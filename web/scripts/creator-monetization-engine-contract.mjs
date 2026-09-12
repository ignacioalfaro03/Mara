import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "lib/commerce/creator-monetization-engine.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const {
  minimumAcceptedBidMinor,
  validateAuctionBid,
  calculateWishProgress,
  validateCreatorRequestTransition,
  normalizeTasteChoice,
  buildMonetizationOpportunities,
} = await import(moduleUrl);

const auction = (overrides = {}) => ({
  id: "auction-1",
  creatorId: "creator-1",
  currency: "CLP",
  status: "active",
  startsAt: "2026-09-12T10:00:00.000Z",
  endsAt: "2026-09-12T12:00:00.000Z",
  startingBidMinor: 2_000_000,
  minimumIncrementMinor: 500_000,
  currentBidMinor: null,
  currentBidderUserId: null,
  antiSnipingWindowSeconds: 120,
  antiSnipingExtensionSeconds: 120,
  ...overrides,
});

const attempt = (overrides = {}) => ({
  auctionId: "auction-1",
  creatorId: "creator-1",
  bidderUserId: "user-1",
  amountMinor: 2_000_000,
  idempotencyKey: "bid-1",
  placedAt: "2026-09-12T11:30:00.000Z",
  ...overrides,
});

assert.equal(minimumAcceptedBidMinor(auction()), 2_000_000);
assert.equal(minimumAcceptedBidMinor(auction({ currentBidMinor: 3_000_000 })), 3_500_000);

const firstBid = validateAuctionBid(auction(), attempt());
assert.equal(firstBid.ok, true);
assert.equal(firstBid.minimumAcceptedBidMinor, 2_000_000);
assert.equal(firstBid.shouldExtend, false);
assert.equal(firstBid.nextEndsAt, "2026-09-12T12:00:00.000Z");

const tooLow = validateAuctionBid(
  auction({ currentBidMinor: 3_000_000 }),
  attempt({ amountMinor: 3_499_999 }),
);
assert.equal(tooLow.ok, false);
assert.equal(tooLow.code, "BID_TOO_LOW");
assert.equal(tooLow.minimumAcceptedBidMinor, 3_500_000);

const antiSnipe = validateAuctionBid(
  auction({ currentBidMinor: 3_000_000 }),
  attempt({ amountMinor: 3_500_000, placedAt: "2026-09-12T11:59:00.000Z" }),
);
assert.equal(antiSnipe.ok, true);
assert.equal(antiSnipe.shouldExtend, true);
assert.equal(antiSnipe.nextEndsAt, "2026-09-12T12:02:00.000Z");

const ended = validateAuctionBid(auction(), attempt({ placedAt: "2026-09-12T12:00:00.000Z" }));
assert.equal(ended.ok, false);
assert.equal(ended.code, "AUCTION_ENDED");

const mismatched = validateAuctionBid(auction(), attempt({ creatorId: "creator-2" }));
assert.equal(mismatched.ok, false);
assert.equal(mismatched.code, "AUCTION_MISMATCH");

assert.throws(() => minimumAcceptedBidMinor(auction({ minimumIncrementMinor: 0 })));

const wish = calculateWishProgress(10_000_000, [
  { userId: "u1", amountMinor: 2_500_000, status: "succeeded" },
  { userId: "u1", amountMinor: 500_000, status: "succeeded" },
  { userId: "u2", amountMinor: 1_000_000, status: "succeeded" },
  { userId: "u3", amountMinor: 9_000_000, status: "refunded" },
  { userId: "u4", amountMinor: 9_000_000, status: "failed" },
]);
assert.equal(wish.fundedAmountMinor, 4_000_000);
assert.equal(wish.remainingAmountMinor, 6_000_000);
assert.equal(wish.progressPercent, 40);
assert.equal(wish.succeededContributionCount, 3);
assert.equal(wish.uniqueSupporterCount, 2);

assert.equal(validateCreatorRequestTransition("requested", "countered", "creator").ok, true);
assert.equal(validateCreatorRequestTransition("countered", "accepted", "customer").ok, true);
assert.equal(validateCreatorRequestTransition("countered", "accepted", "creator").ok, false);
assert.equal(validateCreatorRequestTransition("accepted", "paid", "creator").ok, false);
assert.equal(validateCreatorRequestTransition("payment_pending", "paid", "system").ok, true);
assert.equal(validateCreatorRequestTransition("paid", "in_progress", "creator").ok, true);
assert.equal(validateCreatorRequestTransition("delivered", "completed", "customer").ok, true);
assert.equal(validateCreatorRequestTransition("completed", "requested", "customer").ok, false);

