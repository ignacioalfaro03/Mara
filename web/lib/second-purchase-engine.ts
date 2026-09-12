export type SecondPurchaseStage = "care" | "ready" | "win_back" | "cooldown";
export type SecondPurchasePriority = "high" | "medium" | "low";

export type SecondPurchaseCustomer = {
  user_id: string | null;
  alias?: string | null;
  purchase_count?: number | null;
  fulfilled_purchase_count?: number | null;
  creator_gmv_minor?: number | null;
  last_purchase_at?: string | null;
  last_fulfillment_at?: string | null;
  last_creator_action_at?: string | null;
};

export type PendingPurchase = {
  user_id: string | null;
};

export type SecondPurchaseOpportunity = {
  userId: string;
  customerAlias: string | null;
  stage: SecondPurchaseStage;
  priority: SecondPurchasePriority;
  score: number;
  daysSinceLastPurchase: number;
  firstPurchaseGmvMinor: number;
  action: "post_purchase_followup" | "second_purchase_offer" | "reactivate_with_value" | "wait";
  title: string;
  reason: string;
  evidence: {
    purchaseCount: 1;
    fulfilledPurchaseCount: number;
    lastPurchaseAt: string;
    lastFulfillmentAt: string | null;
    lastCreatorActionAt: string | null;
    pendingFulfillment: false;
  };
};

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTION_COOLDOWN_DAYS = 7;

function daysSince(iso: string, nowMs: number) {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) return null;
  return Math.max(0, Math.floor((nowMs - time) / DAY_MS));
}

/**
 * Revenue OS wedge: turn a successful first purchase into a second purchase
 * without selling before value has been delivered.
 *
 * Invariants:
 * - exactly one succeeded purchase;
 * - at least one fulfilled purchase;
 * - no currently pending fulfillment for that creator/customer;
 * - respect a creator-action cooldown after the purchase;
 * - deterministic evidence only; no psychographic inference or fake urgency.
 */
export function buildSecondPurchaseOpportunities(
  customers: readonly SecondPurchaseCustomer[],
  pendingPurchases: readonly PendingPurchase[],
  now = new Date(),
): SecondPurchaseOpportunity[] {
  const pendingUsers = new Set(
    pendingPurchases
      .map((purchase) => purchase.user_id)
      .filter((userId): userId is string => Boolean(userId)),
  );
  const nowMs = now.getTime();

  const opportunities: SecondPurchaseOpportunity[] = [];

  for (const customer of customers) {
    if (!customer.user_id || customer.purchase_count !== 1) continue;
    if ((customer.fulfilled_purchase_count ?? 0) < 1) continue;
    if (pendingUsers.has(customer.user_id)) continue;
    if (!customer.last_purchase_at) continue;

    const purchaseMs = Date.parse(customer.last_purchase_at);
    const days = daysSince(customer.last_purchase_at, nowMs);
    if (days === null || !Number.isFinite(purchaseMs)) continue;

    const actionMs = customer.last_creator_action_at ? Date.parse(customer.last_creator_action_at) : Number.NaN;
    const daysSinceLastAction = Number.isFinite(actionMs)
      ? Math.max(0, Math.floor((nowMs - actionMs) / DAY_MS))
      : null;
    const inActionCooldown = Number.isFinite(actionMs)
      && actionMs >= purchaseMs
      && daysSinceLastAction !== null
      && daysSinceLastAction < ACTION_COOLDOWN_DAYS;

    let stage: SecondPurchaseStage;
    let priority: SecondPurchasePriority;
    let score: number;
    let action: SecondPurchaseOpportunity["action"];
    let title: string;
    let reason: string;

    if (inActionCooldown) {
      stage = "cooldown";
      priority = "low";
      score = 20;
      action = "wait";
      title = "Ya actuaste con este cliente. Dale espacio.";
      reason = "Hubo una acción comercial reciente después de la primera compra. Mara aplica un cooldown de 7 días para evitar presión repetitiva.";
    } else if (days <= 3) {
      stage = "care";
      priority = "low";
      score = 40 + days;
      action = "post_purchase_followup";
      title = "Protege la primera compra antes de volver a vender.";
      reason = "La primera compra ya fue entregada, pero sigue demasiado reciente para presionar una segunda venta.";
    } else if (days <= 10) {
      stage = "care";
      priority = "medium";
      score = 58 + days;
      action = "post_purchase_followup";
      title = "Haz seguimiento y abre la puerta a la segunda compra.";
      reason = "Es un primer comprador con valor ya entregado. Conviene confirmar experiencia y detectar el siguiente problema antes de ofrecer.";
    } else if (days <= 30) {
      stage = "ready";
      priority = "high";
      score = Math.max(72, 94 - (days - 11));
      action = "second_purchase_offer";
      title = "Este cliente está en ventana de segunda compra.";
      reason = "Tiene exactamente una compra, ya recibió el valor y no tiene entregas pendientes. Es una oportunidad limpia para una oferta siguiente relevante.";
    } else {
      stage = "win_back";
      priority = "medium";
      score = Math.max(45, 68 - Math.floor((days - 31) / 7));
      action = "reactivate_with_value";
      title = "Recupera la relación antes de pedir una segunda compra.";
      reason = "Sigue siendo un comprador de una sola vez, pero la relación ya está fría. Reintroduce valor antes de vender.";
    }

    opportunities.push({
      userId: customer.user_id,
      customerAlias: customer.alias ?? null,
      stage,
      priority,
      score,
      daysSinceLastPurchase: days,
      firstPurchaseGmvMinor: customer.creator_gmv_minor ?? 0,
      action,
      title,
      reason,
      evidence: {
        purchaseCount: 1,
        fulfilledPurchaseCount: customer.fulfilled_purchase_count ?? 0,
        lastPurchaseAt: customer.last_purchase_at,
        lastFulfillmentAt: customer.last_fulfillment_at ?? null,
        lastCreatorActionAt: customer.last_creator_action_at ?? null,
        pendingFulfillment: false,
      },
    });
  }

  return opportunities.sort((a, b) => {
    const priorityRank = { high: 0, medium: 1, low: 2 } as const;
    const priorityDelta = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDelta !== 0) return priorityDelta;
    if (b.score !== a.score) return b.score - a.score;
    return a.daysSinceLastPurchase - b.daysSinceLastPurchase;
  });
}
