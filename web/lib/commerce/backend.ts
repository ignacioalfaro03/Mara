import type { MaraBackendConfig, MaraServerBackendConfig } from "@/lib/backend-config";
import type { CommerceGoal, CommerceOffer } from "@/lib/commerce/catalog";
import type { Tables } from "@/lib/supabase/database.types";

export type CommerceOfferRow = Tables<"commerce_offers">;
export type CommerceGoalRow = Tables<"commerce_goals">;
export type CommerceCheckoutIntentRow = Tables<"commerce_checkout_intents">;

export function publicHeaders(config: MaraBackendConfig) {
  return { apikey: config.publishableKey };
}

export function serviceHeaders(config: MaraServerBackendConfig, contentType = true) {
  const credentialHeaders = config.serviceRoleKey.startsWith("sb_secret_")
    ? { apikey: config.serviceRoleKey }
    : { apikey: config.publishableKey, Authorization: `Bearer ${config.serviceRoleKey}` };
  return {
    ...credentialHeaders,
    ...(contentType ? { "Content-Type": "application/json" } : {}),
  };
}

export function toCommerceOffer(row: CommerceOfferRow): CommerceOffer {
  return {
    slug: row.slug,
    type: row.type as CommerceOffer["type"],
    title: row.title,
    description: row.description,
    priceMode: row.price_mode as CommerceOffer["priceMode"],
    amountMinor: row.amount_minor,
    minAmountMinor: row.min_amount_minor,
    maxAmountMinor: row.max_amount_minor,
    currency: row.currency,
    fulfillmentKey: row.fulfillment_key,
    status: row.status as CommerceOffer["status"],
  };
}

export function toCommerceGoal(row: CommerceGoalRow, offerSlug: string): CommerceGoal {
  return {
    slug: row.slug,
    offerSlug,
    title: row.title,
    description: row.description,
    visualPath: row.visual_path ?? "",
    targetAmountMinor: row.target_amount_minor,
    fundedAmountMinor: row.funded_amount_minor ?? 0,
    currency: row.currency,
    status: row.status as CommerceGoal["status"],
    completedAt: row.completed_at,
    worldStateKey: row.world_state_key,
  };
}
