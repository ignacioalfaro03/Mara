import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mara-mp-report-'));
const script = 'scripts/mercado-pago-account-money-dry-run.mjs';
const headers = 'EXTERNAL_REFERENCE;SOURCE_ID;USER_ID;PAYMENT_METHOD_TYPE;PAYMENT_METHOD;SITE;TRANSACTION_TYPE;TRANSACTION_AMOUNT;TRANSACTION_CURRENCY;TRANSACTION_DATE;SELLER_AMOUNT;FEE_AMOUNT;SETTLEMENT_NET_AMOUNT;SETTLEMENT_CURRENCY;SETTLEMENT_DATE;REAL_AMOUNT;COUPON_AMOUNT;METADATA';

function run(name, row) {
  const file = path.join(tmp, name);
  fs.writeFileSync(file, `${headers}\n${row}\n`, 'utf8');
  return spawnSync(process.execPath, [script, file], { cwd: process.cwd(), encoding: 'utf8' });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const valid = run('valid.csv', 'checkout-1;123;creator;credit_card;visa;MLC;SETTLEMENT;10000;CLP;2026-09-12T20:00:00Z;9000;-1000;9000;CLP;2026-09-12T20:00:01Z;9000;0;"[{""checkout_id"":""checkout-1""}]"');
assert(valid.status === 0, `valid CLP report must pass: ${valid.stderr}`);
const validPayload = JSON.parse(valid.stdout);
assert(validPayload.mode === 'DRY_RUN_ONLY', 'validator must remain dry-run only');
assert(validPayload.criticalCount === 0, 'valid fixture must have zero critical issues');
assert(validPayload.notes.some((n) => n.includes('not interpreted as pure processor fee')), 'FEE_AMOUNT semantics must be explicit');

const decimalClp = run('decimal-clp.csv', 'checkout-2;124;creator;credit_card;visa;MLC;REFUND;-1000.50;CLP;2026-09-12T20:10:00Z;-900;-100.50;-900;CLP;2026-09-12T20:10:01Z;-900;0;[]');
assert(decimalClp.status !== 0, 'fractional CLP must fail closed');
assert(decimalClp.stdout.includes('CLP_NON_INTEGRAL_AMOUNT'), 'fractional CLP issue must be explicit');

const nonClp = run('non-clp.csv', 'checkout-3;125;creator;credit_card;visa;MLB;SETTLEMENT;100.00;BRL;2026-09-12T20:20:00Z;90.00;-10.00;90.00;BRL;2026-09-12T20:20:01Z;90.00;0;[]');
assert(nonClp.status !== 0, 'non-CLP report must fail closed in V1');
assert(nonClp.stdout.includes('NON_CLP_UNSUPPORTED_V1'), 'non-CLP issue must be explicit');

const unrelated = run('unrelated.csv', 'bank-1;126;creator;bank_transfer;account_money;MLC;WITHDRAWAL;5000;CLP;2026-09-12T20:30:00Z;5000;0;-5000;CLP;2026-09-12T20:30:01Z;-5000;0;[]');
assert(unrelated.status === 0, 'non-payment movement should remain reviewable, not corrupt the parser');
const unrelatedPayload = JSON.parse(unrelated.stdout);
assert(unrelatedPayload.warningCount === 1, 'non-payment movement must be surfaced as warning');
assert(unrelatedPayload.paymentRows === 0, 'non-payment movement must not count as payment evidence');

console.log('mercado-pago-account-money dry-run contract: PASS');
