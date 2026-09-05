import fs from "node:fs/promises";
import process from "node:process";
import { pathToFileURL } from "node:url";

const MARKER = "MARA_TELEMETRY";
const VALID_SOURCES = ["ig", "tt", "x", "direct", "other"];
const CORE_EVENTS = [
  "page_view",
  "landing_view",
  "session_started",
  "hero_cta_click",
  "cta_clicked",
  "first_interaction",
  "launch_experience_started",
  "returning_user",
  "memory_recall_rendered",
  "memory_recall_engaged",
  "launch_return_continued",
  "ritual_viewed",
  "ritual_completed",
  "ritual_skipped",
  "experience_started",
  "experience_completed",
  "preference_selected",
  "first_preference_signal",
  "preference_updated",
  "signup_started",
  "signup_completed",
  "paywall_impression",
  "offer_viewed",
  "offer_clicked",
  "commerce_offer_viewed",
  "commercial_offer_dismissed",
  "commercial_post_offer_continued",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
  "purchase_completed",
];

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortedObject(map) {
  return Object.fromEntries(
    [...map.entries()].sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return String(a[0]).localeCompare(String(b[0]));
    }),
  );
}

function safeRatio(numerator, denominator) {
  if (!denominator) return null;
  return Number((numerator / denominator).toFixed(3));
}

function extractTelemetryJson(line) {
  const markerIndex = line.indexOf(MARKER);
  if (markerIndex < 0) return null;
  const afterMarker = line.slice(markerIndex + MARKER.length).trim();
  const objectStart = afterMarker.indexOf("{");
  if (objectStart < 0) return null;

  const candidate = afterMarker.slice(objectStart);
  try {
    return JSON.parse(candidate);
  } catch {
    for (let index = candidate.length - 1; index >= 0; index -= 1) {
      if (candidate[index] !== "}") continue;
      try {
        return JSON.parse(candidate.slice(0, index + 1));
      } catch {
        // Keep looking for an earlier valid JSON boundary.
      }
    }
    return null;
  }
}

