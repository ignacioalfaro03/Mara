# Mara Vera — Fantasy Compiler / Desire Composition Engine

Last reviewed: 2026-09-02

## Status

Authoritative composition and recommendation layer inside Mara Foundation.

The Fantasy Compiler does **not** create a new user profile, memory system, content engine, consent database or payment layer.

It consumes:

- filtered Preference Graph projections;
- Desire Discovery outputs;
- current-session intent;
- Context Builder / Life State where relevant;
- Relationship Memory callbacks;
- World Asset/Fantasy affordances;
- active consent/policy eligibility;
- experience history/saturation.

It produces ranked eligible experience configurations for the Fantasy Experience Engine or another eligible next surface.

Read together with [Desire Operating System Integration Contract](desire-operating-system.md).

## Core thesis

Do not build Mara as:

**fetish category → user selects → content consumed**.

Build:

**Discover → Understand → Compose → Deliver → React → Learn → Continue.**

> **FANTASY = COMPOSITION, NOT LABEL.**

The commercial/experience unit is a combination of reusable variables, not one category.

## Architecture position

Conceptual flow:

**Current intent + Preference Graph slice + Context/Life State + Consent/Policy Gate → Fantasy Compiler → eligible Experience Vector(s) → Fantasy Experience Engine / voice / ritual / external-media handoff / conversation → reaction → update candidate**.

The compiler owns:

- experience-variable schema;
- temporary User Desire Vector consumption;
- Experience Vector representation;
- hard eligibility filtering handoff;
- rule-based matching;
- known-fit vs explore selection;
- saturation/novelty adjustment;
- sequence/continuation eligibility;
- candidate ranking;
- composition metadata;
- session-rhythm proposal;
- experiment assignment where relevant.

It does not own:

- durable memory;
- Relationship State;
- raw adult-sensitive storage;
- character canon;
- real payment/pricing state;
- provider implementation;
- legal policy itself;
- psychological inference.

## Composition dimensions

P0/P1 should model a bounded subset of these variables.

### Desire family

- control/submission;
- financial-domination fantasy;
- authority/power;
- eligible forbidden/taboo adult fiction;
- intimacy/continuity;
- object/fetish focus;
- world builder/collector;
- exploration/surprise.

### Power / dynamic

- Mara leads;
- user leads;
- co-created;
- bounded surprise.

### Role / scenario

Examples:
- work/authority;
- gym;
- home;
- night;
- travel;
- date;
- party;
- other approved contexts.

### Object / World Asset

- clothing;
- shoes;
- lingerie;
- perfume/sensory object;
- canonical Capricho/World Asset;
- approved props.

### Modality

- text;
- voice;
- image;
- video;
- mixed;
- ritual/action;
- approved external-media companion.

### Voice performance band

- `V0` natural presence;
- `V1` flirty;
- `V2` seductive;
- `V3` rare high-intensity intimate performance.

Voice identity remains canonical. The compiler only proposes performance intensity where eligible.

### Adult intensity

A separate bounded intensity dimension may represent the experience content level.

Do not confuse:
- content intensity;
- voice performance;
- relationship closeness;
- payment state.

### Pace

- fast;
- gradual;
- story-led;
- delayed/anticipation.

### Control direction

- `mara_leads`;
- `user_leads`;
- `co_created`.

### Repeatability

- `repeat_comfort`;
- `occasional`;
- `exploration`.

### Narrative

- standalone;
- episode;
- continuation;
- callback;
- branching.

### Personalization depth

- `P0_generic_mara`;
- `P1_nominal_contextual`;
- `P2_preference_aware`;
- `P3_continuity_aware`;
- `P4_relationship_aware`.

### Novelty

- `known_fit`;
- `adjacent`;
- `surprise`.

### Reward

- praise;
- teasing;
- acknowledgement;
- reveal;
- surprise;
- progression;
- collectible;
- none.

### Commercial scope

- free;
- included entitlement;
- premium continuation;
- bounded custom;
- collection;
- Capricho/world interaction;
- no offer.

The commercial scope is constrained by transparent SKU/price rules; it is never inferred from vulnerability.

## Experience Vector

Conceptual shape:

```yaml
experience_id: exp_123
route_id: D03
family: authority_power
role: work_authority
object_refs:
  - black_bag_01
modality: voice
voice_band:
  baseline: V1
  peak_allowed: V2
pace: story_led
control_direction: mara_leads
repeatability: repeat_comfort
narrative: continuation
personalization: P2_preference_aware
novelty: adjacent
reward_style: teasing
consent_tags:
  - adult_mode
  - authority_roleplay
  - voice_v2
policy_tags:
  - adult_fiction
commercial:
  sku: null
  paid: false
sequence:
  prerequisite_experience_ids: []
  continuation_of: exp_122
saturation:
  repeat_window_days: 7
```

