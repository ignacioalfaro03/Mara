import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";

const ACCESS_COOKIE = "mara_access_token";
const REFRESH_COOKIE = "mara_refresh_token";

export type MaraAuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: { id?: string; email?: string };
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function setSessionCookies(response: NextResponse, session: MaraAuthSession) {
  response.cookies.set(ACCESS_COOKIE, session.access_token, cookieOptions(Math.max(60, session.expires_in ?? 3600)));
  if (session.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, session.refresh_token, cookieOptions(60 * 60 * 24 * 30));
  }
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", cookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, "", cookieOptions(0));
}

async function fetchUser(accessToken: string) {
  const config = getBackendConfig();
  if (!config) return { ok: false as const, reason: "backend_not_configured" as const };

  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return { ok: false as const, reason: "invalid_session" as const };
  const user = (await response.json()) as { id?: string; email?: string };
  return { ok: true as const, user };
}

async function refreshAccessToken(refreshToken: string) {
  const config = getBackendConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  return (await response.json()) as MaraAuthSession;
}

export async function getVerifiedSession() {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (accessToken) {
    const verified = await fetchUser(accessToken);
    if (verified.ok) {
      return { ok: true as const, accessToken, user: verified.user, refreshedSession: null };
    }
  }

  if (refreshToken) {
    const refreshedSession = await refreshAccessToken(refreshToken);
    if (refreshedSession?.access_token) {
      const verified = await fetchUser(refreshedSession.access_token);
      if (verified.ok) {
        return {
          ok: true as const,
          accessToken: refreshedSession.access_token,
          user: verified.user,
          refreshedSession,
        };
      }
    }
  }

  return { ok: false as const };
}
