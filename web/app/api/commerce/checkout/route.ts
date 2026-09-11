import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { CAPRICHO_OFFER_SLUG, getAmountForOffer } from "@/lib/commerce/catalog";
import { getAppBaseUrl, getPaymentRuntime, signTestCheckout } from "@/lib/commerce/config";
import { serviceHeaders, toCommerceOffer, type CommerceCheckoutIntentRow, type CommerceGoalRow, type CommerceOfferRow } from "@/lib/commerce/backend";

export const runtime = "nodejs";

type CheckoutBody = { offerSlug?: unknown; amountMinor?: unknown; clientRequestId?: unknown };
type CheckoutOfferRow = CommerceOfferRow & { visibility?: "public" | "private_user"; buyer_user_id?: string | null };
type RequestCheckoutRow = {
  id: string;
  user_id: string;
  creator_id: string;
  world_id: string;
  offer_id: string | null;
  counter_amount_minor: number | null;
  status: string;
};
const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_OFFER_SLUG = /^[a-z0-9][a-z0-9_-]{1,80}$/;

function errorResponse(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}
function safeSlug(value: unknown) { return typeof value === "string" && SAFE_OFFER_SLUG.test(value) ? value : null; }
function safeUuid(value: unknown) { return typeof value === "string" && UUID_LIKE.test(value) ? value : null; }
function safeAmount(value: unknown) { return Number.isInteger(value) && Number(value) > 0 && Number(value) <= 10000000 ? Number(value) : null; }

async function readOne<T>(url: string, headers: HeadersInit) {
  const response = await fetch(url, { headers, cache: "no-store" });
  if (!response.ok) return { ok: false as const, row: null };
  const rows = (await response.json()) as T[];
  return { ok: true as const, row: rows[0] ?? null };
}

async function readExistingIntent(config: NonNullable<ReturnType<typeof getServerBackendConfig>>, userId: string, clientRequestId: string) {
  return readOne<CommerceCheckoutIntentRow>(`${config.url}/rest/v1/commerce_checkout_intents?select=*&user_id=eq.${encodeURIComponent(userId)}&client_request_id=eq.${encodeURIComponent(clientRequestId)}&limit=1`, serviceHeaders(config, false));
}

function sameIntent(intent: CommerceCheckoutIntentRow, offer: CommerceOfferRow, amountMinor: number, provider: string) {
  return intent.offer_id === offer.id && intent.amount_minor === amountMinor && intent.currency === offer.currency && intent.provider === provider;
}

function requestIdFromOffer(offer: CommerceOfferRow) {
  if (!offer.metadata || typeof offer.metadata !== "object" || Array.isArray(offer.metadata)) return null;
  const value = (offer.metadata as Record<string, unknown>).request_id;
  return typeof value === "string" && UUID_LIKE.test(value) ? value : null;
}

