# Mara Vera — Playable Rituals & Challenges Architecture

Last reviewed: 2026-09-02

## Status

Authoritative interaction layer for short, bounded games, rituals, dares and anticipation challenges inside Mara experiences.

This extends the existing Fantasy Compiler, Fantasy Experience Engine, Preference Graph, Desire Routing, Reward Grammar and Voice/Human Presence systems. It does **not** create a new relationship engine, preference profile or payment system.

No production adult generation, realtime sexual instruction system, payment flow or persistent sensitive-memory deployment is authorized by this document.

---

## Core thesis

> **MARA SHOULD SOMETIMES GIVE THE USER SOMETHING TO DO, WAIT FOR, CHOOSE OR RESIST — NOT ONLY SOMETHING TO WATCH OR READ.**

Playable rituals create participation and anticipation.

The goal is not maximum explicitness. The goal is a changing session rhythm:

**conversation → tease → choice → challenge/ritual → waiting/anticipation → user signal → Mara reaction/reward → continuation**.

Some rituals are adult/sensual. Others are mundane, playful or absurd. This contrast is important because Mara should feel like a character, not a perpetual adult-content machine.

---

## Why this matters

Flat adult content often optimizes passive consumption.

Mara can add value through:
- agency;
- anticipation;
- self-control;
- surprise;
- personality;
- reward;
- continuity;
- remembered prior games.

The user should sometimes think:

> `I want to see what Mara makes me do next.`

rather than only:

> `I want another clip.`

---

## Ritual families

### 1. Appearance / wardrobe play

Examples of eligible adult opt-in concepts:
- Mara changes into a particular outfit;
- lingerie/underwear reveal;
- user chooses between two approved looks;
- outfit linked to a World Asset/Capricho;
- delayed reveal after a choice or challenge.

This can connect Caprichos to Fantasy Surface Area.

### 2. Body-focused tease

Adult-only and consent-gated.

Examples at the architecture level:
- sensual attention to approved body areas;
- breast/nipple-focused tease;
- butt-focused tease;
- pose/reveal games;
- body-focused voice/visual callbacks.

Do not assume consent to one body-focused theme implies consent to another.

### 3. Anticipation / denial / self-control

Adult-only, explicit opt-in.

Examples:
- short bounded waiting challenge;
- orgasm-delay/denial fantasy;
- `not yet` / anticipation mechanic;
- Mara decides when an experience progresses;
- user chooses whether to continue or stop.

Permanent rules:
- bounded duration;
- easy stop/skip;
- no health-risk claims;
- no coercion;
- no punishment for stopping or failing;
- no real-world financial penalty;
- no emotional withdrawal for non-compliance;
- do not use arousal state to raise price.

### 4. Choice games

Examples:
- `Mara chooses`;
- `You choose`;
- two-option reveal;
- prediction game;
- truth-or-dare style bounded choice;
- hidden branch selected after user response.

### 5. Ordinary / absurd dares

Important for contrast and personality.

Examples:
- eat a whole chocolate as a playful character beat;
- wear something ridiculous;
- choose a song;
- complete a small harmless challenge;
- make Mara choose between two mundane options.

These make adult intensity peaks feel rarer and more human.

### 6. World Asset rituals

A canonical Capricho/World Asset can become part of the game.

Examples:
- choose the outfit around a funded item;
- decide which World Asset appears next;
- unlock a contributor callback;
- use an asset as an active fantasy object where separate consent allows it.

---

## Ritual schema

Conceptual representation:

```yaml
ritual_id: ritual_123
family: anticipation
adult_required: true
consent_tags:
  - orgasm_control
source:
  desire_route: D01
  world_asset_id: null
entry:
  mara_energy: playful_dominant
  voice_intensity: V2
interaction:
  user_action_required: true
  duration_band: short
  can_stop: true
  can_skip: true
completion:
  signal: self_report
  success_required: false
reward:
  style: teasing
  payoff_ref: reveal_123
failure_behavior:
  relationship_penalty: false
  commercial_penalty: false
saturation:
  repeat_window: rare
```

The actual storage implementation remains deferred.

---

## Challenge is not obedience proof

Completion can be entertaining, but the product must not treat compliance as evidence that the user deserves baseline affection.

Allowed:
- praise;
- teasing;
- reveal;
- progression;
- collectible;
- next branch.

Not allowed:
- `you failed, so Mara ignores you`;
- relationship stage loss;
- increased price;
- financial punishment;
- guilt;
- humiliation unless independently adult-consented as fantasy and never tied to real payment/refusal.

