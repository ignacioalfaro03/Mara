import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const sql = read("supabase/drafts/mara_payment_chargeback_dispute_control_v1.sql");
const ledger = read("supabase/drafts/mara_payment_ledger_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

assert.match(sql, /create table if not exists public\.commerce_payment_cases/);
assert.match(sql, /case_type in \('dispute', 'chargeback'\)/);
assert.match(sql, /status in \('open', 'won', 'lost', 'closed'\)/);
assert.match(sql, /unique \(provider, provider_case_id, case_type\)/);

assert.match(sql, /create or replace function public\.upsert_mara_payment_case_v1/);
assert.match(sql, /payment_case_idempotency_conflict/);
assert.match(sql, /payment_case_amount_exceeds_capture/);

// A dispute is tracked as a case only. It must not itself write the financial ledger.
const upsertSection = sql.split("create or replace function public.materialize_mara_full_chargeback_loss_v1")[0];
assert.doesNotMatch(upsertSection, /insert into public\.commerce_ledger_transactions/);
assert.doesNotMatch(upsertSection, /update public\.commerce_payments[\s\S]*status = 'chargeback'/);

assert.match(sql, /create or replace function public\.materialize_mara_full_chargeback_loss_v1/);
assert.match(sql, /v_case\.case_type <> 'chargeback' or v_case\.status <> 'lost'/);
assert.match(sql, /chargeback_case_not_final_loss/);
assert.match(sql, /v_payment\.refunded_amount_minor <> 0/);
assert.match(sql, /chargeback_refund_overlap_requires_reconciliation/);
assert.match(sql, /v_case\.disputed_amount_minor <> v_payment\.amount_minor/);
assert.match(sql, /partial_chargeback_not_supported_v1/);

// Principal reversal is explicit; processor fee economics are not invented.
assert.match(sql, /'creator_payable', 'debit'/);
assert.match(sql, /'platform_revenue', 'debit'/);
assert.match(sql, /'processor_clearing', 'credit'/);
assert.match(sql, /'processor_fee_reversal_materialized', false/);
assert.doesNotMatch(sql, /'processor_fee_expense', 'credit'/);
assert.match(sql, /perform private\.assert_mara_ledger_transaction_balanced\(v_tx_id\)/);
assert.match(sql, /set status = 'chargeback'/);

// Reconciliation distinguishes financial loss from operational product reversal.
assert.match(sql, /CHARGEBACK_LEDGER_MISSING/);
assert.match(sql, /CHARGEBACK_PRODUCT_REVERSAL_PENDING/);
assert.match(sql, /CHARGEBACK_REFUND_OVERLAP_UNSUPPORTED_V1/);
assert.match(sql, /DISPUTE_OPEN_NO_AUTOMATIC_FINANCIAL_MUTATION/);

// Existing ledger schema supports chargeback but remains append-only.
assert.match(ledger, /transaction_type in \('payment_capture'[\s\S]*'chargeback'/);
assert.match(ledger, /commerce_ledger_transactions_append_only/);
assert.match(ledger, /commerce_ledger_entries_append_only/);

// Service-only and draft-only.
assert.match(sql, /alter table public\.commerce_payment_cases enable row level security/);
assert.match(sql, /revoke all on table public\.commerce_payment_cases from anon, authenticated/);
assert.match(sql, /revoke all on function public\.materialize_mara_full_chargeback_loss_v1\(uuid, text\) from public, anon, authenticated/);
assert.match(sql, /grant execute on function public\.materialize_mara_full_chargeback_loss_v1\(uuid, text\) to service_role/);
assert.equal(migrations.some((file) => file.includes("chargeback") || file.includes("dispute")), false);

console.log("MARA_PAYMENT_CHARGEBACK_DISPUTE_CONTROL_CONTRACT PASS");