export function buildSignalReport(text) {
  const events = new Map();
  const surfaceEvents = new Map();
  const sources = new Map();
  const returnCountBuckets = new Map();
  const returnLatencyBuckets = new Map();
  const sourceCoreEvents = new Map();
  let telemetryLines = 0;
  let malformedTelemetryLines = 0;

  for (const line of text.split(/\r?\n/)) {
    if (!line.includes(MARKER)) continue;
    telemetryLines += 1;

    const record = extractTelemetryJson(line);
    if (!record || typeof record.event !== "string") {
      malformedTelemetryLines += 1;
      continue;
    }

    increment(events, record.event);
    const properties = record.properties && typeof record.properties === "object"
      ? record.properties
      : {};
    const surface = typeof properties.surface === "string" ? properties.surface : "unspecified";
    increment(surfaceEvents, `${surface}:${record.event}`);

    const source = typeof properties.entry_source === "string" && VALID_SOURCES.includes(properties.entry_source)
      ? properties.entry_source
      : "unattributed";
    increment(sources, source);
    if (CORE_EVENTS.includes(record.event)) increment(sourceCoreEvents, `${source}:${record.event}`);
    if (typeof properties.return_count_bucket === "string") increment(returnCountBuckets, properties.return_count_bucket);
    if (typeof properties.days_since_first_bucket === "string") increment(returnLatencyBuckets, properties.days_since_first_bucket);
  }

  const count = (event) => events.get(event) ?? 0;
  const countSurface = (event, surface) => surfaceEvents.get(`${surface}:${event}`) ?? 0;

  const landingViews = count("landing_view");
  const sessionStarts = count("session_started");
  const firstInteractions = count("first_interaction");
  const homeCtaClicks = countSurface("hero_cta_click", "home");
  const meetMaraViews = countSurface("page_view", "/meet-mara");
  const meetMaraCtaClicks = countSurface("hero_cta_click", "meet_mara");
  const ritualViews = count("ritual_viewed");
  const ritualCompletions = count("ritual_completed");
  const ritualSkips = count("ritual_skipped");
  const continuityCtaClicks = countSurface("hero_cta_click", "dm_continuity");
  const privateStarts = countSurface("experience_started", "private_moment");
  const privateCompletions = countSurface("experience_completed", "private_moment");
  const privatePreferenceSelections = countSurface("preference_selected", "private_moment");
  const signupStarts = count("signup_started");
  const signupCompletions = count("signup_completed");
  const returns = count("returning_user");
  const memoryRecallRendered = count("memory_recall_rendered");
  const memoryRecallEngaged = count("memory_recall_engaged");
  const returnContinuations = count("launch_return_continued");
  const offerViews = countSurface("commerce_offer_viewed", "dm_private_moment");
  const canonicalOfferViews = count("offer_viewed");
  const offerClicks = count("offer_clicked");
  const offerDismissals = countSurface("commercial_offer_dismissed", "dm_private_moment");
  const postOfferContinuations = countSurface("commercial_post_offer_continued", "dm_private_moment");
  const checkoutStarts = countSurface("commerce_checkout_started", "dm_private_moment");
  const checkoutBlocks = countSurface("commerce_checkout_blocked", "dm_private_moment");
  const entitlementUnlocks = count("commerce_entitlement_unlocked");

  return {
    telemetry_lines_seen: telemetryLines,
    accepted_records: telemetryLines - malformedTelemetryLines,
    malformed_records: malformedTelemetryLines,
    events: sortedObject(events),
    events_by_surface: sortedObject(surfaceEvents),
    entry_sources: sortedObject(sources),
    return_count_buckets: sortedObject(returnCountBuckets),
    return_latency_buckets: sortedObject(returnLatencyBuckets),
    core_events_by_source: sortedObject(sourceCoreEvents),
    directional_event_ratios: {
      home_cta_clicks_per_landing_view: safeRatio(homeCtaClicks, landingViews),
      first_interactions_per_session_start: safeRatio(firstInteractions, sessionStarts),
      meet_mara_cta_clicks_per_view: safeRatio(meetMaraCtaClicks, meetMaraViews),
      ritual_completions_per_view: safeRatio(ritualCompletions, ritualViews),
      ritual_skips_per_view: safeRatio(ritualSkips, ritualViews),
      continuity_cta_clicks_per_ritual_completion: safeRatio(continuityCtaClicks, ritualCompletions),
      private_moment_completions_per_start: safeRatio(privateCompletions, privateStarts),
      preference_selections_per_private_moment_start: safeRatio(privatePreferenceSelections, privateStarts),
      signup_completions_per_start: safeRatio(signupCompletions, signupStarts),
      memory_engagements_per_recall_rendered: safeRatio(memoryRecallEngaged, memoryRecallRendered),
      return_continuations_per_return_event: safeRatio(returnContinuations, returns),
      offer_dismissals_per_offer_view: safeRatio(offerDismissals, offerViews),
      post_offer_continuations_per_dismissal: safeRatio(postOfferContinuations, offerDismissals),
      offer_clicks_per_offer_view: safeRatio(offerClicks, canonicalOfferViews),
      checkout_starts_per_offer_view: safeRatio(checkoutStarts, offerViews),
      checkout_blocks_per_checkout_start: safeRatio(checkoutBlocks, checkoutStarts),
      entitlement_unlocks_per_checkout_start: safeRatio(entitlementUnlocks, checkoutStarts),
    },
    interpretation_warning:
      "Event aggregates only. Public events must have a current product producer and founder decision. These are not unique users, D1/D3/D7 retention, cohort retention, churn, LTV or unique conversion rates. Use the separate minimal invited-cohort roster for actual return status.",
  };
}

