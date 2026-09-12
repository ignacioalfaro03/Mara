import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type WorldRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { safeLocalReturn, serviceRest, userRest } from "@/lib/supabase/server-rest";
import type { CreatorAuctionRow } from "@/lib/commerce/auction-runtime";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_MAJOR = 1_000_000_000;

type FinalizeRow = {
  finalized_status: string;
  winner_user_id: string | null;
  winning_bid_id: string | null;
  winning_amount_minor: number | null;
};

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | null | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

export async function POST(request: Request) {
  if (!productCapability("auctions")) return NextResponse.json({ error: "auctions_system_disabled" }, { status: 404 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "create");
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator/monetization");

  if (action === "finalize") {
    const auctionId = String(form.get("auctionId") ?? "");
    if (!UUID_LIKE.test(auctionId)) return NextResponse.json({ error: "invalid_auction" }, { status: 400 });

    const existing = await serviceRest<CreatorAuctionRow[]>(
      `creator_auctions?select=*&id=eq.${encodeURIComponent(auctionId)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`,
    );
    const auction = existing.ok ? existing.data[0] : null;
    if (!auction) return NextResponse.json({ error: "auction_not_authorized" }, { status: 403 });
    if (Date.now() < Date.parse(auction.ends_at) && auction.status !== "ended") {
      return NextResponse.json({ error: "auction_not_ended" }, { status: 409 });
    }

    const finalized = await serviceRest<FinalizeRow[]>("rpc/finalize_creator_auction_v1", {
      method: "POST",
      body: JSON.stringify({
        p_auction_id: auction.id,
        p_creator_id: creator.id,
        p_finalized_at: new Date().toISOString(),
      }),
    });
    if (!finalized.ok || !finalized.data[0]) return NextResponse.json({ error: "auction_finalize_failed" }, { status: 502 });

    await emitProductEvent(request, "creator_auction_finalized", {
      surface: "/creator/monetization",
      target: auction.id,
      currency: auction.currency,
      has_winner: Boolean(finalized.data[0].winner_user_id),
    });
    return withSession(NextResponse.redirect(new URL(returnTo, request.url), 303), session.refreshedSession);
  }

  if (action !== "create") return NextResponse.json({ error: "unsupported_auction_action" }, { status: 400 });

  const worldId = String(form.get("worldId") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const startingMajor = Number(form.get("startingBid") ?? 0);
  const incrementMajor = Number(form.get("minimumIncrement") ?? 0);
  const startsInMinutes = Number(form.get("startsInMinutes") ?? 0);
  const durationMinutes = Number(form.get("durationMinutes") ?? 60);
  const antiSnipingMinutes = Number(form.get("antiSnipingMinutes") ?? 2);

  if (
    !UUID_LIKE.test(worldId) ||
    title.length < 2 || title.length > 180 ||
    description.length > 4000 ||
    !Number.isFinite(startingMajor) || startingMajor <= 0 || startingMajor > MAX_MAJOR ||
    !Number.isFinite(incrementMajor) || incrementMajor <= 0 || incrementMajor > startingMajor ||
    !Number.isInteger(startsInMinutes) || startsInMinutes < 0 || startsInMinutes > 43_200 ||
    !Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 43_200 ||
    !Number.isInteger(antiSnipingMinutes) || antiSnipingMinutes < 0 || antiSnipingMinutes > 60
  ) {
    return NextResponse.json({ error: "invalid_auction" }, { status: 400 });
  }

  const worldResult = await userRest<WorldRow[]>(
    session.accessToken,
    `creator_worlds?select=*&id=eq.${encodeURIComponent(worldId)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`,
  );
  const world = worldResult.ok ? worldResult.data[0] : null;
  if (!world) return NextResponse.json({ error: "world_not_authorized" }, { status: 403 });

  const now = Date.now();
  const startsAt = new Date(now + startsInMinutes * 60_000);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);
  const startingBidMinor = Math.round(startingMajor * 100);
  const minimumIncrementMinor = Math.round(incrementMajor * 100);
  const antiSnipingSeconds = antiSnipingMinutes * 60;

  const created = await serviceRest<CreatorAuctionRow[]>("creator_auctions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: creator.id,
      world_id: world.id,
      offer_id: null,
      title,
      description,
      currency: "CLP",
      starting_bid_minor: startingBidMinor,
      minimum_increment_minor: minimumIncrementMinor,
      current_bid_minor: null,
      current_bidder_user_id: null,
      bid_count: 0,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      anti_sniping_window_seconds: antiSnipingSeconds,
      anti_sniping_extension_seconds: antiSnipingSeconds,
      status: startsInMinutes === 0 ? "active" : "scheduled",
      winner_user_id: null,
      winning_bid_id: null,
      payment_due_at: null,
      metadata: {
        mechanism: "AUCTION",
        preview_v1: true,
        winner_checkout_enabled: false,
      },
    }),
  });
  if (!created.ok || !created.data[0]) return NextResponse.json({ error: "auction_create_failed" }, { status: 502 });

  await emitProductEvent(request, "creator_auction_created", {
    surface: "/creator/monetization",
    target: created.data[0].id,
    currency: "CLP",
  });

  return withSession(NextResponse.redirect(new URL(returnTo, request.url), 303), session.refreshedSession);
}
