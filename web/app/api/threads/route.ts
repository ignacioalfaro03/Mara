import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { touchCreatorCustomerRelationship } from "@/lib/creator-relationship";
import { readOwnCreator, readWorld } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import { serviceRest, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

type ThreadRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: "active" | "archived" | "blocked";
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

const SAFE_SLUG = /^[a-z0-9][a-z0-9-]{1,80}$/;

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | null | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

export async function GET(request: Request) {
  if (!productCapability("messaging")) return NextResponse.json({ enabled: false, threads: [] });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const scope = new URL(request.url).searchParams.get("scope") === "creator" ? "creator" : "consumer";
  let path: string;
  if (scope === "creator") {
    const creator = await readOwnCreator(session.accessToken, session.user.id);
    if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
    path = `creator_threads?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&order=last_message_at.desc.nullslast,created_at.desc&limit=100`;
  } else {
    path = `creator_threads?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=last_message_at.desc.nullslast,created_at.desc&limit=100`;
  }

  const result = await userRest<ThreadRow[]>(session.accessToken, path);
  const response = result.ok
    ? NextResponse.json({ enabled: true, scope, threads: result.data })
    : NextResponse.json({ error: "thread_read_failed" }, { status: 502 });
  return withSession(response, session.refreshedSession);
}

export async function POST(request: Request) {
  if (!productCapability("messaging")) return NextResponse.json({ error: "messaging_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: { worldSlug?: unknown };
  try { body = (await request.json()) as typeof body; }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const worldSlug = typeof body.worldSlug === "string" && SAFE_SLUG.test(body.worldSlug) ? body.worldSlug : null;
  if (!worldSlug) return NextResponse.json({ error: "invalid_world" }, { status: 400 });

  const world = await readWorld(worldSlug, session.accessToken);
  if (!world || world.status !== "active" || world.visibility !== "public") {
    return NextResponse.json({ error: "world_unavailable" }, { status: 404 });
  }

  const existing = await serviceRest<ThreadRow[]>(
    `creator_threads?select=*&creator_id=eq.${encodeURIComponent(world.creator_id)}&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,
  );
  if (!existing.ok) return NextResponse.json({ error: "thread_read_failed" }, { status: 502 });
  if (existing.data[0]) {
    if (existing.data[0].status === "blocked") return NextResponse.json({ error: "thread_blocked" }, { status: 403 });
    return withSession(NextResponse.json({ thread: existing.data[0], created: false }), session.refreshedSession);
  }

  const created = await serviceRest<ThreadRow[]>("creator_threads", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: world.creator_id,
      world_id: world.id,
      user_id: session.user.id,
      status: "active",
    }),
  });
  if (!created.ok || !created.data[0]) return NextResponse.json({ error: "thread_create_failed" }, { status: 502 });

  await touchCreatorCustomerRelationship(world.creator_id, session.user.id, "mara");
  return withSession(NextResponse.json({ thread: created.data[0], created: true }, { status: 201 }), session.refreshedSession);
}
