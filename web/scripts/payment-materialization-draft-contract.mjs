import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const sql = fs.readFileSync(path.join(process.cwd(), "supabase/drafts/mara_payment_capture_materialization_v1.sql"), "utf8");

assert.match(sql, /DRAFT ONLY/);
assert.match(sql, /DO NOT APPLY DIRECTLY/);
assert.match(sql, /create or replace function public\.materialize_mara_payment_capture_v1/);
assert.match(sql, /security definer/i);
assert.match(sql, /for update of ci/i, "checkout economics must be locked before materialization");
assert.match(sql, /provider_account_id_snapshot/);
assert.match(sql, /platform_fee_minor/);
assert.match(sql, /checkout_amount_mismatch/);
assert.match(sql, /checkout_currency_mismatch/);
assert.match(sql, /provider_payment_idempotency_conflict/);
assert.match(sql, /payment_capture:/);
assert.match(sql, /processor_fee:/);
assert.match(sql, /assert_mara_ledger_transaction_balanced/);
assert.match(sql, /processor_fee_bearer_required/);
assert.match(sql, /processor_fee_exceeds_creator_share/);
assert.match(sql, /revoke all on function public\.materialize_mara_payment_capture_v1[\s\S]*from public, anon, authenticated/i);
assert.match(sql, /grant execute on function public\.materialize_mara_payment_capture_v1[\s\S]*to service_role/i);
assert.match(sql, /does NOT create a commerce_purchase/i);
assert.doesNotMatch(sql, /grant execute[\s\S]*to authenticated/i);

console.log("MARA_PAYMENT_MATERIALIZATION_DRAFT_CONTRACT PASS");
