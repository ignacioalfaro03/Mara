import {
  buildMonetizationOpportunities,
  type AuctionOutcomeSignal,
  type MonetizationOpportunity,
  type RequestDemandSignal,
  type WishSupportSignal,
} from "@/lib/commerce/creator-monetization-engine";
import { serviceRest, userRest } from "@/lib/supabase/server-rest";

type AuctionRow = {
  id: string;
  creator_id: string;
  current_bid_minor: number | null;
  winner_user_id: string | null;
  winning_bid_id: string | null;
  ends_at: string;
  status: string;
};

type AuctionBidRow = {
  id: string;
  auction_id: string;
  creator_id: string;
  user_id: string;
  amount_minor: number;
  status: string;
  placed_at: string;
};

type RequestRow = {
  id: string;
  creator_id: string;
  user_id: string;
  category: string;
  budget_minor: number | null;
  counter_amount_minor: number | null;
  status: RequestDemandSignal["status"];
  created_at: string;
};

type ContributionRow = {
  id: string;
  user_id: string;
  offer_id: string;
  goal_id: string;
  amount_minor: number;
  status: "succeeded" | "refunded";
  created_at: string;
};

const NON_DEMAND_REQUEST_STATES = new Set(["declined", "cancelled", "refunded"]);

function encodeIn(values: readonly string[]) {
  return values.map((value) => encodeURIComponent(value)).join(",");
}

function buildAuctionSignals(auctions: AuctionRow[], bids: AuctionBidRow[]): AuctionOutcomeSignal[] {
  const ended = new Map(
    auctions
      .filter((auction) => auction.status === "ended" && auction.current_bid_minor && auction.current_bid_minor > 0)
      .map((auction) => [auction.id, auction] as const),
  );
  const highestByUser = new Map<string, AuctionBidRow>();

  for (const bid of bids) {
    const auction = ended.get(bid.auction_id);
    if (!auction || bid.creator_id !== auction.creator_id || !bid.user_id || bid.amount_minor <= 0) continue;
    const key = `${bid.auction_id}::${bid.user_id}`;
    const previous = highestByUser.get(key);
    if (!previous || bid.amount_minor > previous.amount_minor) highestByUser.set(key, bid);
  }

  return [...highestByUser.values()].flatMap((bid) => {
    const auction = ended.get(bid.auction_id);
    if (!auction?.current_bid_minor) return [];
    return [{
      creatorId: bid.creator_id,
      auctionId: bid.auction_id,
      userId: bid.user_id,
      bidAmountMinor: Number(bid.amount_minor),
      winningBidMinor: Number(auction.current_bid_minor),
      won: auction.winner_user_id === bid.user_id,
      occurredAt: bid.placed_at,
    } satisfies AuctionOutcomeSignal];
  });
}

function buildRequestSignals(rows: RequestRow[]): RequestDemandSignal[] {
  return rows.flatMap((row) => {
    const key = row.category?.trim().toLowerCase();
    if (!key || NON_DEMAND_REQUEST_STATES.has(row.status)) return [];
    return [{
      creatorId: row.creator_id,
      requestId: row.id,
      userId: row.user_id,
      normalizedRequestKey: key,
      offeredAmountMinor: row.counter_amount_minor ?? row.budget_minor,
      status: row.status,
      occurredAt: row.created_at,
    } satisfies RequestDemandSignal];
  });
}

function buildWishSignals(creatorId: string, rows: ContributionRow[]): WishSupportSignal[] {
  return rows.map((row) => ({
    creatorId,
    wishId: row.goal_id,
    userId: row.user_id,
    amountMinor: Number(row.amount_minor),
    status: row.status,
    occurredAt: row.created_at,
  }));
}

function localizedReason(item: MonetizationOpportunity) {
  switch (item.type) {
    case "HIGH_INTENT_BIDDER":
      return "Este cliente perdió una subasta después de pujar al menos el 80% del precio ganador. Hay intención de compra observada: considera una segunda oportunidad relevante.";
    case "AUCTION_LOSER":
      return "Este cliente hizo una puja real y perdió la subasta. Mara detectó intención de compra sin asumir que debas venderle inmediatamente.";
    case "REPEATED_REQUEST":
      return `${item.evidence.distinctCustomerCount ?? 0} clientes distintos pidieron el mismo tipo de producto. Evalúa convertir esa demanda observada en una oferta clara.`;
    case "WISH_REPEAT_SUPPORTER":
      return "Este cliente aportó exitosamente más de una vez. Reconoce la relación antes de hacer una nueva propuesta comercial.";
  }
}

export async function readLiveMonetizationOpportunities(
  accessToken: string,
  creatorId: string,
  creatorOfferIds: readonly string[],
): Promise<MonetizationOpportunity[]> {
  const [auctionsResult, bidsResult, requestsResult] = await Promise.all([
    serviceRest<AuctionRow[]>(
      `creator_auctions?select=id,creator_id,current_bid_minor,winner_user_id,winning_bid_id,ends_at,status&creator_id=eq.${encodeURIComponent(creatorId)}&status=eq.ended&order=ends_at.desc&limit=100`,
    ),
    serviceRest<AuctionBidRow[]>(
      `creator_auction_bids?select=id,auction_id,creator_id,user_id,amount_minor,status,placed_at&creator_id=eq.${encodeURIComponent(creatorId)}&status=in.(outbid,winning,won)&order=placed_at.desc&limit=500`,
    ),
    userRest<RequestRow[]>(
      accessToken,
      `creator_requests?select=id,creator_id,user_id,category,budget_minor,counter_amount_minor,status,created_at&creator_id=eq.${encodeURIComponent(creatorId)}&order=created_at.desc&limit=500`,
    ),
  ]);

  const contributionResult = creatorOfferIds.length > 0
    ? await serviceRest<ContributionRow[]>(
        `commerce_contributions?select=id,user_id,offer_id,goal_id,amount_minor,status,created_at&offer_id=in.(${encodeIn(creatorOfferIds)})&order=created_at.desc&limit=500`,
      )
    : null;

  const auctionSignals = auctionsResult.ok && bidsResult.ok
    ? buildAuctionSignals(auctionsResult.data, bidsResult.data)
    : [];
  const requestSignals = requestsResult.ok ? buildRequestSignals(requestsResult.data) : [];
  const wishSignals = contributionResult?.ok
    ? buildWishSignals(creatorId, contributionResult.data)
    : [];

  return buildMonetizationOpportunities({ auctionSignals, requestSignals, wishSignals })
    .map((item) => ({ ...item, reason: localizedReason(item) }));
}