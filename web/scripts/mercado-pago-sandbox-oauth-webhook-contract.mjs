import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const oauthRuntime = read("lib/commerce/mercado-pago-sandbox-oauth-runtime.ts");
const webhookStore = read("lib/commerce/mercado-pago-sandbox-webhook-store.ts");
const connectRoute = read("app/api/creator/payments/mercado-pago-sandbox/connect/route.ts");
const callbackRoute = read("app/api/creator/payments/mercado-pago-sandbox/callback/route.ts");
const webhookRoute = read("app/api/commerce/webhooks/mercado-pago-sandbox/route.ts");
const oauthSql = read("supabase/drafts/mara_mp_sandbox_oauth_rpc_v1.sql");
const webhookSql = read("supabase/drafts/mara_mp_sandbox_webhook_binding_v1.sql");
const migrationFiles = fs.readdirSync(path.join(root, "supabase/migrations"));

// OAuth must use state hashing + PKCE and store neither raw state nor PKCE in product tables.
assert.match(oauthRuntime, /crypto\.randomBytes\(STATE_BYTES\)/);
assert.match(oauthRuntime, /crypto\.randomBytes\(PKCE_VERIFIER_BYTES\)/);
assert.match(oauthRuntime, /sha256Hex\(state\)/);
assert.match(oauthRuntime, /pkceChallenge\(verifier\)/);
assert.match(oauthRuntime, /mara_mp_sandbox_oauth_begin/);
assert.match(oauthRuntime, /mara_mp_sandbox_oauth_consume/);
assert.match(oauthRuntime, /mara_mp_sandbox_bind_account/);
assert.match(oauthRuntime, /buildMercadoPagoSandboxNotificationUrl/);
assert.doesNotMatch(oauthRuntime, /console\.(log|info|warn|error)/);
assert.doesNotMatch(oauthRuntime, /NEXT_PUBLIC_/);

// HTTP entrypoints must be gated by the fail-closed sandbox runtime.
for (const route of [connectRoute, callbackRoute, webhookRoute]) {
  assert.match(route, /getMercadoPagoSandboxExecutionRuntime/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_/);
  assert.doesNotMatch(route, /console\.(log|info|warn|error)/);
}
assert.match(connectRoute, /authentication_required/);
assert.match(connectRoute, /creator_required/);
assert.match(callbackRoute, /mercado_pago_sandbox_connected/);
assert.match(webhookRoute, /processMercadoPagoSandboxWebhook/);
assert.match(webhookRoute, /fulfilled: false/);
assert.doesNotMatch(webhookRoute, /commerce_purchases|commerce_entitlements/);

// Webhook binding resolution stays server-only and returns only opaque references.
assert.match(webhookStore, /mara_mp_sandbox_ensure_webhook_binding/);
assert.match(webhookStore, /mara_mp_sandbox_resolve_webhook_binding/);
assert.match(webhookStore, /mara_mp_sandbox_checkout_expectation/);
assert.match(webhookStore, /serviceHeaders\(backend\)/);
assert.doesNotMatch(webhookStore, /console\.(log|info|warn|error)/);

// OAuth SQL: state hash, Vault PKCE, one-time consume, browser denied.
assert.match(oauthSql, /DRAFT ONLY/);
assert.match(oauthSql, /p_state_hash text/);
assert.match(oauthSql, /vault\.create_secret/);
assert.match(oauthSql, /vault\.decrypted_secrets/);
assert.match(oauthSql, /delete from vault\.secrets/);
assert.match(oauthSql, /for update/);
assert.match(oauthSql, /status = 'consumed'/);
assert.match(oauthSql, /status = 'expired'/);
assert.match(oauthSql, /grant execute on function public\.mara_mp_sandbox_oauth_begin[\s\S]*to service_role/);
assert.match(oauthSql, /grant execute on function public\.mara_mp_sandbox_oauth_consume[\s\S]*to service_role/);
assert.match(oauthSql, /grant execute on function public\.mara_mp_sandbox_bind_account[\s\S]*to service_role/);
assert.doesNotMatch(oauthSql, /grant execute .* to anon/);
assert.doesNotMatch(oauthSql, /grant execute .* to authenticated/);

const credentialReferenceTable = oauthSql.match(
  /insert into public\.creator_payment_credential_references \(([\s\S]*?)\n  \) values/,
)?.[1];
assert.ok(credentialReferenceTable, "credential reference write block missing");
assert.doesNotMatch(credentialReferenceTable, /access[_]?token|refresh[_]?token/i);
assert.match(credentialReferenceTable, /credential_reference/);

// Webhook SQL: random opaque binding + server-authoritative expectation.
assert.match(webhookSql, /binding_id uuid primary key default extensions\.gen_random_uuid\(\)/);
assert.match(webhookSql, /private\.mara_payment_webhook_bindings/);
assert.match(webhookSql, /mara_mp_sandbox_resolve_webhook_binding/);
assert.match(webhookSql, /mara_mp_sandbox_checkout_expectation/);
assert.match(webhookSql, /provider_account_id_snapshot/);
assert.match(webhookSql, /revoke all on table private\.mara_payment_webhook_bindings from public, anon, authenticated/);

const webhookBindingTable = webhookSql.match(
  /create table if not exists private\.mara_payment_webhook_bindings \(([\s\S]*?)\n\);/,
)?.[1];
assert.ok(webhookBindingTable, "webhook binding table block missing");
assert.doesNotMatch(webhookBindingTable, /access[_]?token|refresh[_]?token|credential_reference/i);
assert.match(webhookBindingTable, /binding_id uuid primary key/);

// These are review-only drafts until an isolated non-production database exists.
assert.equal(migrationFiles.some((file) => file.includes("mp_sandbox_oauth_rpc")), false);
assert.equal(migrationFiles.some((file) => file.includes("mp_sandbox_webhook_binding")), false);

console.log("MARA_MERCADO_PAGO_SANDBOX_OAUTH_WEBHOOK_CONTRACT PASS");
