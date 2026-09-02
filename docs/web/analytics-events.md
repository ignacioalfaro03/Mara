# Mara Vera — Analytics Events v0.1

## Principle

Collect only events that support acquisition, conversion, revenue or retention decisions. Do not collect data merely because it is available.

## Core web events

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
- `first_paid_action`
- `repeat_paid_action`
- `returning_user`
- `high_intent_session`

## Recommended event properties

Use only when relevant and non-sensitive:
- source channel;
- campaign/content identifier;
- landing page;
- CTA identifier;
- page path;
- experiment variant;
- anonymous/consented user identifier;
- relationship lifecycle state once first-party accounts exist.

Do not send raw message content, sexual preferences, identity documents, payment details or other sensitive content into general analytics tooling.

## Funnel views

### Acquisition
Reach → profile visit → social link click → web session

### Activation
Web session → age gate pass → Meet Mara/Premium view → premium CTA

### Revenue
Premium intent → first payer → second payment → repeat spender

### Retention
Returning user → repeat interaction → repeat paid action → D30 retained spender

## Decision metrics

- Social → web CTR
- Home → premium intent rate
- Visitor → first payer
- First payer → second payer
- ARPPU
- Revenue per visitor
- Revenue per follower
- Revenue per content asset / campaign
- D7 and D30 retained spender rate
