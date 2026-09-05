import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "landing_view",
  "session_started",
  "hero_cta_click",
  "cta_clicked",
  "mara_entered",
  "first_interaction",
  "social_to_web",
  "age_gate_view",
  "age_gate_pass",
  "age_gate_accepted",
  "age_gate_fail",
  "returning_user",
  "memory_recall_rendered",
  "memory_recall_engaged",
  "launch_experience_started",
  "experience_started",
  "experience_completed",
  "launch_return_continued",
  "launch_state_reset",
  "preference_selected",
  "first_preference_signal",
  "preference_updated",
  "signup_started",
  "signup_completed",
  "signin_started",
  "signin_completed",
  "ritual_viewed",
  "ritual_completed",
  "ritual_skipped",
  "paywall_impression",
  "offer_viewed",
  "offer_clicked",
  "commercial_offer_dismissed",
  "commercial_post_offer_continued",
  "capricho_viewed",
  "commerce_offer_viewed",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
  "purchase_completed",
  "commerce_contribution_progress_viewed",
]);

const ALLOWED_PROPERTY_KEYS = new Set([
  "surface",
  "target",
  "placement",
  "entry_source",
  "memory_source",
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

const TOKEN_PROPERTY_KEYS = new Set([
  "surface",
  "target",
  "placement",
  "memory_source",
  "preference_group",
  "offer_slug",
  "offer_type",
  "capricho_slug",
  "currency",
]);

const ENTRY_SOURCES = new Set(["ig", "tt", "x", "direct", "other"]);
const MEMORY_SOURCES = new Set(["local", "server"]);
const RETURN_COUNT_BUCKETS = new Set(["1", "2", "3-4", "5+"]);
const DAYS_SINCE_FIRST_BUCKETS = new Set(["same_day", "1-2d", "3-7d", "8+d", "unknown"]);
const AMOUNT_BUCKETS = new Set(["under_5", "5_9", "10_24", "25_99", "100_plus"]);
const PROVIDER_STATUSES = new Set(["configured", "not_configured"]);
const SAFE_TOKEN = /^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$/;
const SAFE_SURFACE = /^(\/|\/[A-Za-z0-9][A-Za-z0-9_:/.-]{0,78}|[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79})$/;

type TelemetryPayload = {
  event?: unknown;
  properties?: unknown;
  timestamp?: unknown;
  sessionId?: unknown;
};

function sanitizeProperties(value: unknown): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const safe: Record<string, string | number | boolean> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!ALLOWED_PROPERTY_KEYS.has(key)) continue;

    if (key === "surface") {
      if (typeof raw === "string" && SAFE_SURFACE.test(raw)) safe[key] = raw;
      continue;
    }

    if (key === "entry_source") {
      if (typeof raw === "string" && ENTRY_SOURCES.has(raw)) safe[key] = raw;
      continue;
    }

    if (key === "memory_source") {
      if (typeof raw === "string" && MEMORY_SOURCES.has(raw)) safe[key] = raw;
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

    if (TOKEN_PROPERTY_KEYS.has(key)) {
      if (typeof raw === "string" && SAFE_TOKEN.test(raw)) safe[key] = raw;
      continue;
    }

    if (typeof raw === "boolean" || typeof raw === "number") {
      safe[key] = raw;
    }
  }
  return safe;
}

function safeTimestamp(value: unknown) {
  if (typeof value !== "string") return new Date().toISOString();

  const parsed = Date.parse(value.slice(0, 64));
  const now = Date.now();
  const maxFuture = now + 5 * 60 * 1000;
  const maxPast = now - 30 * 24 * 60 * 60 * 1000;
  if (!Number.isFinite(parsed) || parsed > maxFuture || parsed < maxPast) {
    return new Date().toISOString();
  }
  return new Date(parsed).toISOString();
}

function safeSessionId(value: unknown) {
  if (typeof value !== "string") return null;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}

function token(properties: Record<string, string | number | boolean>, key: string) {
  const value = properties[key];
  return typeof value === "string" ? value : null;
}

function getSupabaseWriteHeaders(config: NonNullable<ReturnType<typeof getServerBackendConfig>>) {
  if (config.serviceRoleKey.startsWith("sb_secret_")) {
    return {
      apikey: config.serviceRoleKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };
  }

  return {
    apikey: config.publishableKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

async function persistTelemetry(
  event: string,
  properties: Record<string, string | number | boolean>,
  occurredAt: string,
  sessionId: string | null,
) {
  const config = getServerBackendConfig();
  if (!config) return false;

  try {
    const response = await fetch(`${config.url}/rest/v1/launch_events`, {
      method: "POST",
      headers: getSupabaseWriteHeaders(config),
      body: JSON.stringify({
        event,
        session_id: sessionId,
        entry_source: token(properties, "entry_source") ?? "direct",
        surface: token(properties, "surface"),
        target: token(properties, "target"),
        placement: token(properties, "placement"),
        memory_source: token(properties, "memory_source"),
        preference_group: token(properties, "preference_group"),
        offer_slug: token(properties, "offer_slug"),
        offer_type: token(properties, "offer_type"),
        capricho_slug: token(properties, "capricho_slug"),
        amount_bucket: token(properties, "amount_bucket"),
        currency: token(properties, "currency"),
        provider_status: token(properties, "provider_status"),
        return_count_bucket: token(properties, "return_count_bucket"),
        days_since_first_bucket: token(properties, "days_since_first_bucket"),
        properties,
        occurred_at: occurredAt,
      }),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
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

  const event = payload.event;
  const properties = sanitizeProperties(payload.properties);
  const timestamp = safeTimestamp(payload.timestamp);
  const sessionId = safeSessionId(payload.sessionId);
  const persisted = await persistTelemetry(event, properties, timestamp, sessionId);

  // Intentionally anonymous launch telemetry. Public events must have a current
  // producer and founder decision; parked/dev-only events are rejected here.
  // Do not add user IDs, IP-derived identity, conversation content, fantasies,
  // sexual history or commercial vulnerability data.
  console.info("MARA_TELEMETRY", JSON.stringify({
    event,
    properties,
    timestamp,
    persisted,
  }));

  return NextResponse.json({ ok: true, persisted });
}
