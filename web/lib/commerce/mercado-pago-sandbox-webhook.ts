import { decideProviderPaymentAcceptance, type CheckoutPaymentExpectation } from "@/lib/commerce/provider-payment-acceptance";
import {
  fetchMercadoPagoSandboxPayment,
  type MercadoPagoSandboxCredentialVault,
  type MercadoPagoSandboxTransport,
} from "@/lib/commerce/mercado-pago-sandbox-client";
import { verifyMercadoPagoWebhookSignature } from "@/lib/commerce/mercado-pago-test";

export type MercadoPagoSandboxAccountBinding = {
  bindingId: string;
  creatorId: string;
  providerAccountId: string;
  credentialReference: string;
};

export type MercadoPagoSandboxWebhookDeps = {
  resolveAccountBinding(bindingId: string): Promise<MercadoPagoSandboxAccountBinding | null>;
  readCheckoutExpectation(checkoutIntentId: string): Promise<CheckoutPaymentExpectation | null>;
  transport: MercadoPagoSandboxTransport;
  vault: MercadoPagoSandboxCredentialVault;
};

export type MercadoPagoSandboxWebhookResult =
  | { ok: false; status: 400 | 401 | 404 | 409; error: string }
  | {
      ok: true;
      status: 200;
      disposition: "ignored" | "materialize_succeeded" | "record_pending" | "record_failed" | "hold";
      providerPaymentId: string | null;
      checkoutIntentId: string | null;
      issues: Array<{ code: string; expected: string | number | null; observed: string | number | null }>;
    };

function readPaymentId(rawBody: string, url: string) {
  const parsedUrl = new URL(url);
  const queryId = parsedUrl.searchParams.get("data.id") ?? parsedUrl.searchParams.get("id");
  if (queryId?.trim()) return queryId.trim();

  try {
    const body = JSON.parse(rawBody) as { type?: unknown; data?: { id?: unknown } };
    if (body.type && body.type !== "payment") return null;
    const value = body.data?.id;
    if (typeof value === "string" || typeof value === "number") return String(value);
  } catch {
    return null;
  }
  return null;
}

/**
 * Sandbox-only webhook orchestration.
 *
 * The URL carries only an opaque Mara payment-account binding id (`mara_account`).
 * It never carries an access token, refresh token or credential reference.
 * Signature verification happens before provider re-fetch. Provider data is then
 * checked against the checkout snapshot before any downstream materializer is allowed.
 */
export async function processMercadoPagoSandboxWebhook(input: {
  rawBody: string;
  requestUrl: string;
  xSignature: string | null;
  xRequestId: string | null;
  webhookSecret: string;
}, deps: MercadoPagoSandboxWebhookDeps): Promise<MercadoPagoSandboxWebhookResult> {
  const url = new URL(input.requestUrl);
  const bindingId = url.searchParams.get("mara_account")?.trim() ?? "";
  if (!bindingId) return { ok: false, status: 400, error: "mercado_pago_sandbox_binding_missing" };

  const providerPaymentId = readPaymentId(input.rawBody, input.requestUrl);
  if (!providerPaymentId) {
    return { ok: true, status: 200, disposition: "ignored", providerPaymentId: null, checkoutIntentId: null, issues: [] };
  }

  const authentic = verifyMercadoPagoWebhookSignature({
    xSignature: input.xSignature,
    xRequestId: input.xRequestId,
    dataId: providerPaymentId,
    secret: input.webhookSecret,
  });
  if (!authentic) return { ok: false, status: 401, error: "mercado_pago_sandbox_signature_invalid" };

  const binding = await deps.resolveAccountBinding(bindingId);
  if (!binding) return { ok: false, status: 404, error: "mercado_pago_sandbox_binding_not_found" };

  const provider = await fetchMercadoPagoSandboxPayment({
    providerPaymentId,
    providerAccountId: binding.providerAccountId,
    credentialReference: binding.credentialReference,
  }, deps.transport, deps.vault);

  const checkoutIntentId = provider.providerExternalReference;
  if (!checkoutIntentId) {
    return {
      ok: true,
      status: 200,
      disposition: "hold",
      providerPaymentId,
      checkoutIntentId: null,
      issues: [{ code: "EXTERNAL_REFERENCE_MISSING", expected: "checkout_intent_id", observed: null }],
    };
  }

  const expected = await deps.readCheckoutExpectation(checkoutIntentId);
  if (!expected) {
    return {
      ok: true,
      status: 200,
      disposition: "hold",
      providerPaymentId,
      checkoutIntentId,
      issues: [{ code: "CHECKOUT_EXPECTATION_NOT_FOUND", expected: checkoutIntentId, observed: null }],
    };
  }
  if (expected.creatorId !== binding.creatorId || expected.providerAccountId !== binding.providerAccountId) {
    return {
      ok: true,
      status: 200,
      disposition: "hold",
      providerPaymentId,
      checkoutIntentId,
      issues: [{ code: "ACCOUNT_BINDING_SCOPE_MISMATCH", expected: expected.providerAccountId, observed: binding.providerAccountId }],
    };
  }

  const decision = decideProviderPaymentAcceptance(expected, provider);
  return {
    ok: true,
    status: 200,
    disposition: decision.disposition,
    providerPaymentId,
    checkoutIntentId,
    issues: decision.issues,
  };
}
