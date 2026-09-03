import fs from "node:fs/promises";
import process from "node:process";

const MARKER = "MARA_TELEMETRY";
const VALID_SOURCES = ["ig", "tt", "x", "direct", "other"];
const CORE_EVENTS = [
  "launch_experience_started",
  "launch_session_completed",
  "returning_user",
  "launch_return_continued",
  "prediction_hit",
  "prediction_miss",
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
    // Some log collectors append metadata after the application message. If
    // that happens, try the largest prefix ending in a closing brace.
    for (let index = candidate.length - 1; index >= 0; index -= 1) {
      if (candidate[index] !== "}") continue;
      try {
        return JSON.parse(candidate.slice(0, index + 1));
      } catch {
        // Continue looking for an earlier valid JSON boundary.
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
  const starts = count("launch_experience_started");
  const completions = count("launch_session_completed");
  const returns = count("returning_user");
  const returnContinuations = count("launch_return_continued");
  const predictionHits = count("prediction_hit");
  const predictionMisses = count("prediction_miss");

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
      completion_events_per_start_event: safeRatio(completions, starts),
      return_continuations_per_return_event: safeRatio(returnContinuations, returns),
      prediction_hits_per_prediction_result: safeRatio(
        predictionHits,
        predictionHits + predictionMisses,
      ),
    },
    interpretation_warning:
      "Event aggregates only. Do not report these as unique users, D1/D7 retention, cohort retention, churn, LTV or unique conversion rates.",
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
  console.log("MARA PUBLIC ALPHA — SIGNAL REPORT");
  console.log("=================================");
  console.log(`Telemetry lines seen: ${report.telemetry_lines_seen}`);
  console.log(`Accepted records:    ${report.accepted_records}`);
  console.log(`Malformed records:   ${report.malformed_records}`);

  printTable("Events", report.events);
  printTable("Entry sources", report.entry_sources);
  printTable("Return depth buckets", report.return_count_buckets);
  printTable("Return latency buckets", report.return_latency_buckets);
  printTable("Core events by source", report.core_events_by_source);

  console.log("\nDirectional event ratios (NOT unique-user conversion/retention)");
  for (const [key, value] of Object.entries(report.directional_event_ratios)) {
    console.log(`  ${key}: ${value ?? "n/a"}`);
  }

  console.log(`\nWARNING: ${report.interpretation_warning}`);
  console.log("Use docs/launch/alpha-signal-scorecard.md for the Day 7 founder decision.");
}

function selfTest() {
  const sample = [
    '2026-09-03T12:00:00Z MARA_TELEMETRY {"event":"launch_experience_started","properties":{"entry_source":"ig"},"timestamp":"2026-09-03T12:00:00Z"}',
    'MARA_TELEMETRY {"event":"launch_session_completed","properties":{"entry_source":"ig"},"timestamp":"2026-09-03T12:02:00Z"}',
    'MARA_TELEMETRY {"event":"returning_user","properties":{"entry_source":"x","return_count_bucket":"1","days_since_first_bucket":"1-2d"},"timestamp":"2026-09-04T12:00:00Z"}',
    'MARA_TELEMETRY {"event":"launch_return_continued","properties":{"entry_source":"x","return_count_bucket":"1","days_since_first_bucket":"1-2d"},"timestamp":"2026-09-04T12:01:00Z"}',
    'MARA_TELEMETRY {"event":"prediction_hit","properties":{"entry_source":"ig"},"timestamp":"2026-09-03T12:01:00Z"}',
    'MARA_TELEMETRY {"event":"prediction_miss","properties":{"entry_source":"tt"},"timestamp":"2026-09-03T12:03:00Z"}',
    "MARA_TELEMETRY not-json",
    "ordinary runtime log line",
  ].join("\n");

  const report = buildSignalReport(sample);
  const assertions = [
    [report.telemetry_lines_seen === 7, "telemetry line count"],
    [report.accepted_records === 6, "accepted record count"],
    [report.malformed_records === 1, "malformed record count"],
    [report.events.launch_experience_started === 1, "start event"],
    [report.entry_sources.ig === 3, "instagram source count"],
    [report.entry_sources.x === 2, "x source count"],
    [report.return_count_buckets["1"] === 2, "return bucket"],
    [report.return_latency_buckets["1-2d"] === 2, "latency bucket"],
    [report.directional_event_ratios.completion_events_per_start_event === 1, "completion/start ratio"],
    [report.directional_event_ratios.return_continuations_per_return_event === 1, "return continuation ratio"],
    [report.directional_event_ratios.prediction_hits_per_prediction_result === 0.5, "prediction ratio"],
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
