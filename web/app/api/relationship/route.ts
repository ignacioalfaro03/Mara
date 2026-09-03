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

function earliestIso(existing: string | null, incoming: string) {
  const existingTime = parsedIso(existing);
  const incomingTime = parsedIso(incoming);
  if (existingTime === null) return incoming;
  if (incomingTime === null) return existing;
  return existingTime <= incomingTime ? existing : incoming;
}

function latestIso(existing: string | null, incoming: string) {
  const existingTime = parsedIso(existing);
  const incomingTime = parsedIso(incoming);
  if (existingTime === null) return incoming;
  if (incomingTime === null) return existing;
  return existingTime >= incomingTime ? existing : incoming;
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

  const incomingFirstSeenAt = body.firstSeenAt as string;
  const incomingLastSeenAt = body.lastSeenAt as string;
  const current = await readRelationshipRow(config, session.accessToken, session.user.id);
  if (!current.ok) {
    return NextResponse.json({ error: "relationship_read_failed" }, { status: 502 });
  }

  // Relationship snapshots are monotonic. An old browser/localStorage snapshot must never
  // lower the server return counter, move timestamps backwards, clear completion, or replace
  // a preference already projected by the dedicated preference-event path.
  const merged = current.row
    ? {
        returnCount: Math.max(current.row.return_count, body.returnCount ?? 0),
        firstSeenAt: earliestIso(current.row.first_seen_at, incomingFirstSeenAt),
        lastSeenAt: latestIso(current.row.last_seen_at, incomingLastSeenAt),
        lastVisualChoice: current.row.last_visual_choice ?? body.lastVisualChoice ?? null,
        launchCompleted: current.row.launch_completed || Boolean(body.launchCompleted),
      }
    : {
        returnCount: body.returnCount ?? 0,
        firstSeenAt: incomingFirstSeenAt,
        lastSeenAt: incomingLastSeenAt,
        lastVisualChoice: body.lastVisualChoice ?? null,
        launchCompleted: Boolean(body.launchCompleted),
      };

  const dbResponse = await fetch(`${config.url}/rest/v1/relationship_state?on_conflict=user_id`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      user_id: session.user.id,
      return_count: merged.returnCount,
      first_seen_at: merged.firstSeenAt,
      last_seen_at: merged.lastSeenAt,
      last_visual_choice: merged.lastVisualChoice,
      launch_completed: merged.launchCompleted,
      updated_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!dbResponse.ok) return NextResponse.json({ error: "relationship_persist_failed" }, { status: 502 });

  const response = new NextResponse(null, { status: 204 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
