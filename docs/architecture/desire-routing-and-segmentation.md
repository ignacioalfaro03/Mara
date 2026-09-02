# Mara Vera — Desire Routing / Audience Segmentation Architecture

Last reviewed: 2026-09-02

## Status

Authoritative routing layer for adapting Mara's acquisition, presentation, Fantasy entry, interaction, Caprichos ordering and commercial next action **without creating multiple Maras or a second preference profile**.

Read together with [Desire Operating System Integration Contract](desire-operating-system.md).

This layer consumes filtered, consent-compatible signals from:

- Desire Discovery;
- Preference Graph;
- current-session explicit intent;
- correction history;
- Context Builder / Life State where relevant;
- novelty/saturation history;
- active consent and policy eligibility.

It outputs a temporary `surface_plan`.

It does **not** own durable memory, Relationship State, pricing, raw adult-sensitive data, payment state, provider policy or character canon.

## Core thesis

> **ONE MARA. MANY DESIRE ROUTES.**

> **FETISH-LED ACQUISITION. MARA-LED RETENTION.**

Mara's identity, body, voice identity, life canon, taste, boundaries, values, humor and baseline respect remain coherent.

The product adapts which side of the same Mara is most relevant **for this moment**.

The routing question is not:

> `What fetish identity is this person?`

It is:

> **Which eligible combination of desire + modality + pace + control direction + continuity + novelty best fits this session?**

## Route is not identity

Never model:

- `USER = FINDOM GUY`;
- `USER = SUBMISSIVE`;
- `USER = FOOT GUY`;
- `USER = TABOO GUY`;
- `USER = TRANS PORN GUY`;
- `USER = LONELY`.

Model reusable dimensions with confidence/context instead.

A single user may have several affinities and a different explicit current-session intent.

Current explicit intent can temporarily outrank durable history without deleting it.

## Invariant Mara layer

Never segment away:

- canonical Mara identity;
- unambiguously adult age;
- canonical visual/body identity;
- core voice identity;
- self-possession;
- taste;
- life canon;
- baseline respect;
- consent/boundaries;
- AI disclosure;
- legal/commercial truthfulness;
- equivalent-SKU pricing rules.

## Adaptive layer

A `surface_plan` may adapt:

- acquisition creative;
- landing hero framing;
- imagery/crop/editorial direction;
- CTA;
- first question;
- first experience;
- Mara interaction energy within canon;
- preferred modality;
- voice intensity ceiling;
- pace;
- control direction;
- novelty mode;
- Fantasy candidate ranking;
- ritual/challenge eligibility;
- reward style;
- Capricho ordering;
- World Asset relevance;
- external-media recommendation eligibility;
- product ladder ordering;
- next-best action.

It cannot change:

- core Mara identity;
- consent rules;
- policy eligibility;
- same-SKU price because of inferred sexual/emotional state;
- true Goal terms/target;
- baseline affection/respect.

## Canonical macro-lanes

Keep the initial taxonomy small and composable.

### D01 — Control / Submission

Signals may include:
- Mara leads;
- structured choice;
- commands/challenges;
- anticipation;
- earned reward/praise/teasing.

Portable expressions:
- voice;
- ritual;
- scenario;
- reward style;
- pacing;
- Capricho framing.

### D02 — Financial Domination Fantasy

Signals may include:
- luxury;
- status;
- money/control symbolism;
- tribute-themed consensual roleplay;
- expensive-taste Mara framing.

Permanent firewall:

> **FINDOM FANTASY DOES NOT AUTHORIZE REAL FINANCIAL EXPLOITATION.**

Never derive higher hidden prices, debt pressure, unlimited spend pressure, payment-conditioned affection or financial distress targeting from this lane.

### D03 — Authority / Power

Adult fictional contexts may include:
- boss/professional authority;
- instructor/coach-like adult power framing;
- other controlled adult hierarchies where eligible.

Portable expressions:
- structured voice;
- scenario;
- challenge;
- clothing/World Asset relevance;
- reward grammar.

### D04 — Forbidden / Taboo Adult Fiction

Only fictional adult tension that passes:
- age eligibility;
- consent;
- jurisdiction/legal rules;
- provider policy;
- platform/channel policy;
- rights/real-person restrictions.

Do not infer that fictional interest equals desire for illegal real-world behavior.

