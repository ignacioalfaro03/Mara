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

console.log("MARA_REAL_APP_WIRING_CONTRACT PASS");
