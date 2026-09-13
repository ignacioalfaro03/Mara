import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const sql = read("supabase/drafts/mara_provider_settlement_reconciliation_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

assert.match(sql, /create table if not exists public\.commerce_provider_report_batches/);
assert.match(sql, /create table if not exists public\.commerce_provider_report_rows/);
assert.match(sql, /commerce_provider_report_rows_append_only/);
assert.match(sql, /mara_provider_report_evidence_is_append_only/);
assert.match(sql, /create or replace function public\.begin_mara_mp_account_money_batch_v1/);
assert.match(sql, /create or replace function public\.ingest_mara_mp_account_money_row_v1/);
assert.match(sql, /create or replace function public\.complete_mara_mp_account_money_batch_v1/);
assert.match(sql, /create or replace function public\.mara_provider_settlement_reconciliation_v1/);

// Current Account Money evidence fields are explicitly modeled.
for (const field of [
  "source_id", "external_reference", "transaction_type", "transaction_amount",
  "transaction_currency", "seller_amount", "fee_amount", "settlement_net_amount",
  "real_amount", "transaction_date", "settlement_date", "metadata_raw"
]) {
  assert.match(sql, new RegExp(`\\b${field}\\b`));
}

// V1 is intentionally scoped to Chile/CLP and never guesses currency exponent.
assert.match(sql, /provider_report_v1_currency_not_supported/);
assert.match(sql, /provider_report_v1_settlement_currency_not_supported/);
assert.match(sql, /PROVIDER_SETTLEMENT_NON_INTEGRAL_CLP/);

// Missing-evidence findings are only valid inside an explicitly completed provider coverage window.
assert.match(sql, /coverage_start/);
assert.match(sql, /coverage_end/);
assert.match(sql, /status = 'complete'/);
assert.match(sql, /provider_report_imported_row_count_mismatch/);
assert.match(sql, /provider_report_expected_row_count_mismatch/);
assert.match(sql, /p\.captured_at >= b\.coverage_start/);
assert.match(sql, /p\.captured_at < b\.coverage_end/);

// Release-gate reconciliation covers capture and unmatched provider money truth.
assert.match(sql, /PROVIDER_SETTLEMENT_EVIDENCE_MISSING/);
assert.match(sql, /PROVIDER_SETTLEMENT_CAPTURE_MISMATCH/);
assert.match(sql, /PROVIDER_MONEY_MOVEMENT_UNMATCHED/);
assert.match(sql, /PROVIDER_NET_IMPACT_REVIEW/);

// FEE_AMOUNT is aggregate provider fee evidence, not falsely asserted as pure processor fee.
assert.match(sql, /PROVIDER_TOTAL_FEE_EVIDENCE_REVIEW/);
assert.match(sql, /FEE_AMOUNT may aggregate processing, shipping, financing and coupon fees/);
assert.match(sql, /p\.metadata ->> 'processor_fee_minor'/);
assert.match(sql, /r\.fee_amount/);
assert.doesNotMatch(sql, /PROVIDER_PROCESSOR_FEE_MISMATCH/);

// The reconciliation surface is read-only: strip comments, then ensure its body has no mutation verbs.
const reconciliationStart = sql.indexOf("create or replace function public.mara_provider_settlement_reconciliation_v1");
assert.ok(reconciliationStart >= 0);
const reconciliation = sql.slice(reconciliationStart)
  .replace(/--.*$/gm, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");
assert.doesNotMatch(reconciliation, /\b(insert|update|delete|truncate)\b/i);

// Service-only and draft-only.
assert.match(sql, /revoke all on table public\.commerce_provider_report_batches from anon, authenticated/);
assert.match(sql, /revoke all on table public\.commerce_provider_report_rows from anon, authenticated/);
assert.match(sql, /grant all on table public\.commerce_provider_report_batches to service_role/);
assert.match(sql, /grant all on table public\.commerce_provider_report_rows to service_role/);
assert.match(sql, /revoke all on function public\.mara_provider_settlement_reconciliation_v1\(\) from public, anon, authenticated/);
assert.match(sql, /grant execute on function public\.mara_provider_settlement_reconciliation_v1\(\) to service_role/);
assert.equal(migrations.some((file) => file.includes("provider_settlement_reconciliation")), false);

// This slice must not create payout automation or auto-heal financial/product truth.
assert.doesNotMatch(sql, /insert into public\.creator_payouts/i);
assert.doesNotMatch(sql, /update public\.creator_payouts/i);
assert.doesNotMatch(reconciliation, /commerce_payments\s+set/i);
assert.doesNotMatch(reconciliation, /commerce_ledger_transactions/i);

console.log("MARA_PROVIDER_SETTLEMENT_RECONCILIATION_CONTRACT PASS");
