import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const runtime = read("lib/commerce/payment-backed-fulfillment.ts");
const route = read("app/api/commerce/webhooks/mercado-pago-sandbox/route.ts");
const sql = read("supabase/drafts/mara_payment_backed_fulfillment_v1.sql");
const materializerSql = read("supabase/drafts/mara_payment_capture_materialization_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

// Fulfillment is a separate non-production gate after financial materialization.
assert.match(runtime, /process\.env\.VERCEL_ENV === "production"/);
assert.match(runtime, /MARA_MP_SANDBOX_FULFILLMENT_ENABLED !== "true"/);
assert.match(runtime, /fulfill_mara_materialized_payment_v1/);
assert.match(runtime, /p_payment_id: input\.paymentId\.trim\(\)/);
assert.doesNotMatch(runtime, /providerPaymentId|amountMinor|currency|offerId|userId/);
assert.doesNotMatch(runtime, /NEXT_PUBLIC_/);
assert.doesNotMatch(runtime, /console\.(log|info|warn|error)/);

// HTTP orchestration may fulfill only a payment returned by the materializer.
assert.match(route, /paymentId = outcome\.materialized \? outcome\.paymentId : null/);
assert.match(route, /if \(!materialized \|\| !paymentId\)/);
assert.match(route, /materialized_payment_required/);
assert.match(route, /fulfillMaterializedPayment/);
assert.doesNotMatch(route, /p_amount_minor|p_currency|p_provider_payment_id|p_offer_id|p_user_id/);

// DB RPC accepts only payment UUID and reloads all commercial/payment truth.
assert.match(sql, /create or replace function public\.fulfill_mara_materialized_payment_v1\(\s*p_payment_id uuid\s*\)/);
assert.match(sql, /from public\.commerce_payments p/);
assert.match(sql, /v_payment\.status <> 'succeeded'/);
assert.match(sql, /v_payment\.purchase_id is not null/);
assert.match(sql, /from public\.commerce_checkout_intents ci/);
assert.match(sql, /v_intent\.provider <> v_payment\.provider/);
assert.match(sql, /v_intent\.amount_minor <> v_payment\.amount_minor/);
assert.match(sql, /v_intent\.currency <> v_payment\.currency/);
assert.match(sql, /public\.fulfill_mara_commerce_checkout/);
assert.match(sql, /financial_fulfillment:/);
assert.match(sql, /set purchase_id = v_purchase_id/);
assert.match(sql, /grant execute on function public\.fulfill_mara_materialized_payment_v1\(uuid\) to service_role/);
assert.doesNotMatch(sql, /grant execute .* to anon/);
assert.doesNotMatch(sql, /grant execute .* to authenticated/);

// The financial materializer itself still cannot create a product purchase.
assert.doesNotMatch(materializerSql, /insert into public\.commerce_purchases/);
assert.doesNotMatch(materializerSql, /insert into public\.commerce_entitlements/);

// Activation remains blocked until isolated non-production rehearsal.
assert.equal(migrations.some((file) => file.includes("payment_backed_fulfillment")), false);

console.log("MARA_PAYMENT_BACKED_FULFILLMENT_CONTRACT PASS");
