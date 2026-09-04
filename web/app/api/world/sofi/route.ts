import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { SOFI_CHARACTER, SOFI_FOUND_FOOTAGE } from "@/lib/world-canon";

export const runtime = "nodejs";

type KnowledgeRow = {
  fact_key: string;
  source_key: string;
  discovered_at: string;
};

function publicPayload(row?: KnowledgeRow | null) {
  return {
    character: SOFI_CHARACTER,
    event: SOFI_FOUND_FOOTAGE,
    knowledge: {
      discovered: Boolean(row),
      discoveredAt: row?.discovered_at ?? null,
    },
  };
}

export async function GET() {
  const config = getBackendConfig();
  if (!config) return NextResponse.json(publicPayload(null));

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json(publicPayload(null));

  const response = await fetch(
    `${config.url}/rest/v1/user_world_knowledge?select=fact_key,source_key,discovered_at&user_id=eq.${encodeURIComponent(session.user.id)}&fact_key=eq.${SOFI_FOUND_FOOTAGE.factKey}&limit=1`,
    {
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return NextResponse.json({ error: "world_knowledge_read_failed" }, { status: 502 });

  const rows = (await response.json()) as KnowledgeRow[];
  const next = NextResponse.json(publicPayload(rows[0]));
  if (session.refreshedSession) setSessionCookies(next, session.refreshedSession);
  return next;
}

export async function POST(request: Request) {
  let body: { action?: unknown };
  try {
    body = (await request.json()) as { action?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.action !== "discover_found_footage") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const config = getBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const response = await fetch(`${config.url}/rest/v1/rpc/record_sofi_found_footage`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });

  if (!response.ok) return NextResponse.json({ error: "world_knowledge_write_failed" }, { status: 502 });

  const rows = (await response.json()) as KnowledgeRow[];
  const next = NextResponse.json(publicPayload(rows[0]));
  if (session.refreshedSession) setSessionCookies(next, session.refreshedSession);
  return next;
}
