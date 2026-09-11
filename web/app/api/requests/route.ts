import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { touchCreatorCustomerRelationship } from "@/lib/creator-relationship";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { creatorRequestPolicy } from "@/lib/request-policy";
import { readWorld } from "@/lib/mara-real-data";
import { serviceRest, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]{1,80}$/;
const CATEGORIES = new Set(["audio", "photo", "video", "digital_experience", "message", "bundle", "other"]);

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

export async function GET() {
  if (!productCapability("requests")) return NextResponse.json({ enabled: false, requests: [] });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const result = await userRest<RequestRow[]>(
    session.accessToken,
    `creator_requests?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=100`,
  );
  const response = result.ok
    ? NextResponse.json({ enabled: true, requests: result.data })
    : NextResponse.json({ error: "request_read_failed" }, { status: 502 });
  return withSession(response, session.refreshedSession);
}

export async function POST(request: Request) {
  if (!productCapability("requests")) return NextResponse.json({ error: "request_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: { action?: unknown; requestId?: unknown; worldSlug?: unknown; category?: unknown; description?: unknown; budgetMajor?: unknown };
  try { body = (await request.json()) as typeof body; }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  if (body.action === "accept_counter") {
    const requestId = typeof body.requestId === "string" && UUID_LIKE.test(body.requestId) ? body.requestId : null;
    if (!requestId) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    const existing = await userRest<RequestRow[]>(
      session.accessToken,
      `creator_requests?select=*&id=eq.${encodeURIComponent(requestId)}&user_id=eq.${encodeURIComponent(session.user.id)}&status=eq.countered&limit=1`,
    );
    const row = existing.ok ? existing.data[0] : null;
    if (!row || !row.offer_id || !row.counter_amount_minor) return NextResponse.json({ error: "counter_not_available" }, { status: 409 });
    const updated = await serviceRest<RequestRow[]>(`creator_requests?id=eq.${encodeURIComponent(row.id)}&user_id=eq.${encodeURIComponent(session.user.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "payment_pending", updated_at: new Date().toISOString() }),
    });
    if (!updated.ok || !updated.data[0]) return NextResponse.json({ error: "request_update_failed" }, { status: 502 });
    return withSession(NextResponse.json({ request: updated.data[0] }), session.refreshedSession);
  }

  const worldSlug = typeof body.worldSlug === "string" && SAFE_SLUG.test(body.worldSlug) ? body.worldSlug : null;
  const category = typeof body.category === "string" && CATEGORIES.has(body.category) ? body.category : "other";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const budgetMajor = typeof body.budgetMajor === "number" ? body.budgetMajor : Number(body.budgetMajor ?? 0);
  if (!worldSlug || description.length < 3 || description.length > 4000) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const policy = creatorRequestPolicy(description);
  if (!policy.allowed) return NextResponse.json({ error: policy.reason }, { status: 422 });
  const budgetMinor = Number.isFinite(budgetMajor) && budgetMajor > 0 && budgetMajor <= 10_000_000 ? Math.round(budgetMajor * 100) : null;

  const world = await readWorld(worldSlug, session.accessToken);
  if (!world || world.status !== "active" || world.visibility !== "public") return NextResponse.json({ error: "world_unavailable" }, { status: 404 });

  const created = await serviceRest<RequestRow[]>("creator_requests", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: world.creator_id,
      world_id: world.id,
      user_id: session.user.id,
      status: "requested",
      category,
      description,
      budget_minor: budgetMinor,
      currency: "CLP",
    }),
  });
  if (!created.ok || !created.data[0]) return NextResponse.json({ error: "request_create_failed" }, { status: 502 });

  await touchCreatorCustomerRelationship(world.creator_id, session.user.id, "mara");
  await emitProductEvent(request, "request_submitted", { surface: `/app/people/${world.slug}/request`, target: category, currency: "CLP" });
  return withSession(NextResponse.json({ request: created.data[0] }, { status: 201 }), session.refreshedSession);
}