## Temporary User Desire Vector

The compiler must not create a second permanent profile.

It consumes a temporary projection such as:

```yaml
user_desire_vector:
  dynamic:
    authority: high
  modality:
    voice: high
  pace:
    gradual: medium
  control_direction:
    mara_leads: high
  narrative:
    continuation: high
  novelty:
    adjacent: medium
  repeatability:
    repeat_comfort: medium
```

Every projected field inherits confidence, recency, context, sensitivity, consent and correction state.

Current explicit session intent can override historical ranking.

## Policy-aware eligibility first

Eligibility is a hard filter, not a weighted score.

Before ranking an adult candidate require:

1. adult eligibility;
2. active consent scope;
3. category eligibility;
4. jurisdiction/legal compatibility;
5. provider policy compatibility;
6. channel/platform compatibility;
7. rights/real-person restrictions;
8. privacy classification;
9. commercial scope clarity where paid.

Only after this gate does the compiler rank candidates.

Do not rank prohibited options and hope generation-time moderation catches them later.

## P0 recommender

No ML is required.

A transparent rule is sufficient:

```text
experience_score =
  preference_fit
+ current_session_intent_fit
+ continuity_value
+ modality_fit
+ pace_fit
+ control_direction_fit
+ novelty_value
+ world_asset_relevance
+ content_availability
- saturation_penalty
- contradiction_penalty
```

Commercial relevance may be considered only among already-eligible actions and must never include vulnerability.

Never use:
- loneliness score;
- desperation score;
- arousal monetization score;
- emotional-dependence score;
- compulsive-spend score.

## Known fit vs exploration

If Mara always serves the highest known-fit candidate, she becomes repetitive.

If she explores constantly, she appears clueless.

Use a bounded novelty budget:

- known fit — majority;
- adjacent — regular;
- surprise — occasional;
- high-risk/niche — rare + separately consented.

Exact percentages remain experimental.

## Unexpected Attraction

One surprising positive response can produce a low-confidence candidate.

It does not create:
- orientation inference;
- permanent fetish identity;
- shame label;
- psychological explanation.

Flow:

**adjacent candidate → reaction → surprise → Mara notices → user confirms/corrects → candidate evidence → later retest**.

> **OBSERVE THE RESPONSE. DO NOT INVENT THE IDENTITY.**

## Fetish portability

The compiler should reuse underlying variables across surfaces.

Example: `authority_affinity` can affect:

- scenario;
- voice;
- ritual;
- pace;
- object/World Asset;
- external-media candidate;
- reward style;
- product ladder.

Do not mass-produce one separate category implementation for every combination.

## Session rhythm compilation

The compiler may propose a rhythm plan in addition to content variables.

Conceptual arc:

**ENTRY → READ MOMENT → PLAY → BUILD TENSION → SURPRISE → OPTIONAL PEAK → PAYOFF → NORMALIZE/CONTINUE → OPEN LOOP**.

Not every experience needs every stage.

Potential blocks:
- conversation;
- teasing;
- choice;
- voice;
- ritual/challenge;
- waiting;
- reveal;
- reward;
- external-media handoff;
- callback;
- commercial moment;
- mundane/absurd beat;
- return to normal Mara.

> **MARA CONTROLS SESSION RHYTHM.**

The goal is not `escalate → maximum → end`.

## Voice compilation

The compiler can pass:
- baseline voice band;
- peak ceiling;
- pace;
- directness;
- narrative role;
- mood/performance guidance.

Canonical Mara voice always wins.

V3 is scarce and should generally require stronger eligibility/context than V2.

Repeated V3 exposure should incur a saturation penalty.

## Ritual compilation

A candidate experience may include:
- appearance/wardrobe choice;
- Mara-led choice game;
- anticipation/waiting;
- ordinary harmless dare;
- World Asset ritual;
- eligible adult body-focused play behind separate consent.

The compiler must know ritual cooldown/saturation.

> **FAILURE CHANGES THE GAME, NOT THE RELATIONSHIP.**

## External media companion

The compiler/router may select approved external media when exploration value is higher than Mara-owned content.

Core loop:

**Mara prediction → approved candidate → outbound handoff → return → reaction → structured learning → next Mara experience**.

Do not copy third-party content.

