import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/mercado-pago-account-money-dry-run.mjs <report.csv>');
  process.exit(2);
}

const requiredHeaders = [
  'EXTERNAL_REFERENCE',
  'SOURCE_ID',
  'TRANSACTION_TYPE',
  'TRANSACTION_AMOUNT',
  'TRANSACTION_CURRENCY',
  'TRANSACTION_DATE',
  'FEE_AMOUNT',
  'SETTLEMENT_NET_AMOUNT',
  'SETTLEMENT_CURRENCY',
  'SETTLEMENT_DATE',
  'REAL_AMOUNT',
  'METADATA',
];

const paymentTypes = new Set(['SETTLEMENT', 'REFUND', 'CHARGEBACK', 'DISPUTE']);
const amountFields = ['TRANSACTION_AMOUNT', 'SELLER_AMOUNT', 'FEE_AMOUNT', 'SETTLEMENT_NET_AMOUNT', 'REAL_AMOUNT'];

function parseDelimited(text, delimiter = ';') {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (quoted) throw new Error('Unterminated quoted field');
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v !== ''));
}

function numeric(value) {
  if (value === '' || value == null) return null;
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) return Number.NaN;
  return Number(value);
}

const filePath = path.resolve(process.cwd(), input);
const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
const rows = parseDelimited(text);
if (rows.length < 1) throw new Error('Report is empty');

const headers = rows[0];
const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
if (missingHeaders.length) {
  throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
}

const issues = [];
const normalized = [];
for (let i = 1; i < rows.length; i += 1) {
  const values = rows[i];
  if (values.length !== headers.length) {
    issues.push({ severity: 'critical', row: i + 1, code: 'COLUMN_COUNT_MISMATCH' });
    continue;
  }
  const record = Object.fromEntries(headers.map((h, idx) => [h, values[idx]]));
  const currency = record.TRANSACTION_CURRENCY;
  const settlementCurrency = record.SETTLEMENT_CURRENCY;

  if (currency !== settlementCurrency) {
    issues.push({ severity: 'critical', row: i + 1, code: 'CURRENCY_MISMATCH' });
  }
  if (currency !== 'CLP') {
    issues.push({ severity: 'critical', row: i + 1, code: 'NON_CLP_UNSUPPORTED_V1', value: currency });
  }

  for (const field of amountFields) {
    if (!(field in record)) continue;
    const parsed = numeric(record[field]);
    if (Number.isNaN(parsed)) {
      issues.push({ severity: 'critical', row: i + 1, code: 'INVALID_NUMERIC', field, value: record[field] });
      continue;
    }
    if (parsed != null && currency === 'CLP' && !Number.isInteger(parsed)) {
      issues.push({ severity: 'critical', row: i + 1, code: 'CLP_NON_INTEGRAL_AMOUNT', field, value: record[field] });
    }
  }

  if (!record.SOURCE_ID) {
    issues.push({ severity: 'critical', row: i + 1, code: 'SOURCE_ID_MISSING' });
  }
  if (!record.TRANSACTION_TYPE) {
    issues.push({ severity: 'critical', row: i + 1, code: 'TRANSACTION_TYPE_MISSING' });
  } else if (!paymentTypes.has(record.TRANSACTION_TYPE)) {
    issues.push({ severity: 'warning', row: i + 1, code: 'NON_PAYMENT_TRANSACTION_TYPE', value: record.TRANSACTION_TYPE });
  }

  normalized.push({
    source_id: record.SOURCE_ID,
    external_reference: record.EXTERNAL_REFERENCE || null,
    transaction_type: record.TRANSACTION_TYPE,
    transaction_amount: record.TRANSACTION_AMOUNT,
    transaction_currency: record.TRANSACTION_CURRENCY,
    seller_amount: record.SELLER_AMOUNT || null,
    fee_amount: record.FEE_AMOUNT,
    settlement_net_amount: record.SETTLEMENT_NET_AMOUNT,
    real_amount: record.REAL_AMOUNT,
    transaction_date: record.TRANSACTION_DATE,
    settlement_date: record.SETTLEMENT_DATE,
    metadata: record.METADATA || null,
  });
}

const critical = issues.filter((i) => i.severity === 'critical');
const output = {
  mode: 'DRY_RUN_ONLY',
  file: path.basename(filePath),
  rows: normalized.length,
  paymentRows: normalized.filter((r) => paymentTypes.has(r.transaction_type)).length,
  warningCount: issues.filter((i) => i.severity === 'warning').length,
  criticalCount: critical.length,
  issues,
  notes: [
    'No database writes are performed.',
    'FEE_AMOUNT is preserved as provider total fee evidence; it is not interpreted as pure processor fee.',
    'CLP values are treated as integral pesos in Mara V1.',
  ],
};

console.log(JSON.stringify(output, null, 2));
if (critical.length) process.exit(1);
