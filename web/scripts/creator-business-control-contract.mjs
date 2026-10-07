import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadEngine() {
  const source = read("lib/creator-business-control.ts");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      strict: true,
    },
  });
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, console, Intl, Date, Math, Number, String, Array, Error, RegExp, Object };
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: "creator-business-control.js" });
  return module.exports;
}

const engine = loadEngine();
assert(typeof engine.buildCreatorBusinessControl === "function", "business control builder missing");
assert(typeof engine.breakEvenRevenueMinor === "function", "break-even function missing");

const observations = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  source: "MARA",
  occurredAt: `2026-10-${String(index + 1).padStart(2, "0")}T12:00:00-03:00`,
  amountMinor: 10_000,
  currency: "CLP",
  customerKey: `fan-${index + 1}`,
}));

const settings = {
  currency: "CLP",
  monthlyRevenueGoalMinor: 300_000,
  monthlyFixedCostsMinor: 50_000,
  variableCostRateBps: 2_000,
  timeZone: "America/Santiago",
};

const snapshot = engine.buildCreatorBusinessControl(
  observations,
  settings,
  new Date("2026-10-10T18:00:00-03:00"),
);

assert(snapshot.actualRevenueMinor === 100_000, "actual revenue mismatch");
assert(snapshot.forecastBaseMinor === 310_000, "base forecast mismatch");
assert(snapshot.forecastLowMinor === 310_000 && snapshot.forecastHighMinor === 310_000, "stable pace forecast range mismatch");
assert(snapshot.status === "ON_TRACK", "goal status mismatch");
assert(snapshot.breakEvenRevenueMinor === 62_500, "break-even mismatch");
assert(snapshot.breakEvenReached === true, "break-even reached mismatch");
assert(snapshot.expectedOperatingResultMinor === 198_000, "operating result mismatch");
assert(snapshot.revenueBySource.MARA === 100_000, "source aggregation mismatch");

const slowed = engine.buildCreatorBusinessControl(
  observations.slice(0, 3).map((item) => ({ ...item, amountMinor: 20_000 })),
  { ...settings, monthlyRevenueGoalMinor: 250_000 },
  new Date("2026-10-10T18:00:00-03:00"),
);
assert(slowed.forecastLowMinor === 60_000, "trailing-seven low forecast mismatch");
assert(slowed.forecastHighMinor === 186_000, "month-to-date high forecast mismatch");
assert(slowed.status === "OFF_TRACK", "off-track status mismatch");

const mixedCurrency = engine.buildCreatorBusinessControl(
  [...observations, { id: "usd", source: "ONLYFANS", occurredAt: "2026-10-05T12:00:00-03:00", amountMinor: 999_999, currency: "USD" }],
  settings,
  new Date("2026-10-10T18:00:00-03:00"),
);
assert(mixedCurrency.actualRevenueMinor === 100_000, "cross-currency revenue must not be silently combined");

let invalidRateRejected = false;
try {
  engine.breakEvenRevenueMinor({ ...settings, variableCostRateBps: 10_000 });
} catch {
  invalidRateRejected = true;
}
assert(invalidRateRejected, "100% variable cost must be rejected");

const sql = read("supabase/prepared/creator_business_control_foundation.sql");
assert(sql.includes("enable row level security"), "business settings RLS missing");
assert(sql.includes("creator_business_settings_select_owner"), "owner SELECT policy missing");
assert(sql.includes("creator_business_settings_update_owner"), "owner UPDATE policy missing");
assert(!/grant\s+.+\s+to\s+anon/i.test(sql), "business settings must not grant anon access");

const route = read("app/api/creator/business-settings/route.ts");
assert(route.includes("MARA_CREATOR_BUSINESS_CONTROL_ENABLED"), "route feature gate missing");
assert(route.includes("creator_not_authorized"), "creator ownership authorization missing");
assert(route.includes("on_conflict=creator_id"), "settings upsert contract missing");

const page = read("app/creator/business/page.tsx");
assert(page.includes("readCreatorBusinessRevenue"), "business page must use real purchase data");
assert(page.includes("RUN_RATE") || page.includes("control.model"), "forecast model disclosure missing");
assert(!page.includes("syntheticFans"), "business page must never depend on synthetic fans");

const strategy = read("../docs/strategy/MARA_CREATOR_BUSINESS_OS_V1.md");
assert(strategy.includes("A label is not a connector"), "external-source truth boundary missing");
assert(strategy.includes("NO MERGE unless Ignacio explicitly writes"), "founder merge boundary missing");

console.log("CREATOR_BUSINESS_CONTROL_CONTRACT PASS", {
  actual: snapshot.actualRevenueMinor,
  forecast: snapshot.forecastBaseMinor,
  breakEven: snapshot.breakEvenRevenueMinor,
  status: snapshot.status,
});
