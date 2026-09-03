import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

type PreferenceBody = {
  clientEventId?: string;
  eventType?: string;
  choiceGroup?: string;
  selectedOption?: string;
  alternativeOption?: string;
  surface?: string;
  contextVersion?: string;
};

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isAllowed(body: PreferenceBody) {
  return (
    Boolean(body.clientEventId && UUID_LIKE.test(body.clientEventId)) &&
    body.eventType === "visual_choice" &&
    body.choiceGroup === "pose_pair_launch_v1" &&
    (body.selectedOption === "pose_a" || body.selectedOption === "pose_b") &&
    (body.alternativeOption === "pose_a" || body.alternativeOption === "pose_b") &&
    body.selectedOption !== body.alternativeOption &&
    body.surface === "launch_experience" &&
    body.contextVersion === "v1"
  );
}

export async function POST(request: Request) {
  const config = getBackendConfig();
  if (!config) {
    return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });
  }

  let body: PreferenceBody;
  try {
    body = (await request.json()) as PreferenceBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isAllowed(body)) {
    return NextResponse.json({ error: "invalid_preference_event" }, { status: 400 });
  }

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const dbResponse = await fetch(`${config.url}/rest/v1/preference_events`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      user_id: session.user.id,
      client_event_id: body.clientEventId,
      event_type: body.eventType,
      choice_group: body.choiceGroup,
      selected_option: body.selectedOption,
      alternative_option: body.alternativeOption,
      surface: body.surface,
      context_version: body.contextVersion,
    }),
    cache: "no-store",
  });

  if (!dbResponse.ok && dbResponse.status !== 409) {
    return NextResponse.json({ error: "preference_persist_failed" }, { status: 502 });
  }

  const relationshipResponse = await fetch(
    `${config.url}/rest/v1/relationship_state?user_id=eq.${encodeURIComponent(session.user.id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        last_visual_choice: body.selectedOption,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    },
  );

  if (!relationshipResponse.ok) {
    return NextResponse.json({ error: "relationship_projection_failed" }, { status: 502 });
  }

  const response = new NextResponse(null, { status: 204 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
