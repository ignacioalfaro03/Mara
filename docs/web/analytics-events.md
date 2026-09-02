# Mara Vera — Analytics Events v0.3

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

Use generic, non-intimate event names and properties:

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
- `personalized_next_experience_shown`
- `personalized_next_experience_opened`

Do not place the actual sexual/fantasy answer in general event properties.

## Interaction / relationship events

Use only where the corresponding product exists:
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

Where adult mode exists, use non-content-bearing events such as:
- `adult_mode_gate_viewed`
- `adult_mode_opt_in`
- `adult_mode_opt_out`
- `adult_experience_started`
- `adult_experience_stopped`
- `adult_experience_skipped`
- `boundary_updated`
- `negative_reaction_reported`

Do not encode the user's sexual preference or fantasy in the event name/property.

## Recommended event properties

Use only when relevant and non-sensitive:
- source channel;
- campaign/content identifier;
- product/experience identifier;
- discovery game identifier;
- discovery format (`ab`, `fast_five`, `ranking`, `guess_me`, `i_bet_you`, `build_it`, `surprise_me`);
- landing page;
- CTA identifier;
- page path;
- experiment variant;
- anonymous/consented user identifier;
- relationship lifecycle state once first-party accounts exist;
- commercial state;
- personalization depth (`P0`–`P4`) without storing intimate content;
- preference confidence bucket (`low`, `medium`, `high`) only where non-sensitive and useful;
- modality (`text`, `voice`, `image`, `video`, `mixed`);
- recommendation mode (`known_fit`, `explore`, `surprise_me`);
- offer type;
- price bucket / public SKU where appropriate;
- acquisition cohort.

Do not attach:
- raw answer text;
- fantasy category labels where sensitive;
- vulnerability scores;
- psychological labels;
- orientation inference;
- raw conversation excerpts.

## Funnel views

### Acquisition
Reach → profile visit → social poll/quiz → social link click → web session

### Activation
Web session → age gate pass → Meet Mara/Premium → playable discovery / meaningful interaction / first voice → premium intent

### Discovery
Game view → game start → choices → Mara prediction/reaction → reveal → confirm/correct → personalized next experience

### Revenue
Premium intent → first payer → second payment → repeat spender → retained spender

### Narrative commerce
Preview → story/experience start → branch/engagement → paid unlock → completion → continuation → repeat purchase

### Retention
Returning user → repeat interaction/discovery → callback/continuation → repeat paid action → D30 retained spender

## Decision metrics

### Acquisition
- Social → web CTR
- Social quiz/poll → web CTR
- Visitor → signup/identified user

### Activation
- Signup → meaningful interaction
- Playable onboarding completion
- Discovery game completion
- First voice engagement
- Premium intent rate

### Discovery quality
- Game start rate
- Game completion rate
- Choices per discovery session
- Repeat discovery rate
- Mara Guess Accuracy
- Surprise Rate
- Correction Rate
- Correction Acceptance
- Profile/reveal confirmation rate
- Personalization Lift

`Personalization Lift` compares an adapted/relevant next experience against an appropriate generic/control experience. Do not calculate it from sensitive-profile targeting.

### Monetization
- Visitor → first payer
- First payer → second payer
- Personalized vs generic offer conversion
- AOV
- ARPU / ARPPU
- Purchase frequency
- Bundle attach rate
- Personalized experience conversion
- Revenue per visitor
- Revenue per follower
- Revenue per content/experience
- Contribution margin

### Retention
- D1 / D7 / D30 return
- Repeat payer rate
- Days between purchases
- 30-day retained spender
- Story continuation rate
- Return after discovery/prediction interaction

### Relationship quality
- Successful callback rate
- Open-loop resolution rate
- Memory correction rate
- Preference correction rate
- Memory/personalization creepiness/negative-reaction rate
- Personalized experience completion
- Voice engagement/replay where measurable

### Adult product health
- Adult-mode opt-in
- Voluntary stop/skip
- Repeat adult-session rate
- Refund/dispute rate
- Negative-reaction/support rate

## Data separation

General analytics should know **that** a discovery interaction happened, not the intimate details of **what** the user chose.

Preference Graph / Relationship Memory data must remain in the appropriate purpose-limited store or manual test record, with stronger controls for adult-sensitive data.

Aggregate experiment reporting may use safe categories where privacy thresholds and consent permit it.

Never publish social-comparison claims such as “18% chose this” unless real, sufficiently aggregated data supports the statement and the result is safe to expose.

## North-star candidates

Do not lock a custom North Star before launch evidence.

Compare:
- First payer → second payer
- Repeat Paying Users
- 30-day Retained Spenders
- Revenue per Active Relationship
- Paid Relationship Moments per Active Payer

A `Paid Relationship Moment` is a clearly purchased experience with perceived personal relevance; it is not simply a charge event.

Prefer the metric that best predicts **repeat spend × retention × satisfaction × contribution margin**.
