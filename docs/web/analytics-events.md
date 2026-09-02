# Mara Vera — Analytics Events v0.4

## Principle

Collect only events that support acquisition, conversion, revenue, retention, product quality or safety decisions. Do not collect data merely because it is available.

Do not send raw message content, sexual preferences, identity documents, payment details or other intimate/sensitive content into general analytics tooling.

## Core web/funnel events
- `page_view`
- `hero_cta_click`
- `social_to_web`
- `age_gate_view`
- `age_gate_pass`
- `age_gate_fail`
- `meet_mara_view`
- `premium_view`
- `premium_cta_click`
- `external_checkout_click`
- `signup_start`
- `signup_complete`
- `returning_user`
- `high_intent_session`

## Desire discovery / playable personalization events
Use generic, non-intimate event names/properties:
- `discovery_game_viewed`
- `discovery_game_started`
- `discovery_choice_made`
- `discovery_ranking_submitted`
- `discovery_game_completed`
- `discovery_result_viewed`
- `discovery_result_confirmed`
- `discovery_result_corrected`
- `mara_prediction_shown`
- `mara_prediction_hit`
- `mara_prediction_miss`
- `surprise_me_selected`
- `preference_reset_requested`
- `safe_result_share_started`
- `safe_result_share_completed`

Do not place actual adult/fantasy answers in general analytics properties.

## Fantasy Compiler events
Track composition/routing without exposing intimate dimensions:
- `compiler_candidate_set_created`
- `compiler_recommendation_shown`
- `compiler_recommendation_opened`
- `compiled_experience_started`
- `compiled_experience_completed`
- `compiled_experience_skipped`
- `compiler_known_fit_selected`
- `compiler_explore_selected`
- `compiler_surprise_selected`
- `compiler_recommendation_corrected`
- `compiler_saturation_triggered`
- `compiler_continuation_prioritized`

Do not attach raw fantasy vectors or sensitive preference labels to general analytics.

## Interaction / relationship events
- `conversation_started`
- `meaningful_interaction`
- `voice_played`
- `voice_completed`
- `preference_onboarding_completed`
- `callback_delivered`
- `callback_positive_response`
- `memory_corrected`
- `memory_removed`
- `open_loop_created`
- `open_loop_resolved`
- `return_session`

## Narrative / fantasy-commerce events
- `story_started`
- `story_completed`
- `branch_selected`
- `preview_opened`
- `experience_viewed`
- `continuation_viewed`
- `continuation_purchased`
- `bundle_viewed`
- `custom_started`
- `custom_completed`
- `build_it_started`
- `build_it_completed`

## Monetization events
- `product_viewed`
- `paywall_seen`
- `checkout_started`
- `first_paid_action`
- `repeat_paid_action`
- `purchase_completed`
- `subscription_started`
- `subscription_cancelled`
- `refund_requested`
- `refund_completed`
- `payment_dispute_recorded`

## Adult-consent / safety events
Where adult mode exists:
- `adult_mode_gate_viewed`
- `adult_mode_opt_in`
- `adult_mode_opt_out`
- `adult_experience_started`
- `adult_experience_stopped`
- `adult_experience_skipped`
- `boundary_updated`
- `negative_reaction_reported`

Never encode the user's sexual preference/fantasy in event names or general properties.

## Recommended safe properties
Use only when relevant/non-sensitive:
- source channel;
- campaign/content identifier;
- product/experience identifier;
- discovery game identifier;
- discovery format (`ab`, `fast_five`, `ranking`, `guess_me`, `i_bet_you`, `build_it`, `surprise_me`);
- landing page / CTA / page path;
- experiment variant;
- anonymous/consented user identifier;
- relationship lifecycle state once first-party accounts exist;
- commercial state;
- personalization depth (`P0`–`P4`);
- preference confidence bucket only where non-sensitive;
- modality (`text`, `voice`, `image`, `video`, `mixed`);
- recommendation mode (`known_fit`, `explore`, `surprise_me`);
- experience family as a **non-sensitive experiment code**, not raw intimate label;
- offer type;
- price bucket/public SKU;
- acquisition cohort.

