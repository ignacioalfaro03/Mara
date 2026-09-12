export type CommerceMechanism =
  | "FIXED_PRICE"
  | "AUCTION"
  | "WISH"
  | "CUSTOM_REQUEST"
  | "LIMITED_DROP"
  | "MEMBERSHIP"
  | "PAID_INTERACTION";

export type AuctionStatus = "draft" | "scheduled" | "active" | "ended" | "cancelled";

export type AuctionSnapshot = {
  id: string;
  creatorId: string;
  currency: string;
  status: AuctionStatus;
  startsAt: string;
  endsAt: string;
  startingBidMinor: number;
  minimumIncrementMinor: number;
  currentBidMinor: number | null;
  currentBidderUserId: string | null;
  antiSnipingWindowSeconds: number;
  antiSnipingExtensionSeconds: number;
};

export type AuctionBidAttempt = {
  auctionId: string;
  creatorId: string;
  bidderUserId: string;
  amountMinor: number;
  idempotencyKey: string;
  placedAt: string;
};

export type AuctionBidDecision =
  | {
      ok: true;
      minimumAcceptedBidMinor: number;
      acceptedAmountMinor: number;
      shouldExtend: boolean;
      nextEndsAt: string;
    }
  | {
      ok: false;
      code:
        | "AUCTION_NOT_ACTIVE"
        | "AUCTION_NOT_STARTED"
        | "AUCTION_ENDED"
        | "AUCTION_MISMATCH"
        | "INVALID_AMOUNT"
        | "BID_TOO_LOW"
        | "INVALID_TIMESTAMP";
      minimumAcceptedBidMinor: number;
    };

export type WishContribution = {
  userId: string;
  amountMinor: number;
  status: "succeeded" | "refunded" | "failed";
};

export type WishProgress = {
  targetAmountMinor: number;
  fundedAmountMinor: number;
  remainingAmountMinor: number;
  progressPercent: number;
  succeededContributionCount: number;
  uniqueSupporterCount: number;
};

export type CreatorRequestStatus =
  | "requested"
  | "reviewing"
  | "countered"
  | "accepted"
  | "payment_pending"
  | "paid"
  | "in_progress"
  | "delivered"
  | "completed"
  | "declined"
  | "cancelled"
  | "refunded";

export type CreatorRequestActor = "customer" | "creator" | "system";

export type CreatorRequestTransitionDecision = {
  ok: boolean;
  from: CreatorRequestStatus;
  to: CreatorRequestStatus;
  actor: CreatorRequestActor;
  reason: string;
};

export type TasteChoiceInput = {
  creatorId: string | null;
  userId: string;
  promptId: string;
  selectedOptionId: string;
  presentedOptionIds: readonly string[];
  source: string;
  version: string;
  occurredAt: string;
};

export type TasteChoiceEvent = TasteChoiceInput & {
  type: "TASTE_CHOICE";
};

export type AuctionOutcomeSignal = {
  creatorId: string;
  auctionId: string;
  userId: string;
  bidAmountMinor: number;
  winningBidMinor: number;
  won: boolean;
  occurredAt: string;
};

export type RequestDemandSignal = {
  creatorId: string;
  requestId: string;
  userId: string;
  normalizedRequestKey: string;
  offeredAmountMinor: number | null;
  status: CreatorRequestStatus;
  occurredAt: string;
};

export type WishSupportSignal = {
  creatorId: string;
  wishId: string;
  userId: string;
  amountMinor: number;
  status: "succeeded" | "refunded" | "failed";
  occurredAt: string;
};

export type MonetizationOpportunity = {
  creatorId: string;
  userId: string | null;
  type: "AUCTION_LOSER" | "HIGH_INTENT_BIDDER" | "REPEATED_REQUEST" | "WISH_REPEAT_SUPPORTER";
  priority: "high" | "medium";
  action: "follow_up_bidder" | "consider_offer_from_demand" | "recognize_repeat_supporter";
  reason: string;
  evidence: Record<string, string | number | boolean | null>;
  source: "creator_monetization_engine_v1";
};

function isPositiveMinor(value: number) {
  return Number.isSafeInteger(value) && value > 0;
}

