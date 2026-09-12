import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");

const contract = read("../docs/product/CREATOR_MONETIZATION_ENGINE.md");
const draft = read("supabase/drafts/mara_creator_monetization_engine_v1.sql");
const migration = read("supabase/migrations/20260912191000_mara_creator_monetization_engine_v1.sql");
const preferencesApi = read("app/api/preferences/route.ts");
const tastePage = read("app/c/[slug]/taste/page.tsx");
const requestPage = read("app/c/[slug]/request/page.tsx");
const storefront = read("app/c/[slug]/page.tsx");
const offerPage = read("app/c/[slug]/offers/[offerSlug]/page.tsx");
const auctionPage = read("app/c/[slug]/auctions/page.tsx");
const creatorHub = read("app/creator/monetization/page.tsx");
const checkoutApi = read("app/api/commerce/checkout/route.ts");
const wishApi = read("app/api/creator/wishes/route.ts");
const auctionBidApi = read("app/api/commerce/auctions/bid/route.ts");
const auctionCreatorApi = read("app/api/creator/auctions/route.ts");
const paidInteractionApi = read("app/api/creator/paid-interactions/route.ts");

for (const mechanism of [
  "FIXED_PRICE",
  "AUCTION",
  "WISH",
  "CUSTOM_REQUEST",
  "LIMITED_DROP",
  "MEMBERSHIP",
  "PAID_INTERACTION",
]) {
  assert.match(contract, new RegExp(`\\b${mechanism}\\b`), `missing mechanism ${mechanism}`);
  assert.match(migration, new RegExp(`'${mechanism}'`), `migration missing mechanism ${mechanism}`);
}
assert.match(contract, /No pay-per-bid, bid-fee, lottery or gambling mechanics/i);
assert.match(contract, /NOT PAYMENT READY/);
assert.match(contract, /creators with an existing audience/i);

// The old draft stays explicitly non-applying for audit/history, while the current
// executable architecture is represented by the versioned migration below.
assert.match(draft, /DRAFT ONLY \/ DO NOT APPLY DIRECTLY/);
assert.match(draft, /rollback;/i, "historical draft must remain non-applying by design");
assert.doesNotMatch(draft, /create table if not exists public\.creator_taste_choices/i, "must reuse preference_events instead of creating a second Taste silo");

assert.doesNotMatch(migration, /\brollback\s*;/i, "versioned migration must not silently roll itself back");
assert.match(migration, /create table if not exists public\.creator_auctions/i);
assert.match(migration, /create table if not exists public\.creator_auction_bids/i);
assert.match(migration, /for update;/i, "auction bid write must lock current auction state");
assert.match(migration, /create or replace function public\.place_creator_auction_bid_v1/i);
assert.match(migration, /create or replace function public\.finalize_creator_auction_v1/i);
assert.match(migration, /security invoker/i, "auction RPCs must not bypass RLS through SECURITY DEFINER");
assert.match(migration, /revoke execute on function public\.place_creator_auction_bid_v1[\s\S]*from public, anon, authenticated/i);
assert.match(migration, /grant execute on function public\.place_creator_auction_bid_v1[\s\S]*to service_role/i);
assert.match(migration, /revoke execute on function public\.finalize_creator_auction_v1[\s\S]*from public, anon, authenticated/i);
assert.match(migration, /grant execute on function public\.finalize_creator_auction_v1[\s\S]*to service_role/i);
assert.match(migration, /revoke all on table public\.creator_auctions from anon, authenticated/i);
assert.match(migration, /revoke all on table public\.creator_auction_bids from anon, authenticated/i);
assert.match(migration, /creator_auctions_browser_deny/i);
assert.match(migration, /creator_auction_bids_browser_deny/i);
assert.match(migration, /bid is free, not settled money and not a purchase/i);
assert.match(migration, /Finalization creates only winner state, never checkout\/payment\/purchase/i);
assert.match(migration, /preference_events/i);
assert.doesNotMatch(migration, /create table if not exists public\.creator_taste_choices/i, "versioned schema must reuse preference_events instead of creating a second Taste silo");

