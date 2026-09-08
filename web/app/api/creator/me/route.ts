import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type CreatorRow } from "@/lib/mara-real-data";
import { safeLocalReturn, serviceRest } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

function creatorAlphaEnabled(email?: string) {
  if (process.env.MARA_ALPHA_CREATOR_ONBOARDING_ENABLED !== "true") return false;
  const allowlist = (process.env.MARA_ALPHA_CREATOR_EMAIL_ALLOWLIST ?? "")
    .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return allowlist.length === 0 || Boolean(email && allowlist.includes(email.toLowerCase()));
}

export async function GET() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  const response = NextResponse.json({ creator, canActivate: creatorAlphaEnabled(session.user.email) });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  if (!creatorAlphaEnabled(session.user.email)) return NextResponse.json({ error: "creator_alpha_not_enabled" }, { status: 403 });

  const existing = await readOwnCreator(session.accessToken, session.user.id);
  if (!existing) {
    const row: TablesInsert<"creators"> = { user_id: session.user.id, status: "pilot", plan: "free", onboarding_state: "setup" };
    const created = await serviceRest<CreatorRow[]>("creators", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    if (!created.ok) return NextResponse.json({ error: "creator_activation_failed" }, { status: 502 });
  }

  let returnTo = "/creator";
  try {
    const form = await request.formData();
    returnTo = safeLocalReturn(form.get("returnTo"), "/creator");
  } catch { /* JSON callers can use the default */ }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
