import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { auctionSnapshot, publicAuctionProjection, type CreatorAuctionRow } from "@/lib/commerce/auction-runtime";
import { validateAuctionBid } from "@/lib/commerce/creator-monetization-engine";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { serviceRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_IDEMPOTENCY = /^[A-Za-z0-9:_-]{8,180}$/;
const MAX_BID_MINOR = 100_000_000_000;

type BidRpcRow = {
  bid_id: string;
  accepted_amount_minor: number;
  next_ends_at: string;
  extended: boolean;
};

type CreatorOwnerRow = { id: string; user_id: string };
type PublicWorldRow = { id: string; creator_id: string; status: string; visibility: string };

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | null | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

async function readAuction(auctionId: string) {
  const result = await serviceRest<CreatorAuctionRow[]>(
    `creator_auctions?select=*&id=eq.${encodeURIComponent(auctionId)}&limit=1`,
  );
  return result.ok ? result.data[0] ?? null : null;
}

async function bidRateAllowed(userId: string) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const result = await serviceRest<Array<{ id: string }>>(
    `creator_auction_bids?select=id&user_id=eq.${encodeURIComponent(userId)}&placed_at=gte.${encodeURIComponent(since)}&limit=31`,
  );
  return result.ok && result.data.length < 30;
}

export async function POST(request: Request) {
  if (!productCapability("auctions")) return NextResponse.json({ error: "auctions_system_disabled" }, { status: 404 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: { auctionId?: unknown; amountMinor?: unknown; idempotencyKey?: unknown };
  try { body = (await request.json()) as typeof body; }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const auctionId = typeof body.auctionId === "string" && UUID_LIKE.test(body.auctionId) ? body.auctionId : null;
  const amountMinor = Number(body.amountMinor);
  const idempotencyKey = typeof body.idempotencyKey === "string" && SAFE_IDEMPOTENCY.test(body.idempotencyKey)
    ? body.idempotencyKey
    : null;

  if (!auctionId || !Number.isSafeInteger(amountMinor) || amountMinor <= 0 || amountMinor > MAX_BID_MINOR || !idempotencyKey) {
    return NextResponse.json({ error: "invalid_auction_bid" }, { status: 400 });
  }

  if (!(await bidRateAllowed(session.user.id))) {
    return withSession(NextResponse.json({ error: "auction_bid_rate_limited" }, { status: 429 }), session.refreshedSession);
  }

  const auction = await readAuction(auctionId);
  if (!auction) return NextResponse.json({ error: "auction_not_found" }, { status: 404 });

  const [worldResult, ownerResult] = await Promise.all([
    serviceRest<PublicWorldRow[]>(
      `creator_worlds?select=id,creator_id,status,visibility&id=eq.${encodeURIComponent(auction.world_id)}&creator_id=eq.${encodeURIComponent(auction.creator_id)}&limit=1`,
    ),
    serviceRest<CreatorOwnerRow[]>(
      `creators?select=id,user_id&id=eq.${encodeURIComponent(auction.creator_id)}&limit=1`,
    ),
  ]);
  const world = worldResult.ok ? worldResult.data[0] : null;
  const owner = ownerResult.ok ? ownerResult.data[0] : null;
  if (!world || world.status !== "active" || world.visibility !== "public") {
    return NextResponse.json({ error: "auction_not_public" }, { status: 404 });
  }
  if (!owner) return NextResponse.json({ error: "auction_creator_not_found" }, { status: 409 });
  if (owner.user_id === session.user.id) return NextResponse.json({ error: "creator_cannot_bid_own_auction" }, { status: 403 });

  const placedAt = new Date().toISOString();
  const decision = validateAuctionBid(auctionSnapshot(auction), {
    auctionId: auction.id,
    creatorId: auction.creator_id,
    bidderUserId: session.user.id,
    amountMinor,
    idempotencyKey,
    placedAt,
  });
  if (!decision.ok) {
    const status = decision.code === "BID_TOO_LOW" || decision.code === "AUCTION_ENDED" ? 409 : 400;
    return withSession(NextResponse.json({ error: decision.code.toLowerCase(), minimumAcceptedBidMinor: decision.minimumAcceptedBidMinor }, { status }), session.refreshedSession);
  }

  const rpc = await serviceRest<BidRpcRow[]>("rpc/place_creator_auction_bid_v1", {
    method: "POST",
    body: JSON.stringify({
      p_auction_id: auction.id,
      p_creator_id: auction.creator_id,
      p_user_id: session.user.id,
      p_amount_minor: amountMinor,
      p_idempotency_key: idempotencyKey,
      p_placed_at: placedAt,
    }),
  });

  if (!rpc.ok || !rpc.data[0]) {
    // A concurrent bid may have changed the minimum between preflight and the locked RPC.
    const latest = await readAuction(auction.id);
    const latestProjection = latest ? publicAuctionProjection(latest) : null;
    return withSession(NextResponse.json({
      error: "auction_bid_conflict",
      minimumAcceptedBidMinor: latestProjection?.minimumNextBidMinor ?? decision.minimumAcceptedBidMinor,
    }, { status: 409 }), session.refreshedSession);
  }

  const accepted = rpc.data[0];
  await emitProductEvent(request, "auction_bid_placed", {
    surface: `/c/${auction.world_id}/auctions`,
    target: auction.id,
    currency: auction.currency,
    extended: accepted.extended,
  });

  return withSession(NextResponse.json({
    bidId: accepted.bid_id,
    amountMinor: accepted.accepted_amount_minor,
    endsAt: accepted.next_ends_at,
    extended: accepted.extended,
  }, { status: 201 }), session.refreshedSession);
}
