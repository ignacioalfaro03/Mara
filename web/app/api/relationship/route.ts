import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

type RelationshipBody = {
  returnCount?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
  lastVisualChoice?: "pose_a" | "pose_b" | null;
  launchCompleted?: boolean;
};

type RelationshipRow = {
  return_count: number;
  first_seen_at: string | null;
  last_seen_at: string | null;
  last_visual_choice: "pose_a" | "pose_b" | null;
  launch_completed: boolean;
};

function validIso(value?: string) {
  if (!value) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
}

export async function GET() {
  const config = getBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const dbResponse = await fetch(
    `${config.url}/rest/v1/relationship_state?select=return_count,first_seen_at,last_seen_at,last_visual_choice,launch_completed&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,
    {
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!dbResponse.ok) {
    return NextResponse.json({ error: "relationship_read_failed" }, { status: 502 });
  }

  const rows = (await dbResponse.json()) as RelationshipRow[];
  const row = rows[0];
  const response = NextResponse.json({
    state: row
      ? {
          returnCount: row.return_count,
          firstSeenAt: row.first_seen_at,
          lastSeenAt: row.last_seen_at,
          lastVisualChoice: row.last_visual_choice,
          launchCompleted: row.launch_completed,
        }
      : null,
  });

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
    !validIso(body.firstSeenAt) ||
    !validIso(body.lastSeenAt) ||
    typeof body.launchCompleted !== "boolean" ||
    (body.lastVisualChoice !== undefined &&
      body.lastVisualChoice !== null &&
      body.lastVisualChoice !== "pose_a" &&
      body.lastVisualChoice !== "pose_b")
  ) {
    return NextResponse.json({ error: "invalid_relationship_state" }, { status: 400 });
  }

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
      return_count: body.returnCount,
      first_seen_at: body.firstSeenAt,
      last_seen_at: body.lastSeenAt,
      last_visual_choice: body.lastVisualChoice ?? null,
      launch_completed: body.launchCompleted,
      updated_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!dbResponse.ok) return NextResponse.json({ error: "relationship_persist_failed" }, { status: 502 });

  const response = new NextResponse(null, { status: 204 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
