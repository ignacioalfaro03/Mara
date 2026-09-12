import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { getServerBackendConfig } from "@/lib/backend-config";
import { beginMercadoPagoSandboxOAuth } from "@/lib/commerce/mercado-pago-sandbox-oauth-runtime";
import { getMercadoPagoSandboxExecutionRuntime } from "@/lib/commerce/mercado-pago-sandbox-runtime";
import { readOwnCreator } from "@/lib/mara-real-data";

export const runtime = "nodejs";

export async function POST() {
  const sandbox = getMercadoPagoSandboxExecutionRuntime();
  if (!sandbox.configured) {
    return NextResponse.json({ error: sandbox.reason }, { status: 404 });
  }

  const backend = getServerBackendConfig();
  if (!backend) {
    return NextResponse.json({ error: "supabase_server_not_configured" }, { status: 503 });
  }

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator?.id) {
    return NextResponse.json({ error: "creator_required" }, { status: 403 });
  }

  try {
    const oauth = await beginMercadoPagoSandboxOAuth({ creatorId: creator.id, backend, runtime: sandbox });
    const response = NextResponse.json({
      authorizationUrl: oauth.authorizationUrl,
      expiresAt: oauth.expiresAt,
    });
    if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
    return response;
  } catch {
    return NextResponse.json({ error: "mercado_pago_sandbox_oauth_begin_failed" }, { status: 503 });
  }
}