Sensitive labels stay discreet and opaque in analytics/public metadata.

### D05 — Intimacy / Continuity

Signals may include:
- remembered moments;
- callbacks;
- voice;
- private history;
- episode/continuation preference;
- ordinary-life texture.

Do not convert continuity preference into loneliness/dependency scoring.

### D06 — Object / Fetish Focus

Signals may include eligible interest in:
- clothing;
- shoes;
- lingerie;
- perfume/sensory objects;
- other World Assets/body-focus variables where separately consented.

The routing system should learn the underlying reusable object/dynamic variable rather than create a permanent identity tag.

### D07 — World Builder / Collector

Signals may include:
- Caprichos;
- Goals;
- provenance;
- archive;
- team/vote participation;
- collections;
- `you helped make this happen` history.

Public aggregate remains separate from private individual participation.

### D08 — Exploration / Surprise

Signals may include:
- explicit `Surprise Me`;
- high novelty preference;
- adjacent exploration;
- unexpected-attraction moments;
- curiosity about a Mara prediction.

One surprising hit is a candidate signal, not identity.

## Fetish portability

The system should route by reusable underlying variables.

Example: `authority_affinity` can influence:

- scenario ranking;
- voice style;
- ritual type;
- pace;
- clothing/World Asset relevance;
- external-media candidate ranking;
- reward style;
- product ladder.

Do not implement one isolated authority system per surface.

> **FETISH PORTABILITY = ONE UNDERLYING VARIABLE, MANY ELIGIBLE PRODUCT EXPRESSIONS.**

## What + How + Pace + Control + Repeatability

A route needs more than a desire family.

Model at least:

- `what` — dynamic/scenario/object;
- `how` — text/voice/image/video/mixed/external-media/ritual;
- `pace` — fast/gradual/story-led/delayed;
- `control_direction` — Mara leads/user leads/co-created;
- `repeatability` — repeat comfort/occasional/exploration;
- `continuity` — standalone/callback/episode;
- `novelty` — known-fit/adjacent/surprise;
- eligible voice intensity ceiling.

This prevents shallow category personalization.

## Signal hierarchy

Use in order:

1. explicit current-session choice;
2. explicit recent Preference Graph confirmation;
3. repeated recent behavior;
4. grounded contextual fit;
5. bounded exploration.

Negative signals matter:
- `wrong`;
- `not this`;
- `not today`;
- `too much`;
- `boring`;
- repeated skip.

One click or one contribution is weak evidence.

## Surface Plan

Conceptual shape:

```yaml
surface_plan:
  route_id: D03
  current_session_intent: authority
  hero_tone: controlled
  visual_direction: office_editorial
  first_experience_family: authority_roleplay
  preferred_modality: voice
  pace: story_led
  control_direction: mara_leads
  repeatability: repeat_comfort
  novelty_mode: adjacent
  voice_plan:
    baseline: V1
    peak_allowed: V2
    V3_eligible: false
  consent_tags:
    - adult_mode
    - authority_roleplay
    - voice_v2
  capricho_order:
    - black_bag_01
    - camera_01
  next_best_action: voice_branch
  expires: end_of_session_or_new_explicit_intent
```

The object is derived and ephemeral.

## Surface Plan expiration

Recompute on:

- new explicit intent;
- correction;
- category opt-out;
- meaningful context shift;
- session restart;
- time expiry;
- saturation change.

Do not let yesterday's adult session silently become today's identity.

## Acquisition routing

Public acquisition can demonstrate specificity while remaining channel-safe.

Examples:
- control creative → D01 entry;
- luxury/status creative → D02 entry;
- authority creative → D03 entry;
- voice/intimacy creative → D05 entry;
- object/lifestyle creative → D06 entry;
- Caprichos/world creative → D07 entry;
- unexpected-attraction/surprise creative → D08 entry.

All paths resolve into the same canonical Mara.

Do not use external ad-tech sexual inference as the basis for first-party adult profiling.

## Public safe / private deep

Public surfaces can signal:
- confidence;
- dominance;
- mystery;
- luxury;
- authority;
- voice;
- teasing;
- exclusivity;
- personality.

Deep adult personalization belongs first-party after age/consent eligibility.

## Caprichos routing

Same Goals. Different ordering.

