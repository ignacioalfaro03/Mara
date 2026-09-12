import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type OfferRow, type WorldRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { safeLocalReturn, serviceRest, slugify, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const CURRENCIES = new Set(["CLP", "USD", "EUR"]);

type GoalRow = {
  id: string;
  slug: string;
  offer_id: string;
  title: string;
  description: string;
  target_amount_minor: number;
  funded_amount_minor: number;
  currency: string;
  status: string;
  world_state_key: string;
  metadata: Record<string, unknown>;
};

export async function POST(request: Request) {
  if (!productCapability("wishes")) return NextResponse.json({ error: "wishes_system_disabled" }, { status: 404 });

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const worldId = String(form.get("worldId") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const currency = String(form.get("currency") ?? "CLP").toUpperCase();
  const targetMajor = Number(form.get("target") ?? 0);
  const minMajor = Number(form.get("minContribution") ?? 0);
  const maxMajor = Number(form.get("maxContribution") ?? 0);
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator/monetization");

  if (
    title.length < 2 || title.length > 140 ||
    description.length < 2 || description.length > 1200 ||
    !CURRENCIES.has(currency) ||
    !Number.isFinite(targetMajor) || targetMajor <= 0 ||
    !Number.isFinite(minMajor) || minMajor <= 0 ||
    !Number.isFinite(maxMajor) || maxMajor < minMajor || maxMajor > targetMajor
  ) {
    return NextResponse.json({ error: "invalid_wish" }, { status: 400 });
  }

  const worldResult = await userRest<WorldRow[]>(
    session.accessToken,
    `creator_worlds?select=*&id=eq.${encodeURIComponent(worldId)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`,
  );
  const world = worldResult.ok ? worldResult.data[0] : null;
  if (!world) return NextResponse.json({ error: "world_not_authorized" }, { status: 403 });

  const suffix = crypto.randomUUID().slice(0, 8);
  const base = slugify(title, 58) || "wish";
  const offerSlug = `${base}-${suffix}`;
  const goalSlug = `wish-${suffix}`;
  const targetAmountMinor = Math.round(targetMajor * 100);
  const minAmountMinor = Math.round(minMajor * 100);
  const maxAmountMinor = Math.round(maxMajor * 100);

  const offerResult = await serviceRest<OfferRow[]>("commerce_offers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: creator.id,
      world_id: world.id,
      slug: offerSlug,
      type: "open_contribution",
      title,
      description,
      price_mode: "custom_amount",
      amount_minor: null,
      min_amount_minor: minAmountMinor,
      max_amount_minor: maxAmountMinor,
      currency,
      fulfillment_key: null,
      offer_family: "digital_product",
      status: "active",
      metadata: {
        mechanism: "WISH",
        wish_v1: true,
        creator_id: creator.id,
        world_id: world.id,
      },
    }),
  });
  const offer = offerResult.ok ? offerResult.data[0] : null;
  if (!offer) return NextResponse.json({ error: "wish_offer_create_failed" }, { status: 502 });

  const goalResult = await serviceRest<GoalRow[]>("commerce_goals", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      slug: goalSlug,
      offer_id: offer.id,
      title,
      description,
      visual_path: null,
      target_amount_minor: targetAmountMinor,
      funded_amount_minor: 0,
      currency,
      status: "funding",
      completed_at: null,
      world_state_key: `creator_wish_${creator.id.replaceAll("-", "_")}_${suffix}`,
      metadata: {
        mechanism: "WISH",
        creator_id: creator.id,
        world_id: world.id,
        storefront_slug: world.slug,
      },
    }),
  });

  if (!goalResult.ok || !goalResult.data[0]) {
    await serviceRest<unknown>(`commerce_offers?id=eq.${encodeURIComponent(offer.id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
    return NextResponse.json({ error: "wish_goal_create_failed" }, { status: 502 });
  }

  await emitProductEvent(request, "creator_wish_created", {
    surface: "/creator/monetization",
    target: goalSlug,
    currency,
  });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
