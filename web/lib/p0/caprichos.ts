export type CaprichoCategory =
  | "personal_capricho"
  | "maras_world"
  | "make_mara_better"
  | "mara_garage"
  | "experience_goal";

export type CaprichoStatus =
  | "draft"
  | "open"
  | "funding"
  | "funded"
  | "clearing"
  | "fulfillment"
  | "reveal"
  | "canonicalized"
  | "lived"
  | "archived";

export type WorldAssetStatus =
  | "wanted"
  | "funding"
  | "funded"
  | "acquiring"
  | "acquired"
  | "canonical"
  | "active"
  | "archived"
  | "sold";

export type ContributionIdentityMode = "anonymous" | "alias";
export type AmountVisibility = "hidden" | "public";

export type CaprichoTeam = {
  id: string;
  label: string;
  prototypeFundedCents: number;
};

export type CaprichoDefinition = {
  id: string;
  title: string;
  category: CaprichoCategory;
  maraLine: string;
  targetCents: number;
  prototypeFundedCents: number;
  prototypeContributorCount: number;
  currency: "USD";
  physical: boolean;
  worldAssetId: string;
  status: CaprichoStatus;
  worldAssetStatus: WorldAssetStatus;
  overfundingPolicy: "hard_close";
  failurePolicy: "open_ended";
  contributorPayoff: string;
  fantasyEligible: boolean;
  companyCofundCents?: number;
  teams?: CaprichoTeam[];
};

export type P0CaprichoParticipation = {
  caprichoId: string;
  amountCents: number;
  identityMode: ContributionIdentityMode;
  alias: string | null;
  amountVisibility: AmountVisibility;
  teamId: string | null;
  createdAt: string;
};

export const P0_CAPRICHOS_STATE_KEY = "mara_p0_caprichos_state";

export function caprichoProgressPercent(goal: CaprichoDefinition): number {
  if (goal.targetCents <= 0) return 0;
  return Math.min(100, Math.round((goal.prototypeFundedCents / goal.targetCents) * 100));
}

export function formatUsdCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function readP0CaprichoParticipation(): P0CaprichoParticipation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(P0_CAPRICHOS_STATE_KEY);
    return raw ? (JSON.parse(raw) as P0CaprichoParticipation[]) : [];
  } catch {
    return [];
  }
}

export function writeP0CaprichoParticipation(next: P0CaprichoParticipation[]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(P0_CAPRICHOS_STATE_KEY, JSON.stringify(next));
}

export function clearP0CaprichoParticipation() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(P0_CAPRICHOS_STATE_KEY);
}
