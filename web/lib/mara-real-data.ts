import type { Tables } from "@/lib/supabase/database.types";
import { first, publicRest, userRest } from "@/lib/supabase/server-rest";

export type CreatorRow = Tables<"creators">;
export type WorldRow = Tables<"creator_worlds">;
export type OfferRow = Tables<"commerce_offers">;
export type PurchaseRow = Tables<"commerce_purchases">;
export type DemandRow = Tables<"demand_requests">;
export type DemandMetricRow = Tables<"demand_request_metrics">;
export type DeclaredPreferenceRow = Tables<"user_declared_preferences">;
export type CustomerSummaryRow = Tables<"creator_customer_summary">;
export type DemandOpportunityRow = Tables<"creator_demand_opportunities">;
export type NextBestActionRow = Tables<"creator_next_best_actions">;
export type ActivityHistoryRow = Tables<"user_activity_history">;
export type DemandSignalRow = Tables<"demand_signals">;

function boundedLimit(limit: number, fallback: number) {
  if (!Number.isFinite(limit)) return fallback;
  return Math.max(1, Math.min(50, Math.floor(limit)));
}

export async function readOwnCreator(accessToken: string, userId: string) {
  return first(await userRest<CreatorRow[]>(accessToken, `creators?select=*&user_id=eq.${encodeURIComponent(userId)}&limit=1`));
}

export async function readOwnWorlds(accessToken: string, creatorId: string) {
  const result = await userRest<WorldRow[]>(accessToken, `creator_worlds?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=created_at.asc`);
  return result.ok ? result.data : [];
}

export async function readWorld(slug: string, accessToken?: string) {
  const path = `creator_worlds?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`;
  return first(accessToken ? await userRest<WorldRow[]>(accessToken, path) : await publicRest<WorldRow[]>(path));
}

export async function readPublicWorlds(limit = 8) {
  const safeLimit = boundedLimit(limit, 8);
  const path = `creator_worlds?select=*&visibility=eq.public&status=eq.active&order=updated_at.desc&limit=${safeLimit}`;
  const result = await publicRest<WorldRow[]>(path);
  return result.ok ? result.data : [];
}

export async function readWorldOffers(worldId: string, accessToken?: string, owner = false) {
  const status = owner ? "" : "&status=eq.active";
  const path = `commerce_offers?select=*&world_id=eq.${encodeURIComponent(worldId)}${status}&order=created_at.desc`;
  const result = accessToken ? await userRest<OfferRow[]>(accessToken, path) : await publicRest<OfferRow[]>(path);
  return result.ok ? result.data : [];
}

export async function readWorldDemand(worldId: string, accessToken?: string) {
  const path = `demand_requests?select=*&world_id=eq.${encodeURIComponent(worldId)}&status=in.(open,validated,unlocked,offered)&order=updated_at.desc`;
  const result = accessToken ? await userRest<DemandRow[]>(accessToken, path) : await publicRest<DemandRow[]>(path);
  return result.ok ? result.data : [];
}

export async function readPublicDemand(limit = 12) {
  const safeLimit = boundedLimit(limit, 12);
  const path = `demand_requests?select=*&status=in.(open,validated,unlocked,offered)&order=updated_at.desc&limit=${safeLimit}`;
  const result = await publicRest<DemandRow[]>(path);
  return result.ok ? result.data : [];
}

export async function readDemandMetrics(ids: string[], accessToken?: string) {
  if (ids.length === 0) return [] as DemandMetricRow[];
  const encoded = ids.map((id) => encodeURIComponent(id)).join(",");
  const path = `demand_request_metrics?select=*&demand_request_id=in.(${encoded})`;
  const result = accessToken ? await userRest<DemandMetricRow[]>(accessToken, path) : await publicRest<DemandMetricRow[]>(path);
  return result.ok ? result.data : [];
}

export async function readWeakness(accessToken: string, userId: string, world?: WorldRow | null) {
  const scope = world ? "creator_world" : "network";
  const extra = world ? `&creator_id=eq.${encodeURIComponent(world.creator_id)}&world_id=eq.${encodeURIComponent(world.id)}` : "&creator_id=is.null&world_id=is.null";
  return first(await userRest<DeclaredPreferenceRow[]>(accessToken, `user_declared_preferences?select=*&user_id=eq.${encodeURIComponent(userId)}&preference_type=eq.weakness&scope=eq.${scope}${extra}&limit=1`));
}

export async function readUserWorldHistory(accessToken: string, userId: string, worldId: string) {
  const result = await userRest<ActivityHistoryRow[]>(accessToken, `user_activity_history?select=*&user_id=eq.${encodeURIComponent(userId)}&world_id=eq.${encodeURIComponent(worldId)}&order=event_at.desc&limit=12`);
  return result.ok ? result.data : [];
}

export async function readCreatorDashboard(accessToken: string, creatorId: string) {
  const [customers, opportunities, nextActions, purchases, offers] = await Promise.all([
    userRest<CustomerSummaryRow[]>(accessToken, `creator_customer_summary?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=last_activity_at.desc&limit=50`),
    userRest<DemandOpportunityRow[]>(accessToken, `creator_demand_opportunities?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=progress_percent.desc&limit=30`),
    userRest<NextBestActionRow[]>(accessToken, `creator_next_best_actions?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=priority.asc&limit=50`),
    userRest<PurchaseRow[]>(accessToken, `commerce_purchases?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&status=eq.succeeded&order=created_at.desc&limit=50`),
    userRest<OfferRow[]>(accessToken, `commerce_offers?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=created_at.desc&limit=50`),
  ]);
  return {
    customers: customers.ok ? customers.data : [],
    opportunities: opportunities.ok ? opportunities.data : [],
    nextActions: nextActions.ok ? nextActions.data : [],
    purchases: purchases.ok ? purchases.data : [],
    offers: offers.ok ? offers.data : [],
  };
}

export function formatMoney(minor: number | null | undefined, currency = "CLP") {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency, maximumFractionDigits: currency === "CLP" ? 0 : 2 }).format((minor ?? 0) / 100);
}

export function historyCopy(eventType: string | null) {
  const labels: Record<string, string> = {
    preference_declared: "Mara guardó algo que decidiste contarle.",
    declared_preference: "Mara guardó algo que decidiste contarle.",
    taste_signal: "Elegiste una opción y Mara aprendió un poco más de tu gusto.",
    want: "Ayudaste a que una idea empezara a crecer.",
    demand_want: "Ayudaste a que una idea empezara a crecer.",
    pledge: "Mostraste interés serio en una idea.",
    demand_pledge: "Mostraste interés serio en una idea.",
    commit: "Te comprometiste con una idea si llega a concretarse.",
    demand_commit: "Te comprometiste con una idea si llega a concretarse.",
    demand_created: "Propusiste algo que te gustaría ver aquí.",
    purchase_completed: "Compraste algo en este World.",
    purchase: "Compraste algo en este World.",
    fulfillment_completed: "La creadora entregó una compra tuya.",
    fulfillment: "La creadora entregó una compra tuya.",
  };
  const key = eventType?.trim().toLowerCase() ?? "";
  return labels[key] ?? "Algo cambió en tu relación con este World.";
}