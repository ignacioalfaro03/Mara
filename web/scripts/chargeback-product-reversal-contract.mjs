import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const sql = read("supabase/drafts/mara_chargeback_product_reversal_v1.sql");
const chargebackSql = read("supabase/drafts/mara_payment_chargeback_dispute_control_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

assert.match(sql, /reverse_mara_chargeback_payment_product_v1/);
assert.match(sql, /p_payment_id uuid/);
assert.match(sql, /v_payment\.status <> 'chargeback'/);
assert.match(sql, /case_type = 'chargeback'/);
assert.match(sql, /c\.status = 'lost'/);
assert.match(sql, /financial_loss_materialized_at is not null/);
assert.match(sql, /v_case_count > 1/);
assert.match(sql, /transaction_type = 'chargeback'/);
assert.match(sql, /assert_mara_ledger_transaction_balanced/);
assert.match(sql, /chargeback_product_purchase_truth_mismatch/);

// Product state gets an explicit chargeback status; it must not masquerade as refund.
assert.match(sql, /commerce_purchases_status_check[\s\S]*'chargeback'/);
assert.match(sql, /commerce_contributions_status_check[\s\S]*'chargeback'/);
assert.match(sql, /update public\.commerce_purchases[\s\S]*status = 'chargeback'/);
assert.match(sql, /update public\.commerce_entitlements[\s\S]*status = 'revoked'/);
assert.match(sql, /update public\.commerce_contributions[\s\S]*status = 'chargeback'/);
assert.match(sql, /refresh_mara_commerce_goal_status/);
assert.match(sql, /revocation_reason', 'chargeback'/);

// Dispute/open must remain financially and product neutral in the upstream control draft.
assert.match(chargebackSql, /DISPUTE_OPEN_NO_AUTOMATIC_FINANCIAL_MUTATION/);
assert.match(chargebackSql, /c\.case_type = 'dispute'/);
assert.match(chargebackSql, /c\.status = 'open'/);

// Product reversal must not rewrite financial truth.
assert.doesNotMatch(sql, /update public\.commerce_payments/);
assert.doesNotMatch(sql, /insert into public\.commerce_ledger_transactions/);
assert.doesNotMatch(sql, /insert into public\.commerce_ledger_entries/);
assert.doesNotMatch(sql, /update public\.commerce_payment_cases/);

// Reconciliation catches incomplete downstream reversal.
assert.match(sql, /CHARGEBACK_PRODUCT_REVERSAL_PENDING/);
assert.match(sql, /CHARGEBACK_ENTITLEMENT_STILL_ACTIVE/);
assert.match(sql, /CHARGEBACK_CONTRIBUTION_NOT_REVERSED/);

// Service-only and draft-only.
assert.match(sql, /revoke all on function public\.reverse_mara_chargeback_payment_product_v1\(uuid\)[\s\S]*from public, anon, authenticated/);
assert.match(sql, /grant execute on function public\.reverse_mara_chargeback_payment_product_v1\(uuid\)[\s\S]*to service_role/);
assert.equal(migrations.some((file) => file.includes("chargeback_product_reversal")), false);

console.log("MARA_CHARGEBACK_PRODUCT_REVERSAL_CONTRACT PASS");
