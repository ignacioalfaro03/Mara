import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { setSessionCookies, type MaraAuthSession } from "@/lib/auth-session";

export const runtime = "nodejs";

type SigninBody = { email?: string; password?: string };

export async function POST(request: Request) {
  const config = getBackendConfig();
  if (!config) {
    return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });
  }

  let body: SigninBody;
  try {
    body = (await request.json()) as SigninBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "credentials_required" }, { status: 400 });
  }

  const authResponse = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = (await authResponse.json().catch(() => ({}))) as MaraAuthSession;
  if (!authResponse.ok || !payload.access_token) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookies(response, payload);
  return response;
}
