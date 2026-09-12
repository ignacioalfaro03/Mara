import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const runtime = read("lib/commerce/mercado-pago-sandbox-refund.ts");
const providerClient = read("lib/commerce/mercado-pago-sandbox-client.ts");
const sql = read("supabase/drafts/mara_payment_refund_materialization_v1.sql");
const ledger = read("supabase/drafts/mara_payment_ledger_v1.sql");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

// Refund execution remains non-production and separate from checkout/materialization flags.
assert.match(runtime, /process\.env\.VERCEL_ENV === "production"/);
assert.match(runtime, /MARA_MP_SANDBOX_REFUNDS_ENABLED !== "true"/);
assert.match(runtime, /mara_mp_sandbox_refund_context_v1/);
assert.match(runtime, /refundMercadoPagoSandboxPayment/);
assert.match(runtime, /materialize_mara_payment_refund_v1/);
assert.match(runtime, /mara_mp_sandbox_refund_exceeds_remaining/);
assert.match(runtime, /provider_refund_not_succeeded/);
assert.doesNotMatch(runtime, /NEXT_PUBLIC_/);
assert.doesNotMatch(runtime, /console\.(log|info|warn|error)/);

// Provider refund uses credential reference + idempotency; provider response amount is authoritative.
assert.match(providerClient, /X-Idempotency-Key/);
assert.match(runtime, /providerRefund\.amountMinor/);
assert.match(runtime, /providerRefund\.providerRefundId/);
assert.match(runtime, /refund_api:\$\{providerRefund\.providerRefundId\}/);

// DB refund context is service-only and exposes no raw access/refresh token.
assert.match(sql, /create or replace function public\.mara_mp_sandbox_refund_context_v1/);
assert.match(sql, /credential_reference/);
assert.doesNotMatch(sql, /access_token\s+text|refresh_token\s+text/i);
assert.match(sql, /grant execute on function public\.mara_mp_sandbox_refund_context_v1\(uuid\) to service_role/);

// Refund materialization is provider-refund-idempotent and bounded by captured value.
assert.match(sql, /create or replace function public\.materialize_mara_payment_refund_v1/);
assert.match(sql, /provider_refund_idempotency_conflict/);
assert.match(sql, /v_new_refunded > v_payment\.amount_minor/);
assert.match(sql, /refund_exceeds_remaining_payment/);
assert.match(sql, /v_payment\.status not in \('succeeded', 'partially_refunded'\)/);
assert.match(sql, /v_payment\.purchase_id is null/);

// Mercado Pago 1:1 refund economics: reverse creator payable + marketplace revenue proportionally.
assert.match(sql, /proportional_marketplace_split/);
assert.match(sql, /v_previous_platform_reversed := round/);
assert.match(sql, /v_new_platform_reversed := round/);
assert.match(sql, /v_creator_refund_minor := p_refund_amount_minor - v_platform_refund_minor/);
assert.match(sql, /'creator_payable', 'debit'/);
assert.match(sql, /'platform_revenue',[\s\S]*'debit'/);
assert.match(sql, /'processor_clearing',[\s\S]*'credit'/);
assert.match(sql, /processor_fee_reversal_materialized', false/);
assert.doesNotMatch(sql, /'processor_fee_expense',[\s\S]*'credit'/);
assert.match(sql, /assert_mara_ledger_transaction_balanced/);

// Financial refund materialization must not revoke product state directly.
assert.doesNotMatch(sql, /update public\.commerce_entitlements/);
assert.doesNotMatch(sql, /update public\.commerce_purchases[\s\S]*status = 'refunded'/);
assert.doesNotMatch(sql, /refund_mara_commerce_purchase/);

// Browser roles are denied, ledger remains append-only, draft remains unapplied.
assert.match(sql, /grant execute on function public\.materialize_mara_payment_refund_v1[\s\S]*to service_role/);
assert.doesNotMatch(sql, /grant execute .* to anon/);
assert.doesNotMatch(sql, /grant execute .* to authenticated/);
assert.match(ledger, /commerce_ledger_transactions_append_only/);
assert.match(ledger, /commerce_ledger_entries_append_only/);
assert.equal(migrations.some((file) => file.includes("payment_refund_materialization")), false);

console.log("MARA_PAYMENT_REFUND_MATERIALIZATION_CONTRACT PASS");
