import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability, type CreatorFollowRow, type CreatorFollowStatus } from "@/lib/product-realization";
import { userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_STATUS = new Set<CreatorFollowStatus>(["following", "muted", "blocked"]);

function creatorIdFrom(value: unknown) {
  return typeof value === "string" && UUID_LIKE.test(value) ? value : null;
}

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

export async function GET(request: Request) {
  if (!productCapability("follow")) return NextResponse.json({ enabled: false, status: "not_following" });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ enabled: true, authenticated: false, status: "not_following" });

  const creatorId = creatorIdFrom(new URL(request.url).searchParams.get("creatorId"));
  if (!creatorId) return NextResponse.json({ error: "invalid_creator" }, { status: 400 });

  const result = await userRest<CreatorFollowRow[]>(
    session.accessToken,
    `creator_follows?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,
  );
  if (!result.ok) return withSession(NextResponse.json({ error: "follow_read_failed" }, { status: 502 }), session.refreshedSession);

  return withSession(
    NextResponse.json({ enabled: true, authenticated: true, status: result.data[0]?.status ?? "not_following" }),
    session.refreshedSession,
  );
}

export async function POST(request: Request) {
  if (!productCapability("follow")) return NextResponse.json({ error: "follow_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: { creatorId?: unknown; status?: unknown };
  try { body = (await request.json()) as typeof body; }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const creatorId = creatorIdFrom(body.creatorId);
  const status = typeof body.status === "string" && VALID_STATUS.has(body.status as CreatorFollowStatus)
    ? (body.status as CreatorFollowStatus)
    : "following";
  if (!creatorId) return NextResponse.json({ error: "invalid_creator" }, { status: 400 });

  const result = await userRest<CreatorFollowRow[]>(
    session.accessToken,
    "creator_follows?on_conflict=creator_id,user_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ creator_id: creatorId, user_id: session.user.id, status }),
    },
  );
  if (!result.ok || !result.data[0]) return withSession(NextResponse.json({ error: "follow_write_failed" }, { status: 502 }), session.refreshedSession);

  if (status === "following") {
    await emitProductEvent(request, "creator_followed", { surface: "/app/people", target: creatorId });
  }

  return withSession(NextResponse.json({ ok: true, status: result.data[0].status }), session.refreshedSession);
}

export async function DELETE(request: Request) {
  if (!productCapability("follow")) return NextResponse.json({ error: "follow_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const creatorId = creatorIdFrom(new URL(request.url).searchParams.get("creatorId"));
  if (!creatorId) return NextResponse.json({ error: "invalid_creator" }, { status: 400 });

  const result = await userRest<unknown>(
    session.accessToken,
    `creator_follows?creator_id=eq.${encodeURIComponent(creatorId)}&user_id=eq.${encodeURIComponent(session.user.id)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
  );
  if (!result.ok) return withSession(NextResponse.json({ error: "follow_delete_failed" }, { status: 502 }), session.refreshedSession);

  await emitProductEvent(request, "creator_unfollowed", { surface: "/app/people", target: creatorId });
  return withSession(NextResponse.json({ ok: true, status: "not_following" }), session.refreshedSession);
}
