import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { touchCreatorCustomerRelationship } from "@/lib/creator-relationship";
import { readOwnCreator, type OfferRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { safeLocalReturn, serviceRest, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAID_INTERACTION_FAMILIES = new Set(["bounded_interaction", "personalized_digital"]);

type ThreadRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: "active" | "archived" | "blocked";
};

type MessageRow = {
  id: string;
  thread_id: string;
  sender_kind: "consumer" | "creator" | "system";
  sender_user_id: string | null;
  type: string;
  body: string;
  offer_id: string | null;
  created_at: string;
};

export async function POST(request: Request) {
  if (!productCapability("paid_interactions") || !productCapability("messaging")) {
    return NextResponse.json({ error: "paid_interactions_disabled" }, { status: 404 });
  }

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const threadId = String(form.get("threadId") ?? "");
  const offerId = String(form.get("offerId") ?? "");
  const message = String(form.get("message") ?? "").trim();
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator/monetization");

  if (!UUID_LIKE.test(threadId) || !UUID_LIKE.test(offerId) || message.length > 1200) {
    return NextResponse.json({ error: "invalid_paid_interaction" }, { status: 400 });
  }

  const threadResult = await userRest<ThreadRow[]>(
    session.accessToken,
    `creator_threads?select=*&id=eq.${encodeURIComponent(threadId)}&creator_id=eq.${encodeURIComponent(creator.id)}&status=eq.active&limit=1`,
  );
  const thread = threadResult.ok ? threadResult.data[0] : null;
  if (!thread) return NextResponse.json({ error: "thread_not_authorized" }, { status: 403 });

  const offerResult = await userRest<OfferRow[]>(
    session.accessToken,
    `commerce_offers?select=*&id=eq.${encodeURIComponent(offerId)}&creator_id=eq.${encodeURIComponent(creator.id)}&world_id=eq.${encodeURIComponent(thread.world_id)}&status=eq.active&limit=1`,
  );
  const offer = offerResult.ok ? offerResult.data[0] : null;
  if (!offer || !PAID_INTERACTION_FAMILIES.has(offer.offer_family ?? "")) {
    return NextResponse.json({ error: "paid_interaction_offer_not_available" }, { status: 409 });
  }

  const body = message || `Te dejé una opción pagada: ${offer.title}`;
  const created = await serviceRest<MessageRow[]>("creator_messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      thread_id: thread.id,
      sender_kind: "creator",
      sender_user_id: session.user.id,
      type: "offer",
      body,
      offer_id: offer.id,
      purchase_id: null,
      locked: false,
      media_ref: { mechanism: "PAID_INTERACTION", offer_family: offer.offer_family },
    }),
  });
  if (!created.ok || !created.data[0]) return NextResponse.json({ error: "paid_interaction_send_failed" }, { status: 502 });

  const now = new Date().toISOString();
  await serviceRest<unknown>(`creator_threads?id=eq.${encodeURIComponent(thread.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ last_message_at: now, updated_at: now }),
  });
  await touchCreatorCustomerRelationship(creator.id, thread.user_id, "creator");
  await emitProductEvent(request, "creator_paid_interaction_sent", {
    surface: "/creator/monetization",
    target: offer.slug,
    offer_type: offer.offer_family,
    currency: offer.currency,
  });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
