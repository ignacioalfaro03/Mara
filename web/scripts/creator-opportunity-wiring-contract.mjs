import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const live = read("lib/creator-monetization-live.ts");
const dashboard = read("lib/mara-real-data.ts");
const actions = read("lib/creator-actions.ts");

// Auction bid identities remain server-side. Creator OS consumes only derived,
// creator-scoped opportunities rather than exposing raw bidder tables to browser clients.
assert.match(live, /serviceRest<AuctionBidRow\[]>/);
assert.match(live, /creator_auction_bids\?select=/);
assert.match(live, /creator_id=eq\.\$\{encodeURIComponent\(creatorId\)\}/);
assert.match(live, /highestByUser/);
assert.match(live, /bid\.amount_minor > previous\.amount_minor/);
assert.match(live, /won:\s*auction\.winner_user_id === bid\.user_id/);

// Requests use explicit product categories, not free-text psychographic inference.
assert.match(live, /normalizedRequestKey:\s*key/);
assert.match(live, /row\.category\?\.trim\(\)\.toLowerCase\(\)/);
assert.match(live, /NON_DEMAND_REQUEST_STATES/);
assert.doesNotMatch(live, /weakness|vulnerability|psychographic/i);

// Wish opportunity evidence comes only from persisted contribution status/amount.
assert.match(live, /commerce_contributions/);
assert.match(live, /status:\s*row\.status/);
assert.match(live, /buildWishSignals/);

// The live adapter must feed the deterministic engine, not invent a second scoring system.
assert.match(live, /buildMonetizationOpportunities\(\{ auctionSignals, requestSignals, wishSignals \}\)/);
assert.match(live, /HIGH_INTENT_BIDDER/);
assert.match(live, /REPEATED_REQUEST/);
assert.match(live, /WISH_REPEAT_SUPPORTER/);

// Creator dashboard mixes Second Purchase + monetization intelligence and suppresses
// stale persisted per-user suggestions whenever current evidence exists.
assert.match(dashboard, /readLiveMonetizationOpportunities/);
assert.match(dashboard, /monetizationNextActions/);
assert.match(dashboard, /opportunity_type:\s*item\.type/);
assert.match(dashboard, /creator_monetization_engine_v1|item\.source/);
assert.match(dashboard, /derivedUserIds/);
assert.match(dashboard, /!derivedUserIds\.has\(item\.user_id\)/);
assert.match(dashboard, /monetizationOpportunities,/);

for (const action of ["follow_up_bidder", "consider_offer_from_demand", "recognize_repeat_supporter"]) {
  assert.match(actions, new RegExp(`${action}:`), `creator action registry missing ${action}`);
}

console.log("MARA_CREATOR_OPPORTUNITY_WIRING_CONTRACT PASS");