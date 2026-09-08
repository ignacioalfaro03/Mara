import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type DemandRow, type OfferRow, type WorldRow } from "@/lib/mara-real-data";
import { safeLocalReturn, slugify, userRest } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const FAMILIES = new Set(["digital_product", "personalized_digital", "limited_drop", "membership", "bounded_interaction"]);
const CURRENCIES = new Set(["CLP", "USD", "EUR"]);
const MANUAL_FULFILLMENT_FAMILIES = new Set(["personalized_digital", "bounded_interaction"]);

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const form = await request.formData();
  const worldId = String(form.get("worldId") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const offerFamily = String(form.get("offerFamily") ?? "digital_product");
  const currency = String(form.get("currency") ?? "CLP").toUpperCase();
  const priceMajor = Number(form.get("price") ?? 0);
  const demandRequestId = String(form.get("demandRequestId") ?? "").trim() || null;
  const fulfillmentConcept = String(form.get("fulfillmentConcept") ?? "digital_delivery").trim();
  const status = form.get("status") === "draft" ? "draft" : "active";
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator");

  if (title.length < 2 || title.length > 140 || description.length < 2 || description.length > 1200 || !FAMILIES.has(offerFamily) || !CURRENCIES.has(currency) || !Number.isFinite(priceMajor) || priceMajor <= 0) {
    return NextResponse.json({ error: "invalid_offer" }, { status: 400 });
  }

  const worldResult = await userRest<WorldRow[]>(session.accessToken, `creator_worlds?select=*&id=eq.${encodeURIComponent(worldId)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`);
  const world = worldResult.ok ? worldResult.data[0] : null;
  if (!world) return NextResponse.json({ error: "world_not_authorized" }, { status: 403 });

  if (demandRequestId) {
    const demandResult = await userRest<DemandRow[]>(session.accessToken, `demand_requests?select=*&id=eq.${encodeURIComponent(demandRequestId)}&creator_id=eq.${encodeURIComponent(creator.id)}&world_id=eq.${encodeURIComponent(world.id)}&limit=1`);
    if (!demandResult.ok || !demandResult.data[0]) return NextResponse.json({ error: "demand_not_authorized" }, { status: 403 });
  }

  const base = slugify(title, 58) || "offer";
  const suffix = crypto.randomUUID().slice(0, 8);
  const slug = `${base}-${suffix}`;
  const fulfillmentKey = slugify(`${offerFamily}-${fulfillmentConcept}`, 100).replaceAll("-", "_") || `offer_${suffix}`;
  const fulfillmentMode = MANUAL_FULFILLMENT_FAMILIES.has(offerFamily) ? "creator_manual" : "automatic";
  const row: TablesInsert<"commerce_offers"> = {
    creator_id: creator.id,
    world_id: world.id,
    demand_request_id: demandRequestId,
    slug,
    type: "fixed_unlock",
    title,
    description,
    price_mode: "fixed",
    amount_minor: Math.round(priceMajor * 100),
    currency,
    fulfillment_key: fulfillmentKey,
    offer_family: offerFamily,
    status,
    metadata: { fulfillment_concept: fulfillmentConcept, fulfillment_mode: fulfillmentMode, alpha: true },
  };

  const result = await userRest<OfferRow[]>(session.accessToken, "commerce_offers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!result.ok) return NextResponse.json({ error: "offer_create_failed" }, { status: result.status === 409 ? 409 : 502 });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
