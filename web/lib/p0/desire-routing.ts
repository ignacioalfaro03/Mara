export type DesireRouteId = "D01" | "D02" | "D03" | "D04" | "D05" | "D06" | "D07" | "D08";

export type VoiceBand = "V0" | "V1" | "V2" | "V3";
export type DesireModality = "text" | "voice" | "image" | "mixed" | "external_media" | "ritual";
export type PaceAffinity = "fast" | "gradual" | "story_led" | "delayed";
export type ControlDirection = "mara_leads" | "user_leads" | "co_created";
export type Repeatability = "repeat_comfort" | "occasional" | "exploration";
export type NoveltyMode = "known_fit" | "adjacent" | "surprise";

export type DesireSurfacePlan = {
  id: DesireRouteId;
  internalLabel: string;
  testerDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  visualDirection: string;
  primaryCta: string;
  firstScenario: string;
  maraEnergy: string;
  preferredFormat: DesireModality;
  currentSessionIntent: string;
  pace: PaceAffinity;
  controlDirection: ControlDirection;
  repeatability: Repeatability;
  noveltyMode: NoveltyMode;
  voicePlan: {
    baseline: VoiceBand;
    peakAllowed: VoiceBand;
    v3Eligible: boolean;
  };
  consentTags: string[];
  rhythmArc: string[];
  featuredCaprichoIds: string[];
  productLadder: string[];
  commercialSurface: string;
  privacyNote: string;
};

export const P0_DESIRE_ROUTE_KEY = "mara_p0_desire_route";

const ROUTE_IDS: DesireRouteId[] = ["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08"];

export function isDesireRouteId(value: string): value is DesireRouteId {
  return ROUTE_IDS.includes(value as DesireRouteId);
}

export function readP0DesireRoute(): DesireRouteId | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(P0_DESIRE_ROUTE_KEY);
  return raw && isDesireRouteId(raw) ? raw : null;
}

export function writeP0DesireRoute(route: DesireRouteId) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(P0_DESIRE_ROUTE_KEY, route);
}

export function clearP0DesireRoute() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(P0_DESIRE_ROUTE_KEY);
}
