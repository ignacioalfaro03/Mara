import type { BusinessProvenanceType, CreatorBusinessSource } from "@/lib/creator-business-control";

export type ImportedRevenueEventType = "SALE" | "REFUND";

export type ImportedRevenueEvent = {
  source: Exclude<CreatorBusinessSource, "MARA">;
  sourceRecordId: string;
  occurredAt: string;
  customerExternalId: string | null;
  eventType: ImportedRevenueEventType;
  grossAmountMinor: number;
  currency: string;
  provenanceType: Extract<BusinessProvenanceType, "CSV_IMPORT">;
};

export type RevenueImportError = {
  row: number;
  code: string;
  message: string;
};

export type RevenueImportDuplicate = {
  row: number;
  source: string;
  sourceRecordId: string;
};

export type RevenueImportSummary = {
  currency: string;
  salesMinor: number;
  refundsMinor: number;
  netMinor: number;
  rows: number;
};

export type RevenueImportPreview = {
  rows: ImportedRevenueEvent[];
  errors: RevenueImportError[];
  duplicates: RevenueImportDuplicate[];
  summaryByCurrency: RevenueImportSummary[];
  provenanceType: "CSV_IMPORT";
};

const REQUIRED_HEADERS = [
  "source",
  "source_record_id",
  "occurred_at",
  "customer_external_id",
  "event_type",
  "gross_amount",
  "currency",
] as const;

const EXTERNAL_SOURCES = new Set<ImportedRevenueEvent["source"]>([
  "ONLYFANS",
  "ARSMATE",
  "INSTAGRAM",
  "TIKTOK",
  "X",
  "OTHER",
]);

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (quoted) throw new Error("csv_unclosed_quote");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((items) => items.some((value) => value.trim().length > 0));
}

function parseMajorAmountToMinor(value: string) {
  const normalized = value.trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) return null;
  const major = BigInt(match[1]);
  const fraction = BigInt((match[2] ?? "").padEnd(2, "0"));
  const minor = major * BigInt(100) + fraction;
  if (minor > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return Number(minor);
}

function canonicalDate(value: string, asOf: Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getTime() > asOf.getTime()) return null;
  return date.toISOString();
}

export function parseCanonicalRevenueCsv(csv: string, asOf = new Date()): RevenueImportPreview {
  let matrix: string[][];
  try {
    matrix = parseCsv(csv);
  } catch {
    return {
      rows: [],
      errors: [{ row: 1, code: "CSV_PARSE_ERROR", message: "El CSV contiene comillas sin cerrar o una estructura inválida." }],
      duplicates: [],
      summaryByCurrency: [],
      provenanceType: "CSV_IMPORT",
    };
  }

  if (matrix.length === 0) {
    return {
      rows: [],
      errors: [{ row: 1, code: "EMPTY_FILE", message: "El archivo no contiene filas." }],
      duplicates: [],
      summaryByCurrency: [],
      provenanceType: "CSV_IMPORT",
    };
  }

  const header = matrix[0].map((value) => value.trim().toLowerCase());
  const missing = REQUIRED_HEADERS.filter((name) => !header.includes(name));
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [{ row: 1, code: "MISSING_HEADERS", message: `Faltan columnas requeridas: ${missing.join(", ")}.` }],
      duplicates: [],
      summaryByCurrency: [],
      provenanceType: "CSV_IMPORT",
    };
  }

  const positions = Object.fromEntries(REQUIRED_HEADERS.map((name) => [name, header.indexOf(name)])) as Record<(typeof REQUIRED_HEADERS)[number], number>;
  const errors: RevenueImportError[] = [];
  const duplicates: RevenueImportDuplicate[] = [];
  const rows: ImportedRevenueEvent[] = [];
  const seen = new Set<string>();

  for (let index = 1; index < matrix.length; index += 1) {
    const rowNumber = index + 1;
    const values = matrix[index];
    const source = (values[positions.source] ?? "").trim().toUpperCase() as ImportedRevenueEvent["source"];
    const sourceRecordId = (values[positions.source_record_id] ?? "").trim();
    const occurredAtRaw = (values[positions.occurred_at] ?? "").trim();
    const customerExternalId = (values[positions.customer_external_id] ?? "").trim() || null;
    const eventType = (values[positions.event_type] ?? "").trim().toUpperCase() as ImportedRevenueEventType;
    const grossAmount = (values[positions.gross_amount] ?? "").trim();
    const currency = (values[positions.currency] ?? "").trim().toUpperCase();

    if (!EXTERNAL_SOURCES.has(source)) {
      errors.push({ row: rowNumber, code: "INVALID_SOURCE", message: "source debe ser una fuente externa canónica; MARA no se importa por CSV." });
      continue;
    }
    if (!sourceRecordId || sourceRecordId.length > 200) {
      errors.push({ row: rowNumber, code: "INVALID_SOURCE_RECORD_ID", message: "source_record_id es obligatorio y debe tener hasta 200 caracteres." });
      continue;
    }
    const occurredAt = canonicalDate(occurredAtRaw, asOf);
    if (!occurredAt) {
      errors.push({ row: rowNumber, code: "INVALID_OCCURRED_AT", message: "occurred_at debe ser una fecha válida y no futura." });
      continue;
    }
    if (eventType !== "SALE" && eventType !== "REFUND") {
      errors.push({ row: rowNumber, code: "INVALID_EVENT_TYPE", message: "event_type debe ser SALE o REFUND." });
      continue;
    }
    const grossAmountMinor = parseMajorAmountToMinor(grossAmount);
    if (grossAmountMinor === null || grossAmountMinor <= 0) {
      errors.push({ row: rowNumber, code: "INVALID_GROSS_AMOUNT", message: "gross_amount debe ser un monto positivo con máximo dos decimales." });
      continue;
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      errors.push({ row: rowNumber, code: "INVALID_CURRENCY", message: "currency debe ser un código ISO-like de tres letras." });
      continue;
    }

    const dedupeKey = `${source}:${sourceRecordId}`;
    if (seen.has(dedupeKey)) {
      duplicates.push({ row: rowNumber, source, sourceRecordId });
      continue;
    }
    seen.add(dedupeKey);

    rows.push({
      source,
      sourceRecordId,
      occurredAt,
      customerExternalId,
      eventType,
      grossAmountMinor,
      currency,
      provenanceType: "CSV_IMPORT",
    });
  }

  const summary = new Map<string, RevenueImportSummary>();
  for (const row of rows) {
    const current = summary.get(row.currency) ?? {
      currency: row.currency,
      salesMinor: 0,
      refundsMinor: 0,
      netMinor: 0,
      rows: 0,
    };
    if (row.eventType === "SALE") current.salesMinor += row.grossAmountMinor;
    else current.refundsMinor += row.grossAmountMinor;
    current.netMinor = current.salesMinor - current.refundsMinor;
    current.rows += 1;
    summary.set(row.currency, current);
  }

  return {
    rows,
    errors,
    duplicates,
    summaryByCurrency: [...summary.values()].sort((a, b) => a.currency.localeCompare(b.currency)),
    provenanceType: "CSV_IMPORT",
  };
}
