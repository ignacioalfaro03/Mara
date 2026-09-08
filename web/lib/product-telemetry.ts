export type ProductEvent =
  | "creator_onboarding_started"
  | "creator_activated"
  | "creator_world_created"
  | "creator_offer_created"
  | "creator_opportunity_viewed"
  | "creator_next_action_used"
  | "world_viewed"
  | "taste_signal_created"
  | "weakness_saved"
  | "demand_created"
  | "want_created"
  | "pledge_created"
  | "commit_created"
  | "offer_viewed"
  | "purchase_completed"
  | "fulfillment_viewed"
  | "history_viewed"
  | "returning_user";

type ProductProperties = {
  surface?: string;
  target?: string;
  placement?: string;
  preference_group?: string;
  offer_slug?: string;
  offer_type?: string;
  currency?: string;
};

export async function emitProductEvent(request: Request, event: ProductEvent, properties: ProductProperties = {}) {
  try {
    await fetch(new URL("/api/telemetry", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() }),
      cache: "no-store",
    });
  } catch {
    // Product writes must not fail because anonymous launch analytics is unavailable.
  }
}