Permanent principle:

> **FAILURE CHANGES THE GAME, NOT THE RELATIONSHIP.**

---

## Reward Grammar integration

Rituals are especially useful because the Reward Grammar can make the ending feel earned.

Eligible reward styles include:
- praise;
- teasing;
- acknowledgement;
- reveal;
- surprise;
- access;
- progression;
- collectible;
- none.

The reward should fit the user's known/contextual interaction preference.

Do not mechanically give the same phrase after every completed challenge.

---

## Voice integration

Rituals can use Mara's Seduction Intensity Budget.

Suggested pattern:
- ordinary setup: V0/V1;
- challenge explanation: V1/V2;
- anticipation: V2;
- rare payoff peak: V3 only when adult-consented and contextually justified;
- return to V0/V1 afterward.

This preserves contrast.

A constant V3 performance destroys both human presence and reward value.

---

## Session pacing

Do not turn every session into a challenge.

A healthy session can contain:
- no ritual;
- one small ritual;
- one larger ritual plus payoff;
- a returning open loop from an earlier ritual.

Use a **Ritual Attention Budget**.

Signals to reduce ritual frequency:
- repeated skips;
- corrections;
- low completion;
- user explicitly asks to just talk/watch/listen;
- saturation.

Do not store a psychological `obedience score` or `self-control score`.

---

## Preference Graph integration

Potential contextual signals:
- challenge affinity;
- Mara-leads affinity;
- denial/anticipation affinity;
- wardrobe-choice affinity;
- body-focus affinity;
- reward preference;
- ritual frequency preference.

Adult-sensitive signals require appropriate consent/context/confidence.

One completed challenge must not create a durable fetish identity.

---

## Desire Routing integration

Different desire lanes can rank rituals differently.

Examples:
- control/submission → Mara-led challenges and anticipation;
- authority roleplay → instruction/choice rituals;
- object/fetish route → World Asset/body/wardrobe rituals where eligible;
- intimacy/continuity → callbacks and shared-history rituals;
- world-builder → votes, Caprichos and asset-driven games;
- unexpected-attraction exploration → small bounded adjacent experiments rather than identity labels.

Same Mara, different eligible ritual ordering.

---

## Commercial boundary

A ritual can be:
- free engagement;
- part of a paid experience;
- a premium branch;
- contributor payoff;
- continuation mechanic.

But:

> **AROUSAL OR COMPLIANCE MUST NOT BECOME A HIDDEN PRICING VARIABLE.**

The real transaction remains ordinary transparent commerce.

Do not interrupt a high-intensity adult ritual with a surprise charge.

If a premium continuation exists, the scope/price must be clear before purchase.

---

## Safety boundary

P0 and initial design exclude challenges involving material physical danger.

Do not productize:
- breath restriction/choking challenges;
- dangerous pain/injury;
- unsafe insertion/object use;
- intoxication;
- dangerous food restriction/overconsumption;
- public exposure without clear lawful context;
- illegal acts;
- threats or coercion;
- self-harm;
- real-world financial punishment.

Any later physical-risk category requires separate safety/legal/provider review before even entering an eligible catalog.

---

## Privacy

Ritual choices and adult-sensitive challenge preferences are private.

Do not expose them through:
- public aliases;
- Caprichos leaderboards;
- share cards;
- generic analytics labels;
- notifications by default.

Use opaque IDs in general analytics.

---

## P0

P0 should validate the interaction shape without explicit production content.

Use four abstract fixtures:
1. appearance/wardrobe tease;
2. Mara-led choice game;
3. short anticipation/self-control game;
4. ordinary playful dare.

Measure:
- would the tester play?;
- preferred family;
- completion intent;
- reward preference;
- whether repetition becomes annoying;
- whether the same Mara still feels authentic.

No real sexual instruction, media generation, payment or persistent adult preference storage is required to validate the product architecture.

---

## Permanent principles

> **MARA SOMETIMES GIVES THE USER SOMETHING TO DO, NOT ONLY SOMETHING TO CONSUME.**

> **ANTICIPATION IS A PRODUCT MECHANIC.**

> **FAILURE CHANGES THE GAME, NOT THE RELATIONSHIP.**

> **RITUALS NEED CONTRAST; NOT EVERY SESSION SHOULD BE A CHALLENGE.**

> **ADULT RITUALS REQUIRE THEIR OWN CONSENT/ELIGIBILITY.**

> **AROUSAL OR COMPLIANCE NEVER JUSTIFIES HIDDEN PRICE/PRESSURE CHANGES.**
