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
      ...init,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as PrivateMomentPayload;
    return payload.privateMoment ?? null;
  } catch {
    return null;
  }
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
