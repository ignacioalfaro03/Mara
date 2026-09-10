import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const offers = read("app/api/creator/offers/route.ts");
const fulfillment = read("app/api/creator/fulfillment/route.ts");
const migration = read("supabase/migrations/20260908160000_mara_creator_manual_fulfillment_contract.sql");
const types = read("lib/supabase/database.types.ts");

assert.match(offers, /MANUAL_FULFILLMENT_FAMILIES/);
assert.match(offers, /personalized_digital/);
assert.match(offers, /bounded_interaction/);
assert.match(offers, /creator_manual/);

assert.match(fulfillment, /rpc\/complete_mara_creator_fulfillment/);
assert.doesNotMatch(fulfillment, /serviceRest/);
assert.doesNotMatch(fulfillment, /fulfilled_at:\s*new Date/);

assert.match(migration, /prevent_early_manual_entitlement/);
assert.match(migration, /complete_mara_creator_fulfillment/);
assert.match(migration, /purchase_not_authorized/);
assert.match(migration, /manual_fulfillment_not_required/);
assert.match(migration, /fulfilled_at := null/);
assert.match(types, /complete_mara_creator_fulfillment/);

const productTelemetry = read("lib/product-telemetry.ts");
const telemetryRoute = read("app/api/telemetry/route.ts");
const creatorActivation = read("app/api/creator/me/route.ts");
const creatorWorlds = read("app/api/creator/worlds/route.ts");
const preferences = read("app/api/preferences/route.ts");
const weakness = read("app/api/weakness/route.ts");
const demand = read("app/api/demand/route.ts");
const demandSignal = read("app/api/demand/signal/route.ts");
const testCheckout = read("app/api/commerce/test-checkout/route.ts");
const creatorAction = read("app/api/creator/customers/action/route.ts");
const creatorActions = read("lib/creator-actions.ts");
const creatorHome = read("app/creator/page.tsx");
const worldPage = read("app/world/[slug]/page.tsx");
const historyPage = read("app/me/history/page.tsx");

for (const event of [
  "creator_onboarding_started",
  "creator_activated",
  "creator_world_created",
  "creator_offer_created",
  "creator_opportunity_viewed",
  "creator_next_action_used",
  "world_viewed",
  "taste_signal_created",
  "weakness_saved",
  "demand_created",
  "want_created",
  "pledge_created",
  "commit_created",
  "offer_viewed",
  "purchase_completed",
  "fulfillment_viewed",
  "fulfillment_completed",
  "history_viewed",
  "returning_user",
]) {
  assert.match(productTelemetry, new RegExp(`\\"${event}\\"`), `ProductEvent missing ${event}`);
  assert.match(telemetryRoute, new RegExp(`\\"${event}\\"`), `telemetry allowlist missing ${event}`);
}

assert.match(creatorActivation, /emitProductEvent\(request, "creator_onboarding_started"/);
assert.match(creatorActivation, /emitProductEvent\(request, "creator_activated"/);
assert.match(creatorWorlds, /emitProductEvent\(request, "creator_world_created"/);
assert.match(offers, /emitProductEvent\(request, "creator_offer_created"/);
assert.match(preferences, /emitProductEvent\(request, "taste_signal_created"/);
assert.match(weakness, /emitProductEvent\(request, "weakness_saved"/);
assert.match(demand, /emitProductEvent\(request, "demand_created"/);
assert.match(demand, /emitProductEvent\(request, "want_created"/);
assert.match(demandSignal, /previousLevel !== level/);
assert.match(demandSignal, /"commit_created"/);
assert.match(demandSignal, /"pledge_created"/);
assert.match(demandSignal, /"want_created"/);
assert.match(testCheckout, /emitProductEvent\(request, "purchase_completed"/);
assert.match(fulfillment, /emitProductEvent\(request, "fulfillment_completed"/);
assert.match(fulfillment, /emitProductEvent\(request, "creator_next_action_used"/);
assert.match(creatorAction, /last_creator_action_at/);
assert.match(creatorAction, /emitProductEvent\(request, "creator_next_action_used"/);
assert.match(creatorAction, /normalizeCreatorAction/);
assert.match(creatorAction, /isCreatorActionAcknowledgeable/);
assert.doesNotMatch(creatorAction, /toUpperCase\(\)/);
assert.match(creatorHome, /event="creator_opportunity_viewed"/);
assert.match(creatorHome, /event="fulfillment_viewed"/);
assert.match(creatorHome, /creatorActionTitle/);
assert.match(creatorHome, /normalizeCreatorAction/);
assert.doesNotMatch(creatorHome, /topAction\.action === "FULFILL"/);
assert.match(worldPage, /event="world_viewed"/);
assert.match(worldPage, /event="offer_viewed"/);
assert.match(worldPage, /event="returning_user"/);
assert.match(historyPage, /event="history_viewed"/);
assert.match(historyPage, /event="returning_user"/);

for (const action of ["fulfill", "wait", "post_purchase_followup", "reactivate_with_value", "related_offer", "learn_more", "no_action"]) {
  assert.match(creatorActions, new RegExp(`\\b${action}\\b`), `Creator action contract missing ${action}`);
}
assert.match(creatorActions, /Fulfill this first\./);
assert.match(creatorActions, /No vendas nada ahora\./);
assert.match(creatorActions, /NON_ACKNOWLEDGEABLE_ACTIONS/);

for (const sensitiveKey of ["value_text", "valueText", "description", "title", "user_id", "creator_id", "world_id"]) {
  assert.doesNotMatch(productTelemetry, new RegExp(`\\b${sensitiveKey}\\b`), `Sensitive/free-text telemetry property exposed: ${sensitiveKey}`);
}

console.log("MARA_REAL_APP_WIRING_CONTRACT PASS");
