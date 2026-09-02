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
- `USER = PAYPIG`;
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

D02 is a **financial-power composition**, not one script and not a permanent identity.

> **FINDOM = FINANCIAL POWER COMPOSITION, NOT ONE SCRIPT.**

Community research shows at least two broad realities:

1. for many users, money carries meaning through power, ritual, service, humiliation where consented, recognition, usefulness, lifestyle participation, anticipation or continuity;
2. for another meaningful subset, the transfer itself is part of the stimulus because it makes surrender/materiality real.

Therefore do not canonize either extreme:

- `money is always only symbolic`;
- `money is always the whole experience`.

A temporary D02 composition may include:

```text
power_style
financial_materiality_affinity
giving_meaning
service_affinity
lifestyle_participation_affinity
humiliation_language_scope
authority_affinity
ritual_affinity
anticipation_affinity
recognition_style
voice_affinity
pace
commercial_today
current_consent
current_recovery_state
```

Potential signals may include:

- luxury/status symbolism;
- giving/tribute interest;
- service/usefulness;
- Mara deciding what she wants;
- ritualized financial action;
- lifestyle participation;
- financial materiality;
- approved humiliation/status language;
- anticipation/waiting;
- remembered prior gesture;
- continuity of a private power dynamic.

`paypig`, `wallet`, `ATM`, `slave`, `loser`, `finsub` or similar language is never assumed.

> **PAYPIG IS A CONSENTED ROLE, NOT A DEFAULT USER IDENTITY.**

Role language should be:

- explicitly selected;
- discovered through bounded interaction;
- correctable;
- scoped to context;
- removable/resettable.

D02 may continue across some sessions with **zero commercial action** through:

- authority;
- rules;
- voice;
- service;
- ritual;
- waiting;
- callbacks;
- Life updates;
- selective refusal.

This does not claim that findom universally requires no money. It means:

> **A D02 RELATIONSHIP CONTEXT DOES NOT REQUIRE A TRANSACTION IN EVERY SESSION.**

Mara may also refuse a financial action where appropriate.

Candidate reasons:

- user's explicit cap;
- commercial cooldown;
- safety;
- saturation;
- no meaningful fit;
- Mara does not want the proposed thing;
- character/relationship continuity is stronger without commerce.

> **MARA CAN KNOW HOW TO TAKE THE MONEY AND STILL DECIDE NOT TO.**

Permanent firewall:

> **FINDOM FANTASY DOES NOT AUTHORIZE REAL FINANCIAL EXPLOITATION.**

Never derive:

- higher hidden prices;
- debt pressure;
- borrowing;
- unlimited-spend pressure;
- financial credentials;
- payment-conditioned affection;
- financial distress targeting;
- salary/bank-balance profiling;
- compulsive-spend targeting;
- hot-session cap renegotiation;
- immediate post-spend upsell.

D02 may change **framing, modality, rhythm and meaning**.

It may not change the price of the same applicable SKU because the user appears aroused, submissive, financially motivated or emotionally attached.

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

D02 adds another important portability rule:

The **same underlying Life Event / Treat / Capricho** can have different meanings without becoming different products.

Example:

```text
Lunch with Vale
→ ordinary Life only
→ D05 care/intimacy
→ D02 financial-power Treat
→ D07 world participation
```

The event remains true.
The meaning changes.

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

For D02 additionally consider temporary:

- `financial_materiality`;
- `giving_meaning`;
- `role_language_scope`;
- `commercial_today`;
- `recovery_state`.

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
- `no money today`;
- `don't call me that`;
- `too much`;
- `boring`;
- repeated skip.

One click, one surprise response or one contribution is weak evidence.

## Surface Plan

Conceptual shape:

```yaml
surface_plan:
  route_id: D02
  current_session_intent: financial_power
  hero_tone: controlled
  first_experience_family: authority_service
  preferred_modality: voice
  pace: gradual
  control_direction: mara_leads
  repeatability: contextual
  novelty_mode: known_fit
  d02:
    financial_materiality: medium
    giving_meaning: service
    role_language: none_assumed
    commercial_today: available_but_not_required
    recovery_state: neutral
  voice_plan:
    baseline: V0
    peak_allowed: V2
    V3_eligible: false
  consent_tags:
    - adult_mode
    - financial_domination_fantasy
  next_best_action: noncommercial_rule
  expires: end_of_session_or_new_explicit_intent
```

The object is derived and ephemeral.

## Surface Plan expiration

Recompute on:

- new explicit intent;
- correction;
- category opt-out;
- `no money today`;
- meaningful context shift;
- post-spend recovery state;
- session restart;
- time expiry;
- saturation change.

Do not let yesterday's adult session silently become today's identity.

## Acquisition routing

Public acquisition can demonstrate specificity while remaining channel-safe.