function parseIso(value: string) {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export function minimumAcceptedBidMinor(auction: Pick<AuctionSnapshot, "startingBidMinor" | "minimumIncrementMinor" | "currentBidMinor">) {
  if (!isPositiveMinor(auction.startingBidMinor) || !isPositiveMinor(auction.minimumIncrementMinor)) {
    throw new Error("Auction money configuration must use positive safe integer minor units.");
  }

  return auction.currentBidMinor === null
    ? auction.startingBidMinor
    : auction.currentBidMinor + auction.minimumIncrementMinor;
}

/**
 * Pure bid decision only. The persistence layer MUST re-evaluate equivalent rules
 * against locked/current state inside one transaction/RPC to prevent race conditions.
 * A scheduled auction becomes bid-eligible once its startsAt is reached; the atomic
 * RPC promotes it to active while accepting the first valid bid.
 */
export function validateAuctionBid(
  auction: AuctionSnapshot,
  attempt: AuctionBidAttempt,
): AuctionBidDecision {
  const minimum = minimumAcceptedBidMinor(auction);

  if (auction.id !== attempt.auctionId || auction.creatorId !== attempt.creatorId) {
    return { ok: false, code: "AUCTION_MISMATCH", minimumAcceptedBidMinor: minimum };
  }

  if (!isPositiveMinor(attempt.amountMinor)) {
    return { ok: false, code: "INVALID_AMOUNT", minimumAcceptedBidMinor: minimum };
  }

  const startsAtMs = parseIso(auction.startsAt);
  const endsAtMs = parseIso(auction.endsAt);
  const placedAtMs = parseIso(attempt.placedAt);
  if (startsAtMs === null || endsAtMs === null || placedAtMs === null || endsAtMs <= startsAtMs) {
    return { ok: false, code: "INVALID_TIMESTAMP", minimumAcceptedBidMinor: minimum };
  }

  if (auction.status !== "active" && auction.status !== "scheduled") {
    return { ok: false, code: "AUCTION_NOT_ACTIVE", minimumAcceptedBidMinor: minimum };
  }

  if (placedAtMs < startsAtMs) {
    return { ok: false, code: "AUCTION_NOT_STARTED", minimumAcceptedBidMinor: minimum };
  }

  if (placedAtMs >= endsAtMs) {
    return { ok: false, code: "AUCTION_ENDED", minimumAcceptedBidMinor: minimum };
  }

  if (attempt.amountMinor < minimum) {
    return { ok: false, code: "BID_TOO_LOW", minimumAcceptedBidMinor: minimum };
  }

  const remainingSeconds = Math.max(0, Math.floor((endsAtMs - placedAtMs) / 1000));
  const safeWindowSeconds = Math.max(0, Math.floor(auction.antiSnipingWindowSeconds));
  const safeExtensionSeconds = Math.max(0, Math.floor(auction.antiSnipingExtensionSeconds));
  const shouldExtend = safeWindowSeconds > 0
    && safeExtensionSeconds > 0
    && remainingSeconds <= safeWindowSeconds;
  const nextEndsAt = new Date(shouldExtend ? endsAtMs + safeExtensionSeconds * 1000 : endsAtMs).toISOString();

  return {
    ok: true,
    minimumAcceptedBidMinor: minimum,
    acceptedAmountMinor: attempt.amountMinor,
    shouldExtend,
    nextEndsAt,
  };
}

export function calculateWishProgress(
  targetAmountMinor: number,
  contributions: readonly WishContribution[],
): WishProgress {
  if (!isPositiveMinor(targetAmountMinor)) {
    throw new Error("Wish target must be a positive safe integer in minor units.");
  }

  const succeeded = contributions.filter((item) => item.status === "succeeded" && isPositiveMinor(item.amountMinor));
  const fundedAmountMinor = succeeded.reduce((sum, item) => sum + item.amountMinor, 0);
  const uniqueSupporterCount = new Set(succeeded.map((item) => item.userId).filter(Boolean)).size;

  return {
    targetAmountMinor,
    fundedAmountMinor,
    remainingAmountMinor: Math.max(0, targetAmountMinor - fundedAmountMinor),
    progressPercent: Math.min(100, Math.floor((fundedAmountMinor / targetAmountMinor) * 100)),
    succeededContributionCount: succeeded.length,
    uniqueSupporterCount,
  };
}

const requestTransitions: Record<CreatorRequestStatus, Partial<Record<CreatorRequestStatus, readonly CreatorRequestActor[]>>> = {
  requested: {
    reviewing: ["creator"],
    accepted: ["creator"],
    countered: ["creator"],
    declined: ["creator"],
    cancelled: ["customer"],
  },
  reviewing: {
    accepted: ["creator"],
    countered: ["creator"],
    declined: ["creator"],
    cancelled: ["customer"],
  },
  countered: {
    accepted: ["customer"],
    declined: ["customer"],
    cancelled: ["customer"],
  },
  accepted: {
    payment_pending: ["system"],
    cancelled: ["creator", "customer"],
  },
  payment_pending: {
    paid: ["system"],
    cancelled: ["system", "creator", "customer"],
  },
  paid: {
    in_progress: ["creator"],
    refunded: ["system"],
  },
  in_progress: {
    delivered: ["creator"],
    refunded: ["system"],
  },
  delivered: {
    completed: ["customer", "creator", "system"],
    refunded: ["system"],
  },
  completed: {
    refunded: ["system"],
  },
  declined: {},
  cancelled: {},
  refunded: {},
};

export function validateCreatorRequestTransition(
  from: CreatorRequestStatus,
  to: CreatorRequestStatus,
  actor: CreatorRequestActor,
): CreatorRequestTransitionDecision {
  const allowedActors = requestTransitions[from]?.[to] ?? [];
  const ok = allowedActors.includes(actor);

  return {
    ok,
    from,
    to,
    actor,
    reason: ok
      ? "Transition is allowed by the creator-request commercial lifecycle."
      : "Transition is not allowed for this actor/state pair; request state must remain server-authoritative.",
  };
}

export function normalizeTasteChoice(input: TasteChoiceInput): TasteChoiceEvent {
  if (!input.userId || !input.promptId || !input.selectedOptionId || !input.source || !input.version) {
    throw new Error("Taste choices require explicit user, prompt, selection, source and version.");
  }
  if (!input.presentedOptionIds.includes(input.selectedOptionId)) {
    throw new Error("Selected option must be one of the options that were actually presented.");
  }
  if (parseIso(input.occurredAt) === null) {
    throw new Error("Taste choice occurredAt must be a valid ISO-compatible timestamp.");
  }

  return { ...input, type: "TASTE_CHOICE" };
}

export function buildMonetizationOpportunities(input: {
  auctionSignals?: readonly AuctionOutcomeSignal[];
  requestSignals?: readonly RequestDemandSignal[];
  wishSignals?: readonly WishSupportSignal[];
}): MonetizationOpportunity[] {
  const opportunities: MonetizationOpportunity[] = [];

  for (const signal of input.auctionSignals ?? []) {
    if (signal.won || !isPositiveMinor(signal.bidAmountMinor) || !isPositiveMinor(signal.winningBidMinor)) continue;
    const ratio = signal.bidAmountMinor / signal.winningBidMinor;
    const highIntent = ratio >= 0.8;
    opportunities.push({
      creatorId: signal.creatorId,
      userId: signal.userId,
      type: highIntent ? "HIGH_INTENT_BIDDER" : "AUCTION_LOSER",
      priority: highIntent ? "high" : "medium",
      action: "follow_up_bidder",
      reason: highIntent
        ? "This customer lost the auction after bidding at least 80% of the observed winning price."
        : "This customer placed a real bid and lost the auction, which is direct purchase-intent evidence.",
      evidence: {
        auctionId: signal.auctionId,
        bidAmountMinor: signal.bidAmountMinor,
        winningBidMinor: signal.winningBidMinor,
        bidToWinningPriceRatioBps: Math.round(ratio * 10_000),
        won: false,
      },
      source: "creator_monetization_engine_v1",
    });
  }

  const requestGroups = new Map<string, RequestDemandSignal[]>();
  for (const signal of input.requestSignals ?? []) {
    const key = `${signal.creatorId}::${signal.normalizedRequestKey.trim().toLowerCase()}`;
    if (!signal.normalizedRequestKey.trim()) continue;
    const current = requestGroups.get(key) ?? [];
    current.push(signal);
    requestGroups.set(key, current);
  }

  for (const signals of requestGroups.values()) {
    const uniqueUsers = new Set(signals.map((signal) => signal.userId));
    if (uniqueUsers.size < 3) continue;
    const amounts = signals
      .map((signal) => signal.offeredAmountMinor)
      .filter((value): value is number => value !== null && isPositiveMinor(value));
    const highestObservedOfferMinor = amounts.length > 0 ? Math.max(...amounts) : 0;
    opportunities.push({
      creatorId: signals[0].creatorId,
      userId: null,
      type: "REPEATED_REQUEST",
      priority: uniqueUsers.size >= 5 ? "high" : "medium",
      action: "consider_offer_from_demand",
      reason: `${uniqueUsers.size} distinct customers requested the same normalized need. Consider turning observed demand into an offer.`,
      evidence: {
        normalizedRequestKey: signals[0].normalizedRequestKey,
        distinctCustomerCount: uniqueUsers.size,
        requestCount: signals.length,
        highestObservedOfferMinor,
      },
      source: "creator_monetization_engine_v1",
    });
  }

  const wishGroups = new Map<string, WishSupportSignal[]>();
  for (const signal of input.wishSignals ?? []) {
    if (signal.status !== "succeeded" || !isPositiveMinor(signal.amountMinor)) continue;
    const key = `${signal.creatorId}::${signal.userId}`;
    const current = wishGroups.get(key) ?? [];
    current.push(signal);
    wishGroups.set(key, current);
  }

  for (const signals of wishGroups.values()) {
    if (signals.length < 2) continue;
    const totalContributionMinor = signals.reduce((sum, signal) => sum + signal.amountMinor, 0);
    opportunities.push({
      creatorId: signals[0].creatorId,
      userId: signals[0].userId,
      type: "WISH_REPEAT_SUPPORTER",
      priority: "medium",
      action: "recognize_repeat_supporter",
      reason: "This customer has supported more than one creator wish contribution. Recognize the relationship before making another commercial ask.",
      evidence: {
        contributionCount: signals.length,
        totalContributionMinor,
      },
      source: "creator_monetization_engine_v1",
    });
  }

  const priorityRank = { high: 0, medium: 1 } as const;
  return opportunities.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
}
