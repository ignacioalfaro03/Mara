import crypto from "node:crypto";
import { getServerBackendConfig } from "@/lib/backend-config";
import { getPaymentRuntime, verifyWebhookSignature } from "@/lib/commerce/config";
import { serviceHeaders } from "@/lib/commerce/backend";

type SignedTestPayload = {
  eventType?: unknown;
  providerEventId?: unknown;
  providerCheckoutId?: unknown;
  providerPaymentId?: unknown;
  amountMinor?: unknown;
  currency?: unknown;
};

type FulfillmentResult =
  | { ok: true; purchaseId: string | null; status: number }
  | { ok: false; error: string; status: number };

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function payloadHash(rawBody: string) {
  return crypto.createHash("sha256").update(rawBody).digest("hex");
}
function parsePayload(rawBody: string): SignedTestPayload | null {
  try {
    const parsed = JSON.parse(rawBody) as SignedTestPayload;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function isSafeProviderId(value: unknown, prefix: string) {
  return typeof value === "string" && value.startsWith(prefix) && value.length <= 100;
}

function isValidPayload(payload: SignedTestPayload) {
  return (
    (payload.eventType === "payment_succeeded" || payload.eventType === "payment_refunded") &&
    isSafeProviderId(payload.providerEventId, "evt_test_") &&
    isSafeProviderId(payload.providerPaymentId, "pay_test_") &&
    isSafeProviderId(payload.providerCheckoutId, "checkout_test_") &&
    Number.isInteger(payload.amountMinor) &&
    Number(payload.amountMinor) > 0 &&
    typeof payload.currency === "string" &&
    /^[A-Z]{3}$/.test(payload.currency)
  );
}

export async function fulfillSignedTestWebhook(rawBody: string, signature: string | null): Promise<FulfillmentResult> {
  const runtime = getPaymentRuntime();
  if (!runtime.configured || runtime.provider !== "signed_test") {
    return { ok: false, error: "payment_provider_not_configured", status: 503 };
  }

  if (!verifyWebhookSignature(rawBody, signature, runtime.webhookSecret)) {
    return { ok: false, error: "invalid_webhook_signature", status: 401 };
  }

  const payload = parsePayload(rawBody);
  if (!payload || !isValidPayload(payload)) {
    return { ok: false, error: "invalid_webhook_payload", status: 400 };
  }

  const config = getServerBackendConfig();
  if (!config) {
    return { ok: false, error: "commerce_backend_not_configured", status: 503 };
  }

  const rpcName = payload.eventType === "payment_refunded"
    ? "refund_mara_commerce_purchase"
    : "fulfill_mara_commerce_checkout";
  const body = payload.eventType === "payment_refunded"
    ? {
        p_provider: "signed_test",
        p_provider_event_id: payload.providerEventId,
        p_provider_payment_id: payload.providerPaymentId,
        p_payload_sha256: payloadHash(rawBody),
      }
    : {
        p_provider: "signed_test",
        p_provider_event_id: payload.providerEventId,
        p_provider_checkout_id: payload.providerCheckoutId,
        p_provider_payment_id: payload.providerPaymentId,
        p_amount_minor: payload.amountMinor,
        p_currency: payload.currency,
        p_event_type: payload.eventType,
        p_payload_sha256: payloadHash(rawBody),
      };

  const response = await fetch(`${config.url}/rest/v1/rpc/${rpcName}`, {
    method: "POST",
    headers: serviceHeaders(config),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false, error: "commerce_fulfillment_failed", status: 502 };
  }

  const purchaseId = (await response.json().catch(() => null)) as string | null;
  return {
    ok: true,
    purchaseId: typeof purchaseId === "string" && UUID_LIKE.test(purchaseId) ? purchaseId : null,
    status: 200,
  };
}
