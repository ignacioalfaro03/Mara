import { NextResponse } from "next/server";
import { getBackendConfig } from "@/lib/backend-config";
import { CAPRICHO_GOAL_SLUG, CAPRICHO_OFFER_SLUG, FIXED_LAUNCH_OFFER_SLUG, launchCommerceCatalog } from "@/lib/commerce/catalog";
import { getPaymentRuntime } from "@/lib/commerce/config";
import { publicHeaders, toCommerceGoal, toCommerceOffer, type CommerceGoalRow, type CommerceOfferRow } from "@/lib/commerce/backend";

export const runtime = "nodejs";

const OFFER_SELECT = "id,slug,type,title,description,price_mode,amount_minor,min_amount_minor,max_amount_minor,currency,fulfillment_key,status";
const GOAL_SELECT = "id,slug,offer_id,title,description,visual_path,target_amount_minor,funded_amount_minor,currency,status,completed_at,world_state_key";

function paymentStatus() {
  const runtimeConfig = getPaymentRuntime();
  if (runtimeConfig.configured) {
    return { status: "configured" as const, provider: runtimeConfig.provider };
  }

  return { status: "not_configured" as const, provider: "disabled" as const, reason: runtimeConfig.reason };
}
function staticPayload(source: "static" | "supabase_fallback", backendConfigured: boolean) {
  return {
    source,
    backendConfigured,
    payment: paymentStatus(),
    offers: {
      fixed: launchCommerceCatalog.fixedOffer,
      capricho: launchCommerceCatalog.caprichoOffer,
    },
    goals: {
      capricho: launchCommerceCatalog.caprichoGoal,
    },
  };
}

export async function GET() {
  const config = getBackendConfig();
  if (!config) {
    return NextResponse.json(staticPayload("static", false), { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const offersResponse = await fetch(
      `${config.url}/rest/v1/commerce_offers?select=${OFFER_SELECT}&status=eq.active&slug=in.(${FIXED_LAUNCH_OFFER_SLUG},${CAPRICHO_OFFER_SLUG})`,
      { headers: publicHeaders(config), cache: "no-store" },
    );
    const goalsResponse = await fetch(
      `${config.url}/rest/v1/commerce_goals?select=${GOAL_SELECT}&status=in.(funding,funded,fulfillment,canonicalized)&slug=eq.${CAPRICHO_GOAL_SLUG}&limit=1`,
      { headers: publicHeaders(config), cache: "no-store" },
    );

    if (!offersResponse.ok || !goalsResponse.ok) {
      return NextResponse.json(staticPayload("supabase_fallback", true), { headers: { "Cache-Control": "no-store" } });
    }

    const offerRows = (await offersResponse.json()) as CommerceOfferRow[];
    const goalRows = (await goalsResponse.json()) as CommerceGoalRow[];
    const offersBySlug = new Map(offerRows.map((offer) => [offer.slug, offer]));
    const offerSlugsById = new Map(offerRows.map((offer) => [offer.id, offer.slug]));
    const fixedOffer = offersBySlug.get(FIXED_LAUNCH_OFFER_SLUG);
    const caprichoOffer = offersBySlug.get(CAPRICHO_OFFER_SLUG);
    const caprichoGoal = goalRows[0];

    if (!fixedOffer || !caprichoOffer || !caprichoGoal) {
      return NextResponse.json(staticPayload("supabase_fallback", true), { headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({
      source: "supabase",
      backendConfigured: true,
      payment: paymentStatus(),
      offers: {
        fixed: toCommerceOffer(fixedOffer),
        capricho: toCommerceOffer(caprichoOffer),
      },
      goals: {
        capricho: toCommerceGoal(caprichoGoal, offerSlugsById.get(caprichoGoal.offer_id) ?? CAPRICHO_OFFER_SLUG),
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(staticPayload("supabase_fallback", true), { headers: { "Cache-Control": "no-store" } });
  }
}