async function verifyRequestCheckout(
  config: NonNullable<ReturnType<typeof getServerBackendConfig>>,
  headers: HeadersInit,
  offer: CheckoutOfferRow,
  userId: string,
  amountMinor: number,
) {
  if (offer.visibility === "private_user" && offer.buyer_user_id !== userId) {
    return { ok: false as const, response: errorResponse("commerce_offer_not_found", 404) };
  }

  const requestId = requestIdFromOffer(offer);
  if (!requestId) return { ok: true as const };
  const result = await readOne<RequestCheckoutRow>(
    `${config.url}/rest/v1/creator_requests?select=id,user_id,creator_id,world_id,offer_id,counter_amount_minor,status&id=eq.${encodeURIComponent(requestId)}&offer_id=eq.${encodeURIComponent(offer.id)}&user_id=eq.${encodeURIComponent(userId)}&status=eq.payment_pending&limit=1`,
    headers,
  );
  if (!result.ok) return { ok: false as const, response: errorResponse("request_checkout_read_failed", 502) };
  if (!result.row) return { ok: false as const, response: errorResponse("request_checkout_not_available", 409) };
  if (result.row.creator_id !== offer.creator_id || result.row.world_id !== offer.world_id) {
    return { ok: false as const, response: errorResponse("request_checkout_scope_mismatch", 409) };
  }
  if (!result.row.counter_amount_minor || result.row.counter_amount_minor !== amountMinor) {
    return { ok: false as const, response: errorResponse("request_checkout_amount_changed", 409) };
  }
  return { ok: true as const };
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try { body = (await request.json()) as CheckoutBody; }
  catch { return errorResponse("invalid_json", 400); }

  const offerSlug = safeSlug(body.offerSlug);
  const clientRequestId = safeUuid(body.clientRequestId);
  if (!offerSlug || !clientRequestId) return errorResponse("invalid_checkout_request", 400);

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return errorResponse("authentication_required", 401);

  const payment = getPaymentRuntime();
  if (!payment.configured) {
    const response = errorResponse("payment_provider_not_configured", 503, { providerStatus: "not_configured", reason: payment.reason });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const config = getServerBackendConfig();
  if (!config) return errorResponse("commerce_backend_not_configured", 503);
  const headers = serviceHeaders(config, false);
  const offerResult = await readOne<CheckoutOfferRow>(`${config.url}/rest/v1/commerce_offers?select=*&slug=eq.${encodeURIComponent(offerSlug)}&status=eq.active&limit=1`, headers);
  if (!offerResult.ok) return errorResponse("commerce_offer_read_failed", 502);
  const offer = offerResult.row;
  if (!offer) return errorResponse("commerce_offer_not_found", 404);

  if (offer.visibility === "private_user" && offer.buyer_user_id !== session.user.id) {
    return errorResponse("commerce_offer_not_found", 404);
  }

  // Private Alpha guard: creator-scoped offers are engineering-proof only until live payment authorization is explicit.
  if (offer.creator_id && payment.provider !== "signed_test") {
    return errorResponse("creator_offer_live_payment_not_authorized", 403, { testModeRequired: true });
  }

  const amountMinor = getAmountForOffer(toCommerceOffer(offer), safeAmount(body.amountMinor));
  if (amountMinor === null) return errorResponse("invalid_checkout_amount", 400);

  const requestCheckout = await verifyRequestCheckout(config, headers, offer, session.user.id, amountMinor);
  if (!requestCheckout.ok) return requestCheckout.response;

  if (offer.slug === CAPRICHO_OFFER_SLUG) {
    const goalResult = await readOne<CommerceGoalRow>(`${config.url}/rest/v1/commerce_goals?select=*&offer_id=eq.${offer.id}&status=in.(funding,funded)&limit=1`, headers);
    if (!goalResult.ok || !goalResult.row) return errorResponse(goalResult.ok ? "commerce_goal_not_found" : "commerce_goal_read_failed", goalResult.ok ? 409 : 502);
    const remainingMinor = Math.max(0, goalResult.row.target_amount_minor - (goalResult.row.funded_amount_minor ?? 0));
    if (goalResult.row.status === "funded" || amountMinor > remainingMinor) return errorResponse("capricho_goal_no_longer_accepting", 409, { remainingMinor });
  }

  const existing = await readExistingIntent(config, session.user.id, clientRequestId);
  if (!existing.ok) return errorResponse("commerce_checkout_read_failed", 502);
  if (existing.row) {
    if (!sameIntent(existing.row, offer, amountMinor, payment.provider)) return errorResponse("checkout_idempotency_conflict", 409);
    const response = NextResponse.json({ checkoutUrl: existing.row.provider_checkout_url, intentId: existing.row.id, provider: payment.provider, status: existing.row.status, testMode: payment.provider === "signed_test" });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const intentId = crypto.randomUUID();
  if (payment.provider !== "signed_test") return errorResponse("payment_provider_not_implemented", 503);
  const providerCheckoutId = `checkout_test_${intentId}`;
  const checkoutUrl = `${getAppBaseUrl()}/api/commerce/test-checkout?intent=${encodeURIComponent(intentId)}&signature=${signTestCheckout(intentId, payment.webhookSecret)}`;

  const createResponse = await fetch(`${config.url}/rest/v1/commerce_checkout_intents?select=*`, {
    method: "POST",
    headers: { ...serviceHeaders(config), Prefer: "return=representation" },
    body: JSON.stringify({ id: intentId, user_id: session.user.id, offer_id: offer.id, client_request_id: clientRequestId, amount_minor: amountMinor, currency: offer.currency, provider: payment.provider, provider_checkout_id: providerCheckoutId, provider_checkout_url: checkoutUrl, status: "pending", metadata: { offer_slug: offer.slug, price_mode: offer.price_mode, creator_scoped: Boolean(offer.creator_id), request_scoped: Boolean(requestIdFromOffer(offer)) } }),
    cache: "no-store",
  });

  if (!createResponse.ok) {
    const retry = await readExistingIntent(config, session.user.id, clientRequestId);
    if (retry.ok && retry.row && sameIntent(retry.row, offer, amountMinor, payment.provider)) {
      const response = NextResponse.json({ checkoutUrl: retry.row.provider_checkout_url, intentId: retry.row.id, provider: payment.provider, status: retry.row.status, testMode: true });
      if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
      return response;
    }
    return errorResponse("commerce_checkout_create_failed", 502);
  }

  const rows = (await createResponse.json()) as CommerceCheckoutIntentRow[];
  const created = rows[0];
  const response = NextResponse.json({ checkoutUrl: created?.provider_checkout_url ?? checkoutUrl, intentId, provider: payment.provider, status: "pending", testMode: true }, { status: 201 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
