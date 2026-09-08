import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";

export const runtime = "nodejs";

const EXPOSURE_LEVELS = new Set([
  "character_only",
  "voice",
  "selective_real_content",
  "direct_interaction",
  "not_sure",
]);

const PRODUCT_INTERESTS = new Set([
  "digital_content",
  "audio",
  "personalized",
  "chat",
  "scheduled_sessions",
  "membership",
  "not_sure",
]);

const AUDIENCE_SIZES = new Set(["none", "under_5k", "5k_25k", "25k_plus", "not_sure"]);
const CURRENT_STATUSES = new Set(["never", "private_creator", "public_creator", "not_sure"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CreatorInterestPayload = {
  email?: unknown;
  exposureLevel?: unknown;
  productInterests?: unknown;
  audienceSize?: unknown;
  currentCreatorStatus?: unknown;
  adultConsent?: unknown;
  website?: unknown;
};

function writeHeaders(config: NonNullable<ReturnType<typeof getServerBackendConfig>>) {
  if (config.serviceRoleKey.startsWith("sb_secret_")) {
    return {
      apikey: config.serviceRoleKey,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    };
  }

  return {
    apikey: config.publishableKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
}

function parsePayload(payload: CreatorInterestPayload) {
  if (payload.website) return null; // honeypot
  if (payload.adultConsent !== true) return null;
  if (typeof payload.email !== "string") return null;
  if (typeof payload.exposureLevel !== "string" || !EXPOSURE_LEVELS.has(payload.exposureLevel)) return null;

  const email = payload.email.trim().toLowerCase();
  if (email.length > 320 || !EMAIL.test(email)) return null;

  const productInterests = Array.isArray(payload.productInterests)
    ? [...new Set(payload.productInterests.filter((value): value is string => typeof value === "string" && PRODUCT_INTERESTS.has(value)))].slice(0, 7)
    : [];

  const audienceSize = typeof payload.audienceSize === "string" && AUDIENCE_SIZES.has(payload.audienceSize)
    ? payload.audienceSize
    : "not_sure";

  const currentCreatorStatus = typeof payload.currentCreatorStatus === "string" && CURRENT_STATUSES.has(payload.currentCreatorStatus)
    ? payload.currentCreatorStatus
    : "not_sure";

  return {
    email,
    exposure_level: payload.exposureLevel,
    product_interests: productInterests.length > 0 ? productInterests : ["not_sure"],
    audience_size: audienceSize,
    current_creator_status: currentCreatorStatus,
    source: "web_creators",
    consented_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  let raw: CreatorInterestPayload;

  try {
    const text = await request.text();
    if (text.length > 8_000) return NextResponse.json({ ok: false }, { status: 413 });
    raw = JSON.parse(text) as CreatorInterestPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = parsePayload(raw);
  if (!payload) return NextResponse.json({ ok: false }, { status: 400 });

  const config = getServerBackendConfig();
  if (!config) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/creator_interest?on_conflict=email`, {
      method: "POST",
      headers: writeHeaders(config),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("MARA_CREATOR_INTEREST_WRITE_FAILED", response.status);
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
