import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { clearSessionCookies, getVerifiedSession, setSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function GET() {
  if (!getBackendConfig()) {
    return NextResponse.json({ authenticated: false, backendConfigured: false }, { status: 503 });
  }

  const session = await getVerifiedSession();
  if (!session.ok) {
    const response = NextResponse.json({ authenticated: false, backendConfigured: true }, { status: 401 });
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.json({
    authenticated: true,
    backendConfigured: true,
    user: {
      id: session.user.id ?? null,
      email: session.user.email ?? null,
    },
  });

  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
