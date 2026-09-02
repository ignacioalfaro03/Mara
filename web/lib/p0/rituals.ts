export type RitualFamily =
  | "appearance_tease"
  | "mara_choice"
  | "anticipation"
  | "ordinary_dare";

export type RitualRewardStyle = "praise" | "teasing" | "reveal" | "surprise" | "none";

export type RitualDefinition = {
  id: string;
  family: RitualFamily;
  title: string;
  maraLine: string;
  description: string;
  adultRequired: boolean;
  intensity: "low" | "medium" | "high";
  repeatWindow: "common" | "occasional" | "rare";
  rewardOptions: RitualRewardStyle[];
};

export type P0RitualSession = {
  ritualId: string;
  playIntent: boolean;
  completed: boolean;
  skipped: boolean;
  rewardPreference: RitualRewardStyle | null;
};

export const P0_RITUAL_STATE_KEY = "mara_p0_ritual_state";

export function writeP0RitualSession(session: P0RitualSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(P0_RITUAL_STATE_KEY, JSON.stringify(session));
}

export function readP0RitualSession(): P0RitualSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(P0_RITUAL_STATE_KEY);
    return raw ? (JSON.parse(raw) as P0RitualSession) : null;
  } catch {
    return null;
  }
}

export function clearP0RitualSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(P0_RITUAL_STATE_KEY);
}
