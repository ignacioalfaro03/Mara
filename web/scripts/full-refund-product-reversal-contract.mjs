import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const sql = read("supabase/drafts/mara_full_refund_product_reversal_v1.sql");
const refundSql = read("supabase/drafts/mara_payment_refund_materialization_v1.sql");
const ledger = read("supabase/drafts/mara_payment_ledger_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

assert.match(sql, /create or replace function public\.reverse_mara_fully_refunded_payment_product_v1/);
assert.match(sql, /p_payment_id uuid/);
assert.match(sql, /v_payment\.status <> 'refunded'/);
assert.match(sql, /v_payment\.refunded_amount_minor <> v_payment\.amount_minor/);
assert.match(sql, /payment_not_fully_refunded/);
assert.match(sql, /from public\.commerce_refunds/);
assert.match(sql, /r\.status = 'succeeded'/);
assert.match(sql, /v_refund_total <> v_payment\.amount_minor/);
assert.match(sql, /refund_materialization_total_mismatch/);
assert.match(sql, /refunded_purchase_payment_truth_mismatch/);

// Product reversal is downstream of financial refund truth.
assert.match(sql, /update public\.commerce_purchases[\s\S]*status = 'refunded'/);
assert.match(sql, /update public\.commerce_entitlements[\s\S]*status = 'revoked'/);
assert.match(sql, /update public\.commerce_contributions[\s\S]*status = 'refunded'/);
assert.match(sql, /refresh_mara_commerce_goal_status/);

// This RPC must not create/rewrite financial truth.
assert.doesNotMatch(sql, /insert into public\.commerce_refunds/);
assert.doesNotMatch(sql, /insert into public\.commerce_ledger_transactions/);
assert.doesNotMatch(sql, /insert into public\.commerce_ledger_entries/);
assert.doesNotMatch(sql, /update public\.commerce_payments/);
assert.match(ledger, /commerce_ledger_transactions_append_only/);
assert.match(ledger, /commerce_ledger_entries_append_only/);

// The financial materializer itself remains product-state neutral.
assert.doesNotMatch(refundSql, /update public\.commerce_entitlements/);
assert.doesNotMatch(refundSql, /update public\.commerce_purchases[\s\S]*status = 'refunded'/);

// Service-only and draft-only.
assert.match(sql, /revoke all on function public\.reverse_mara_fully_refunded_payment_product_v1\(uuid\) from public, anon, authenticated/);
assert.match(sql, /grant execute on function public\.reverse_mara_fully_refunded_payment_product_v1\(uuid\) to service_role/);
assert.equal(migrations.some((file) => file.includes("full_refund_product_reversal")), false);

console.log("MARA_FULL_REFUND_PRODUCT_REVERSAL_CONTRACT PASS");
