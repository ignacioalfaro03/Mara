export type ExposureMode = "REAL_ME" | "CREATOR_PERSONA" | "VIRTUAL_IDENTITY";
export type OfferFamily = "ASYNC_DIGITAL" | "ACCESS" | "TIME" | "SUPPORT";
export type OfferFormat = "text" | "audio" | "image" | "video" | "collection" | "custom_request" | "membership" | "session" | "tip";
export type FulfillmentMode = "INSTANT" | "CREATOR_ASYNC" | "SCHEDULED" | "NO_DELIVERABLE";
export type AcquisitionChannel = "INSTAGRAM" | "TIKTOK" | "X" | "YOUTUBE" | "DIRECT" | "MARA_DISCOVERY";

export type CreatorOffer = {
  id: string;
  title: string;
  family: OfferFamily;
  format: OfferFormat;
  priceMinor: number;
  currency: "USD";
  fulfillmentMode: FulfillmentMode;
  deliveryHours: number | null;
  capacity: number | null;
  sold: number;
  active: boolean;
};

export type Capricho = {
  id: string;
  title: string;
  targetMinor: number;
  fundedMinor: number;
  contributionMinimumMinor: number;
  contributors: number;
  status: "OPEN" | "FUNDED" | "FULFILLED";
  linkedUpdate: boolean;
};

export type ChannelPerformance = {
  channel: AcquisitionChannel;
  visits: number;
  buyers: number;
  gmvMinor: number;
  repeatBuyers: number;
};

export const syntheticCreator = {
  publicName: "Sofi",
  handle: "@sofi",
  exposureMode: "CREATOR_PERSONA" as ExposureMode,
  publicStoreUrl: "mara.com/@sofi",
};

export const syntheticOffers: CreatorOffer[] = [
  {
    id: "offer_audio_personalized",
    title: "Audio personalizado",
    family: "ASYNC_DIGITAL",
    format: "audio",
    priceMinor: 1490,
    currency: "USD",
    fulfillmentMode: "CREATOR_ASYNC",
    deliveryHours: 24,
    capacity: 5,
    sold: 3,
    active: true,
  },
  {
    id: "offer_private_reply",
    title: "Respóndeme esto",
    family: "ASYNC_DIGITAL",
    format: "text",
    priceMinor: 490,
    currency: "USD",
    fulfillmentMode: "CREATOR_ASYNC",
    deliveryHours: 12,
    capacity: 12,
    sold: 8,
    active: true,
  },
  {
    id: "offer_collection",
    title: "Drop privado",
    family: "ASYNC_DIGITAL",
    format: "collection",
    priceMinor: 990,
    currency: "USD",
    fulfillmentMode: "INSTANT",
    deliveryHours: null,
    capacity: null,
    sold: 21,
    active: true,
  },
  {
    id: "offer_session",
    title: "15 minutos conmigo",
    family: "TIME",
    format: "session",
    priceMinor: 2490,
    currency: "USD",
    fulfillmentMode: "SCHEDULED",
    deliveryHours: null,
    capacity: 4,
    sold: 2,
    active: true,
  },
  {
    id: "offer_membership",
    title: "VIP mensual",
    family: "ACCESS",
    format: "membership",
    priceMinor: 1990,
    currency: "USD",
    fulfillmentMode: "INSTANT",
    deliveryHours: null,
    capacity: null,
    sold: 14,
    active: true,
  },
  {
    id: "offer_tip",
    title: "Hazme el día",
    family: "SUPPORT",
    format: "tip",
    priceMinor: 500,
    currency: "USD",
    fulfillmentMode: "NO_DELIVERABLE",
    deliveryHours: null,
    capacity: null,
    sold: 18,
    active: true,
  },
];

export const syntheticCaprichos: Capricho[] = [
  {
    id: "capricho_dress",
    title: "Mi próximo vestido",
    targetMinor: 12000,
    fundedMinor: 8700,
    contributionMinimumMinor: 500,
    contributors: 17,
    status: "OPEN",
    linkedUpdate: true,
  },
  {
    id: "capricho_coffee",
    title: "Invítame el café de hoy",
    targetMinor: 400,
    fundedMinor: 400,
    contributionMinimumMinor: 100,
    contributors: 3,
    status: "FUNDED",
    linkedUpdate: false,
  },
];

export const syntheticChannels: ChannelPerformance[] = [
  { channel: "INSTAGRAM", visits: 8200, buyers: 168, gmvMinor: 420000, repeatBuyers: 53 },
  { channel: "TIKTOK", visits: 16500, buyers: 241, gmvMinor: 610000, repeatBuyers: 49 },
  { channel: "X", visits: 2100, buyers: 61, gmvMinor: 180000, repeatBuyers: 24 },
  { channel: "MARA_DISCOVERY", visits: 3600, buyers: 102, gmvMinor: 390000, repeatBuyers: 31 },
  { channel: "DIRECT", visits: 1400, buyers: 37, gmvMinor: 94000, repeatBuyers: 12 },
];

export function caprichoProgress(capricho: Capricho) {
  if (capricho.targetMinor <= 0) return 0;
  return Math.min(1, capricho.fundedMinor / capricho.targetMinor);
}

export function channelConversion(channel: ChannelPerformance) {
  if (channel.visits <= 0) return 0;
  return channel.buyers / channel.visits;
}

export function gmvPerVisitorMinor(channel: ChannelPerformance) {
  if (channel.visits <= 0) return 0;
  return Math.round(channel.gmvMinor / channel.visits);
}

export function creatorCommerceSummary() {
  const offerGmvMinor = syntheticOffers.reduce((sum, offer) => sum + offer.priceMinor * offer.sold, 0);
  const caprichoFundedMinor = syntheticCaprichos.reduce((sum, capricho) => sum + capricho.fundedMinor, 0);
  const totalChannelGmvMinor = syntheticChannels.reduce((sum, channel) => sum + channel.gmvMinor, 0);
  const creatorSourcedGmvMinor = syntheticChannels
    .filter((channel) => channel.channel !== "MARA_DISCOVERY")
    .reduce((sum, channel) => sum + channel.gmvMinor, 0);
  const maraSourcedGmvMinor = syntheticChannels
    .filter((channel) => channel.channel === "MARA_DISCOVERY")
    .reduce((sum, channel) => sum + channel.gmvMinor, 0);

  return {
    activeOffers: syntheticOffers.filter((offer) => offer.active).length,
    offerGmvMinor,
    caprichoFundedMinor,
    totalChannelGmvMinor,
    creatorSourcedGmvMinor,
    maraSourcedGmvMinor,
  };
}
