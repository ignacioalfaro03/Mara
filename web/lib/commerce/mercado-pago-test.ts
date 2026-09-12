import crypto from "node:crypto";
import type { CreateCheckoutInput, ProviderPaymentSnapshot } from "@/lib/commerce/payment-provider-contract";

// TEST/SANDBOX SUPPORT ONLY.
// This module is deliberately NOT wired into getPaymentRuntime() or checkout routes.
// Importing it must never make Mercado Pago executable in production.

const MP_API_BASE = "https://api.mercadopago.com";
const MP_AUTH_BASE = "https://auth.mercadopago.cl/authorization";

export type MercadoPagoTestOAuthInput = {
  clientId: string;
  redirectUri: string;
  state: string;
  pkceChallenge: string;
};

export type MercadoPagoPreferenceRequest = {
  items: Array<{
    id: string;
    title: string;
    currency_id: string;
    quantity: 1;
    unit_price: number;
  }>;
  marketplace_fee: number;
  external_reference: string;
  notification_url: string;
  back_urls: {
    success: string;
    pending: string;
    failure: string;
  };
  auto_return: "approved";
};

type MercadoPagoWebhookInput = {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string;
};

type MercadoPagoPaymentPayload = {
  id?: string | number | null;
  status?: string | null;
  external_reference?: string | null;
  transaction_amount?: number | null;
  currency_id?: string | null;
  transaction_amount_refunded?: number | null;
  date_created?: string | null;
  date_last_updated?: string | null;
  fee_details?: Array<{ type?: string | null; amount?: number | null }> | null;
  collector_id?: string | number | null;
};

function assertNonEmpty(value: string, field: string) {
  if (!value.trim()) throw new Error(`missing_${field}`);
}

function minorToMajor(amountMinor: number) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new Error("invalid_minor_units");
  return amountMinor / 100;
}

function majorToMinor(amountMajor: number | null | undefined) {
  if (typeof amountMajor !== "number" || !Number.isFinite(amountMajor) || amountMajor < 0) return 0;
  return Math.round(amountMajor * 100);
}

export function buildMercadoPagoTestAuthorizationUrl(input: MercadoPagoTestOAuthInput) {
  for (const [field, value] of Object.entries(input)) assertNonEmpty(value, field);
  const url = new URL(MP_AUTH_BASE);
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("platform_id", "mp");
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge", input.pkceChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export function buildMercadoPagoTestPreference(
  input: CreateCheckoutInput,
  offerTitle: string,
  notificationUrl: string,
): MercadoPagoPreferenceRequest {
  assertNonEmpty(offerTitle, "offer_title");
  assertNonEmpty(notificationUrl, "notification_url");
  if (input.platformFeeMinor < 0 || input.platformFeeMinor > input.amountMinor) {
    throw new Error("invalid_platform_fee_minor");
  }

  return {
    items: [{
      id: input.offerId,
      title: offerTitle,
      currency_id: input.currency,
      quantity: 1,
      unit_price: minorToMajor(input.amountMinor),
    }],
    marketplace_fee: minorToMajor(input.platformFeeMinor),
    external_reference: input.checkoutIntentId,
    notification_url: notificationUrl,
    back_urls: {
      success: input.successUrl,
      pending: input.pendingUrl,
      failure: input.failureUrl,
    },
    auto_return: "approved",
  };
}

function parseSignatureHeader(value: string | null) {
  const parts = new Map<string, string>();
  for (const item of value?.split(",") ?? []) {
    const [key, raw] = item.split("=", 2).map((part) => part.trim());
    if (key && raw) parts.set(key, raw);
  }
  return { ts: parts.get("ts") ?? null, v1: parts.get("v1") ?? null };
}

function safeHexEqual(left: string, right: string) {
  if (!/^[0-9a-f]+$/i.test(left) || !/^[0-9a-f]+$/i.test(right)) return false;
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Implements Mercado Pago's documented HMAC-SHA256 webhook manifest:
 * id:<data.id>;request-id:<x-request-id>;ts:<ts>;
 * Missing values are omitted. data.id is normalized to lower-case.
 */
export function verifyMercadoPagoWebhookSignature(input: MercadoPagoWebhookInput) {
  const { ts, v1 } = parseSignatureHeader(input.xSignature);
  if (!ts || !v1 || !input.secret) return false;

  const pieces: string[] = [];
  if (input.dataId) pieces.push(`id:${input.dataId.toLowerCase()};`);
  if (input.xRequestId) pieces.push(`request-id:${input.xRequestId};`);
  pieces.push(`ts:${ts};`);
  const manifest = pieces.join("");
  const expected = crypto.createHmac("sha256", input.secret).update(manifest).digest("hex");
  return safeHexEqual(expected, v1);
}

export function normalizeMercadoPagoPayment(
  payload: MercadoPagoPaymentPayload,
  providerAccountId: string,
): ProviderPaymentSnapshot {
  const providerPaymentId = payload.id === null || payload.id === undefined ? "" : String(payload.id);
  if (!providerPaymentId) throw new Error("mercado_pago_payment_missing_id");
  if (!payload.currency_id) throw new Error("mercado_pago_payment_missing_currency");

  const statusMap: Record<string, ProviderPaymentSnapshot["status"]> = {
    pending: "pending",
    in_process: "pending",
    authorized: "authorized",
    approved: "succeeded",
    rejected: "failed",
    cancelled: "failed",
    refunded: "refunded",
    charged_back: "chargeback",
  };

  const refundedAmountMinor = majorToMinor(payload.transaction_amount_refunded);
  const amountMinor = majorToMinor(payload.transaction_amount);
  let status = statusMap[payload.status ?? ""] ?? "pending";
  if (status === "succeeded" && refundedAmountMinor > 0 && refundedAmountMinor < amountMinor) {
    status = "partially_refunded";
  }

  const processorFeeMinor = (payload.fee_details ?? [])
    .filter((fee) => fee.type === "mercadopago_fee" || fee.type === "financing_fee")
    .reduce((sum, fee) => sum + majorToMinor(fee.amount), 0);

  return {
    providerPaymentId,
    providerAccountId,
    providerExternalReference: payload.external_reference ?? null,
    amountMinor,
    refundedAmountMinor,
    currency: payload.currency_id,
    status,
    processorFeeMinor,
    providerCreatedAt: payload.date_created ?? null,
    providerUpdatedAt: payload.date_last_updated ?? null,
  };
}

export function mercadoPagoTestApiEndpoints() {
  return {
    createPreference: `${MP_API_BASE}/checkout/preferences`,
    oauthToken: `${MP_API_BASE}/oauth/token`,
    payment: (paymentId: string) => `${MP_API_BASE}/v1/payments/${encodeURIComponent(paymentId)}`,
  };
}
