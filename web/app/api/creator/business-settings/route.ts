import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator } from "@/lib/mara-real-data";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const CURRENCIES = new Set(["CLP", "USD", "EUR"]);

function businessControlEnabled() {
  return process.env.MARA_CREATOR_BUSINESS_CONTROL_ENABLED === "true";
}

function majorToMinor(value: FormDataEntryValue | null) {
  const major = Number(value ?? 0);
  if (!Number.isFinite(major) || major < 0) return null;
  return Math.round(major * 100);
}

export async function POST(request: Request) {
  if (!businessControlEnabled()) return NextResponse.json({ error: "business_control_not_enabled" }, { status: 404 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const currency = String(form.get("currency") ?? "CLP").toUpperCase();
  const monthlyRevenueGoalMinor = majorToMinor(form.get("monthlyRevenueGoal"));
  const monthlyFixedCostsMinor = majorToMinor(form.get("monthlyFixedCosts"));
  const variableCostPercent = Number(form.get("variableCostPercent") ?? 0);
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator/business");

  if (
    !CURRENCIES.has(currency) ||
    monthlyRevenueGoalMinor === null ||
    monthlyFixedCostsMinor === null ||
    !Number.isFinite(variableCostPercent) ||
    variableCostPercent < 0 ||
    variableCostPercent >= 100
  ) {
    return NextResponse.json({ error: "invalid_business_settings" }, { status: 400 });
  }

  const payload = {
    creator_id: creator.id,
    currency,
    monthly_revenue_goal_minor: monthlyRevenueGoalMinor,
    monthly_fixed_costs_minor: monthlyFixedCostsMinor,
    variable_cost_rate_bps: Math.round(variableCostPercent * 100),
    time_zone: "America/Santiago",
    updated_at: new Date().toISOString(),
  };

  const saved = await userRest<unknown>(
    session.accessToken,
    "creator_business_settings?on_conflict=creator_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(payload),
    },
  );
  if (!saved.ok) return NextResponse.json({ error: "business_settings_save_failed" }, { status: 502 });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
