import fs from "node:fs/promises";
import process from "node:process";

const MARKER = "MARA_TELEMETRY";
const VALID_SOURCES = ["ig", "tt", "x", "direct", "other"];
const CORE_EVENTS = [
  "launch_experience_started",
  "launch_session_completed",
  "returning_user",
  "launch_return_continued",
  "ritual_viewed",
  "ritual_play_intent",
  "ritual_skipped",
  "experience_started",
  "experience_completed",
  "preference_selected",
  "signup_started",
  "signup_completed",
  "commerce_offer_viewed",
  "commercial_offer_dismissed",
  "commercial_post_offer_continued",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
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

    const source = typeof properties.entry_source === "string" && VALID_SOURCES.includes(properties.entry_source)
      ? properties.entry_source
      : "unattributed";
    increment(sources, source);

    if (CORE_EVENTS.includes(record.event)) {
      increment(sourceCoreEvents, `${source}:${record.event}`);
    }

    if (typeof properties.return_count_bucket === "string") {
      increment(returnCountBuckets, properties.return_count_bucket);
    }

    if (typeof properties.days_since_first_bucket === "string") {
      increment(returnLatencyBuckets, properties.days_since_first_bucket);
    }
  }

  const count = (event) => events.get(event) ?? 0;
  const launchStarts = count("launch_experience_started");
  const launchCompletions = count("launch_session_completed");
  const ritualViews = count("ritual_viewed");
  const ritualPlayIntents = count("ritual_play_intent");
  const ritualSkips = count("ritual_skipped");
  const privateStarts = count("experience_started");
  const privateCompletions = count("experience_completed");
  const preferenceSelections = count("preference_selected");
  const signupStarts = count("signup_started");
  const signupCompletions = count("signup_completed");
  const returns = count("returning_user");
  const returnContinuations = count("launch_return_continued");
  const offerViews = count("commerce_offer_viewed");
  const offerDismissals = count("commercial_offer_dismissed");
  const postOfferContinuations = count("commercial_post_offer_continued");
  const checkoutStarts = count("commerce_checkout_started");
  const checkoutBlocks = count("commerce_checkout_blocked");
  const entitlementUnlocks = count("commerce_entitlement_unlocked");

  return {
    telemetry_lines_seen: telemetryLines,
    accepted_records: telemetryLines - malformedTelemetryLines,
    malformed_records: malformedTelemetryLines,
    events: sortedObject(events),
    entry_sources: sortedObject(sources),
    return_count_buckets: sortedObject(returnCountBuckets),
    return_latency_buckets: sortedObject(returnLatencyBuckets),
    core_events_by_source: sortedObject(sourceCoreEvents),
    directional_event_ratios: {
      launch_completion_events_per_start_event: safeRatio(launchCompletions, launchStarts),
      ritual_play_intents_per_view: safeRatio(ritualPlayIntents, ritualViews),
      ritual_skips_per_view: safeRatio(ritualSkips, ritualViews),
      private_moment_completions_per_start: safeRatio(privateCompletions, privateStarts),
      preference_selections_per_private_moment_start: safeRatio(preferenceSelections, privateStarts),
      signup_completions_per_start: safeRatio(signupCompletions, signupStarts),
      return_continuations_per_return_event: safeRatio(returnContinuations, returns),
      offer_dismissals_per_offer_view: safeRatio(offerDismissals, offerViews),
      post_offer_continuations_per_dismissal: safeRatio(postOfferContinuations, offerDismissals),
      checkout_starts_per_offer_view: safeRatio(checkoutStarts, offerViews),
      checkout_blocks_per_checkout_start: safeRatio(checkoutBlocks, checkoutStarts),
      entitlement_unlocks_per_checkout_start: safeRatio(entitlementUnlocks, checkoutStarts),
    },
    interpretation_warning:
      "Event aggregates only. Do not report these as unique users, D1/D3/D7 retention, cohort retention, churn, LTV or unique conversion rates. Use the separate minimal invited-cohort roster for actual return status.",
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
  for (const [key, value] of entries) {
    console.log(`  ${key.padEnd(width)}  ${value}`);
  }
}

function printHumanReport(report) {
  console.log("MARA PRIVATE ALPHA — SIGNAL REPORT");
  console.log("==================================");
  console.log(`Telemetry lines seen: ${report.telemetry_lines_seen}`);
  console.log(`Accepted records:    ${report.accepted_records}`);
  console.log(`Malformed records:   ${report.malformed_records}`);

  printTable("Events", report.events);
  printTable("Entry sources", report.entry_sources);
  printTable("Return depth buckets", report.return_count_buckets);
  printTable("Return latency buckets", report.return_latency_buckets);
  printTable("Launch-critical events by source", report.core_events_by_source);

  console.log("\nDirectional event ratios (NOT unique-user conversion/retention)");
  for (const [key, value] of Object.entries(report.directional_event_ratios)) {
    console.log(`  ${key}: ${value ?? "n/a"}`);
  }

  console.log(`\nWARNING: ${report.interpretation_warning}`);
  console.log("Founder decision framework: docs/launch/alpha-signal-scorecard.md");
}

function selfTest() {
  const sampleRecords = [
    ["launch_experience_started", { entry_source: "ig" }],
    ["launch_session_completed", { entry_source: "ig" }],
    ["ritual_viewed", { entry_source: "ig" }],
    ["ritual_play_intent", { entry_source: "ig" }],
    ["experience_started", { entry_source: "direct" }],
    ["experience_completed", { entry_source: "direct" }],
    ["preference_selected", { entry_source: "direct" }],
    ["signup_started", { entry_source: "direct" }],
    ["signup_completed", { entry_source: "direct" }],
    ["returning_user", { entry_source: "x", return_count_bucket: "1", days_since_first_bucket: "1-2d" }],
    ["launch_return_continued", { entry_source: "x", return_count_bucket: "1", days_since_first_bucket: "1-2d" }],
    ["commerce_offer_viewed", { entry_source: "direct" }],
    ["commercial_offer_dismissed", { entry_source: "direct" }],
    ["commercial_post_offer_continued", { entry_source: "direct" }],
    ["commerce_checkout_started", { entry_source: "direct" }],
    ["commerce_checkout_blocked", { entry_source: "direct" }],
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
    [report.telemetry_lines_seen === 17, "telemetry line count"],
    [report.accepted_records === 16, "accepted record count"],
    [report.malformed_records === 1, "malformed record count"],
    [report.events.experience_started === 1, "Private Moment start"],
    [report.events.commercial_post_offer_continued === 1, "post-offer continuation"],
    [report.return_count_buckets["1"] === 2, "return bucket"],
    [report.return_latency_buckets["1-2d"] === 2, "latency bucket"],
    [ratios.launch_completion_events_per_start_event === 1, "launch completion ratio"],
    [ratios.ritual_play_intents_per_view === 1, "ritual participation ratio"],
    [ratios.ritual_skips_per_view === 0, "ritual skip ratio"],
    [ratios.private_moment_completions_per_start === 1, "Private Moment completion ratio"],
    [ratios.preference_selections_per_private_moment_start === 1, "preference ratio"],
    [ratios.signup_completions_per_start === 1, "signup ratio"],
    [ratios.return_continuations_per_return_event === 1, "return continuation ratio"],
    [ratios.offer_dismissals_per_offer_view === 1, "offer dismissal ratio"],
    [ratios.post_offer_continuations_per_dismissal === 1, "relationship preservation ratio"],
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
    throw new Error(
      "Provide a log file path or pipe runtime logs into stdin. Example: node scripts/alpha-signal-report.mjs mara-runtime.log",
    );
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
