import fs from "node:fs";

const REQUIRED = [
  "SOURCE_ID",
  "EXTERNAL_REFERENCE",
  "TRANSACTION_TYPE",
  "TRANSACTION_AMOUNT",
  "TRANSACTION_CURRENCY",
  "SELLER_AMOUNT",
  "FEE_AMOUNT",
  "SETTLEMENT_NET_AMOUNT",
  "SETTLEMENT_CURRENCY",
  "REAL_AMOUNT",
  "TRANSACTION_DATE",
  "SETTLEMENT_DATE",
  "METADATA"
];

const ALLOWED_TYPES = new Set([
  "SETTLEMENT",
  "REFUND",
  "CHARGEBACK",
  "DISPUTE",
  "WITHDRAWAL",
  "CASHBACK",
  "COLLATERAL",
  "PAYOUT",
  "OTHER"
]);

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error("unterminated quoted field");
  if (field.length || row.length) {
    row.push(field);
    if (row.some((value) => value !== "")) rows.push(row);
  }
  return rows;
}

function asIntegerPeso(value, field, line) {
  if (value === "") return null;
  if (!/^-?\d+$/.test(value.trim())) throw new Error(`line ${line}: ${field} must be an integral CLP peso value, got ${value}`);
  return Number(value);
}

function validateCsv(input) {
  const rows = parseCsv(input);
  if (rows.length < 2) throw new Error("report must include a header and at least one data row");
  const header = rows[0].map((value) => value.trim());
  for (const required of REQUIRED) {
    if (!header.includes(required)) throw new Error(`missing required column ${required}`);
  }

  const index = Object.fromEntries(header.map((name, i) => [name, i]));
  const seen = new Set();
  const totals = {
    transactionAmount: 0,
    sellerAmount: 0,
    feeAmount: 0,
    settlementNetAmount: 0,
    realAmount: 0
  };
  const byType = {};
  const warnings = [];

  rows.slice(1).forEach((row, offset) => {
    const line = offset + 2;
    while (row.length < header.length) row.push("");
    const get = (name) => String(row[index[name]] ?? "").trim();
    const currency = get("TRANSACTION_CURRENCY");
    const settlementCurrency = get("SETTLEMENT_CURRENCY");
    if (currency !== "CLP" || settlementCurrency !== "CLP") throw new Error(`line ${line}: V1 accepts CLP only`);

    const type = get("TRANSACTION_TYPE").toUpperCase();
    if (!ALLOWED_TYPES.has(type)) warnings.push(`line ${line}: unknown transaction type ${type}`);

    const sourceId = get("SOURCE_ID");
    const dedupeKey = `${sourceId}|${type}|${get("TRANSACTION_DATE")}|${get("TRANSACTION_AMOUNT")}`;
    if (seen.has(dedupeKey)) throw new Error(`line ${line}: duplicate provider evidence row ${dedupeKey}`);
    seen.add(dedupeKey);

    const transactionAmount = asIntegerPeso(get("TRANSACTION_AMOUNT"), "TRANSACTION_AMOUNT", line) ?? 0;
    const sellerAmount = asIntegerPeso(get("SELLER_AMOUNT"), "SELLER_AMOUNT", line) ?? 0;
    const feeAmount = asIntegerPeso(get("FEE_AMOUNT"), "FEE_AMOUNT", line) ?? 0;
    const settlementNetAmount = asIntegerPeso(get("SETTLEMENT_NET_AMOUNT"), "SETTLEMENT_NET_AMOUNT", line) ?? 0;
    const realAmount = asIntegerPeso(get("REAL_AMOUNT"), "REAL_AMOUNT", line) ?? 0;

    totals.transactionAmount += transactionAmount;
    totals.sellerAmount += sellerAmount;
    totals.feeAmount += feeAmount;
    totals.settlementNetAmount += settlementNetAmount;
    totals.realAmount += realAmount;
    byType[type] = (byType[type] || 0) + 1;
  });

  return {
    mode: "dry-run-read-only",
    currency: "CLP",
    rowCount: rows.length - 1,
    byType,
    totals,
    warnings,
    interpretation: {
      feeAmount: "provider aggregate fee evidence only; never treated as pure processor fee",
      settlementNetAmount: "provider net settlement evidence",
      realAmount: "provider real net impact evidence including adjustments"
    },
    mutations: []
  };
}

function selfTest() {
  const good = [
    REQUIRED.join(","),
    'p_1,checkout_1,SETTLEMENT,10000,CLP,9000,1000,9000,CLP,9000,2026-09-12T10:00:00Z,2026-09-12T10:05:00Z,"{\"source\":\"fixture\"}"',
    'r_1,checkout_1,REFUND,-2000,CLP,-1800,-200,-1800,CLP,-1800,2026-09-12T11:00:00Z,2026-09-12T11:05:00Z,"{}"'
  ].join("\n");
  const result = validateCsv(good);
  if (result.rowCount !== 2 || result.currency !== "CLP" || result.mutations.length !== 0) throw new Error("valid fixture failed dry-run invariants");

  let decimalBlocked = false;
  try {
    validateCsv(good.replace("10000,CLP", "100.50,CLP"));
  } catch (error) {
    decimalBlocked = String(error.message).includes("integral CLP peso");
  }
  if (!decimalBlocked) throw new Error("decimal CLP value was not blocked");

  let nonClpBlocked = false;
  try {
    validateCsv(good.replace(",CLP,", ",USD,"));
  } catch (error) {
    nonClpBlocked = String(error.message).includes("CLP only");
  }
  if (!nonClpBlocked) throw new Error("non-CLP report was not blocked");

  console.log("MARA_MP_ACCOUNT_MONEY_DRYRUN_SELFTEST PASS");
}

const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

const file = args.find((value) => !value.startsWith("--"));
if (!file) {
  console.error("Usage: node scripts/mercado-pago-account-money-dryrun.mjs <report.csv> | --self-test");
  process.exit(2);
}

const result = validateCsv(fs.readFileSync(file, "utf8"));
console.log(JSON.stringify(result, null, 2));
