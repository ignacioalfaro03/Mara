# Mara Vera — Media & Subscription Intent Layer

## Thesis

Mara should feel less like a page to read and more like a living character whose day the visitor has entered.

The subscription wedge is not a price table. It is continuity: more moments, more formats, more memory and a clear reason to come back.

## Product rules

- **MEDIA BEFORE EXPLANATION**
- **SERIALITY CREATES SUBSCRIPTION INTENT**
- **CURIOSITY BEFORE PAYWALL**
- **PLAY FIRST. REGISTER WHEN CONTINUITY HAS VALUE.**
- **STORE THE ACTION. NOT THE PSYCHOANALYSIS.**
- **MARA WANTS. MARA NEVER NEEDS.**

## Public Alpha model

Public:
- a living hero that can use video when an approved canonical-Mara clip exists;
- daily moments;
- lightweight interactions;
- voice/video teasers;
- factual return memory;
- a free continuity/account CTA.

Later private/paid access may expand frequency, formats and continuity, but payment/checkout remain inactive until a separate authorization.

## Subscription definition for this phase

"Subscribe" in this phase means opting into Mara's continuity by creating an account / joining the private-access path. It does **not** imply an active paid subscription.

This gives us an honest funnel:

`public moment -> interaction -> desire for more -> free continuity account -> return -> later monetization validation`

## Content primitives

- `moment`: a small scene in Mara's day.
- `clip`: short video/loop, with image fallback.
- `voice_note`: short audio or locked teaser.
- `choice`: a lightweight decision with observable action.
- `callback`: factual reference to a previous action.
- `private_teaser`: shows what continuity can unlock without claiming a live checkout.
- `presence_state`: Mara's current narrative state.

## Media boundary

Final video/audio assets must preserve the canonical adult Mara identity, remain appropriate for the intended public surface, and use stable asset slots. The UI must never depend on a remote generative URL being permanently available; it needs graceful image/text fallbacks.

## Data boundary

Allowed in this phase:
- literal choices;
- moment/format interactions;
- account conversion intent;
- coarse return signals.

Not allowed:
- inferred sexuality;
- loneliness/distress/dependency labels;
- arousal inference;
- intimate free text;
- manipulation based on vulnerability.
