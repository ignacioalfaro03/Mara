export type MaraEvent =
  | "page_view"
  | "landing_view"
  | "session_started"
  | "hero_cta_click"
  | "cta_clicked"
  | "mara_entered"
  | "first_interaction"
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
  | "memory_recall_rendered"
  | "memory_recall_engaged"
  | "high_intent_session"
  | "launch_experience_started"
  | "experience_started"
  | "launch_session_completed"
  | "experience_completed"
  | "launch_return_continued"
  | "launch_state_reset"
  | "visual_choice_completed"
  | "preference_selected"
  | "first_preference_signal"
  | "preference_updated"
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
  | "paywall_impression"
  | "offer_viewed"
  | "offer_clicked"
  | "commerce_offer_viewed"
  | "commerce_checkout_started"
  | "commerce_checkout_blocked"
  | "commerce_checkout_returned"
  | "commerce_entitlement_unlocked"
  | "purchase_completed"
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
  | "ritual_completed"
  | "ritual_completed_simulated"
  | "ritual_skipped"
  | "ritual_reward_preference";

export type MaraEventRecord = {
  event: MaraEvent;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
  sessionId?: string;
};

type PublicEntrySource = "ig" | "tt" | "x" | "direct" | "other";

const P0_DEV_LOG_KEY = "mara_p0_event_log";
const P0_DEV_LOG_LIMIT = 250;
const PUBLIC_ENTRY_SOURCE_KEY = "mara_public_entry_source_v1";
const PUBLIC_SESSION_ID_KEY = "mara_public_session_id_v1";
const PUBLIC_SESSION_STARTED_KEY = "mara_public_session_started_v1";
const PUBLIC_ENTRY_SOURCES = new Set<PublicEntrySource>(["ig", "tt", "x", "direct", "other"]);

const P0_DEV_LOG_EVENTS = new Set<MaraEvent>([
  "session_started",
  "first_interaction",
  "memory_recall_rendered",
  "memory_recall_engaged",
  "first_preference_signal",
  "preference_updated",
  "paywall_impression",
  "offer_viewed",
  "offer_clicked",
  "purchase_completed",
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
  "ritual_completed",
  "ritual_completed_simulated",
  "ritual_skipped",
  "ritual_reward_preference",
]);

// Only launch events with an active producer and a current founder decision may
// leave the browser through the first-party telemetry endpoint. Parked/dev-lab
// event names stay typed for experiments but are not part of the public contract.
const PUBLIC_ALPHA_TELEMETRY_EVENTS = new Set<MaraEvent>([
  "page_view",
  "landing_view",
  "session_started",
  "hero_cta_click",
  "cta_clicked",
  "mara_entered",
  "first_interaction",
  "social_to_web",
  "age_gate_view",
  "age_gate_pass",
  "age_gate_accepted",
  "age_gate_fail",
  "returning_user",
  "memory_recall_rendered",
  "memory_recall_engaged",
  "launch_experience_started",
  "experience_started",
  "experience_completed",
  "launch_return_continued",
  "launch_state_reset",
  "preference_selected",
  "first_preference_signal",
  "preference_updated",
  "signup_started",
  "signup_completed",
  "signin_started",
  "signin_completed",
  "ritual_viewed",
  "ritual_completed",
  "ritual_skipped",
  "commercial_offer_dismissed",
  "commercial_post_offer_continued",
  "paywall_impression",
  "offer_viewed",
  "offer_clicked",
  "capricho_viewed",
  "commerce_offer_viewed",
  "commerce_checkout_started",
  "commerce_checkout_blocked",
  "commerce_checkout_returned",
  "commerce_entitlement_unlocked",
  "purchase_completed",
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

function publicSessionId() {
  if (typeof window === "undefined") return undefined;

  try {
    const existing = window.sessionStorage.getItem(PUBLIC_SESSION_ID_KEY);
    if (existing) return existing;
    const next = crypto.randomUUID();
    window.sessionStorage.setItem(PUBLIC_SESSION_ID_KEY, next);
    return next;
  } catch {
    return undefined;
  }
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
      body: JSON.stringify({ ...record, sessionId: record.sessionId ?? publicSessionId() }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => undefined);
  } catch {
    // Telemetry must never interrupt Mara.
  }
}

function emit(record: MaraEventRecord) {
  window.dispatchEvent(new CustomEvent("mara:analytics", { detail: record }));
  appendDevelopmentEvent(record);
  sendPublicAlphaTelemetry(record);

  if (process.env.NODE_ENV === "development") {
    console.info("[mara:analytics]", record.event, record.properties);
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

export function trackPublicSessionStarted(surface: string) {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(PUBLIC_SESSION_STARTED_KEY) === "true") return;
    window.sessionStorage.setItem(PUBLIC_SESSION_STARTED_KEY, "true");
  } catch {
    // A missing sessionStorage should not stop ordinary page telemetry.
  }

  track("session_started", { surface });
}

export function track(event: MaraEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;

  // The current DM historically emits ritual_play_intent at exposure time.
  // Suppress that false signal entirely until a genuine intent interaction exists.
  if (event === "ritual_play_intent" && properties.surface === "dm_experience") return;

  const timestamp = new Date().toISOString();
  const detail: MaraEventRecord = {
    event,
    properties: publicAlphaProperties(event, properties),
    timestamp,
    sessionId: publicSessionId(),
  };

  emit(detail);

  if (event === "hero_cta_click") {
    emit({
      event: "cta_clicked",
      properties: publicAlphaProperties("cta_clicked", properties),
      timestamp,
      sessionId: detail.sessionId,
    });
  }

  // The concrete ritual completion already exists in product logic as
  // experience_completed on dm_ritual. Normalize it into a dedicated event so
  // launch reporting measures a real user action without duplicating DM state.
  if (event === "experience_completed" && properties.surface === "dm_ritual") {
    emit({
      event: "ritual_completed",
      properties: publicAlphaProperties("ritual_completed", properties),
      timestamp,
      sessionId: detail.sessionId,
    });
  }

  if (event === "commerce_offer_viewed") {
    emit({
      event: "offer_viewed",
      properties: publicAlphaProperties("offer_viewed", properties),
      timestamp,
      sessionId: detail.sessionId,
    });
    emit({
      event: "paywall_impression",
      properties: publicAlphaProperties("paywall_impression", properties),
      timestamp,
      sessionId: detail.sessionId,
    });
  }

  if (event === "commerce_entitlement_unlocked") {
    emit({
      event: "purchase_completed",
      properties: publicAlphaProperties("purchase_completed", properties),
      timestamp,
      sessionId: detail.sessionId,
    });
  }
}
