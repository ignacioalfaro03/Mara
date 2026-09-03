export type RelationshipSnapshot = {
  returnCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  lastVisualChoice?: "pose_a" | "pose_b" | null;
  launchCompleted: boolean;
};

export async function loadRelationshipState(): Promise<RelationshipSnapshot | null> {
  try {
    const response = await fetch("/api/relationship", { method: "GET", cache: "no-store" });
    if (!response.ok) return null;

    const payload = (await response.json()) as { state?: RelationshipSnapshot | null };
    return payload.state ?? null;
  } catch {
    return null;
  }
}

export async function syncRelationshipState(snapshot: RelationshipSnapshot) {
  try {
    await fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot),
    });
  } catch {
    // Best-effort persistence. The playable experience must remain usable offline/backendless.
  }
}