Learn reusable dimensions:
- scenario;
- dynamic;
- pace;
- object;
- dialogue/voice importance;
- visual style;
- intensity;
- novelty.

> **LEARN THE PATTERN. DO NOT COPY THE CONTENT.**

## World Asset integration

World Assets may contribute:
- visual object;
- scenario affordance;
- callback/history;
- collector/provenance value;
- ritual affordance;
- product-ladder continuation.

Each affordance has its own eligibility/consent requirements.

Contribution to an asset does not authorize every fantasy involving it.

## Fantasy Surface Area

For a proposed World Asset, estimate how many valuable future combinations it enables across:
- visual reuse;
- narrative reuse;
- eligible fetish affordances;
- rituals;
- voice/story callbacks;
- collections;
- sponsor/affiliate surfaces;
- operational use.

This is a strategic prioritization metric, not a promise of production volume.

## Product ladder

The compiler/commercial graph can rank a desire-appropriate ladder.

Examples:

### Control
free tease → challenge → voice → premium continuation → bounded custom/collection.

### Authority
scenario → voice branch → continuation → premium bundle.

### Intimacy
callback → voice/history → continuation → collection.

### Object/fetish
asset-focused tease → voice/story → asset-specific premium → collection.

### World Builder
Goal → participation → reveal → contributor callback → asset-specific experience.

### External-media explorer
recommend → return → learn → original Mara continuation.

Same equivalent SKU keeps transparent price and terms.

## Next Best Action

Eligible outputs may include:
- talk;
- ask;
- tease;
- voice;
- show;
- ritual;
- wait;
- continue story;
- approved external-media handoff;
- Capricho/world interaction;
- paid continuation;
- no commercial action.

> **SOMETIMES THE BEST COMMERCIAL ACTION IS NO OFFER.**

## Commerce firewall

The compiler may improve relevance.

It may not:
- estimate maximum extractable price from adult preference;
- hide cheaper equivalent offers from a user because they appear aroused/submissive;
- use loneliness/distress/dependency;
- condition baseline affection on payment;
- surprise-charge at a sexual peak.

Price and scope must be understood before any paid experience begins.

## Saturation

Track experience-history features such as:
- repeated family;
- repeated dynamic;
- repeated object;
- repeated reward;
- repeated voice band;
- recent ritual repetition;
- skips/corrections;
- declining completion/replay.

Use a saturation penalty.

Do not store a psychological boredom diagnosis.

## Economics

Measure by experience family/composition where feasible:
- start/completion;
- return;
- replay;
- first → second purchase linkage;
- repeat purchase;
- voice/video cost;
- generation/QC failure;
- support/refund/dispute;
- contribution margin;
- negative/creepy reaction.

Healthy economics beat maximum explicitness.

## P0

P0 should stay deterministic and manual-first.

Use:
- Markdown;
- typed fixtures;
- JSON/local state;
- simple scoring;
- reusable content blocks;
- opaque analytics IDs;
- no real adult-media integration;
- no payment provider;
- no persistent real adult profile.

Priority tests:

1. category menu vs composed route;
2. same desire with different modality;
3. same desire with different pace;
4. Mara-leads vs co-created;
5. known fit vs adjacent vs surprise;
6. V1/V2/V3 contrast/fatigue;
7. one-shot vs continuation;
8. static experience vs rhythm/open-loop;
9. World Asset decorative vs active affordance;
10. external recommendation → simulated return → original Mara continuation;
11. generic paid unlock vs `Mara did something specific for me`.

## Build trigger

Do not build recommender ML, embeddings/vector DB, expensive agents or realtime orchestration until:

1. compiled/personalized experiences show measurable lift;
2. users voluntarily return;
3. first → second purchase evidence exists or manual matching is clearly valuable;
4. manual routing becomes a measured bottleneck;
5. privacy architecture is approved;
6. unit economics can fund the automation.

## Permanent principles

> **FANTASY = COMPOSITION, NOT LABEL.**

> **ELIGIBILITY BEFORE RANKING.**

> **WHAT FITS THIS USER AND WHAT FITS NOW ARE DIFFERENT QUESTIONS.**

> **FETISH PORTABILITY REDUCES CONTENT WASTE AND INCREASES PERSONALIZATION.**

> **SESSION RHYTHM MATTERS AS MUCH AS CONTENT INTENSITY.**

> **THE BEST EXPERIENCE IS THE ONE THAT CREATES RELEVANCE, RETURN, TRUST AND HEALTHY ECONOMICS — NOT MAXIMUM EXPLICITNESS.**
