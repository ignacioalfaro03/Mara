import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { touchCreatorCustomerRelationship } from "@/lib/creator-relationship";
import { readOwnCreator, type OfferRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { serviceRest, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  content_id: string | null;
  offer_id: string | null;
  purchase_id: string | null;
  locked: boolean;
  media_ref: Record<string, unknown>;
  created_at: string;
  read_at: string | null;
};

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | null | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

async function readParticipantThread(accessToken: string, threadId: string) {
  const result = await userRest<ThreadRow[]>(
    accessToken,
    `creator_threads?select=*&id=eq.${encodeURIComponent(threadId)}&limit=1`,
  );
  return result.ok ? result.data[0] ?? null : null;
}

async function rateAllowed(userId: string) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const result = await serviceRest<Array<{ id: string }>>(
    `creator_messages?select=id&sender_user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${encodeURIComponent(since)}&limit=13`,
  );
  return result.ok && result.data.length < 12;
}

export async function GET(request: Request) {
  if (!productCapability("messaging")) return NextResponse.json({ enabled: false, messages: [], offers: [] });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const threadId = new URL(request.url).searchParams.get("threadId");
  if (!threadId || !UUID_LIKE.test(threadId)) return NextResponse.json({ error: "invalid_thread" }, { status: 400 });
  const thread = await readParticipantThread(session.accessToken, threadId);
  if (!thread) return NextResponse.json({ error: "thread_not_found" }, { status: 404 });

  const result = await userRest<MessageRow[]>(
    session.accessToken,
    `creator_messages?select=*&thread_id=eq.${encodeURIComponent(threadId)}&order=created_at.asc&limit=200`,
  );
  if (!result.ok) return withSession(NextResponse.json({ error: "message_read_failed" }, { status: 502 }), session.refreshedSession);

  const offerIds = [...new Set(result.data.map((message) => message.offer_id).filter((id): id is string => Boolean(id)))];
  let offers: OfferRow[] = [];
  if (offerIds.length) {
    const offerResult = await userRest<OfferRow[]>(
      session.accessToken,
      `commerce_offers?select=*&id=in.(${offerIds.map(encodeURIComponent).join(",")})`,
    );
    if (offerResult.ok) offers = offerResult.data;
  }

  return withSession(NextResponse.json({ enabled: true, thread, messages: result.data, offers }), session.refreshedSession);
}

export async function POST(request: Request) {
  if (!productCapability("messaging")) return NextResponse.json({ error: "messaging_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: { threadId?: unknown; text?: unknown; offerId?: unknown };
  try { body = (await request.json()) as typeof body; }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const threadId = typeof body.threadId === "string" && UUID_LIKE.test(body.threadId) ? body.threadId : null;
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const offerId = typeof body.offerId === "string" && UUID_LIKE.test(body.offerId) ? body.offerId : null;
  if (!threadId || (!text && !offerId) || text.length > 8000) return NextResponse.json({ error: "invalid_message" }, { status: 400 });

  const thread = await readParticipantThread(session.accessToken, threadId);
  if (!thread) return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
  if (thread.status !== "active") return NextResponse.json({ error: "thread_not_active" }, { status: 409 });
  if (!(await rateAllowed(session.user.id))) return NextResponse.json({ error: "message_rate_limited" }, { status: 429 });

  const ownCreator = await readOwnCreator(session.accessToken, session.user.id);
  const senderKind = thread.user_id === session.user.id
    ? "consumer"
    : ownCreator?.id === thread.creator_id
      ? "creator"
      : null;
  if (!senderKind) return NextResponse.json({ error: "thread_not_authorized" }, { status: 403 });

  let offer: OfferRow | null = null;
  if (offerId) {
    if (senderKind !== "creator") return NextResponse.json({ error: "only_creator_can_send_offer" }, { status: 403 });
    const offerResult = await userRest<OfferRow[]>(
      session.accessToken,
      `commerce_offers?select=*&id=eq.${encodeURIComponent(offerId)}&creator_id=eq.${encodeURIComponent(thread.creator_id)}&world_id=eq.${encodeURIComponent(thread.world_id)}&status=eq.active&limit=1`,
    );
    offer = offerResult.ok ? offerResult.data[0] ?? null : null;
    if (!offer) return NextResponse.json({ error: "offer_not_available" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const created = await serviceRest<MessageRow[]>("creator_messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      thread_id: thread.id,
      sender_kind: senderKind,
      sender_user_id: session.user.id,
      type: offer ? "offer" : "text",
      body: text,
      offer_id: offer?.id ?? null,
      locked: false,
      media_ref: {},
    }),
  });
  if (!created.ok || !created.data[0]) return NextResponse.json({ error: "message_create_failed" }, { status: 502 });

  const touched = await serviceRest<unknown>(`creator_threads?id=eq.${encodeURIComponent(thread.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ last_message_at: now, updated_at: now }),
  });
  if (!touched.ok) return NextResponse.json({ error: "thread_touch_failed" }, { status: 502 });
  await touchCreatorCustomerRelationship(thread.creator_id, thread.user_id, senderKind === "consumer" ? "mara" : "creator");
  await emitProductEvent(request, "message_sent", { surface: "/app/messages", target: senderKind });

  return withSession(NextResponse.json({ message: created.data[0] }, { status: 201 }), session.refreshedSession);
}
