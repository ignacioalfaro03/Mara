import { minimumAcceptedBidMinor, type AuctionSnapshot, type AuctionStatus } from "@/lib/commerce/creator-monetization-engine";

export type CreatorAuctionRow = {
  id: string;
  creator_id: string;
  world_id: string;
  offer_id: string | null;
  title: string;
  description: string;
  currency: string;
  starting_bid_minor: number;
  minimum_increment_minor: number;
  current_bid_minor: number | null;
  current_bidder_user_id: string | null;
  bid_count: number;
  starts_at: string;
  ends_at: string;
  anti_sniping_window_seconds: number;
  anti_sniping_extension_seconds: number;
  status: AuctionStatus;
  winner_user_id: string | null;
  winning_bid_id: string | null;
  payment_due_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
};

export type PublicAuctionProjection = {
  id: string;
  creatorId: string;
  worldId: string;
  title: string;
  description: string;
  currency: string;
  startingBidMinor: number;
  minimumIncrementMinor: number;
  currentBidMinor: number | null;
  minimumNextBidMinor: number;
  bidCount: number;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "active" | "ended" | "cancelled";
  antiSnipingWindowSeconds: number;
  antiSnipingExtensionSeconds: number;
};

export function auctionSnapshot(row: CreatorAuctionRow): AuctionSnapshot {
  return {
    id: row.id,
    creatorId: row.creator_id,
    currency: row.currency,
    status: row.status,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    startingBidMinor: Number(row.starting_bid_minor),
    minimumIncrementMinor: Number(row.minimum_increment_minor),
    currentBidMinor: row.current_bid_minor === null ? null : Number(row.current_bid_minor),
    currentBidderUserId: row.current_bidder_user_id,
    antiSnipingWindowSeconds: row.anti_sniping_window_seconds,
    antiSnipingExtensionSeconds: row.anti_sniping_extension_seconds,
  };
}

export function deriveAuctionStatus(row: CreatorAuctionRow, now = new Date()) {
  if (row.status === "cancelled") return "cancelled" as const;
  if (row.status === "ended" || now.getTime() >= Date.parse(row.ends_at)) return "ended" as const;
  if (now.getTime() < Date.parse(row.starts_at)) return "scheduled" as const;
  return "active" as const;
}

export function publicAuctionProjection(row: CreatorAuctionRow, now = new Date()): PublicAuctionProjection {
  return {
    id: row.id,
    creatorId: row.creator_id,
    worldId: row.world_id,
    title: row.title,
    description: row.description,
    currency: row.currency,
    startingBidMinor: Number(row.starting_bid_minor),
    minimumIncrementMinor: Number(row.minimum_increment_minor),
    currentBidMinor: row.current_bid_minor === null ? null : Number(row.current_bid_minor),
    minimumNextBidMinor: minimumAcceptedBidMinor(auctionSnapshot(row)),
    bidCount: Number(row.bid_count ?? 0),
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: deriveAuctionStatus(row, now),
    antiSnipingWindowSeconds: row.anti_sniping_window_seconds,
    antiSnipingExtensionSeconds: row.anti_sniping_extension_seconds,
  };
}
