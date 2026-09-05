import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";

export const runtime = "nodejs";

type LaunchEventRow = {
  event: string;
  surface: string | null;
  entry_source: string | null;
  received_at: string;
};

const MAX_ROWS = 1000;

function configuredToken() {
  return process.env.MARA_OPERATOR_TOKEN?.trim() ?? "";
}

function requestToken(request: Request) {
  const auth = request.headers.get("authorization")?.trim() ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return request.headers.get("x-mara-operator-token")?.trim() ?? "";
}

function authorize(request: Request) {
  const expected = configuredToken();
  if (!expected) return { ok: false as const, status: 404, error: "not_found" };
  if (requestToken(request) !== expected) return { ok: false as const, status: 401, error: "operator_auth_required" };
  return { ok: true as const };
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortedObject(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function safeRatio(numerator: number, denominator: number) {
  if (!denominator) return null;
  return Number((numerator / denominator).toFixed(3));
}

function readWindowHours(request: Request) {
  const raw = new URL(request.url).searchParams.get("hours");
  const parsed = raw ? Number(raw) : 168;
  if (!Number.isFinite(parsed)) return 168;
  return Math.max(1, Math.min(720, Math.round(parsed)));
}

function count(rows: LaunchEventRow[], event: string, surface?: string) {
  return rows.filter((row) => row.event === event && (!surface || row.surface === surface)).length;
}

function buildSummary(rows: LaunchEventRow[], windowHours: number) {
  const events = new Map<string, number>();
  const surfaces = new Map<string, number>();
  const sources = new Map<string, number>();

  for (const row of rows) {
    increment(events, row.event);
    increment(surfaces, `${row.surface ?? "unspecified"}:${row.event}`);
    increment(sources, row.entry_source ?? "unattributed");
  }

  const landingViews = count(rows, "landing_view");
  const firstInteractions = count(rows, "first_interaction");
  const ritualCompletions = count(rows, "ritual_completed");
  const continuityClicks = count(rows, "hero_cta_click", "dm_continuity");
  const memoryRendered = count(rows, "memory_recall_rendered");
  const memoryEngaged = count(rows, "memory_recall_engaged");
  const privateStarts = count(rows, "experience_started", "private_moment");
  const privateCompletions = count(rows, "experience_completed", "private_moment");
  const offerViews = count(rows, "offer_viewed");
  const offerClicks = count(rows, "offer_clicked");
  const checkoutStarts = count(rows, "commerce_checkout_started");
  const checkoutBlocks = count(rows, "commerce_checkout_blocked");
  const purchases = count(rows, "purchase_completed");

  return {
    windowHours,
    totalEvents: rows.length,
    events: sortedObject(events),
    eventsBySurface: sortedObject(surfaces),
    entrySources: sortedObject(sources),
    funnel: {
      landingViews,
      firstInteractions,
      ritualCompletions,
      continuityClicks,
      memoryRendered,
      memoryEngaged,
      privateStarts,
      privateCompletions,
      offerViews,
      offerClicks,
      checkoutStarts,
      checkoutBlocks,
      purchases,
    },
    directionalRatios: {
      first_interactions_per_landing_view: safeRatio(firstInteractions, landingViews),
      ritual_completions_per_first_interaction: safeRatio(ritualCompletions, firstInteractions),
      continuity_clicks_per_ritual_completion: safeRatio(continuityClicks, ritualCompletions),
      memory_engagements_per_recall: safeRatio(memoryEngaged, memoryRendered),
      private_completions_per_start: safeRatio(privateCompletions, privateStarts),
      offer_clicks_per_offer_view: safeRatio(offerClicks, offerViews),
      checkout_starts_per_offer_click: safeRatio(checkoutStarts, offerClicks),
      checkout_blocks_per_checkout_start: safeRatio(checkoutBlocks, checkoutStarts),
      purchases_per_checkout_start: safeRatio(purchases, checkoutStarts),
    },
    warning:
      "Anonymous event aggregates only. This is not unique-user conversion, cohort retention, revenue, LTV, churn or payment reconciliation.",
  };
}

export async function GET(request: Request) {
  const auth = authorize(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const config = getServerBackendConfig();
  if (!config) return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });

  const windowHours = readWindowHours(request);
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
  const query = new URLSearchParams({
    select: "event,surface,entry_source,received_at",
    received_at: `gte.${since}`,
    order: "received_at.desc",
    limit: String(MAX_ROWS),
  });

  const response = await fetch(`${config.url}/rest/v1/launch_events?${query}`, {
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return NextResponse.json({ error: "launch_events_read_failed" }, { status: 502 });

  const rows = (await response.json()) as LaunchEventRow[];
  return NextResponse.json(buildSummary(rows, windowHours));
}
