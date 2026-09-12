import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const acceptanceSource = read("lib/commerce/provider-payment-acceptance.ts");
const webhookSource = read("lib/commerce/mercado-pago-sandbox-webhook.ts");
const mpSource = read("lib/commerce/mercado-pago-test.ts");

// The acceptance gate is pure and can be behavior-tested without provider I/O.
const compiled = ts.transpileModule(acceptanceSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const acceptance = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const expected = {
  checkoutIntentId: "11111111-1111-4111-8111-111111111111",
  creatorId: "22222222-2222-4222-8222-222222222222",
  provider: "mercado_pago_split",
  providerAccountId: "seller-123",
  amountMinor: 125000,
  currency: "CLP",
};
const provider = {
  providerPaymentId: "pay-1",
  providerAccountId: "seller-123",
  providerExternalReference: expected.checkoutIntentId,
  amountMinor: 125000,
  refundedAmountMinor: 0,
  currency: "CLP",
  status: "succeeded",
  processorFeeMinor: 5000,
  providerCreatedAt: null,
  providerUpdatedAt: null,
};

assert.equal(acceptance.decideProviderPaymentAcceptance(expected, provider).disposition, "materialize_succeeded");
assert.equal(acceptance.decideProviderPaymentAcceptance(expected, { ...provider, status: "pending" }).disposition, "record_pending");
assert.equal(acceptance.decideProviderPaymentAcceptance(expected, { ...provider, status: "failed" }).disposition, "record_failed");

for (const mutation of [
  { providerExternalReference: "other-checkout" },
  { providerAccountId: "other-seller" },
  { amountMinor: 124999 },
  { currency: "USD" },
  { status: "refunded", refundedAmountMinor: 125000 },
]) {
  const decision = acceptance.decideProviderPaymentAcceptance(expected, { ...provider, ...mutation });
  assert.equal(decision.disposition, "hold");
  assert.ok(decision.issues.length > 0);
}

// Webhook orchestration must verify before re-fetch/materialization and resolve only
// an opaque account binding, never a token in the callback URL.
assert.match(webhookSource, /verifyMercadoPagoWebhookSignature/);
assert.match(webhookSource, /resolveAccountBinding/);
assert.match(webhookSource, /fetchMercadoPagoSandboxPayment/);
assert.match(webhookSource, /readCheckoutExpectation/);
assert.match(webhookSource, /decideProviderPaymentAcceptance/);
assert.match(webhookSource, /mara_account/);
assert.doesNotMatch(webhookSource, /process\.env/);
assert.doesNotMatch(webhookSource, /\bfetch\s*\(/);
assert.doesNotMatch(webhookSource, /access_token|refresh_token/i);

// Provider identity must be checked against collector_id when Mercado Pago includes it.
assert.match(mpSource, /collector_id/);
assert.match(mpSource, /mercado_pago_payment_collector_mismatch/);
assert.match(mpSource, /buildMercadoPagoSandboxNotificationUrl/);
assert.match(mpSource, /notification_url_must_use_https/);

console.log("MARA_PAYMENT_WEBHOOK_ACCEPTANCE_CONTRACT PASS");