for (const group of [
  "creator_format_v1",
  "creator_personalization_v1",
  "creator_length_v1",
  "creator_offer_style_v1",
]) {
  assert.match(preferencesApi, new RegExp(group), `preferences API missing ${group}`);
}
assert.match(preferencesApi, /signal_scope:\s*body\.signalScope === "creator_world" \? "creator_world" : "network"/);
assert.match(preferencesApi, /safeLocalReturn\(body\.returnTo, "\/"\)/, "Revenue OS preference fallback must not return to legacy /experience");

assert.match(tastePage, /name="signalScope" value="creator_world"/);
assert.match(tastePage, /Preferencias, no vulnerabilidades\./);
assert.match(tastePage, /no generan ningún cobro/i);
assert.doesNotMatch(tastePage, /Mara Vera/i);

assert.match(requestPage, /Solicitud ≠ compra\./);
assert.match(requestPage, /no genera ningún cobro/i);
assert.match(storefront, /href=\{`\/c\/\$\{slug\}\/request`\}/);
assert.match(storefront, /href=\{`\/c\/\$\{slug\}\/taste`\}/);

// Wishes use the canonical variable-amount commerce spine, never a parallel
// donation ledger or browser-authoritative payment state.
assert.match(wishApi, /type:\s*"open_contribution"/);
assert.match(wishApi, /price_mode:\s*"custom_amount"/);
assert.match(wishApi, /mechanism:\s*"WISH"/);
assert.match(wishApi, /commerce_goals/);
assert.match(wishApi, /serviceRest<OfferRow\[]>/);

// Auction browser routes must remain server mediated. The verified user id is
// supplied by authenticated server code; the database RPC itself is service-only.
assert.match(auctionBidApi, /getVerifiedSession/);
assert.match(auctionBidApi, /place_creator_auction_bid_v1/);
assert.match(auctionBidApi, /serviceRest/);
assert.match(auctionCreatorApi, /productCapability\("auctions"\)/);
assert.match(auctionCreatorApi, /creator_auctions/);

// Winner handoff is explicit and private: finalization may create a private offer,
// but a bid itself still never becomes payment/purchase. Checkout re-verifies the
// authoritative auction before creating a signed-test intent.
assert.match(auctionCreatorApi, /ensureAuctionWinnerOffer/);
assert.match(auctionCreatorApi, /visibility:\s*"private_user"/);
assert.match(auctionCreatorApi, /buyer_user_id:\s*winnerUserId/);
assert.match(auctionCreatorApi, /auction_id:\s*auction\.id/);
assert.match(auctionCreatorApi, /signed_test_handoff_v1:\s*true/);
assert.match(auctionCreatorApi, /auction_winner_offer_create_failed/);
assert.match(checkoutApi, /verifyAuctionCheckout/);
assert.match(checkoutApi, /auction\.status !== "ended"/);
assert.match(checkoutApi, /auction\.winner_user_id !== userId/);
assert.match(checkoutApi, /auction\.current_bid_minor\) !== amountMinor/);
assert.match(checkoutApi, /auction_scoped:\s*Boolean\(auctionIdFromOffer\(offer\)\)/);
assert.match(offerPage, /getVerifiedSession/);
assert.match(offerPage, /readWorldOffers\(profile\.id, session\.ok \? session\.accessToken : undefined\)/);
assert.match(offerPage, /ADJUDICACIÓN PRIVADA/);
assert.match(auctionPage, /Ganaste esta subasta\./);
assert.match(auctionPage, /Completar adjudicación/);
assert.match(auctionPage, /pagos reales siguen bloqueados/i);

// Paid interaction sends a canonical offer into an existing authorized thread.
// Chat itself does not become an implicit per-message charge.
assert.match(paidInteractionApi, /productCapability\("paid_interactions"\)/);
assert.match(paidInteractionApi, /productCapability\("messaging"\)/);
assert.match(paidInteractionApi, /PAID_INTERACTION_FAMILIES/);
assert.match(paidInteractionApi, /creator_threads/);
assert.match(paidInteractionApi, /offer_id:\s*offer\.id/);
assert.doesNotMatch(paidInteractionApi, /amount_minor\s*:/i, "paid-interaction send route must not invent or override the offer price");

assert.match(creatorHub, /MARA FREE/);
assert.match(creatorHub, /MARA PLUS/);
assert.match(creatorHub, /Pagos reales siguen bloqueados\./);
assert.doesNotMatch(creatorHub, /Mara Vera/i);

console.log("MARA_CREATOR_MONETIZATION_SURFACE_CONTRACT PASS");