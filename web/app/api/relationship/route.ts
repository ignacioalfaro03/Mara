import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

type VisualChoice = "pose_a" | "pose_b";

type RelationshipBody = {
  returnCount?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
  lastVisualChoice?: VisualChoice | null;
  launchCompleted?: boolean;
};

type RelationshipRow = {
  return_count: number;
  first_seen_at: string | null;
  last_seen_at: string | null;
  last_visual_choice: VisualChoice | null;
  launch_completed: boolean;
};

function parsedIso(value?: string | null) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function validIncomingTimestamps(firstSeenAt?: string, lastSeenAt?: string) {
  const first = parsedIso(firstSeenAt);
  const last = parsedIso(lastSeenAt);
  if (first === null || last === null) return false;
  if (first > last) return false;
  return last <= Date.now() + MAX_CLOCK_SKEW_MS;
}

function toPublicState(row?: RelationshipRow) {
  if (!row) return null;
  return {
    returnCount: row.return_count,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    lastVisualChoice: row.last_visual_choice,
    launchCompleted: row.launch_completed,
  };
}

async function readRelationshipRow(config: NonNullable<ReturnType<typeof getBackendConfig>>, accessToken: string, userId: string) {
  const dbResponse = await fetch(
    `${config.url}/rest/v1/relationship_state?select=return_count,first_seen_at,last_seen_at,last_visual_choice,launch_completed&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!dbResponse.ok) return { ok: false as const, row: null };
  const rows = (await dbResponse.json()) as RelationshipRow[];
  return { ok: true as const, row: rows[0] ?? null };
}

export async function GET() {
  const config = getBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const current = await readRelationshipRow(config, session.accessToken, session.user.id);
  if (!current.ok) {
    return NextResponse.json({ error: "relationship_read_failed" }, { status: 502 });
  }

  const response = NextResponse.json({ state: toPublicState(current.row ?? undefined) });
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

  let body: RelationshipBody;
  try {
    body = (await request.json()) as RelationshipBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    !Number.isInteger(body.returnCount) ||
    (body.returnCount ?? 0) < 0 ||
    (body.returnCount ?? 0) > 100000 ||
    !validIncomingTimestamps(body.firstSeenAt, body.lastSeenAt) ||
    typeof body.launchCompleted !== "boolean" ||
    (body.lastVisualChoice !== undefined &&
      body.lastVisualChoice !== null &&
      body.lastVisualChoice !== "pose_a" &&
      body.lastVisualChoice !== "pose_b")
  ) {
    return NextResponse.json({ error: "invalid_relationship_state" }, { status: 400 });
  }

  const dbResponse = await fetch(`${config.url}/rest/v1/rpc/merge_mara_relationship_state`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      p_return_count: body.returnCount,
      p_first_seen_at: body.firstSeenAt,
      p_last_seen_at: body.lastSeenAt,
      p_last_visual_choice: body.lastVisualChoice ?? null,
      p_launch_completed: body.launchCompleted,
    }),
    cache: "no-store",
  });

  if (!dbResponse.ok) {
    return NextResponse.json({ error: "relationship_persist_failed" }, { status: 502 });
  }

  const response = new NextResponse(null, { status: 204 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
