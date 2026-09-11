import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type OfferRow, type PurchaseRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { safeLocalReturn, serviceRest, slugify, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RequestRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: string;
  category: string;
  description: string;
  budget_minor: number | null;
  counter_amount_minor: number | null;
  currency: string;
  turnaround_days: number | null;
  offer_id: string | null;
  purchase_id: string | null;
  fulfillment_notes: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | null | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

async function readOwnedRequest(accessToken: string, creatorId: string, requestId: string) {
  const result = await userRest<RequestRow[]>(
    accessToken,
    `creator_requests?select=*&id=eq.${encodeURIComponent(requestId)}&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`,
  );
  return result.ok ? result.data[0] ?? null : null;
}

async function ensureRequestOffer(requestRow: RequestRow, amountMinor: number) {
  const fulfillmentKey = `request_${requestRow.id.replaceAll("-", "")}`.slice(0, 100);
  if (requestRow.offer_id) {
    const updated = await serviceRest<OfferRow[]>(`commerce_offers?id=eq.${encodeURIComponent(requestRow.offer_id)}&creator_id=eq.${encodeURIComponent(requestRow.creator_id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        amount_minor: amountMinor,
        status: "active",
        visibility: "private_user",
        buyer_user_id: requestRow.user_id,
        updated_at: new Date().toISOString(),
      }),
    });
    return updated.ok ? updated.data[0] ?? null : null;
  }

  const slug = `${slugify(`request-${requestRow.id.slice(0, 8)}`, 55)}-${crypto.randomUUID().slice(0, 8)}`;
  const created = await serviceRest<OfferRow[]>("commerce_offers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: requestRow.creator_id,
      world_id: requestRow.world_id,
      demand_request_id: null,
      slug,
      type: "fixed_unlock",
      title: `Solicitud personalizada · ${requestRow.category}`.slice(0, 140),
      description: "Oferta privada creada desde una solicitud aceptada por la creadora.",
      price_mode: "fixed",
      amount_minor: amountMinor,
      currency: requestRow.currency,
      fulfillment_key: fulfillmentKey,
      offer_family: "personalized_digital",
      status: "active",
      visibility: "private_user",
      buyer_user_id: requestRow.user_id,
      metadata: {
        fulfillment_mode: "creator_manual",
        fulfillment_concept: "creator_request",
        request_id: requestRow.id,
      },
    }),
  });
  return created.ok ? created.data[0] ?? null : null;
}

export async function GET() {
  if (process.env.MARA_REQUESTS_SYSTEM_ENABLED !== "true") return NextResponse.json({ enabled: false, requests: [] });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const result = await userRest<RequestRow[]>(
    session.accessToken,
    `creator_requests?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&order=created_at.desc&limit=100`,
  );
  const response = result.ok
    ? NextResponse.json({ enabled: true, requests: result.data })
    : NextResponse.json({ error: "request_read_failed" }, { status: 502 });
  return withSession(response, session.refreshedSession);
}

export async function POST(request: Request) {
  if (process.env.MARA_REQUESTS_SYSTEM_ENABLED !== "true") return NextResponse.json({ error: "request_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const form = await request.formData();
  const requestId = String(form.get("requestId") ?? "");
  const action = String(form.get("action") ?? "");
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator");
  if (!UUID_LIKE.test(requestId)) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const row = await readOwnedRequest(session.accessToken, creator.id, requestId);
  if (!row) return NextResponse.json({ error: "request_not_found" }, { status: 404 });

  let patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (action === "decline") {
    if (!["requested", "reviewing", "countered"].includes(row.status)) return NextResponse.json({ error: "request_not_declineable" }, { status: 409 });
    patch.status = "declined";
  } else if (action === "accept" || action === "counter") {
    if (!["requested", "reviewing", "countered"].includes(row.status)) return NextResponse.json({ error: "request_not_priceable" }, { status: 409 });
    const amountMajor = Number(form.get("amount") ?? 0);
    const amountMinor = Number.isFinite(amountMajor) && amountMajor > 0 && amountMajor <= 10_000_000
      ? Math.round(amountMajor * 100)
      : row.budget_minor;
    if (!amountMinor || amountMinor <= 0) return NextResponse.json({ error: "request_price_required" }, { status: 400 });
    const offer = await ensureRequestOffer(row, amountMinor);
    if (!offer) return NextResponse.json({ error: "request_offer_create_failed" }, { status: 502 });
    patch = {
      ...patch,
      offer_id: offer.id,
      counter_amount_minor: amountMinor,
      status: action === "counter" ? "countered" : "payment_pending",
    };
    await emitProductEvent(request, "request_accepted", { surface: "/creator", target: action, offer_slug: offer.slug, currency: offer.currency });
  } else if (action === "start") {
    if (row.status !== "paid" || !row.purchase_id) return NextResponse.json({ error: "request_not_paid" }, { status: 409 });
    patch.status = "in_progress";
  } else if (action === "deliver") {
    if (!["paid", "in_progress"].includes(row.status) || !row.purchase_id) return NextResponse.json({ error: "request_not_deliverable" }, { status: 409 });
    const purchaseResult = await userRest<PurchaseRow[]>(
      session.accessToken,
      `commerce_purchases?select=*&id=eq.${encodeURIComponent(row.purchase_id)}&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(row.user_id)}&limit=1`,
    );
    const purchase = purchaseResult.ok ? purchaseResult.data[0] : null;
    if (!purchase || purchase.status !== "succeeded") return NextResponse.json({ error: "request_purchase_not_fulfillable" }, { status: 409 });
    if (!purchase.fulfilled_at) {
      const fulfilled = await userRest<unknown>(session.accessToken, "rpc/complete_mara_creator_fulfillment", {
        method: "POST",
        body: JSON.stringify({ p_purchase_id: purchase.id }),
      });
      if (!fulfilled.ok) return NextResponse.json({ error: "request_fulfillment_failed" }, { status: 502 });
    }
    patch.status = "delivered";
    patch.delivered_at = new Date().toISOString();
    patch.fulfillment_notes = String(form.get("fulfillmentNotes") ?? "").trim().slice(0, 4000) || null;
    await emitProductEvent(request, "request_delivered", { surface: "/creator", target: row.category });
  } else if (action === "complete") {
    if (row.status !== "delivered") return NextResponse.json({ error: "request_not_completable" }, { status: 409 });
    patch.status = "completed";
    patch.completed_at = new Date().toISOString();
  } else {
    return NextResponse.json({ error: "invalid_request_action" }, { status: 400 });
  }

  const updated = await serviceRest<RequestRow[]>(`creator_requests?id=eq.${encodeURIComponent(row.id)}&creator_id=eq.${encodeURIComponent(creator.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!updated.ok || !updated.data[0]) return NextResponse.json({ error: "request_update_failed" }, { status: 502 });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
