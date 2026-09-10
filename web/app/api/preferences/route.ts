import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { emitProductEvent } from "@/lib/product-telemetry";
import { safeLocalReturn } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

type PreferenceBody = {
  clientEventId?: string;
  eventType?: string;
  choiceGroup?: string;
  selectedOption?: string;
  alternativeOption?: string;
  surface?: string;
  contextVersion?: string;
  signalScope?: string;
  creatorId?: string;
  worldId?: string;
  returnTo?: string;
};

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_TOKEN = /^[a-z0-9][a-z0-9_:-]{1,119}$/;
const SAFE_EVENT = /^[a-z0-9][a-z0-9_]{1,63}$/;
const SAFE_CONTEXT = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,39}$/;
const SAFE_SURFACE = /^\/|\/[A-Za-z0-9][A-Za-z0-9_:/.-]{0,118}$|^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,119}$/;

const ALLOWED_GROUPS: Record<string, readonly string[]> = {
  pose_pair_launch_v1: ["pose_a", "pose_b"],
  world_format_v1: ["image", "audio"],
  world_personalization_v1: ["personalized", "premade"],
  world_length_v1: ["short", "longer"],
  world_tone_v1: ["playful", "direct"],
  world_time_v1: ["day", "night"],
};

async function readBody(request: Request): Promise<PreferenceBody> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return (await request.json()) as PreferenceBody;
  const form = await request.formData();
  const value = (key: string) => {
    const raw = form.get(key);
    return typeof raw === "string" ? raw : undefined;
  };
  return {
    clientEventId: value("clientEventId") || crypto.randomUUID(),
    eventType: value("eventType") || "taste_choice",
    choiceGroup: value("choiceGroup"),
    selectedOption: value("selectedOption"),
    alternativeOption: value("alternativeOption"),
    surface: value("surface"),
    contextVersion: value("contextVersion") || "v1",
    signalScope: value("signalScope") || "network",
    creatorId: value("creatorId"),
    worldId: value("worldId"),
    returnTo: value("returnTo"),
  };
}

function isAllowed(body: PreferenceBody) {
  const options = body.choiceGroup ? ALLOWED_GROUPS[body.choiceGroup] : undefined;
  const worldScope = body.signalScope === "creator_world";
  return Boolean(
    body.clientEventId && UUID_LIKE.test(body.clientEventId) &&
    body.eventType && SAFE_EVENT.test(body.eventType) &&
    body.choiceGroup && SAFE_TOKEN.test(body.choiceGroup) && options &&
    body.selectedOption && options.includes(body.selectedOption) &&
    body.alternativeOption && options.includes(body.alternativeOption) &&
    body.selectedOption !== body.alternativeOption &&
    body.surface && SAFE_SURFACE.test(body.surface) &&
    body.contextVersion && SAFE_CONTEXT.test(body.contextVersion) &&
    (body.signalScope === "network" || worldScope) &&
    (!worldScope || (body.creatorId && body.worldId && UUID_LIKE.test(body.creatorId) && UUID_LIKE.test(body.worldId)))
  );
}

export async function POST(request: Request) {
  const config = getBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  let body: PreferenceBody;
  try { body = await readBody(request); }
  catch { return NextResponse.json({ error: "invalid_preference_payload" }, { status: 400 }); }

  if (!isAllowed(body)) return NextResponse.json({ error: "invalid_preference_event" }, { status: 400 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const row: TablesInsert<"preference_events"> = {
    user_id: session.user.id,
    client_event_id: body.clientEventId!,
    event_type: body.eventType!,
    choice_group: body.choiceGroup!,
    selected_option: body.selectedOption!,
    alternative_option: body.alternativeOption!,
    surface: body.surface!,
    context_version: body.contextVersion!,
    signal_scope: body.signalScope === "creator_world" ? "creator_world" : "network",
    creator_id: body.signalScope === "creator_world" ? body.creatorId! : null,
    world_id: body.signalScope === "creator_world" ? body.worldId! : null,
  };

  const dbResponse = await fetch(`${config.url}/rest/v1/preference_events`, {
    method: "POST",
    headers: { apikey: config.publishableKey, Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!dbResponse.ok && dbResponse.status !== 409) return NextResponse.json({ error: "preference_persist_failed" }, { status: 502 });

  if (body.choiceGroup === "pose_pair_launch_v1") {
    await fetch(`${config.url}/rest/v1/relationship_state?user_id=eq.${encodeURIComponent(session.user.id)}`, {
      method: "PATCH",
      headers: { apikey: config.publishableKey, Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ last_visual_choice: body.selectedOption, updated_at: new Date().toISOString() }),
      cache: "no-store",
    });
  }

  if (dbResponse.ok) {
    await emitProductEvent(request, "taste_signal_created", {
      surface: body.surface!,
      target: body.signalScope === "creator_world" ? "creator_world" : "network",
      preference_group: body.choiceGroup!,
    });
  }

  const response = body.returnTo
    ? NextResponse.redirect(new URL(safeLocalReturn(body.returnTo, "/experience"), request.url), 303)
    : new NextResponse(null, { status: 204 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