const taste = normalizeTasteChoice({
  creatorId: "creator-1",
  userId: "user-1",
  promptId: "style-1",
  selectedOptionId: "option-a",
  presentedOptionIds: ["option-a", "option-b"],
  source: "fan_web",
  version: "v1",
  occurredAt: "2026-09-12T12:00:00.000Z",
});
assert.equal(taste.type, "TASTE_CHOICE");
assert.throws(() => normalizeTasteChoice({
  ...taste,
  selectedOptionId: "option-c",
}));

const auctionOpportunities = buildMonetizationOpportunities({
  auctionSignals: [
    {
      creatorId: "creator-1",
      auctionId: "auction-a",
      userId: "user-high",
      bidAmountMinor: 8_500_000,
      winningBidMinor: 10_000_000,
      won: false,
      occurredAt: "2026-09-12T12:00:00.000Z",
    },
    {
      creatorId: "creator-1",
      auctionId: "auction-a",
      userId: "user-medium",
      bidAmountMinor: 4_000_000,
      winningBidMinor: 10_000_000,
      won: false,
      occurredAt: "2026-09-12T12:00:00.000Z",
    },
    {
      creatorId: "creator-1",
      auctionId: "auction-a",
      userId: "winner",
      bidAmountMinor: 10_000_000,
      winningBidMinor: 10_000_000,
      won: true,
      occurredAt: "2026-09-12T12:00:00.000Z",
    },
  ],
});
assert.equal(auctionOpportunities.length, 2);
assert.equal(auctionOpportunities[0].type, "HIGH_INTENT_BIDDER");
assert.equal(auctionOpportunities[0].priority, "high");
assert.equal(auctionOpportunities[1].type, "AUCTION_LOSER");
assert.equal(auctionOpportunities[0].evidence.bidToWinningPriceRatioBps, 8500);

const requestOpportunities = buildMonetizationOpportunities({
  requestSignals: [
    { creatorId: "creator-1", requestId: "r1", userId: "u1", normalizedRequestKey: "custom audio", offeredAmountMinor: 1_000_000, status: "requested", occurredAt: "2026-09-10T12:00:00.000Z" },
    { creatorId: "creator-1", requestId: "r2", userId: "u2", normalizedRequestKey: "custom audio", offeredAmountMinor: 1_500_000, status: "requested", occurredAt: "2026-09-11T12:00:00.000Z" },
    { creatorId: "creator-1", requestId: "r3", userId: "u3", normalizedRequestKey: "CUSTOM AUDIO", offeredAmountMinor: 2_000_000, status: "requested", occurredAt: "2026-09-12T12:00:00.000Z" },
  ],
});
assert.equal(requestOpportunities.length, 1);
assert.equal(requestOpportunities[0].type, "REPEATED_REQUEST");
assert.equal(requestOpportunities[0].evidence.distinctCustomerCount, 3);
assert.equal(requestOpportunities[0].evidence.highestObservedOfferMinor, 2_000_000);

const repeatSupporter = buildMonetizationOpportunities({
  wishSignals: [
    { creatorId: "creator-1", wishId: "wish-a", userId: "supporter", amountMinor: 500_000, status: "succeeded", occurredAt: "2026-09-01T12:00:00.000Z" },
    { creatorId: "creator-1", wishId: "wish-b", userId: "supporter", amountMinor: 700_000, status: "succeeded", occurredAt: "2026-09-10T12:00:00.000Z" },
    { creatorId: "creator-1", wishId: "wish-b", userId: "refund-only", amountMinor: 900_000, status: "refunded", occurredAt: "2026-09-10T12:00:00.000Z" },
  ],
});
assert.equal(repeatSupporter.length, 1);
assert.equal(repeatSupporter[0].type, "WISH_REPEAT_SUPPORTER");
assert.equal(repeatSupporter[0].evidence.contributionCount, 2);
assert.equal(repeatSupporter[0].evidence.totalContributionMinor, 1_200_000);

assert.doesNotMatch(source, /weakness|vulnerability|psychographic/i);
assert.match(source, /server-authoritative|server-authoritative|server-authoritative/i);

console.log("MARA_CREATOR_MONETIZATION_ENGINE_CONTRACT PASS");
