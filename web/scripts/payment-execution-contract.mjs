import fs from "node:fs";
import assert from "node:assert/strict";
const p=fs.readFileSync(new URL("../supabase/migrations/20260920211500_mara_payment_execution_financial_posting.sql",import.meta.url),"utf8");
for (const pattern of [/post_mara_creator_sale/,/creator_economics_policy_missing/,/sale:' \|\| v_purchase\.provider/,/creator_pending','credit'/,/release_mara_creator_funds/,/for update skip locked/,/payout_exceeds_available_balance/,/pg_advisory_xact_lock/,/creator_payout_reserved/,/record_mara_commerce_refund/,/refund_exceeds_captured_amount/,/creator_recovery/,/mara_finance_control_tower/]) assert.match(p,pattern);
assert.match(p,/auth\.role\(\)<>'service_role'/);
assert.doesNotMatch(p,/double precision|real\b|numeric\s*\(/i);
console.log("payment-execution-contract: PASS");
