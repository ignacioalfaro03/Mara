import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { CAPRICHO_OFFER_SLUG, getAmountForOffer } from "@/lib/commerce/catalog";
import { getAppBaseUrl, getPaymentRuntime, signTestCheckout } from "@/lib/commerce/config";
import { serviceHeaders, toCommerceOffer, type CommerceCheckoutIntentRow, type CommerceGoalRow, type CommerceOfferRow } from "@/lib/commerce/backend";

export const runtime = "nodejs";

type CheckoutBody = {
  offerSlug?: unknown;
  amountMinor?: unknown;
  clientRequestId?: unknown;
};

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OFFER_SLUGS = new Set(["private_after_scene_note_v1", "black_bag_capricho_01"]);

function errorResponse(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}

function safeSlug(value: unknown) {
  return typeof value === "string" && OFFER_SLUGS.has(value) ? value : null;
}

function safeUuid(value: unknown) {
  return typeof value === "string" && UUID_LIKE.test(value) ? value : null;
}

function safeAmount(value: unknown) {
  return Number.isInteger(value) && Number(value) > 0 && Number(value) <= 10000000 ? Number(value) : null;
}

async function readOne<T>(url: string, headers: HeadersInit) {
  const response = await fetch(url, { headers, cache: "no-store" });
  if (!response.ok) return { ok: false as const, row: null };
  const rows = (await response.json()) as T[];
  return { ok: true as const, row: rows[0] ?? null };
}

async function readExistingIntent(config: NonNullable<ReturnType<typeof getServerBackendConfig>>, userId: string, clientRequestId: string) {
  return readOne<CommerceCheckoutIntentRow>(
    `${config.url}/rest/v1/commerce_checkout_intents?select=*&user_id=eq.${encodeURIComponent(userId)}&client_request_id=eq.${encodeURIComponent(clientRequestId)}&limit=1`,
    serviceHeaders(config, false),
  );
}

function sameIntent(
  intent: CommerceCheckoutIntentRow,
  offer: CommerceOfferRow,
  amountMinor: number,
  provider: string,
) {
  return (
    intent.offer_id === offer.id &&
    intent.amount_minor === amountMinor &&
    intent.currency === offer.currency &&
    intent.provider === provider
  );
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return errorResponse("invalid_json", 400);
  }

  const offerSlug = safeSlug(body.offerSlug);
  const clientRequestId = safeUuid(body.clientRequestId);
  if (!offerSlug || !clientRequestId) {
    return errorResponse("invalid_checkout_request", 400);
  }

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return errorResponse("authentication_required", 401);
  }

  const payment = getPaymentRuntime();
  if (!payment.configured) {
    const response = errorResponse("payment_provider_not_configured", 503, {
      providerStatus: "not_configured",
      reason: payment.reason,
    });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const config = getServerBackendConfig();
  if (!config) {
    const response = errorResponse("commerce_backend_not_configured", 503);
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const headers = serviceHeaders(config, false);
  const offerResult = await readOne<CommerceOfferRow>(
    `${config.url}/rest/v1/commerce_offers?select=*&slug=eq.${offerSlug}&status=eq.active&limit=1`,
    headers,
  );
  if (!offerResult.ok) {
    const response = errorResponse("commerce_offer_read_failed", 502);
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const offer = offerResult.row;
  if (!offer) {
    const response = errorResponse("commerce_offer_not_found", 404);
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const amountMinor = getAmountForOffer(toCommerceOffer(offer), safeAmount(body.amountMinor));
  if (amountMinor === null) {
    const response = errorResponse("invalid_checkout_amount", 400);
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  if (offer.slug === CAPRICHO_OFFER_SLUG) {
    const goalResult = await readOne<CommerceGoalRow>(
      `${config.url}/rest/v1/commerce_goals?select=*&offer_id=eq.${offer.id}&status=in.(funding,funded)&limit=1`,
      headers,
    );
    if (!goalResult.ok || !goalResult.row) {
      const response = errorResponse(goalResult.ok ? "commerce_goal_not_found" : "commerce_goal_read_failed", goalResult.ok ? 409 : 502);
      if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
      return response;
    }

    const remainingMinor = Math.max(0, goalResult.row.target_amount_minor - (goalResult.row.funded_amount_minor ?? 0));
    if (goalResult.row.status === "funded" || amountMinor > remainingMinor) {
      const response = errorResponse("capricho_goal_no_longer_accepting", 409, { remainingMinor });
      if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
      return response;
    }
  }

  const existing = await readExistingIntent(config, session.user.id, clientRequestId);
  if (!existing.ok) {
    const response = errorResponse("commerce_checkout_read_failed", 502);
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  if (existing.row) {
    if (!sameIntent(existing.row, offer, amountMinor, payment.provider)) {
      const response = errorResponse("checkout_idempotency_conflict", 409);
      if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
      return response;
    }

    const response = NextResponse.json({
      checkoutUrl: existing.row.provider_checkout_url,
      intentId: existing.row.id,
      provider: payment.provider,
      status: existing.row.status,
      testMode: payment.provider === "signed_test",
    });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const intentId = crypto.randomUUID();
  const providerCheckoutId = `checkout_test_${intentId}`;
  const checkoutUrl = `${getAppBaseUrl()}/api/commerce/test-checkout?intent=${encodeURIComponent(intentId)}&signature=${signTestCheckout(intentId, payment.webhookSecret)}`;

  const createResponse = await fetch(`${config.url}/rest/v1/commerce_checkout_intents?select=*`, {
    method: "POST",
    headers: {
      ...serviceHeaders(config),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      id: intentId,
      user_id: session.user.id,
      offer_id: offer.id,
      client_request_id: clientRequestId,
      amount_minor: amountMinor,
      currency: offer.currency,
      provider: payment.provider,
      provider_checkout_id: providerCheckoutId,
      provider_checkout_url: checkoutUrl,
      status: "pending",
      metadata: {
        offer_slug: offer.slug,
        price_mode: offer.price_mode,
      },
    }),
    cache: "no-store",
  });

  if (!createResponse.ok) {
    const retry = await readExistingIntent(config, session.user.id, clientRequestId);
    if (retry.ok && retry.row && sameIntent(retry.row, offer, amountMinor, payment.provider)) {
      const response = NextResponse.json({
        checkoutUrl: retry.row.provider_checkout_url,
        intentId: retry.row.id,
        provider: payment.provider,
        status: retry.row.status,
        testMode: payment.provider === "signed_test",
      });
      if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
      return response;
    }

    const response = errorResponse("commerce_checkout_create_failed", 502);
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const rows = (await createResponse.json()) as CommerceCheckoutIntentRow[];
  const created = rows[0];
  const response = NextResponse.json({
    checkoutUrl: created?.provider_checkout_url ?? checkoutUrl,
    intentId,
    provider: payment.provider,
    status: "pending",
    testMode: payment.provider === "signed_test",
  }, { status: 201 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