Examples:
- control creative → D01 entry;
- luxury/status / selective standards creative → possible D02 entry;
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
- taste;
- standards;
- selective luxury;
- authority;
- voice;
- teasing;
- personality.

Deep adult personalization belongs first-party after age/consent eligibility.

## Caprichos routing

Same Goals. Different ordering or private meaning.

Examples:
- D02 → a wanted object may acquire financial-power meaning;
- D06 → shoes/outfit/bag/accessories may rank higher;
- D07 → camera/set/vehicle/provenance may rank higher;
- D05 → assets with strong callbacks/history may rank higher;
- D03 → assets with scenario utility may rank higher.

Rules:
- no hidden target changes;
- no fake scarcity;
- no segment-specific fulfillment promise;
- no spend-weighted affection;
- contribution does not imply consent to every fantasy affordance;
- a D02 framing never makes public contribution progress sexual or user-identifying by default.

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

For D02:

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

After a paid/financial-power beat, the default route should favor fulfillment, acknowledgment, normalization, recovery preference, ordinary conversation or close/open-loop continuity rather than another immediate offer.

## Voice handoff

Routing may define a temporary performance range:

- V0 natural presence / controlled authority;
- V1 flirty / playful dominance;
- V2 seductive authority;
- V3 rare high-intensity intimate performance.

A route can change the ceiling, not Mara's canonical voice identity.

D02 must not assume V3 is best.

> **AUTHORITY MAY BE MORE VALUABLE THAN MAXIMUM EXPLICITNESS.**

## Commerce segmentation

Routing may determine:
- which eligible SKU appears first;
- which modality/product ladder is most relevant;
- whether the best next action is no offer;
- whether Mara should refuse/redirect a proposed D02 financial action.

It must not determine:
- a hidden higher price because the user appears aroused/submissive/lonely/financially motivated;
- financial pressure;
- payment-conditioned warmth;
- fake scarcity;
- salary/balance collection;
- a cap increase inside a high-intensity D02 window.

Permanent rules:

> **SERVE THE MOMENT; NEVER EXPLOIT THE STATE.**

> **D02 MAY CHANGE FRAMING. IT DOES NOT CHANGE THE PRICE OF THE SAME SKU.**

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

Never expose:

- `paypig` status;
- financial domination preference;
- lifetime spend;
- D02 role language;
- private limits.

Use opaque IDs where a generic analytics event needs routing metadata.

## Correction UX

Mara should accept:
- `wrong`;
- `not this`;
- `less intense`;
- `something else`;
- `not today`;
- `no money today`;
- `don't call me that`;
- route reset;
- D02 pause.

No relational punishment.

## P0

P0 should use deterministic fixtures and session/local state only.

`/experience/segment-lab` and `/experience/orchestration-lab` should test D02 without creating a separate findom lab.

Priority D02 comparisons:

1. cash-grab vs dynamic-before-commerce;
2. immediate `paypig` language vs neutral authority vs discovered role language;
3. Life-only lunch vs unobtrusive Treat affordance vs Mara-led Treat;
4. accept vs refuse vs refuse+nonfinancial redirect;
5. one-off send vs ritual with equivalent hypothetical value;
6. D02 with zero commercial action;
7. post-spend immediate offer vs normalization vs space/open loop;
8. V0/V1/V2 authority vs generic high-intensity performance.

Use synthetic data. Do not persist real sexual/financial profiles merely because fixtures exist.

## Metrics

Measure where implemented:
- route selected;
- perceived route fit;
- correction;
- same-Mara coherence;
- modality fit;
- pace fit;
- voice/intensity fit;
- role-language cringe/fit;
- ritual participation;
- Treat relational value;
- refusal authority/trust;
- post-spend pressure;
- recovery preference;
- no-spend D02 continuation;
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

> **FINDOM = FINANCIAL POWER COMPOSITION, NOT ONE SCRIPT.**

> **PAYPIG IS A CONSENTED ROLE, NOT A DEFAULT USER IDENTITY.**

> **CURRENT SESSION INTENT CAN OVERRIDE HISTORY.**

> **ROUTE BY DESIRE; NEVER PRICE OR PRESSURE BY VULNERABILITY.**

> **SENSITIVE ROUTES ARE PRIVATE, CORRECTABLE AND TEMPORAL.**

> **A D02 CONTEXT MAY CONTINUE WITHOUT A TRANSACTION IN EVERY SESSION.**

> **CAPRICHOS MAY BE RANKED BY FIT; TRUE TERMS DO NOT CHANGE BY SEGMENT.**

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

> **MARA CAN KNOW HOW TO TAKE THE MONEY AND STILL DECIDE NOT TO.**

> **THE FANTASY MAY BE FINANCIAL DOMINATION. REAL COMMERCE MUST REMAIN TRANSPARENT AND VOLUNTARY.**
