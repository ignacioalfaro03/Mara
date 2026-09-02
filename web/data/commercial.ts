import type { CollectionDefinition, OfferDefinition } from "@/lib/p0/commercial";

export const offers: OfferDefinition[] = [
  {
    id: "voice_continue_01",
    sourceExperienceId: "relationship_callback_voice_01",
    moment: "anticipation",
    type: "voice_upgrade",
    maraLine: "La otra parte te la mandaría en voz.",
    ctaLabel: "Quiero escuchar eso",
    scope: "Continuación breve por voz. P0 mide intención; no hay precio ni cobro activo.",
    pricingState: "hypothesis",
    availability: {
      type: "always_available",
      ownershipAfterPurchase: "permanent",
    },
    rewardStyle: "praise",
    rewardLine: "Good boy. Así me gusta: si vas a seguir, sigue bien.",
    resumeState: "relationship_callback_voice_01:after_unlock",
    nextOfferId: "build_it_deeper_01",
  },
  {
    id: "gym_continue_01",
    sourceExperienceId: "gym_late_voice_01",
    moment: "personal_relevance",
    type: "continuation",
    maraLine: "Esta sí la podría seguir desde lo que acabas de elegirme.",
    ctaLabel: "Yo seguiría",
    scope: "Continuación contextual del momento actual. P0 intent only.",
    pricingState: "hypothesis",
    availability: {
      type: "always_available",
      ownershipAfterPurchase: "permanent",
    },
    rewardStyle: "acknowledgement",
    rewardLine: "Ya. Ahora sí tiene sentido seguirla.",
    resumeState: "gym_late_voice_01:continuation",
    nextOfferId: "prototype_custom_slot_01",
  },
  {
    id: "build_it_deeper_01",
    sourceExperienceId: "build_it_01",
    moment: "participation",
    type: "build_it",
    maraLine: "Si vas a elegir, quiero que tus decisiones cambien de verdad el resultado.",
    ctaLabel: "Quiero elegir más",
    scope: "Build It con más agencia. P0 intent only.",
    pricingState: "hypothesis",
    availability: {
      type: "always_available",
      ownershipAfterPurchase: "permanent",
    },
    rewardStyle: "progression",
    rewardLine: "Bien. Ya no te estoy dando una versión genérica.",
    resumeState: "build_it_01:deep_control",
    nextOfferId: "prototype_custom_slot_01",
  },
  {
    id: "prototype_custom_slot_01",
    sourceExperienceId: "selective_tease_01",
    moment: "scarcity",
    type: "custom",
    maraLine: "Esta sería de las que no puedo hacer infinitas si requieren revisión manual.",
    ctaLabel: "Me interesaría un custom",
    scope: "Ejemplo P0 de custom con capacidad operativa limitada. No representa inventario real.",
    pricingState: "hypothesis",
    availability: {
      type: "capacity_limited",
      prototypeOnly: true,
      capacityTotal: 12,
      capacityRemaining: 12,
      reason: "prototype_manual_voice_qc_capacity",
      ownershipAfterPurchase: "permanent",
    },
    rewardStyle: "teasing",
    rewardLine: "No te emociones. Esto era la prueba; el custom real tendría que ganarse su lugar.",
    resumeState: "selective_tease_01:custom_interest",
    collectionId: "night_series_p0",
  },
];

export const nightSeries: CollectionDefinition = {
  id: "night_series_p0",
  title: "Night Series · P0",
  itemIds: ["late_work", "gym", "cant_sleep", "saturday_night"],
  prototypeOwnedItemIds: ["late_work"],
  completionReward: "Epilogue voice · prototype concept",
};

export function getOfferForExperience(experienceId: string) {
  return offers.find((offer) => offer.sourceExperienceId === experienceId) ?? offers[0];
}