function printTable(title, object) {
  console.log(`\n${title}`);
  const entries = Object.entries(object);
  if (!entries.length) {
    console.log("  (no data)");
    return;
  }
  const width = Math.max(...entries.map(([key]) => key.length));
  for (const [key, value] of entries) console.log(`  ${key.padEnd(width)}  ${value}`);
}

function printHumanReport(report) {
  console.log("MARA PRIVATE ALPHA — SIGNAL REPORT");
  console.log("==================================");
  console.log(`Telemetry lines seen: ${report.telemetry_lines_seen}`);
  console.log(`Accepted records:    ${report.accepted_records}`);
  console.log(`Malformed records:   ${report.malformed_records}`);
  printTable("Events", report.events);
  printTable("Events by surface", report.events_by_surface);
  printTable("Entry sources", report.entry_sources);
  printTable("Return depth buckets", report.return_count_buckets);
  printTable("Return latency buckets", report.return_latency_buckets);
  printTable("Launch-critical events by source", report.core_events_by_source);
  console.log("\nDirectional event ratios (NOT unique-user conversion/retention)");
  for (const [key, value] of Object.entries(report.directional_event_ratios)) console.log(`  ${key}: ${value ?? "n/a"}`);
  console.log(`\nWARNING: ${report.interpretation_warning}`);
  console.log("Founder decision framework: docs/launch/alpha-signal-scorecard.md");
}

