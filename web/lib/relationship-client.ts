export type RelationshipSnapshot = {
  returnCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  lastVisualChoice?: "pose_a" | "pose_b" | null;
};

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
