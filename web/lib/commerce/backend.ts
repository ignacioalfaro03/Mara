import type { MaraBackendConfig, MaraServerBackendConfig } from "@/lib/backend-config";
import type { CommerceGoal, CommerceOffer, OfferStatus, OfferType, PriceMode } from "@/lib/commerce/catalog";

export type CommerceOfferRow = {
  id: string;
  slug: string;
  type: OfferType;
  title: string;
  description: string;
  price_mode: PriceMode;
  amount_minor: number | null;
  min_amount_minor: number | null;
  max_amount_minor: number | null;
  currency: string;
  fulfillment_key: string | null;
  status: OfferStatus;
};

export type CommerceGoalRow = {
  id: string;
  slug: string;
  offer_id: string;
  title: string;
  description: string;
  visual_path: string | null;
  target_amount_minor: number;
  funded_amount_minor: number | null;
  currency: string;
  status: CommerceGoal["status"];
  completed_at: string | null;
  world_state_key: string;
};

export type CommerceCheckoutIntentRow = {
  id: string;
  user_id: string;
  offer_id: string;
  client_request_id: string;
  amount_minor: number;
  currency: string;
  provider: string;
  provider_checkout_id: string | null;
  provider_checkout_url: string | null;
  status: "pending" | "provider_failed" | "completed" | "expired" | "canceled";
};

export function publicHeaders(config: MaraBackendConfig) {
  return {
    apikey: config.publishableKey,
  };
}
export function serviceHeaders(config: MaraServerBackendConfig, contentType = true) {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    ...(contentType ? { "Content-Type": "application/json" } : {}),
  };
}

export function toCommerceOffer(row: CommerceOfferRow): CommerceOffer {
  return {
    slug: row.slug,
    type: row.type,
    title: row.title,
    description: row.description,
    priceMode: row.price_mode,
    amountMinor: row.amount_minor,
    minAmountMinor: row.min_amount_minor,
    maxAmountMinor: row.max_amount_minor,
    currency: row.currency,
    fulfillmentKey: row.fulfillment_key,
    status: row.status,
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
    status: row.status,
    completedAt: row.completed_at,
    worldStateKey: row.world_state_key,
  };
}
