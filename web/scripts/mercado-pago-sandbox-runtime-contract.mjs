import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const runtimePath = path.join(root, "lib/commerce/mercado-pago-sandbox-runtime.ts");
const vaultAdapterPath = path.join(root, "lib/commerce/supabase-mercado-pago-sandbox-vault.ts");
const vaultDraftPath = path.join(root, "supabase/drafts/mara_mp_sandbox_vault_bridge_v1.sql");
const migrationsDir = path.join(root, "supabase/migrations");

const runtime = fs.readFileSync(runtimePath, "utf8");
const adapter = fs.readFileSync(vaultAdapterPath, "utf8");
const sql = fs.readFileSync(vaultDraftPath, "utf8");

// Production sandbox execution must remain fail-closed and explicit.
assert.match(runtime, /process\.env\.VERCEL_ENV === "production"/);
assert.match(runtime, /sandbox_blocked_in_production/);
assert.match(runtime, /MARA_MP_SANDBOX_ENABLED !== "true"/);
assert.match(runtime, /https:\/\/api\.mercadopago\.com/);
assert.match(runtime, /mara_mp_sandbox_transport_origin_blocked/);
assert.match(runtime, /redirect: "error"/);
assert.match(runtime, /cache: "no-store"/);
assert.doesNotMatch(runtime, /console\.(log|info|warn|error)/);
assert.doesNotMatch(runtime, /NEXT_PUBLIC_.*MERCADO|NEXT_PUBLIC_.*MP_/);

// Vault adapter must use server auth, opaque UUID references and must never put
// response bodies/credential values into error strings or logs.
assert.match(adapter, /serviceHeaders\(config\)/);
assert.match(adapter, /mara_mp_sandbox_vault_put/);
assert.match(adapter, /mara_mp_sandbox_vault_read/);
assert.match(adapter, /mara_mp_sandbox_vault_replace/);
assert.match(adapter, /UUID_SHAPE/);
assert.match(adapter, /cache: "no-store"/);
assert.match(adapter, /redirect: "error"/);
assert.doesNotMatch(adapter, /console\.(log|info|warn|error)/);
assert.doesNotMatch(adapter, /response\.text\(\)/);
assert.doesNotMatch(adapter, /NEXT_PUBLIC_/);

// The database bridge is review-only. It must not silently become an applied
// migration, and browser roles must have no direct vault/RPC access.
assert.match(sql, /DRAFT ONLY/);
assert.match(sql, /DO NOT APPLY DIRECTLY/);
assert.match(sql, /create extension if not exists supabase_vault with schema vault/);
assert.match(sql, /vault\.create_secret/);
assert.match(sql, /vault\.decrypted_secrets/);
assert.match(sql, /vault\.update_secret/);
assert.match(sql, /security definer/);
assert.match(sql, /set search_path = ''/);
assert.match(sql, /revoke all on function public\.mara_mp_sandbox_vault_put\(uuid, text, jsonb\) from public, anon, authenticated/);
assert.match(sql, /revoke all on function public\.mara_mp_sandbox_vault_read\(text\) from public, anon, authenticated/);
assert.match(sql, /revoke all on function public\.mara_mp_sandbox_vault_replace\(text, jsonb\) from public, anon, authenticated/);
assert.match(sql, /grant execute on function public\.mara_mp_sandbox_vault_put\(uuid, text, jsonb\) to service_role/);
assert.match(sql, /grant execute on function public\.mara_mp_sandbox_vault_read\(text\) to service_role/);
assert.match(sql, /grant execute on function public\.mara_mp_sandbox_vault_replace\(text, jsonb\) to service_role/);
assert.doesNotMatch(sql, /grant execute .* to anon/);
assert.doesNotMatch(sql, /grant execute .* to authenticated/);
assert.doesNotMatch(sql, /access_token\s+text|refresh_token\s+text/i);

const migrationFiles = fs.readdirSync(migrationsDir);
assert.equal(migrationFiles.includes("mara_mp_sandbox_vault_bridge_v1.sql"), false);
assert.equal(migrationFiles.some((file) => file.includes("mp_sandbox_vault_bridge")), false);

console.log("MARA_MERCADO_PAGO_SANDBOX_RUNTIME_CONTRACT PASS");
