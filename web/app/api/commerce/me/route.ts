import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { serviceHeaders, type CommerceGoalRow, type CommerceOfferRow } from "@/lib/commerce/backend";

export const runtime = "nodejs";

type EntitlementRow = {
  entitlement_key: string;
  status: "active" | "revoked";
  granted_at: string;
  revoked_at: string | null;
};

type PurchaseRow = {
  id: string;
  offer_id: string;
  amount_minor: number;
  currency: string;
  provider: string;
  status: "succeeded" | "failed" | "refunded";
  fulfilled_at: string | null;
  refunded_at: string | null;
  created_at: string;
};

type ContributionRow = {
  offer_id: string;
  goal_id: string;
  amount_minor: number;
  currency: string;
  status: "succeeded" | "refunded";
  created_at: string;
  refunded_at: string | null;
};

async function readRows<T>(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) return { ok: false as const, rows: [] as T[] };
  return { ok: true as const, rows: (await response.json()) as T[] };
}
export async function GET() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const config = getServerBackendConfig();
  if (!config) {
    const response = NextResponse.json({ error: "commerce_backend_not_configured" }, { status: 503 });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const userFilter = encodeURIComponent(session.user.id);
  const headers = serviceHeaders(config, false);
  const [offers, goals, entitlements, purchases, contributions] = await Promise.all([
    readRows<CommerceOfferRow>(`${config.url}/rest/v1/commerce_offers?select=*&status=eq.active`, { headers, cache: "no-store" }),
    readRows<CommerceGoalRow>(`${config.url}/rest/v1/commerce_goals?select=*`, { headers, cache: "no-store" }),
    readRows<EntitlementRow>(`${config.url}/rest/v1/commerce_entitlements?select=entitlement_key,status,granted_at,revoked_at&user_id=eq.${userFilter}`, { headers, cache: "no-store" }),
    readRows<PurchaseRow>(`${config.url}/rest/v1/commerce_purchases?select=id,offer_id,amount_minor,currency,provider,status,fulfilled_at,refunded_at,created_at&user_id=eq.${userFilter}&order=created_at.desc&limit=20`, { headers, cache: "no-store" }),
    readRows<ContributionRow>(`${config.url}/rest/v1/commerce_contributions?select=offer_id,goal_id,amount_minor,currency,status,created_at,refunded_at&user_id=eq.${userFilter}&order=created_at.desc&limit=20`, { headers, cache: "no-store" }),
  ]);

  if (!offers.ok || !goals.ok || !entitlements.ok || !purchases.ok || !contributions.ok) {
    const response = NextResponse.json({ error: "commerce_read_failed" }, { status: 502 });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  }

  const offersById = new Map(offers.rows.map((offer) => [offer.id, offer]));
  const goalsById = new Map(goals.rows.map((goal) => [goal.id, goal]));

  const response = NextResponse.json({
    entitlements: entitlements.rows.map((entitlement) => ({
      key: entitlement.entitlement_key,
      status: entitlement.status,
      grantedAt: entitlement.granted_at,
      revokedAt: entitlement.revoked_at,
    })),
    purchases: purchases.rows.map((purchase) => {
      const offer = offersById.get(purchase.offer_id);
      return {
        id: purchase.id,
        offerSlug: offer?.slug ?? null,
        offerTitle: offer?.title ?? null,
        offerType: offer?.type ?? null,
        amountMinor: purchase.amount_minor,
        currency: purchase.currency,
        provider: purchase.provider,
        status: purchase.status,
        fulfilledAt: purchase.fulfilled_at,
        refundedAt: purchase.refunded_at,
        createdAt: purchase.created_at,
      };
    }),
    contributions: contributions.rows.map((contribution) => {
      const offer = offersById.get(contribution.offer_id);
      const goal = goalsById.get(contribution.goal_id);
      return {
        offerSlug: offer?.slug ?? null,
        goalSlug: goal?.slug ?? null,
        amountMinor: contribution.amount_minor,
        currency: contribution.currency,
        status: contribution.status,
        createdAt: contribution.created_at,
        refundedAt: contribution.refunded_at,
      };
    }),
  });

  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
