export type MaraEvent =
  | "page_view"
  | "landing_view"
  | "hero_cta_click"
  | "mara_entered"
  | "social_to_web"
  | "age_gate_view"
  | "age_gate_pass"
  | "age_gate_accepted"
  | "age_gate_fail"
  | "meet_mara_view"
  | "premium_view"
  | "premium_cta_click"
  | "external_checkout_click"
  | "signup_start"
  | "signup_started"
  | "signup_complete"
  | "signup_completed"
  | "signin_started"
  | "signin_completed"
  | "first_paid_action"
  | "repeat_paid_action"
  | "returning_user"
  | "high_intent_session"
  | "launch_experience_started"
  | "experience_started"
  | "launch_session_completed"
  | "experience_completed"
  | "launch_return_continued"
  | "launch_state_reset"
  | "visual_choice_completed"
  | "preference_selected"
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
  | "commerce_offer_viewed"
  | "commerce_checkout_started"
  | "commerce_checkout_blocked"
  | "commerce_checkout_returned"
  | "commerce_entitlement_unlocked"
  | "commerce_contribution_progress_viewed"
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
  | "desire_route_correction"
  | "external_media_recommended"
  | "external_media_watch_intent"
  | "external_media_return_simulated"
  | "external_media_reaction"
  | "external_media_learning_shown"
  | "ritual_viewed"
  | "ritual_play_intent"
  | "ritual_completed_simulated"
  | "ritual_skipped"
  | "ritual_reward_preference";

export type MaraEventRecord = {
  event: MaraEvent;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
};

type PublicEntrySource = "ig" | "tt" | "x" | "direct" | "other";

const P0_DEV_LOG_KEY = "mara_p0_event_log";
const P0_DEV_LOG_LIMIT = 250;
const PUBLIC_ENTRY_SOURCE_KEY = "mara_public_entry_source_v1";
const PUBLIC_ENTRY_SOURCES = new Set<PublicEntrySource>(["ig", "tt", "x", "direct", "other"]);

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
  "commerce_offer_viewed",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
  "commerce_contribution_progress_viewed",
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
  "external_media_recommended",
  "external_media_watch_intent",
  "external_media_return_simulated",
  "external_media_reaction",
  "external_media_learning_shown",
  "ritual_viewed",
  "ritual_play_intent",
  "ritual_completed_simulated",
  "ritual_skipped",
  "ritual_reward_preference",
]);

// Only these public-alpha events may leave the browser through the first-party
// telemetry endpoint. No conversation text, intimate answers, aliases, payment
// data or user identifiers are accepted by this launch path.
const PUBLIC_ALPHA_TELEMETRY_EVENTS = new Set<MaraEvent>([
  "page_view",
  "landing_view",
  "hero_cta_click",
  "mara_entered",
  "social_to_web",
  "age_gate_view",
  "age_gate_pass",
  "age_gate_accepted",
  "age_gate_fail",
  "meet_mara_view",
  "returning_user",
  "launch_experience_started",
  "experience_started",
  "launch_session_completed",
  "experience_completed",
  "launch_return_continued",
  "launch_state_reset",
  "visual_choice_completed",
  "preference_selected",
  "prediction_hit",
  "prediction_miss",
  "signup_started",
  "signup_completed",
  "signin_started",
  "signin_completed",
  "capricho_viewed",
  "commerce_offer_viewed",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
  "commerce_contribution_progress_viewed",
]);

function publicEntrySource(): PublicEntrySource {
  if (typeof window === "undefined") return "direct";

  try {
    const raw = new URLSearchParams(window.location.search).get("src")?.trim().toLowerCase();
    if (raw) {
      const source = PUBLIC_ENTRY_SOURCES.has(raw as PublicEntrySource)
        ? (raw as PublicEntrySource)
        : "other";
      window.sessionStorage.setItem(PUBLIC_ENTRY_SOURCE_KEY, source);
      return source;
    }

    const stored = window.sessionStorage.getItem(PUBLIC_ENTRY_SOURCE_KEY);
    if (stored && PUBLIC_ENTRY_SOURCES.has(stored as PublicEntrySource)) {
      return stored as PublicEntrySource;
    }

    window.sessionStorage.setItem(PUBLIC_ENTRY_SOURCE_KEY, "direct");
    return "direct";
  } catch {
    return "direct";
  }
}

function publicAlphaProperties(
  event: MaraEvent,
  properties: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> {
  if (!PUBLIC_ALPHA_TELEMETRY_EVENTS.has(event)) return properties;

  // Entry attribution is intentionally coarse and session-scoped. We do not
  // forward arbitrary UTM/campaign strings, referrers, social handles or IDs.
  return {
    ...properties,
    entry_source: publicEntrySource(),
  };
}

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

function sendPublicAlphaTelemetry(record: MaraEventRecord) {
  if (process.env.NODE_ENV !== "production") return;
  if (!PUBLIC_ALPHA_TELEMETRY_EVENTS.has(record.event)) return;

  try {
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => undefined);
  } catch {
    // Telemetry must never interrupt Mara.
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
    properties: publicAlphaProperties(event, properties),
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("mara:analytics", { detail }));
  appendDevelopmentEvent(detail);
  sendPublicAlphaTelemetry(detail);

  if (process.env.NODE_ENV === "development") {
    console.info("[mara:analytics]", event, detail.properties);
  }
}
