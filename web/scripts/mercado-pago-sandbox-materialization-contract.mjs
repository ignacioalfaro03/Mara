import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const materialization = read("lib/commerce/mercado-pago-sandbox-materialization.ts");
const webhook = read("lib/commerce/mercado-pago-sandbox-webhook.ts");
const route = read("app/api/commerce/webhooks/mercado-pago-sandbox/route.ts");
const sql = read("supabase/drafts/mara_payment_capture_materialization_v1.sql");
const ledger = read("supabase/drafts/mara_payment_ledger_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

// Materialization must remain explicitly non-production and separately enabled.
assert.match(materialization, /process\.env\.VERCEL_ENV === "production"/);
assert.match(materialization, /MARA_MP_SANDBOX_MATERIALIZATION_ENABLED !== "true"/);
assert.match(materialization, /processorFeeBearer: "creator"/);
assert.match(materialization, /return \{ enabled: true, processorFeeBearer: "creator" \}/);
assert.doesNotMatch(materialization, /MARA_MP_SANDBOX_PROCESSOR_FEE_BEARER/);
assert.doesNotMatch(materialization, /processorFeeBearer: "platform"/);
assert.match(materialization, /materialize_mara_payment_capture_v1/);
assert.match(materialization, /disposition !== "materialize_succeeded"/);
assert.match(materialization, /provider\.status !== "succeeded"/);
assert.match(materialization, /provider_event_id_missing/);
assert.match(materialization, /processor_fee_truth_missing/);
assert.doesNotMatch(materialization, /NEXT_PUBLIC_/);
assert.doesNotMatch(materialization, /console\.(log|info|warn|error)/);

// The accepted provider snapshot must be the evidence passed into materialization.
assert.match(webhook, /providerSnapshot: ProviderPaymentSnapshot \| null/);
assert.match(webhook, /providerSnapshot: provider/);
assert.match(route, /getMercadoPagoSandboxMaterializationPolicy/);
assert.match(route, /materializeAcceptedMercadoPagoSandboxPayment/);
assert.match(route, /paymentId = outcome\.materialized \? outcome\.paymentId : null/);
assert.match(route, /xRequestId/);
assert.doesNotMatch(materialization, /commerce_purchases|commerce_entitlements/);

// SQL remains draft-only and enforces frozen economics + provider idempotency.
assert.match(sql, /DRAFT ONLY/);
assert.match(sql, /provider_account_id_snapshot/);
assert.match(sql, /platform_fee_minor/);
assert.match(sql, /provider_payment_idempotency_conflict/);
assert.match(sql, /payment_capture:/);
assert.match(sql, /processor_fee:/);
assert.match(sql, /assert_mara_ledger_transaction_balanced/);
assert.match(sql, /grant execute on function public\.materialize_mara_payment_capture_v1[\s\S]*to service_role/);
assert.doesNotMatch(sql, /grant execute .* to anon/);
assert.doesNotMatch(sql, /grant execute .* to authenticated/);
assert.match(ledger, /commerce_ledger_transactions_append_only/);
assert.match(ledger, /commerce_ledger_entries_append_only/);

// Financial schema/materializer remain unapplied until isolated non-prod activation.
assert.equal(migrations.some((file) => file.includes("payment_capture_materialization")), false);
assert.equal(migrations.some((file) => file.includes("payment_ledger_v1")), false);

console.log("MARA_MERCADO_PAGO_SANDBOX_MATERIALIZATION_CONTRACT PASS");
