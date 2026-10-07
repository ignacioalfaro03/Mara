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

function loadTsModule(rel) {
  const source = read(rel);
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      strict: true,
      esModuleInterop: true,
    },
  });
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    console,
    Intl,
    Date,
    Math,
    Number,
    String,
    Array,
    Error,
    RegExp,
    Object,
    BigInt,
    Set,
    Map,
  };
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: rel });
  return module.exports;
}

const engine = loadTsModule("lib/creator-business-control.ts");
const importer = loadTsModule("lib/creator-business-import.ts");

function obs(id, occurredAt, amountMinor, customerKey, source = "MARA", currency = "CLP") {
  return { id, source, occurredAt, amountMinor, currency, customerKey };
}

const bridgeData = [
  obs("a-sep", "2026-09-01T12:00:00-03:00", 100, "A"),
  obs("a-oct", "2026-10-01T12:00:00-03:00", 150, "A"),
  obs("b-sep", "2026-09-02T12:00:00-03:00", 200, "B"),
  obs("c-oct", "2026-10-03T12:00:00-03:00", 300, "C"),
  obs("d-aug", "2026-08-04T12:00:00-03:00", 80, "D"),
  obs("d-oct", "2026-10-04T12:00:00-03:00", 120, "D"),
  obs("e-sep", "2026-09-05T12:00:00-03:00", 200, "E"),
  obs("e-oct", "2026-10-05T12:00:00-03:00", 100, "E"),
  obs("u-sep", "2026-09-05T15:00:00-03:00", 20, null),
  obs("u-oct", "2026-10-05T15:00:00-03:00", 30, null),
];

const bridge = engine.buildRevenueBridge(
  bridgeData,
  "CLP",
  "America/Santiago",
  "2026-09",
  "2026-10",
  10,
  new Date("2026-10-10T23:00:00-03:00"),
);

assert(bridge.startRevenueMinor === 520, "bridge start revenue mismatch");
assert(bridge.endRevenueMinor === 700, "bridge end revenue mismatch");
assert(bridge.newRevenueMinor === 300, "new revenue mismatch");
assert(bridge.reactivatedRevenueMinor === 120, "reactivation revenue mismatch");
assert(bridge.expansionRevenueMinor === 50, "expansion revenue mismatch");
assert(bridge.contractionRevenueMinor === 100, "contraction revenue mismatch");
assert(bridge.lostRevenueMinor === 200, "lost revenue mismatch");
assert(bridge.unassignedDeltaMinor === 10, "unassigned bridge delta mismatch");
assert(bridge.reconciled === true, "revenue bridge must reconcile exactly");

const ramp = engine.buildMonthlyRevenueRamp(
  bridgeData,
  "CLP",
  "America/Santiago",
  new Date("2026-10-10T23:00:00-03:00"),
  3,
);
const october = ramp.find((item) => item.period === "2026-10");
assert(october, "october ramp bucket missing");
assert(october.activeCustomers === 4, "october active customers mismatch");
assert(october.newCustomers === 1, "october new customers mismatch");
assert(october.repeatCustomers === 3, "october repeat customers mismatch");
assert(october.reactivatedCustomers === 1, "october reactivated customers mismatch");
assert(october.newRevenueMinor === 300, "october new revenue mismatch");
assert(october.repeatRevenueMinor === 250, "october retained repeat revenue mismatch");
assert(october.reactivatedRevenueMinor === 120, "october reactivated revenue mismatch");

const healthData = [
  obs("risk-1", "2026-08-01T12:00:00-03:00", 1000, "risk"),
  obs("risk-2", "2026-08-11T12:00:00-03:00", 1200, "risk"),
  obs("risk-3", "2026-08-21T12:00:00-03:00", 1100, "risk"),
  obs("healthy-1", "2026-10-10T12:00:00-03:00", 700, "healthy"),
  obs("healthy-2", "2026-10-20T12:00:00-03:00", 800, "healthy"),
  obs("healthy-3", "2026-10-30T12:00:00-03:00", 900, "healthy"),
  obs("first-1", "2026-10-15T12:00:00-03:00", 500, "first"),
  obs("react-1", "2026-07-01T12:00:00-03:00", 600, "react"),
  obs("react-2", "2026-07-11T12:00:00-03:00", 650, "react"),
  obs("react-3", "2026-10-29T12:00:00-03:00", 700, "react"),
];

const risk = engine.buildCustomerHealth(
  healthData,
  "CLP",
  "America/Santiago",
  new Date("2026-10-31T12:00:00-03:00"),
);
const riskCustomer = risk.customers.find((item) => item.customerKey === "risk");
const healthyCustomer = risk.customers.find((item) => item.customerKey === "healthy");
const firstCustomer = risk.customers.find((item) => item.customerKey === "first");
const reactivatedCustomer = risk.customers.find((item) => item.customerKey === "react");

assert(riskCustomer?.state === "DORMANT", "repeat buyer should become dormant outside cadence");
assert((riskCustomer?.revenueAtRiskMinor ?? 0) > 0, "dormant repeat buyer must carry explainable revenue at risk");
assert(healthyCustomer?.state === "HEALTHY", "recent repeat buyer should be healthy");
assert(firstCustomer?.state === "FIRST_TIME" && firstCustomer?.confidence === "low", "one-purchase customer must stay low-confidence first-time");
assert(reactivatedCustomer?.state === "REACTIVATED", "long-gap returning customer should be reactivated");
assert(risk.revenueAtRiskMinor === riskCustomer.revenueAtRiskMinor, "risk amount should include only explainable out-of-cadence repeat buyers");

