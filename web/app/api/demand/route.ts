import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import type { DemandRow, DemandSignalRow, WorldRow } from "@/lib/mara-real-data";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const FULFILLMENT = new Set(["digital_product", "digital_experience", "membership", "collab", "merch", "physical_experience", "hybrid"]);
const PRIVACY = new Set(["public", "pseudonymous", "private"]);

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const form = await request.formData();
  const worldId = String(form.get("worldId") ?? "");
  const creatorId = String(form.get("creatorId") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const category = String(form.get("category") ?? "Digital product").trim();
  const fulfillmentType = String(form.get("fulfillmentType") ?? "digital_product");
  const privacyMode = String(form.get("privacyMode") ?? "pseudonymous");
  const targetCommitments = Math.max(1, Math.min(100000, Number(form.get("targetCommitments") ?? 10) || 10));
  const wtpMajor = Number(form.get("wtp") ?? 0);
  const currency = String(form.get("currency") ?? "CLP").toUpperCase();
  const returnTo = safeLocalReturn(form.get("returnTo"), "/experience");

  if (title.length < 3 || title.length > 160 || description.length > 1600 || category.length < 2 || category.length > 80 || !FULFILLMENT.has(fulfillmentType) || !PRIVACY.has(privacyMode)) {
    return NextResponse.json({ error: "invalid_demand" }, { status: 400 });
  }

  const worldResult = await userRest<WorldRow[]>(session.accessToken, `creator_worlds?select=*&id=eq.${encodeURIComponent(worldId)}&creator_id=eq.${encodeURIComponent(creatorId)}&status=eq.active&visibility=eq.public&limit=1`);
  const world = worldResult.ok ? worldResult.data[0] : null;
  if (!world) return NextResponse.json({ error: "world_unavailable" }, { status: 404 });

  const row: TablesInsert<"demand_requests"> = {
    creator_id: world.creator_id,
    world_id: world.id,
    created_by_user_id: session.user.id,
    origin: "community",
    title,
    description,
    category,
    fulfillment_type: fulfillmentType,
    privacy_mode: privacyMode,
    target_commitments: targetCommitments,
    status: "open",
  };
  const created = await userRest<DemandRow[]>(session.accessToken, "demand_requests", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!created.ok || !created.data[0]) return NextResponse.json({ error: "demand_create_failed" }, { status: 502 });

  const wtpMinor = Number.isFinite(wtpMajor) && wtpMajor > 0 ? Math.round(wtpMajor * 100) : null;
  const signal: TablesInsert<"demand_signals"> = {
    demand_request_id: created.data[0].id,
    user_id: session.user.id,
    signal_level: "want",
    privacy_mode: privacyMode,
    wtp_amount_minor: wtpMinor,
    currency: wtpMinor ? currency : null,
  };
  const signaled = await userRest<DemandSignalRow[]>(session.accessToken, "demand_signals", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(signal),
  });
  if (!signaled.ok) return NextResponse.json({ error: "demand_created_signal_failed", demandId: created.data[0].id }, { status: 502 });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
