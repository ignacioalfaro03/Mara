export const LAUNCH_RITUAL_KEY = "junk_food_date_v1" as const;

const LOCAL_DM_STORAGE_KEY = "mara_dm_state_v1";

export type RitualMemory = {
  ritualKey: typeof LAUNCH_RITUAL_KEY;
  completedAt: string;
};

function hasLocalCompletedRitual() {
  if (typeof window === "undefined") return false;

  try {
    const raw = window.localStorage.getItem(LOCAL_DM_STORAGE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw) as { ritualCompletedAt?: unknown };
    if (typeof state.ritualCompletedAt !== "string") return false;
    return Number.isFinite(Date.parse(state.ritualCompletedAt));
  } catch {
    return false;
  }
}

export async function loadRitualMemory(): Promise<RitualMemory | null> {
  try {
    const response = await fetch("/api/relationship/ritual", { method: "GET", cache: "no-store" });
    if (!response.ok) return null;
    const payload = (await response.json()) as { ritual?: RitualMemory | null };
    return payload.ritual?.ritualKey === LAUNCH_RITUAL_KEY ? payload.ritual : null;
  } catch {
    return null;
  }
}

export async function completeRitualMemory(): Promise<RitualMemory | null> {
  try {
    const response = await fetch("/api/relationship/ritual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ritualKey: LAUNCH_RITUAL_KEY }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { ritual?: RitualMemory | null };
    return payload.ritual?.ritualKey === LAUNCH_RITUAL_KEY ? payload.ritual : null;
  } catch {
    return null;
  }
}

export async function flushPendingRitualMemory(): Promise<RitualMemory | null> {
  if (!hasLocalCompletedRitual()) return null;

  const existing = await loadRitualMemory();
  if (existing) return existing;

  return completeRitualMemory();
}