function selfTest() {
  const sampleRecords = [
    ["landing_view", { surface: "/", entry_source: "ig" }],
    ["session_started", { surface: "/", entry_source: "ig" }],
    ["hero_cta_click", { surface: "home", placement: "primary", entry_source: "ig" }],
    ["first_interaction", { surface: "dm_experience", entry_source: "ig" }],
    ["page_view", { surface: "/meet-mara", entry_source: "direct" }],
    ["hero_cta_click", { surface: "meet_mara", placement: "top", entry_source: "direct" }],
    ["launch_experience_started", { surface: "dm_experience", entry_source: "ig" }],
    ["experience_started", { surface: "dm_experience", entry_source: "ig" }],
    ["ritual_viewed", { surface: "dm_experience", entry_source: "ig" }],
    ["ritual_completed", { surface: "dm_ritual", entry_source: "ig" }],
    ["hero_cta_click", { surface: "dm_continuity", target: "auth", entry_source: "ig" }],
    ["experience_completed", { surface: "dm_ritual", entry_source: "ig" }],
    ["experience_started", { surface: "private_moment", entry_source: "direct" }],
    ["experience_completed", { surface: "private_moment", entry_source: "direct" }],
    ["preference_selected", { surface: "private_moment", entry_source: "direct" }],
    ["signup_started", { surface: "auth", entry_source: "direct" }],
    ["signup_completed", { surface: "auth", entry_source: "direct" }],
    ["returning_user", { surface: "dm_experience", entry_source: "x", return_count_bucket: "1", days_since_first_bucket: "1-2d" }],
    ["memory_recall_rendered", { surface: "dm_experience", memory_source: "server", entry_source: "x" }],
    ["memory_recall_engaged", { surface: "dm_experience", target: "private_moment", entry_source: "x" }],
    ["launch_return_continued", { surface: "dm_experience", entry_source: "x", return_count_bucket: "1", days_since_first_bucket: "1-2d" }],
    ["offer_viewed", { surface: "dm_private_moment", entry_source: "direct" }],
    ["commerce_offer_viewed", { surface: "dm_private_moment", entry_source: "direct" }],
    ["offer_clicked", { surface: "dm_private_moment", entry_source: "direct" }],
    ["commercial_offer_dismissed", { surface: "dm_private_moment", entry_source: "direct" }],
    ["commercial_post_offer_continued", { surface: "dm_private_moment", entry_source: "direct" }],
    ["commerce_checkout_started", { surface: "dm_private_moment", entry_source: "direct" }],
    ["commerce_checkout_blocked", { surface: "dm_private_moment", entry_source: "direct" }],
  ];

  const sample = [
    ...sampleRecords.map(([event, properties], index) =>
      `2026-09-03T12:${String(index).padStart(2, "0")}:00Z ${MARKER} ${JSON.stringify({ event, properties, timestamp: "2026-09-03T12:00:00Z" })}`,
    ),
    "MARA_TELEMETRY not-json",
    "ordinary runtime log line",
  ].join("\n");

  const report = buildSignalReport(sample);
  const ratios = report.directional_event_ratios;
  const assertions = [
    [report.telemetry_lines_seen === 29, "telemetry line count"],
    [report.accepted_records === 28, "accepted record count"],
    [report.malformed_records === 1, "malformed record count"],
    [report.events.launch_session_completed === undefined, "dead launch completion event absent"],
    [report.events.ritual_play_intent === undefined, "fake ritual exposure intent absent"],
    [report.events_by_surface["home:hero_cta_click"] === 1, "home CTA surface"],
    [report.events_by_surface["dm_experience:first_interaction"] === 1, "first interaction surface"],
    [report.events_by_surface["/meet-mara:page_view"] === 1, "Meet Mara page view surface"],
    [report.events_by_surface["meet_mara:hero_cta_click"] === 1, "Meet Mara CTA surface"],
    [report.events_by_surface["dm_continuity:hero_cta_click"] === 1, "continuity CTA surface"],
    [report.events_by_surface["private_moment:experience_started"] === 1, "Private Moment start"],
    [report.events_by_surface["dm_ritual:ritual_completed"] === 1, "ritual completion surface"],
    [ratios.home_cta_clicks_per_landing_view === 1, "home CTA ratio"],
    [ratios.first_interactions_per_session_start === 1, "first interaction/session ratio"],
    [ratios.meet_mara_cta_clicks_per_view === 1, "Meet Mara CTA ratio"],
    [ratios.ritual_completions_per_view === 1, "ritual completion ratio"],
    [ratios.ritual_skips_per_view === 0, "ritual skip ratio"],
    [ratios.continuity_cta_clicks_per_ritual_completion === 1, "post-value continuity CTA ratio"],
    [ratios.private_moment_completions_per_start === 1, "Private Moment completion ratio"],
    [ratios.preference_selections_per_private_moment_start === 1, "preference ratio"],
    [ratios.signup_completions_per_start === 1, "signup ratio"],
    [ratios.memory_engagements_per_recall_rendered === 1, "memory recall engagement ratio"],
    [ratios.return_continuations_per_return_event === 1, "return continuation ratio"],
    [ratios.offer_dismissals_per_offer_view === 1, "offer dismissal ratio"],
    [ratios.post_offer_continuations_per_dismissal === 1, "relationship preservation ratio"],
    [ratios.offer_clicks_per_offer_view === 1, "offer click ratio"],
    [ratios.checkout_starts_per_offer_view === 1, "checkout intent ratio"],
    [ratios.checkout_blocks_per_checkout_start === 1, "checkout blocked ratio"],
    [ratios.entitlement_unlocks_per_checkout_start === 0, "entitlement ratio"],
  ];

  const failed = assertions.filter(([condition]) => !condition);
  if (failed.length) {
    for (const [, label] of failed) console.error(`SELF_TEST FAIL: ${label}`);
    process.exitCode = 1;
    return;
  }
  console.log("MARA_ALPHA_SIGNAL_REPORT SELF_TEST PASS");
}

async function readInput(args) {
  const fileArg = args.find((arg) => !arg.startsWith("--"));
  if (fileArg) return fs.readFile(fileArg, "utf8");
  if (process.stdin.isTTY) {
    throw new Error("Provide a log file path or pipe runtime logs into stdin. Example: node scripts/alpha-signal-report.mjs mara-runtime.log");
  }
  let text = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    selfTest();
    return;
  }
  const text = await readInput(args);
  const report = buildSignalReport(text);
  if (args.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  printHumanReport(report);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
