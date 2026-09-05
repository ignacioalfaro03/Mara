export type CommercialExperimentVariant = "A_offer_only" | "B_reward" | "C_ownership";

export type CommercialExperimentConfig = {
  variant: CommercialExperimentVariant;
  showRewardContract: boolean;
  showOwnership: boolean;
};

export const COMMERCIAL_EXPERIMENT_KEY = "mara_p0_commerce_variant";

export const COMMERCIAL_EXPERIMENT_VARIANTS: CommercialExperimentVariant[] = [
  "A_offer_only",
  "B_reward",
  "C_ownership",
];

export function getCommercialExperimentConfig(variant: CommercialExperimentVariant): CommercialExperimentConfig {
  return {
    variant,
    showRewardContract: variant === "B_reward" || variant === "C_ownership",
    showOwnership: variant === "C_ownership",
  };
}

export function readCommercialExperimentVariant(): CommercialExperimentVariant | null {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(COMMERCIAL_EXPERIMENT_KEY) as CommercialExperimentVariant | null;
  return existing && COMMERCIAL_EXPERIMENT_VARIANTS.includes(existing) ? existing : null;
}

export function assignCommercialExperimentVariant(): CommercialExperimentVariant {
  if (typeof window === "undefined") return "A_offer_only";

  const existing = readCommercialExperimentVariant();
  if (existing) return existing;

  // Stable, zero-infrastructure P0 assignment. This is not statistical experimentation infrastructure.
  const seed = `${navigator.language}:${window.screen.width}:${window.screen.height}:${new Date().getDate()}`;
  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const assigned = COMMERCIAL_EXPERIMENT_VARIANTS[hash % COMMERCIAL_EXPERIMENT_VARIANTS.length];
  window.localStorage.setItem(COMMERCIAL_EXPERIMENT_KEY, assigned);
  return assigned;
}

export function setCommercialExperimentVariant(variant: CommercialExperimentVariant) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMMERCIAL_EXPERIMENT_KEY, variant);
}

export function resetCommercialExperimentVariant() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(COMMERCIAL_EXPERIMENT_KEY);
}
