export type MaraEvent =
  | "page_view"
  | "hero_cta_click"
  | "social_to_web"
  | "age_gate_view"
  | "age_gate_pass"
  | "age_gate_fail"
  | "meet_mara_view"
  | "premium_view"
  | "premium_cta_click"
  | "external_checkout_click"
  | "signup_start"
  | "signup_complete"
  | "first_paid_action"
  | "repeat_paid_action"
  | "returning_user"
  | "high_intent_session";

export function track(event: MaraEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("mara:analytics", {
      detail: { event, properties, timestamp: new Date().toISOString() },
    }),
  );

  if (process.env.NODE_ENV === "development") {
    console.info("[mara:analytics]", event, properties);
  }
}
