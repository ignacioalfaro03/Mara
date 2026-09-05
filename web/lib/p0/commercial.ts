export type CommercialMomentType =
  | "curiosity"
  | "personal_relevance"
  | "participation"
  | "anticipation"
  | "achievement"
  | "scarcity";

export type RewardStyle =
  | "praise"
  | "teasing"
  | "acknowledgement"
  | "challenge_completion"
  | "reveal"
  | "surprise"
  | "access"
  | "progression"
  | "collectible"
  | "none";

export type AvailabilityType =
  | "always_available"
  | "capacity_limited"
  | "time_limited"
  | "edition_limited"
  | "narrative_window"
  | "live_window"
  | "early_access";

export type AvailabilityPolicy = {
  type: AvailabilityType;
  prototypeOnly?: boolean;
  capacityTotal?: number;
  capacityRemaining?: number;
  startsAt?: string;
  endsAt?: string;
  reason?: string;
  ownershipAfterPurchase: "permanent" | "access_only";
};

export type OfferDefinition = {
  id: string;
  sourceExperienceId: string;
  moment: CommercialMomentType;
  type: "continuation" | "voice_upgrade" | "build_it" | "custom" | "collection_item";
  maraLine: string;
  ctaLabel: string;
  scope: string;
  pricingState: "hypothesis";
  availability: AvailabilityPolicy;
  rewardStyle: RewardStyle;
  rewardLine?: string;
  resumeState: string;
  nextOfferId?: string;
  collectionId?: string;
};

export type CollectionDefinition = {
  id: string;
  title: string;
  itemIds: string[];
  prototypeOwnedItemIds: string[];
  completionReward: string;
};

export type MockCommercialState = {
  offerId?: string;
  premiumIntent: boolean;
  mockPurchased: boolean;
  rewardDelivered: boolean;
};
