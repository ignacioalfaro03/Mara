import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { setSessionCookies, type MaraAuthSession } from "@/lib/auth-session";

export const runtime = "nodejs";

type SignupBody = {
  email?: string;
  password?: string;
  adultConfirmed?: boolean;
};

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const config = getBackendConfig();
  if (!config) {
    return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });
  }

  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!body.adultConfirmed) {
    return NextResponse.json({ error: "adult_confirmation_required" }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "invalid_password" }, { status: 400 });
  }

  const authResponse = await fetch(`${config.url}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = (await authResponse.json().catch(() => ({}))) as MaraAuthSession & {
    msg?: string;
    message?: string;
    error_description?: string;
    code?: string;
  };

  if (!authResponse.ok) {
    return NextResponse.json(
      { error: "signup_failed", code: payload.code ?? null },
      { status: authResponse.status >= 500 ? 502 : 400 },
    );
  }

  if (!payload.access_token) {
    return NextResponse.json({ ok: true, needsConfirmation: true });
  }

  const response = NextResponse.json({ ok: true, needsConfirmation: false });
  setSessionCookies(response, payload);
  return response;
}
