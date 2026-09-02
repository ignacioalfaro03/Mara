export type DesireRouteId = "D01" | "D02" | "D03" | "D04" | "D05";

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
  preferredFormat: "text" | "voice" | "image" | "mixed";
  featuredCaprichoIds: string[];
  commercialSurface: string;
  privacyNote: string;
};

export const P0_DESIRE_ROUTE_KEY = "mara_p0_desire_route";

export function readP0DesireRoute(): DesireRouteId | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(P0_DESIRE_ROUTE_KEY);
  return raw === "D01" || raw === "D02" || raw === "D03" || raw === "D04" || raw === "D05" ? raw : null;
}

export function writeP0DesireRoute(route: DesireRouteId) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(P0_DESIRE_ROUTE_KEY, route);
}

export function clearP0DesireRoute() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(P0_DESIRE_ROUTE_KEY);
}