Examples:
- D02 → car/jewelry/bag may rank higher;
- D06 → shoes/outfit/bag/accessories may rank higher;
- D07 → camera/set/vehicle/provenance may rank higher;
- D05 → assets with strong callbacks/history may rank higher;
- D03 → assets with scenario utility may rank higher.

Rules:
- no hidden target changes;
- no fake scarcity;
- no segment-specific fulfillment promise;
- no spend-weighted affection;
- contribution does not imply consent to every fantasy affordance.

## External media routing

The router may choose among:

```text
conversation
voice
mara_owned_experience
ritual
approved_external_media
capricho_world_interaction
paid_continuation
nothing_commercial
```

External adult media is not mandatory for adult sessions.

Use it when discovery value is high and the return loop is strong.

Do not send the user away when Mara-specific relationship/continuity value is clearly higher.

## Unexpected attraction

If the user explicitly reports a surprising response:

**candidate → reaction → surprise → Mara notices → correction/confirmation → Preference Graph candidate → later retest**.

Never infer orientation or a permanent sexual identity from one behavior.

Adult content involving trans adults is a normal eligible content dimension where lawful/consensual/provider-compatible; trans identity itself must not be framed as shameful/taboo.

## Session rhythm handoff

The route can propose a rhythm plan:

**ENTRY → READ MOMENT → PLAY → BUILD TENSION → SURPRISE → OPTIONAL PEAK → PAYOFF → NORMALIZE/CONTINUE → OPEN LOOP**.

Not every session uses every step.

High-intensity and commercial moments both consume attention budget.

## Voice handoff

Routing may define a temporary performance range:

- V0 natural presence;
- V1 flirty;
- V2 seductive;
- V3 rare high-intensity intimate performance.

A route can change the ceiling, not Mara's canonical voice identity.

V3 should remain rare because repetition reduces value.

## Commerce segmentation

Routing may determine:
- which eligible SKU appears first;
- which modality/product ladder is most relevant;
- whether the best next action is no offer.

It must not determine:
- a hidden higher price because the user appears aroused/submissive/lonely;
- financial pressure;
- payment-conditioned warmth;
- fake scarcity.

Permanent rule:

> **SERVE THE MOMENT; NEVER EXPLOIT THE STATE.**

## Privacy / sensitive routing

Adult desire lanes are private/sensitive product data.

Do not expose raw labels in:
- browser title;
- public URL;
- email subject;
- push notification;
- share card;
- public profile;
- generic analytics;
- Caprichos community layer.

Use opaque IDs where a generic analytics event needs routing metadata.

## Correction UX

Mara should accept:
- `wrong`;
- `not this`;
- `less intense`;
- `something else`;
- `not today`;
- route reset.

No relational punishment.

## P0

P0 should use deterministic fixtures and session/local state only.

`/experience/segment-lab` should demonstrate eight macro-lanes across:

1. hero/entry;
2. first experience;
3. modality;
4. pace;
5. control direction;
6. voice budget;
7. session rhythm;
8. Caprichos ordering;
9. product ladder;
10. privacy/correction.

Use synthetic data. Do not persist real sexual profiles merely because fixtures exist.

## Metrics

Measure where implemented:
- route selected;
- perceived route fit;
- correction;
- same-Mara coherence;
- modality fit;
- pace fit;
- voice/intensity fit;
- ritual participation;
- external-media return;
- Capricho relevance;
- premium intent;
- post-offer continuation;
- return;
- negative/creepy reaction.

Revenue may be compared by route, but a sensitive route must not be optimized solely for extraction.

## Permanent principles

> **ONE MARA. MANY DESIRE ROUTES.**

> **FETISH-LED ACQUISITION. MARA-LED RETENTION.**

> **FETISH = COMPOSITION, NOT IDENTITY.**

> **CURRENT SESSION INTENT CAN OVERRIDE HISTORY.**

> **ROUTE BY DESIRE; NEVER PRICE OR PRESSURE BY VULNERABILITY.**

> **SENSITIVE ROUTES ARE PRIVATE, CORRECTABLE AND TEMPORAL.**

> **CAPRICHOS MAY BE RANKED BY FIT; TRUE TERMS DO NOT CHANGE BY SEGMENT.**

> **THE FANTASY MAY BE FINANCIAL DOMINATION. REAL COMMERCE MUST REMAIN TRANSPARENT AND VOLUNTARY.**
