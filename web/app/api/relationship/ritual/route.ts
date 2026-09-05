import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

const RITUAL_KEY = "junk_food_date_v1";

type RitualRow = {
  last_ritual_key: string | null;
  last_ritual_completed_at: string | null;
};

function toPublicRitual(row?: RitualRow | null) {
  if (!row?.last_ritual_key || !row.last_ritual_completed_at) return null;
  return {
    ritualKey: row.last_ritual_key,
    completedAt: row.last_ritual_completed_at,
  };
}

export async function GET() {
  const config = getBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const dbResponse = await fetch(
    `${config.url}/rest/v1/relationship_state?select=last_ritual_key,last_ritual_completed_at&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,
    {
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!dbResponse.ok) {
    return NextResponse.json({ error: "ritual_read_failed" }, { status: 502 });
  }

  const rows = (await dbResponse.json()) as RitualRow[];
  const response = NextResponse.json({ ritual: toPublicRitual(rows[0]) });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}

export async function POST(request: Request) {
  const config = getBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  let body: { ritualKey?: unknown };
  try {
    body = (await request.json()) as { ritualKey?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.ritualKey !== RITUAL_KEY) {
    return NextResponse.json({ error: "invalid_ritual_key" }, { status: 400 });
  }

  const dbResponse = await fetch(`${config.url}/rest/v1/rpc/complete_mara_ritual`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_ritual_key: RITUAL_KEY }),
    cache: "no-store",
  });

  if (!dbResponse.ok) {
    return NextResponse.json({ error: "ritual_persist_failed" }, { status: 502 });
  }

  const rows = (await dbResponse.json()) as RitualRow[];
  const response = NextResponse.json({ ritual: toPublicRitual(rows[0]) });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