const concentrated = engine.buildRevenueConcentration(
  [
    obs("x1", "2026-10-05T12:00:00-03:00", 800, "whale"),
    obs("x2", "2026-10-05T13:00:00-03:00", 100, "b"),
    obs("x3", "2026-10-05T14:00:00-03:00", 100, "c"),
  ],
  "CLP",
  "America/Santiago",
  new Date("2026-10-06T12:00:00-03:00"),
);
assert(concentrated.top1Share === 0.8, "top customer concentration mismatch");

const settings = {
  currency: "CLP",
  monthlyRevenueGoalMinor: 100_000,
  monthlyFixedCostsMinor: 10_000,
  variableCostRateBps: 2_000,
  timeZone: "America/Santiago",
};
const actionHealth = engine.buildCreatorBusinessHealth(
  healthData,
  settings,
  new Date("2026-10-31T12:00:00-03:00"),
  [{ customerKey: "risk", action: "wait", reason: "Hubo contacto reciente.", priority: "low" }],
);
assert(actionHealth.mainAction.action === "wait", "business layer must reuse existing Creator OS action when available");
assert(actionHealth.mainAction.source === "CREATOR_OS_NEXT_BEST_ACTION", "business action source mismatch");

const mixed = engine.buildMonthlyRevenueRamp(
  [...bridgeData, obs("usd", "2026-10-02T12:00:00-03:00", 999_999, "usd-user", "ONLYFANS", "USD")],
  "CLP",
  "America/Santiago",
  new Date("2026-10-10T23:00:00-03:00"),
  1,
)[0];
assert(mixed.revenueMinor === 700, "multi-currency revenue must never be silently combined");

const csv = [
  "source,source_record_id,occurred_at,customer_external_id,event_type,gross_amount,currency",
  "ONLYFANS,r1,2026-10-01T12:00:00Z,fan-a,SALE,100.50,USD",
  "ONLYFANS,r1,2026-10-01T12:00:00Z,fan-a,SALE,100.50,USD",
  "ARSMATE,r2,2026-10-02T12:00:00Z,fan-b,REFUND,10,CLP",
  "MARA,r3,2026-10-02T12:00:00Z,fan-c,SALE,20,CLP",
].join("\n");

const preview = importer.parseCanonicalRevenueCsv(csv, new Date("2026-10-06T12:00:00Z"));
assert(preview.rows.length === 2, "CSV parser accepted/rejected row count mismatch");
assert(preview.duplicates.length === 1, "CSV stable-source dedupe mismatch");
assert(preview.errors.length === 1 && preview.errors[0].code === "INVALID_SOURCE", "CSV must reject MARA as an imported external source");
assert(preview.rows[0].grossAmountMinor === 10_050, "exact decimal-to-minor conversion mismatch");
assert(preview.summaryByCurrency.length === 2, "multi-currency import summary must stay separated");
assert(preview.provenanceType === "CSV_IMPORT", "CSV provenance missing");

const invalidCsv = importer.parseCanonicalRevenueCsv(
  "source,source_record_id,occurred_at,event_type,gross_amount,currency\nONLYFANS,r1,2026-10-01T12:00:00Z,SALE,10,USD",
  new Date("2026-10-06T12:00:00Z"),
);
assert(invalidCsv.errors[0]?.code === "MISSING_HEADERS", "missing canonical headers must fail");

const engineSource = read("lib/creator-business-control.ts");
assert(!engineSource.includes("readWeakness"), "business intelligence must not depend on private weakness fields");
assert(!engineSource.includes("user_declared_preferences"), "business intelligence must not infer risk from declared intimate preferences");

const importSql = read("supabase/prepared/creator_business_external_import_foundation.sql");
for (const table of ["creator_external_sources", "creator_import_batches", "creator_external_revenue_events"]) {
  assert(importSql.includes(`alter table public.${table} enable row level security`), `RLS missing for ${table}`);
}
assert(!/grant\s+.+\s+to\s+anon/i.test(importSql), "external business data must not grant anon access");
assert(importSql.includes("unique (creator_id, source, source_record_id)"), "database dedupe contract missing");

const page = read("app/creator/business/page.tsx");
assert(page.includes("buildCreatorBusinessHealth"), "business surface must consume canonical P1 health snapshot");
assert(page.includes("REVENUE AT RISK"), "revenue-at-risk surface missing");
assert(page.includes("REVENUE BRIDGE"), "revenue bridge surface missing");
assert(!page.includes("syntheticFans"), "P1 UI must not use synthetic creator economics");

console.log("CREATOR_BUSINESS_P1_CONTRACT PASS", {
  bridge: {
    start: bridge.startRevenueMinor,
    end: bridge.endRevenueMinor,
    reconciled: bridge.reconciled,
  },
  ramp: {
    activeCustomers: october.activeCustomers,
    newCustomers: october.newCustomers,
    repeatCustomers: october.repeatCustomers,
    reactivatedCustomers: october.reactivatedCustomers,
  },
  risk: {
    revenueAtRiskMinor: risk.revenueAtRiskMinor,
    dormantCustomers: risk.dormantCustomers,
  },
  import: {
    accepted: preview.rows.length,
    duplicates: preview.duplicates.length,
    errors: preview.errors.length,
  },
});
