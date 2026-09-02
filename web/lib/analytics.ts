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
  | "high_intent_session"
  | "first_living_experience_started"
  | "playable_onboarding_started"
  | "choice_made"
  | "onboarding_completed"
  | "mara_prediction_shown"
  | "prediction_hit"
  | "prediction_miss"
  | "reveal_confirmed"
  | "reveal_corrected"
  | "experience_recommended"
  | "experience_opened"
  | "voice_played"
  | "voice_completed"
  | "surprise_me_selected"
  | "premium_intent"
  | "open_loop_created"
  | "return_session"
  | "negative_reaction"
  | "commercial_experiment_assigned"
  | "commercial_moment_shown"
  | "commercial_offer_dismissed"
  | "commercial_post_offer_continued"
  | "offer_opened"
  | "mock_purchase_completed"
  | "purchase_resume"
  | "reward_delivered"
  | "continuation_opened"
  | "collection_viewed"
  | "collection_item_acquired"
  | "scarcity_offer_viewed"
  | "scarcity_closed"
  | "custom_slot_interest"
  | "voice_upgrade_interest"
  | "wtp_price_assigned"
  | "wtp_price_shown"
  | "wtp_response_yes"
  | "wtp_response_maybe"
  | "wtp_response_no"
  | "wtp_post_price_continued"
  | "capricho_viewed"
  | "contribution_intent"
  | "contribution_amount_selected"
  | "team_selected"
  | "alias_visibility_selected"
  | "amount_visibility_selected"
  | "vote_cast"
  | "goal_progress_viewed"
  | "contributor_history_viewed"
  | "world_asset_reveal_viewed"
  | "goal_completion_simulated"
  | "goal_share_intent"
  | "desire_route_selected"
  | "desire_surface_plan_viewed"
  | "desire_route_fit"
  | "desire_route_correction";

export type MaraEventRecord = {
  event: MaraEvent;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
};

const P0_DEV_LOG_KEY = "mara_p0_event_log";
const P0_DEV_LOG_LIMIT = 250;

const P0_DEV_LOG_EVENTS = new Set<MaraEvent>([
  "first_living_experience_started",
  "playable_onboarding_started",
  "choice_made",
  "onboarding_completed",
  "mara_prediction_shown",
  "prediction_hit",
  "prediction_miss",
  "reveal_confirmed",
  "reveal_corrected",
  "experience_recommended",
  "experience_opened",
  "voice_played",
  "voice_completed",
  "surprise_me_selected",
  "premium_intent",
  "open_loop_created",
  "return_session",
  "commercial_experiment_assigned",
  "commercial_moment_shown",
  "commercial_offer_dismissed",
  "commercial_post_offer_continued",
  "offer_opened",
  "mock_purchase_completed",
  "purchase_resume",
  "reward_delivered",
  "continuation_opened",
  "collection_viewed",
  "collection_item_acquired",
  "scarcity_offer_viewed",
  "custom_slot_interest",
  "voice_upgrade_interest",
  "wtp_price_assigned",
  "wtp_price_shown",
  "wtp_response_yes",
  "wtp_response_maybe",
  "wtp_response_no",
  "wtp_post_price_continued",
  "capricho_viewed",
  "contribution_intent",
  "contribution_amount_selected",
  "team_selected",
  "alias_visibility_selected",
  "amount_visibility_selected",
  "vote_cast",
  "goal_progress_viewed",
  "contributor_history_viewed",
  "world_asset_reveal_viewed",
  "goal_completion_simulated",
  "goal_share_intent",
  "desire_route_selected",
  "desire_surface_plan_viewed",
  "desire_route_fit",
  "desire_route_correction",
]);

function appendDevelopmentEvent(record: MaraEventRecord) {
  if (process.env.NODE_ENV !== "development") return;
  if (!P0_DEV_LOG_EVENTS.has(record.event)) return;

  try {
    const raw = window.sessionStorage.getItem(P0_DEV_LOG_KEY);
    const previous = raw ? (JSON.parse(raw) as MaraEventRecord[]) : [];
    const next = [...previous, record].slice(-P0_DEV_LOG_LIMIT);
    window.sessionStorage.setItem(P0_DEV_LOG_KEY, JSON.stringify(next));
  } catch {
    // Debug logging must never break the user experience.
  }
}

export function readP0DevelopmentEventLog(): MaraEventRecord[] {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return [];

  try {
    const raw = window.sessionStorage.getItem(P0_DEV_LOG_KEY);
    return raw ? (JSON.parse(raw) as MaraEventRecord[]) : [];
  } catch {
    return [];
  }
}

export function clearP0DevelopmentEventLog() {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return;
  window.sessionStorage.removeItem(P0_DEV_LOG_KEY);
}

export function track(event: MaraEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;

  const detail: MaraEventRecord = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("mara:analytics", { detail }));
  appendDevelopmentEvent(detail);

  if (process.env.NODE_ENV === "development") {
    console.info("[mara:analytics]", event, properties);
  }
}
