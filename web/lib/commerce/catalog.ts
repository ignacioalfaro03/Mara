export type OfferType = "fixed_unlock" | "open_contribution";
export type PriceMode = "fixed" | "custom_amount";
export type OfferStatus = "draft" | "active" | "archived";
export type PaymentProviderStatus = "not_configured" | "configured";

export type CommerceOffer = {
  slug: string;
  type: OfferType;
  title: string;
  description: string;
  priceMode: PriceMode;
  amountMinor: number | null;
  minAmountMinor: number | null;
  maxAmountMinor: number | null;
  currency: string;
  fulfillmentKey: string | null;
  status: OfferStatus;
};

export type CommerceGoal = {
  slug: string;
  offerSlug: string;
  title: string;
  description: string;
  visualPath: string;
  targetAmountMinor: number;
  fundedAmountMinor: number | null;
  currency: string;
  status: "draft" | "funding" | "funded" | "fulfillment" | "canonicalized" | "archived";
  completedAt: string | null;
  worldStateKey: string;
};

export const FIXED_LAUNCH_OFFER_SLUG = "private_after_scene_note_v1";
export const CAPRICHO_OFFER_SLUG = "black_bag_capricho_01";
export const CAPRICHO_GOAL_SLUG = "black_bag_01";

export const launchCommerceCatalog: { fixedOffer: CommerceOffer; caprichoOffer: CommerceOffer; caprichoGoal: CommerceGoal } = {
  fixedOffer: {
    slug: FIXED_LAUNCH_OFFER_SLUG,
    type: "fixed_unlock",
    title: "Nota privada de la noche",
    description:
      "Una continuación breve y concreta de lo que pasó después de la primera escena. Se desbloquea una vez y queda en tu historia con Mara.",
    priceMode: "fixed",
    amountMinor: 499,
    minAmountMinor: null,
    maxAmountMinor: null,
    currency: "USD",
    fulfillmentKey: "private_after_scene_note_v1",
    status: "active",
  },
  caprichoOffer: {
    slug: CAPRICHO_OFFER_SLUG,
    type: "open_contribution",
    title: "Capricho: Black Bag",
    description:
      "Mara quiere sumar un objeto a su mundo. La participación es privada por defecto; el progreso público se deriva solo de pagos confirmados.",
    priceMode: "custom_amount",
    amountMinor: null,
    minAmountMinor: 100,
    maxAmountMinor: 10000000,
    currency: "USD",
    fulfillmentKey: null,
    status: "active",
  },
  caprichoGoal: {
    slug: CAPRICHO_GOAL_SLUG,
    offerSlug: CAPRICHO_OFFER_SLUG,
    title: "Black Bag",
    description:
      "No lo necesita. Ese claramente no es el problema. Si se completa, el objeto entra al canon de Mara como un World Asset real antes de usarse en futuros callbacks.",
    visualPath: "/mara/mara-v1-reference.jpg",
    targetAmountMinor: 42000,
    fundedAmountMinor: null,
    currency: "USD",
    status: "funding",
    completedAt: null,
    worldStateKey: "world_asset_black_bag_01",
  },
};

export function formatMinorAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(amountMinor / 100);
}

export function amountBucket(amountMinor: number) {
  if (amountMinor < 500) return "under_5";
  if (amountMinor < 1000) return "5_9";
  if (amountMinor < 2500) return "10_24";
  if (amountMinor < 10000) return "25_99";
  return "100_plus";
}

export function getAmountForOffer(offer: CommerceOffer, requestedAmountMinor: number | null) {
  if (offer.priceMode === "fixed") {
    return offer.amountMinor;
  }

  if (requestedAmountMinor === null) return null;
  if (offer.minAmountMinor !== null && requestedAmountMinor < offer.minAmountMinor) return null;
  if (offer.maxAmountMinor !== null && requestedAmountMinor > offer.maxAmountMinor) return null;
  return requestedAmountMinor;
}
