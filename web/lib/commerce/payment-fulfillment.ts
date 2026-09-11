import crypto from "node:crypto";
import { getServerBackendConfig } from "@/lib/backend-config";
import { getPaymentRuntime, verifyWebhookSignature } from "@/lib/commerce/config";
import { serviceHeaders } from "@/lib/commerce/backend";
import { serviceRest } from "@/lib/supabase/server-rest";

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

async function syncCreatorRequestPurchase(purchaseId: string, eventType: "payment_succeeded" | "payment_refunded") {
  if (process.env.MARA_REQUESTS_SYSTEM_ENABLED !== "true") return;
  const purchases = await serviceRest<Array<{ id: string; offer_id: string }>>(
    `commerce_purchases?select=id,offer_id&id=eq.${encodeURIComponent(purchaseId)}&limit=1`,
  );
  const purchase = purchases.ok ? purchases.data[0] : null;
  if (!purchase) return;

  const offers = await serviceRest<Array<{ id: string; metadata: Record<string, unknown> }>>(
    `commerce_offers?select=id,metadata&id=eq.${encodeURIComponent(purchase.offer_id)}&limit=1`,
  );
  const requestId = offers.ok && typeof offers.data[0]?.metadata?.request_id === "string"
    ? offers.data[0].metadata.request_id
    : null;
  if (!requestId || !UUID_LIKE.test(requestId)) return;

  await serviceRest<unknown>(`creator_requests?id=eq.${encodeURIComponent(requestId)}&offer_id=eq.${encodeURIComponent(purchase.offer_id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      purchase_id: purchase.id,
      status: eventType === "payment_refunded" ? "refunded" : "paid",
      updated_at: new Date().toISOString(),
    }),
  });
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
  const normalizedPurchaseId = typeof purchaseId === "string" && UUID_LIKE.test(purchaseId) ? purchaseId : null;
  if (normalizedPurchaseId && (payload.eventType === "payment_succeeded" || payload.eventType === "payment_refunded")) {
    await syncCreatorRequestPurchase(normalizedPurchaseId, payload.eventType);
  }

  return {
    ok: true,
    purchaseId: normalizedPurchaseId,
    status: 200,
  };
}
