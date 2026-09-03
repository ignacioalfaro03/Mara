import { NextResponse } from "next/server";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "landing_view",
  "hero_cta_click",
  "mara_entered",
  "social_to_web",
  "age_gate_view",
  "age_gate_pass",
  "age_gate_accepted",
  "age_gate_fail",
  "meet_mara_view",
  "returning_user",
  "launch_experience_started",
  "experience_started",
  "launch_session_completed",
  "experience_completed",
  "launch_return_continued",
  "launch_state_reset",
  "visual_choice_completed",
  "preference_selected",
  "prediction_hit",
  "prediction_miss",
  "signup_started",
  "signup_completed",
  "signin_started",
  "signin_completed",
  "capricho_viewed",
  "commerce_offer_viewed",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
  "commerce_contribution_progress_viewed",
]);

const ALLOWED_PROPERTY_KEYS = new Set([
  "surface",
  "target",
  "placement",
  "entry_source",
  "return_count_bucket",
  "days_since_first_bucket",
  "preference_group",
  "offer_slug",
  "offer_type",
  "capricho_slug",
  "amount_bucket",
  "currency",
  "provider_status",
]);

const ENTRY_SOURCES = new Set(["ig", "tt", "x", "direct", "other"]);
const RETURN_COUNT_BUCKETS = new Set(["1", "2", "3-4", "5+"]);
const DAYS_SINCE_FIRST_BUCKETS = new Set(["same_day", "1-2d", "3-7d", "8+d", "unknown"]);
const AMOUNT_BUCKETS = new Set(["under_5", "5_9", "10_24", "25_99", "100_plus"]);
const PROVIDER_STATUSES = new Set(["configured", "not_configured"]);

type TelemetryPayload = {
  event?: unknown;
  properties?: unknown;
  timestamp?: unknown;
};

function sanitizeProperties(value: unknown): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const safe: Record<string, string | number | boolean> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!ALLOWED_PROPERTY_KEYS.has(key)) continue;

    if (key === "entry_source") {
      if (typeof raw === "string" && ENTRY_SOURCES.has(raw)) safe[key] = raw;
      continue;
    }

    if (key === "return_count_bucket") {
      if (typeof raw === "string" && RETURN_COUNT_BUCKETS.has(raw)) safe[key] = raw;
      continue;
    }

    if (key === "days_since_first_bucket") {
      if (typeof raw === "string" && DAYS_SINCE_FIRST_BUCKETS.has(raw)) safe[key] = raw;
      continue;
    }

    if (key === "amount_bucket") {
      if (typeof raw === "string" && AMOUNT_BUCKETS.has(raw)) safe[key] = raw;
      continue;
    }

    if (key === "provider_status") {
      if (typeof raw === "string" && PROVIDER_STATUSES.has(raw)) safe[key] = raw;
      continue;
    }

    if (typeof raw === "boolean" || typeof raw === "number") {
      safe[key] = raw;
      continue;
    }

    if (typeof raw === "string") {
      safe[key] = raw.slice(0, 80);
    }
  }
  return safe;
}

export async function POST(request: Request) {
  let payload: TelemetryPayload;

  try {
    payload = (await request.json()) as TelemetryPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof payload.event !== "string" || !ALLOWED_EVENTS.has(payload.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const timestamp = typeof payload.timestamp === "string"
    ? payload.timestamp.slice(0, 40)
    : new Date().toISOString();

  // Intentionally anonymous launch telemetry. Do not add user IDs, IP-derived
  // identity, conversation content, fantasies, sexual history or commercial
  // vulnerability data here. Entry attribution is a coarse allowlisted source
  // only; arbitrary campaigns, referrers and handles are not accepted.
  console.info("MARA_TELEMETRY", JSON.stringify({
    event: payload.event,
    properties: sanitizeProperties(payload.properties),
    timestamp,
  }));

  return NextResponse.json({ ok: true });
}
