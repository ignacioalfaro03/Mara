export type PrivateStyle = "direct" | "slow";
export type CommercialDecision = "closed" | "offer_now";

export type PrivateMomentMemory = {
  preferredStyle: PrivateStyle | null;
  sessionCount: number;
  lastSessionAt: string | null;
  lastOfferAt: string | null;
  commercial: {
    decision: CommercialDecision;
    reason: string;
  };
};

type PrivateMomentPayload = {
  privateMoment?: PrivateMomentMemory;
};

async function requestPrivateMoment(init?: RequestInit): Promise<PrivateMomentMemory | null> {
  try {
    const response = await fetch("/api/relationship/private-moment", {
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      ...init,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as PrivateMomentPayload;
    return payload.privateMoment ?? null;
  } catch {
    return null;
  }
}

// Import at most the three completed launch scenes, once. These are narrative
// progress only, never entitlements or paid usage; existing account history wins.
export async function flushPendingPrivateStyle() {
  try {
    const local = JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}");
    if (local.preferredPrivateStyle !== "direct" && local.preferredPrivateStyle !== "slow") return;
    await requestPrivateMoment({
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "import_anonymous", style: local.preferredPrivateStyle,
        completedScenes: Math.min(3, Math.max(0, Math.floor(local.privateSessionCount || 0))) }),
    });
  } catch { /* The anonymous copy stays available for a later sign-in retry. */ }
}

export function loadPrivateMomentMemory() {
  return requestPrivateMoment();
}

export function completePrivateMomentMemory(style: PrivateStyle) {
  return requestPrivateMoment({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "complete", style }),
  });
}

export function markPrivateOfferShown() {
  return requestPrivateMoment({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "offer_shown" }),
  });
}
