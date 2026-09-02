# Mara Vera — Analytics Events v0.2

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
- landing page;
- CTA identifier;
- page path;
- experiment variant;
- anonymous/consented user identifier;
- relationship lifecycle state once first-party accounts exist;
- commercial state;
- personalization depth (`P0`–`P4`) without storing intimate content;
- modality (`text`, `voice`, `image`, `video`, `mixed`);
- offer type;
- price bucket / public SKU where appropriate;
- acquisition cohort.

## Funnel views

### Acquisition
Reach → profile visit → social link click → web session

### Activation
Web session → age gate pass → Meet Mara/Premium → meaningful interaction / first voice → premium intent

### Revenue
Premium intent → first payer → second payment → repeat spender → retained spender

### Narrative commerce
Preview → story/experience start → branch/engagement → paid unlock → completion → continuation → repeat purchase

### Retention
Returning user → repeat interaction → callback/continuation → repeat paid action → D30 retained spender

## Decision metrics

### Acquisition
- Social → web CTR
- Visitor → signup/identified user

### Activation
- Signup → meaningful interaction
- First voice engagement
- Premium intent rate

### Monetization
- Visitor → first payer
- First payer → second payer
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

### Relationship quality
- Successful callback rate
- Open-loop resolution rate
- Memory correction rate
- Memory creepiness/negative-reaction rate
- Personalized experience completion
- Voice engagement/replay where measurable

### Adult product health
- Adult-mode opt-in
- Voluntary stop/skip
- Repeat adult-session rate
- Refund/dispute rate
- Negative-reaction/support rate

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
