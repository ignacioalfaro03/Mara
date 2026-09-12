import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "lib/commerce/payment-oauth-boundary.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const sql = fs.readFileSync(path.join(process.cwd(), "supabase/drafts/mara_payment_oauth_boundary_v1.sql"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const {
  createPaymentOAuthProof,
  verifyPaymentOAuthState,
  assertPaymentOAuthSessionUsable,
  persistPkceVerifierReference,
} = await import(moduleUrl);

const now = new Date("2026-09-12T12:00:00.000Z");
const proof = createPaymentOAuthProof(now, 600);
assert.ok(proof.state.length >= 32);
assert.ok(proof.pkceVerifier.length >= 43);
assert.ok(proof.pkceChallenge.length >= 43);
assert.match(proof.stateHash, /^[0-9a-f]{64}$/);
assert.equal(proof.expiresAt, "2026-09-12T12:10:00.000Z");
assert.equal(verifyPaymentOAuthState(proof.state, proof.stateHash), true);
assert.equal(verifyPaymentOAuthState(`${proof.state}x`, proof.stateHash), false);

assert.doesNotThrow(() => assertPaymentOAuthSessionUsable({ expiresAt: proof.expiresAt, consumedAt: null }, now));
assert.throws(
  () => assertPaymentOAuthSessionUsable({ expiresAt: "2026-09-12T11:59:59.000Z", consumedAt: null }, now),
  /oauth_session_expired/,
);
assert.throws(
  () => assertPaymentOAuthSessionUsable({ expiresAt: proof.expiresAt, consumedAt: "2026-09-12T12:01:00.000Z" }, now),
  /oauth_session_already_consumed/,
);

const writes = [];
const vault = {
  async putSecret(input) { writes.push(input); return "vault-ref-123456"; },
  async takeSecret() { throw new Error("not_called"); },
  async deleteSecret() { throw new Error("not_called"); },
};
const reference = await persistPkceVerifierReference(vault, "creator-1", "mercado_pago_split", proof);
assert.equal(reference, "vault-ref-123456");
assert.equal(writes.length, 1);
assert.equal(writes[0].secret, proof.pkceVerifier);
assert.match(writes[0].purpose, /^payment_oauth_pkce:mercado_pago_split:creator-1$/);

assert.match(source, /timingSafeEqual/);
assert.match(source, /PaymentSecretVault/);
assert.doesNotMatch(source, /\bfetch\s*\(/);
assert.doesNotMatch(source, /process\.env/);

assert.match(sql, /DRAFT ONLY/);
assert.match(sql, /DO NOT APPLY DIRECTLY/);
assert.match(sql, /state_hash text not null unique/);
assert.match(sql, /pkce_verifier_reference text not null/);
assert.match(sql, /credential_reference text not null/);
assert.match(sql, /revoke all on table public\.creator_payment_oauth_sessions from public, anon, authenticated/i);
assert.match(sql, /revoke all on table public\.creator_payment_credential_references from public, anon, authenticated/i);
assert.match(sql, /creator_payment_oauth_browser_deny/);
assert.match(sql, /creator_payment_credential_references_browser_deny/);
assert.doesNotMatch(sql, /\baccess_token\b/i);
assert.doesNotMatch(sql, /\brefresh_token\b/i);

console.log("MARA_PAYMENT_OAUTH_BOUNDARY_CONTRACT PASS");