Do not attach:
- raw answer text;
- raw Experience Vector/User Desire Vector;
- adult-sensitive fantasy labels;
- vulnerability scores;
- psychological labels;
- orientation inference;
- raw conversation excerpts.

## Funnel views

### Acquisition
Reach → profile visit → social poll/quiz → social link click → web session

### Activation
Web session → age gate → playable discovery / meaningful interaction / first voice → compiler recommendation → premium intent

### Discovery
Game view → start → choices → prediction/reaction → reveal → confirm/correct → preference update candidate

### Compilation
Preference projection → eligible candidate set → known-fit/explore/Surprise Me → recommendation → experience start → reaction/correction

### Revenue
Premium intent → first payer → second payment → repeat spender → retained spender

### Narrative commerce
Preview → experience → branch → paid unlock → completion → continuation → repeat purchase

### Retention
Return → repeat interaction/discovery → compiled recommendation/callback/continuation → repeat paid action → D30 retained spender

## Decision metrics

### Acquisition
- Social→web CTR
- Social quiz/poll→web CTR
- Visitor→identified user

### Activation
- Signup→meaningful interaction
- Playable onboarding completion
- Discovery completion
- First voice engagement
- Compiler recommendation open rate
- Premium intent

### Discovery quality
- Game start/completion
- Choices/session
- Repeat discovery
- Mara Guess Accuracy
- Surprise Rate
- Correction Rate/Acceptance
- reveal confirmation

### Compiler quality
- Compiler Recommendation CTR
- Compiled Experience Start Rate
- Compiled Experience Completion Rate
- Known-fit acceptance
- Adjacent exploration acceptance
- Surprise Acceptance
- Compiler Correction Rate
- Saturation Trigger Rate
- Continuation Priority CTR
- Personalization Lift

`Personalization Lift` compares an adapted/compiled experience against an appropriate generic/control experience. Do not calculate it from vulnerability targeting.

### Monetization
- Visitor→first payer
- First→second payer
- Compiled/personalized vs generic conversion
- AOV
- ARPU / ARPPU
- purchase frequency
- bundle/custom conversion
- revenue per visitor/follower/content/experience
- contribution margin

### Retention
- D1/D7/D30 return
- repeat payer
- days between purchases
- story continuation
- return after discovery/compiler interaction
- 30-day retained spender

### Relationship quality
- successful callback
- open-loop resolution
- memory/preference correction
- creepiness/negative reaction
- personalized experience completion
- voice engagement/replay

### Adult product health
- adult-mode opt-in
- voluntary stop/skip
- repeat adult session
- refund/dispute
- negative-reaction/support rate

## Fantasy family performance reporting
At aggregate, privacy-safe level compare:
- demand;
- conversion;
- completion;
- continuation;
- second purchase;
- retention;
- contribution margin;
- production complexity;
- support/refund burden;
- compliance risk.

Do not publish tiny-cohort sensitive preference statistics.

## Data separation
General analytics should know **that** discovery/compilation occurred, not the intimate details of what a user chose.

Preference Graph / Relationship Memory / sensitive compiler inputs stay in purpose-limited storage/manual records with stronger controls.

Never publish claims such as “18% chose this” unless real, sufficiently aggregated and safe to expose.

## North-star candidates
Do not lock a custom North Star before evidence.

Compare:
- First payer→second payer
- Repeat Paying Users
- 30-day Retained Spenders
- Revenue per Active Relationship
- Paid Relationship Moments per Active Payer

A `Paid Relationship Moment` is a clearly purchased experience with perceived personal relevance; it is not merely a charge event.

Prefer the metric that best predicts **repeat spend × retention × satisfaction × contribution margin**.
