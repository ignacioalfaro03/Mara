import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "lib/commerce/mercado-pago-test.ts");
const source = fs.readFileSync(sourcePath, "utf8");

// Sandbox primitives must remain inert: no credentials, env reads or network calls.
assert.doesNotMatch(source, /process\.env/);
assert.doesNotMatch(source, /\bfetch\s*\(/);
assert.doesNotMatch(source, /MARA_PAYMENT_PROVIDER/);

const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const sandbox = await import(moduleUrl);

const authUrl = new URL(sandbox.buildMercadoPagoTestAuthorizationUrl({
  clientId: "123456",
  redirectUri: "https://example.test/api/payments/mercado-pago/oauth/callback",
  state: "state-123",
  pkceChallenge: "challenge-123",
}));
assert.equal(authUrl.origin, "https://auth.mercadopago.cl");
assert.equal(authUrl.searchParams.get("response_type"), "code");
assert.equal(authUrl.searchParams.get("state"), "state-123");
assert.equal(authUrl.searchParams.get("code_challenge_method"), "S256");

const preference = sandbox.buildMercadoPagoTestPreference({
  checkoutIntentId: "11111111-1111-4111-8111-111111111111",
  creatorId: "22222222-2222-4222-8222-222222222222",
  userId: "33333333-3333-4333-8333-333333333333",
  offerId: "44444444-4444-4444-8444-444444444444",
  providerAccountId: "seller-test-1",
  amountMinor: 125000,
  currency: "CLP",
  platformFeeMinor: 18750,
  successUrl: "https://example.test/success",
  pendingUrl: "https://example.test/pending",
  failureUrl: "https://example.test/failure",
}, "Oferta prueba", "https://example.test/api/payments/mercado-pago/webhook");
assert.equal(preference.items[0].unit_price, 1250);
assert.equal(preference.marketplace_fee, 187.5);
assert.equal(preference.external_reference, "11111111-1111-4111-8111-111111111111");

const dataId = "PAYMENTABC123";
const requestId = "request-123";
const tsValue = "1704908010";
const secret = "sandbox-webhook-secret";
const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${tsValue};`;
const v1 = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
assert.equal(sandbox.verifyMercadoPagoWebhookSignature({
  xSignature: `ts=${tsValue},v1=${v1}`,
  xRequestId: requestId,
  dataId,
  secret,
}), true);
assert.equal(sandbox.verifyMercadoPagoWebhookSignature({
  xSignature: `ts=${tsValue},v1=${"0".repeat(64)}`,
  xRequestId: requestId,
  dataId,
  secret,
}), false);

const payment = sandbox.normalizeMercadoPagoPayment({
  id: 991,
  status: "approved",
  external_reference: "11111111-1111-4111-8111-111111111111",
  transaction_amount: 1250,
  transaction_amount_refunded: 250,
  currency_id: "CLP",
  fee_details: [{ type: "mercadopago_fee", amount: 65 }],
  date_created: "2026-09-12T12:00:00Z",
  date_last_updated: "2026-09-12T12:05:00Z",
}, "seller-test-1");
assert.equal(payment.providerPaymentId, "991");
assert.equal(payment.amountMinor, 125000);
assert.equal(payment.refundedAmountMinor, 25000);
assert.equal(payment.processorFeeMinor, 6500);
assert.equal(payment.status, "partially_refunded");

const endpoints = sandbox.mercadoPagoTestApiEndpoints();
assert.equal(endpoints.createPreference, "https://api.mercadopago.com/checkout/preferences");
assert.equal(endpoints.oauthToken, "https://api.mercadopago.com/oauth/token");
assert.equal(endpoints.payment("991"), "https://api.mercadopago.com/v1/payments/991");

console.log("MARA_MERCADO_PAGO_TEST_CONTRACT PASS");
