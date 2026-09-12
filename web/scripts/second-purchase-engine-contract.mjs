import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "lib/second-purchase-engine.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const { buildSecondPurchaseOpportunities } = await import(moduleUrl);

const now = new Date("2026-09-12T12:00:00.000Z");
const customer = (overrides = {}) => ({
  user_id: "11111111-1111-4111-8111-111111111111",
  alias: "Primer comprador",
  purchase_count: 1,
  fulfilled_purchase_count: 1,
  creator_gmv_minor: 1500000,
  last_purchase_at: "2026-09-01T12:00:00.000Z",
  last_fulfillment_at: "2026-09-02T12:00:00.000Z",
  ...overrides,
});

const ready = buildSecondPurchaseOpportunities([customer()], [], now);
assert.equal(ready.length, 1);
assert.equal(ready[0].stage, "ready");
assert.equal(ready[0].priority, "high");
assert.equal(ready[0].action, "second_purchase_offer");
assert.equal(ready[0].daysSinceLastPurchase, 11);
assert.equal(ready[0].evidence.pendingFulfillment, false);

const tooRecent = buildSecondPurchaseOpportunities([
  customer({ last_purchase_at: "2026-09-10T12:00:00.000Z", last_fulfillment_at: "2026-09-11T12:00:00.000Z" }),
], [], now);
assert.equal(tooRecent[0].stage, "care");
assert.equal(tooRecent[0].priority, "low");
assert.equal(tooRecent[0].action, "post_purchase_followup");

const followup = buildSecondPurchaseOpportunities([
  customer({ last_purchase_at: "2026-09-06T12:00:00.000Z", last_fulfillment_at: "2026-09-07T12:00:00.000Z" }),
], [], now);
assert.equal(followup[0].stage, "care");
assert.equal(followup[0].priority, "medium");

const dormant = buildSecondPurchaseOpportunities([
  customer({ last_purchase_at: "2026-07-20T12:00:00.000Z", last_fulfillment_at: "2026-07-21T12:00:00.000Z" }),
], [], now);
assert.equal(dormant[0].stage, "win_back");
assert.equal(dormant[0].action, "reactivate_with_value");

const pending = buildSecondPurchaseOpportunities(
  [customer()],
  [{ user_id: "11111111-1111-4111-8111-111111111111" }],
  now,
);
assert.equal(pending.length, 0, "never upsell while paid value is pending fulfillment");

assert.equal(buildSecondPurchaseOpportunities([customer({ fulfilled_purchase_count: 0 })], [], now).length, 0);
assert.equal(buildSecondPurchaseOpportunities([customer({ purchase_count: 2 })], [], now).length, 0);
assert.equal(buildSecondPurchaseOpportunities([customer({ user_id: null })], [], now).length, 0);

const ranked = buildSecondPurchaseOpportunities([
  customer({ user_id: "22222222-2222-4222-8222-222222222222", last_purchase_at: "2026-07-20T12:00:00.000Z" }),
  customer({ user_id: "33333333-3333-4333-8333-333333333333", last_purchase_at: "2026-08-25T12:00:00.000Z" }),
], [], now);
assert.equal(ranked[0].priority, "high");
assert.equal(ranked[0].userId, "33333333-3333-4333-8333-333333333333");

console.log("MARA_SECOND_PURCHASE_ENGINE_CONTRACT PASS");
