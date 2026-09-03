export const LAUNCH_RITUAL_KEY = "junk_food_date_v1" as const;

export type RitualMemory = {
  ritualKey: typeof LAUNCH_RITUAL_KEY;
  completedAt: string;
};

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
