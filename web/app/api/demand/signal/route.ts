import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import type { DemandRow, DemandSignalRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const LEVELS = new Set(["want", "pledge", "commit"]);
const PRIVACY = new Set(["public", "pseudonymous", "private"]);

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const form = await request.formData();
  const demandId = String(form.get("demandId") ?? "");
  const level = String(form.get("level") ?? "want");
  const privacy = String(form.get("privacyMode") ?? "pseudonymous");
  const wtpMajor = Number(form.get("wtp") ?? 0);
  const currency = String(form.get("currency") ?? "CLP").toUpperCase();
  const returnTo = safeLocalReturn(form.get("returnTo"), "/experience");
  if (!LEVELS.has(level) || !PRIVACY.has(privacy)) return NextResponse.json({ error: "invalid_demand_signal" }, { status: 400 });

  const demandResult = await userRest<DemandRow[]>(session.accessToken, `demand_requests?select=*&id=eq.${encodeURIComponent(demandId)}&limit=1`);
  if (!demandResult.ok || !demandResult.data[0]) return NextResponse.json({ error: "demand_unavailable" }, { status: 404 });

  const previousResult = await userRest<DemandSignalRow[]>(session.accessToken, `demand_signals?select=*&demand_request_id=eq.${encodeURIComponent(demandId)}&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`);
  const previousLevel = previousResult.ok ? previousResult.data[0]?.signal_level : undefined;

  const wtpMinor = Number.isFinite(wtpMajor) && wtpMajor > 0 ? Math.round(wtpMajor * 100) : null;
  const row: TablesInsert<"demand_signals"> = {
    demand_request_id: demandId,
    user_id: session.user.id,
    signal_level: level,
    privacy_mode: privacy,
    wtp_amount_minor: wtpMinor,
    currency: wtpMinor ? currency : null,
  };
  const result = await userRest<DemandSignalRow[]>(session.accessToken, `demand_signals?on_conflict=demand_request_id,user_id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
  if (!result.ok) return NextResponse.json({ error: "demand_signal_failed" }, { status: 502 });

  if (previousLevel !== level) {
    await emitProductEvent(
      request,
      level === "commit" ? "commit_created" : level === "pledge" ? "pledge_created" : "want_created",
      { surface: returnTo, target: privacy, currency },
    );
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
