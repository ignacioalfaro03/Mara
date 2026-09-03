import { NextResponse } from "next/server";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "hero_cta_click",
  "social_to_web",
  "age_gate_view",
  "age_gate_pass",
  "age_gate_fail",
  "meet_mara_view",
  "returning_user",
  "launch_experience_started",
  "launch_session_completed",
  "launch_return_continued",
  "launch_state_reset",
  "prediction_hit",
  "prediction_miss",
]);

const ALLOWED_PROPERTY_KEYS = new Set([
  "surface",
  "target",
  "placement",
  "return_count_bucket",
  "days_since_first_bucket",
]);

const RETURN_COUNT_BUCKETS = new Set(["1", "2", "3-4", "5+"]);
const DAYS_SINCE_FIRST_BUCKETS = new Set(["same_day", "1-2d", "3-7d", "8+d", "unknown"]);

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

    if (key === "return_count_bucket") {
      if (typeof raw === "string" && RETURN_COUNT_BUCKETS.has(raw)) safe[key] = raw;
      continue;
    }

    if (key === "days_since_first_bucket") {
      if (typeof raw === "string" && DAYS_SINCE_FIRST_BUCKETS.has(raw)) safe[key] = raw;
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
  // vulnerability data here. Return measurement uses coarse local buckets only.
  console.info("MARA_TELEMETRY", JSON.stringify({
    event: payload.event,
    properties: sanitizeProperties(payload.properties),
    timestamp,
  }));

  return NextResponse.json({ ok: true });
}
