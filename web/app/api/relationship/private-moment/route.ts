import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

const OFFER_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

type PrivateStyle = "direct" | "slow";
type CommercialDecision = "closed" | "offer_now";

type PrivateMomentRow = {
  preferred_private_style: PrivateStyle | null;
  private_session_count: number | null;
  last_private_session_at: string | null;
  last_private_offer_at: string | null;
};

function readiness(row?: PrivateMomentRow | null): { decision: CommercialDecision; reason: string } {
  const sessionCount = Math.max(0, row?.private_session_count ?? 0);
  if (sessionCount < 2) return { decision: "closed", reason: "free_value_first" };

  const lastOfferAt = row?.last_private_offer_at ? Date.parse(row.last_private_offer_at) : Number.NaN;
  if (Number.isFinite(lastOfferAt) && Date.now() - lastOfferAt < OFFER_COOLDOWN_MS) {
    return { decision: "closed", reason: "offer_fatigue" };
  }

  return { decision: "offer_now", reason: "repeat_session_context" };
}

function toPublic(row?: PrivateMomentRow | null) {
  const commercial = readiness(row);
  return {
    preferredStyle: row?.preferred_private_style ?? null,
    sessionCount: Math.max(0, row?.private_session_count ?? 0),
    lastSessionAt: row?.last_private_session_at ?? null,
    lastOfferAt: row?.last_private_offer_at ?? null,
    commercial,
  };
}

async function verifiedContext() {
  const config = getBackendConfig();
  if (!config) return { ok: false as const, response: NextResponse.json({ error: "backend_not_configured" }, { status: 503 }) };

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return { ok: false as const, response: NextResponse.json({ error: "authentication_required" }, { status: 401 }) };
  }

  const userId = session.user.id;
  return { ok: true as const, config, session, userId };
}

export async function GET() {
  const context = await verifiedContext();
  if (!context.ok) return context.response;

  const dbResponse = await fetch(
    `${context.config.url}/rest/v1/relationship_state?select=preferred_private_style,private_session_count,last_private_session_at,last_private_offer_at&user_id=eq.${encodeURIComponent(context.userId)}&limit=1`,
    {
      headers: {
        apikey: context.config.publishableKey,
        Authorization: `Bearer ${context.session.accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!dbResponse.ok) return NextResponse.json({ error: "private_moment_read_failed" }, { status: 502 });

  const rows = (await dbResponse.json()) as PrivateMomentRow[];
  const response = NextResponse.json({ privateMoment: toPublic(rows[0]) });
  if (context.session.refreshedSession) setSessionCookies(response, context.session.refreshedSession);
  return response;
}

export async function POST(request: Request) {
  const context = await verifiedContext();
  if (!context.ok) return context.response;

  let body: { action?: unknown; style?: unknown };
  try {
    body = (await request.json()) as { action?: unknown; style?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  let rpc: string;
  let rpcBody: Record<string, string> = {};

  if (body.action === "complete") {
    if (body.style !== "direct" && body.style !== "slow") {
      return NextResponse.json({ error: "invalid_private_style" }, { status: 400 });
    }
    rpc = "record_private_moment";
    rpcBody = { p_style: body.style };
  } else if (body.action === "offer_shown") {
    rpc = "mark_private_offer_shown";
  } else {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const dbResponse = await fetch(`${context.config.url}/rest/v1/rpc/${rpc}`, {
    method: "POST",
    headers: {
      apikey: context.config.publishableKey,
      Authorization: `Bearer ${context.session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rpcBody),
    cache: "no-store",
  });

  if (!dbResponse.ok) return NextResponse.json({ error: "private_moment_write_failed" }, { status: 502 });

  const rows = (await dbResponse.json()) as PrivateMomentRow[];
  const response = NextResponse.json({ privateMoment: toPublic(rows[0]) });
  if (context.session.refreshedSession) setSessionCookies(response, context.session.refreshedSession);
  return response;
}
