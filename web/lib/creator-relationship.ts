import { serviceRest } from "@/lib/supabase/server-rest";

export async function touchCreatorCustomerRelationship(creatorId: string, userId: string, attributionSource = "mara") {
  const now = new Date().toISOString();
  const source = ["creator", "mara", "cross_world", "unknown"].includes(attributionSource) ? attributionSource : "unknown";
  return serviceRest<unknown>("creator_customer_relationships?on_conflict=creator_id,user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      creator_id: creatorId,
      user_id: userId,
      attribution_source: source,
      last_activity_at: now,
      updated_at: now,
    }),
  });
}
