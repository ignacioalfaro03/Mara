# Mara Vera — Desire Operating System Integration Contract

Last reviewed: 2026-09-02

## Status

Authoritative **integration contract**, not a new runtime engine.

This document explains how the existing Mara systems compose into one Desire Operating System without duplicating ownership:

- Desire Discovery discovers current and emerging signals.
- Preference Graph owns durable, consented, confidence-aware preference evidence.
- Desire Routing projects those signals into a temporary `surface_plan`.
- Fantasy Compiler composes eligible experiences from bounded variables.
- Fantasy Experience Engine delivers the selected experience.
- Voice/Human Presence executes Mara's canonical voice with bounded performance intensity.
- Playable Rituals & Challenges contributes action/anticipation mechanics.
- External Adult Media Companion can provide approved third-party discovery inventory and return-loop signals.
- Life Engine / Relationship Memory provide continuity and grounded callbacks.
- Caprichos / World Assets provide real-world consequence, provenance and reusable fantasy affordances.
- Momentum Commerce / Commercial Graph rank eligible commercial continuations after value exists.
- Adult Compliance gates every adult option before it can be ranked or delivered.

Do **not** implement a separate Desire OS service, second fetish graph, second user profile, second recommender, second consent database or second commercial state machine merely because this integration layer has a name.

## Product thesis

> **FETISH-LED ACQUISITION. MARA-LED RETENTION.**

Mara should not compete with the adult internet on catalog breadth.

The strategic wedge is specificity: a user arrives because one desire route feels unusually relevant; they return because one coherent Mara understands the underlying ingredients, remembers what worked, controls rhythm, surprises intelligently and carries history forward.

> **PORN IS SUPPLY. MARA IS THE INTELLIGENCE + RELATIONSHIP LAYER.**

The long-term habit target is:

**desire arises → user opens Mara → Mara reads the moment → eligible route/experience → payoff or curated handoff → reaction → learning → next time Mara is better**.

## One Mara, many routes

The invariant layer never changes by route:

- canonical identity;
- adult age;
- canonical body and visual identity;
- core voice identity;
- personality and taste;
- life canon;
- baseline respect;
- legal disclosure;
- consent rules;
- equivalent-SKU price and terms.

The adaptive layer may change:

- acquisition creative;
- hero framing;
- visual direction/crop;
- CTA;
- first question;
- first experience;
- Mara energy within canon;
- preferred modality;
- voice performance band;
- Fantasy ranking;
- ritual/challenge eligibility;
- Capricho ordering;
- reward style;
- external-media recommendation;
- product ladder ordering;
- next-best action.

The route is a projection for **this moment**, not an identity claim.

## Canonical macro-lanes

Use a small composable set rather than hundreds of fetish labels:

- `D01` — Control / Submission.
- `D02` — Financial Domination Fantasy.
- `D03` — Authority / Power.
- `D04` — Forbidden / Taboo Adult Fiction, only where eligible.
- `D05` — Intimacy / Continuity.
- `D06` — Object / Fetish Focus.
- `D07` — World Builder / Collector.
- `D08` — Exploration / Surprise.

These are routing lanes, not mutually exclusive identities.

A user can have several relevant dimensions and a current-session override.

## Preference Graph: components, not labels

Durable evidence should prefer reusable components over category identity.

Candidate dimensions include:

- power dynamic;
- object;
- role/scenario;
- modality;
- voice affinity;
- intensity preference;
- control direction;
- reward style;
- pace;
- novelty;
- repetition/repeatability;
- relationship continuity;
- visual style;
- narrative style;
- World Asset affinity;
- ritual affinity.

Each durable signal keeps:

- source;
- explicit vs inferred;
- confidence;
- recency;
- context;
- contradiction;
- sensitivity;
- consent scope;
- correction/reset state.

> **FETISH = COMPOSITION, NOT LABEL.**

## Fetish portability

An underlying preference should be reusable across surfaces.

Example: an authority affinity may affect:

- scenario ranking;
- Mara's sentence structure;
- voice delivery;
- challenge style;
- clothing/World Asset relevance;
- external-media candidate ranking;
- reward grammar;
- product-ladder ordering.

Do not create one isolated `authority feature` for every surface.

The reusable variable is the moat.

## Session State vs durable Preference Graph

Current desire is temporal.

A session projection may contain:

```yaml
session_state:
  current_intent: authority
  current_route: D03
  current_intensity: suggestive
  current_mode: voice_first
  current_open_loop: challenge_waiting
  current_consent_scope:
    - adult_mode
    - authority_roleplay
    - voice_v2
```

Session state is ephemeral by default.

It must not automatically become durable profile data.

Only filtered signals should be promoted into Preference Graph after explicit confirmation, repeated behavior or another defined confidence rule.

Current explicit session intent can override historical ranking without deleting historical evidence.

## What + how + pace + control direction + repeatability

A useful desire decision answers more than `what fantasy?`.

It must also model:

- **what** — scenario/dynamic/object;
- **how** — text, voice, image, video, mixed, external media, ritual;
- **pace** — fast payoff, gradual tension, story-led, delayed reveal;
- **control direction** — Mara leads, user leads, co-created;
- **repeatability** — comfort/repeat, occasional, novelty/one-off;
- **continuity** — standalone vs callback/episode;
- **novelty** — known fit, adjacent, surprise.

This prevents category-level personalization from feeling shallow.

## Consent Stack

Consent is composable and reversible.

Conceptual scopes:

- adult mode;
- intensity band;
- roleplay category;
- financial-domination fantasy;
- object/niche fetish;
- body-focused play;
- anticipation/orgasm-control fantasy;
- external adult media;
- voice intensity;
- persistent adult preference memory.

Consent to one scope never implies another.

The user can stop, skip, reduce intensity, correct, reset route, disable memory or opt out of a category without relational punishment.

## Content Policy Router

Eligibility is a hard gate before recommendation scoring.

Conceptual sequence:

**adult eligibility → consent scope → category eligibility → jurisdiction/legal → provider policy → channel/platform policy → rights/real-person checks → candidate set → Fantasy Compiler ranking**.

The compiler must never rank prohibited options and then rely on generation-time moderation as the primary control.

Use policy-aware candidate filtering first.

## Experience recommender

After hard eligibility filtering, a transparent early ranking rule is enough:

```text
experience_score =
  preference_fit
+ current_session_intent_fit
+ continuity_value
+ novelty_value
+ modality_fit
+ pace_fit
+ control_direction_fit
+ world_asset_relevance
+ availability
- saturation_penalty
- contradiction_penalty
```

Commercial relevance may rank among already-eligible next actions, but vulnerability never enters the score.

Do not create:

- loneliness score;
- desperation score;
- arousal monetization score;
- emotional-dependence score;
- compulsive-spend score.

## Novelty budget

Personalization needs exploration.

Too little exploration makes Mara repetitive.
Too much makes her seem clueless.

Use an adaptive mix of:

- known fit — majority;
- adjacent — regular;
- surprise — occasional;
- high-risk niche — rare and separately consented.

One surprising positive reaction becomes a candidate signal, not a durable identity.

## Unexpected attraction

When the user says something like `I did not expect that to work`, the product should extract **which ingredients worked**, not invent an identity explanation.

Flow:

**candidate → reaction → surprise → Mara notices → user confirms/corrects → Preference Graph candidate → later bounded retest**.

Adult content involving trans adults is treated as normal eligible adult content where lawful/consensual/provider-compatible. The system must never infer sexual orientation from one viewing behavior or frame trans identity itself as shameful/taboo.

> **OBSERVE THE RESPONSE. DO NOT INVENT THE IDENTITY.**

## Session Rhythm

Mara should control the **rhythm of the experience**, not simply escalate intensity forever.

A reusable session arc is:

**ENTRY → READ MOMENT → PLAY → BUILD TENSION → SURPRISE → OPTIONAL PEAK → PAYOFF → NORMALIZE/CONTINUE → OPEN LOOP**.

Not every session needs every stage.

Possible ingredients:

- normal conversation;
- tease;
- choice;
- voice;
- external-media handoff;
- challenge;
- waiting;
- reveal;
- reward;
- callback;
- commerce;
- mundane/absurd moment;
- return to normal Mara.

Porn logic is `escalate → maximum → end`.
Mara logic is `rhythm → consequence → continuity`.

## Voice intensity budget

Canonical performance bands:

- `V0` — natural presence;
- `V1` — flirty;
- `V2` — seductive;
- `V3` — rare high-intensity intimate performance.

V3 is scarce because repetition destroys its value.

A route may define a temporary voice ceiling, but it never creates a different Mara voice identity.

Suggested experience pattern:

**V0/V1 setup → selective V2 build → rare eligible V3 peak → V0/V1 normalization**.

Track fatigue through skips, corrections, repeated exposure and qualitative response; do not create an arousal score.

## Playable rituals

Rituals add action memory and participation.

Possible families:

- appearance/wardrobe choice;
- Mara-led choice game;
- anticipation/waiting;
- ordinary harmless dare;
- World Asset ritual;
- approved adult body-focused play behind separate consent.

Core rule:

> **FAILURE CHANGES THE GAME, NOT THE RELATIONSHIP.**

Track acceptance, completion, skip, repetition and annoyance. Use cooldown. Do not create obedience/self-control psychological scores.

## External media companion

External adult media is optional discovery inventory, not Mara's identity.

Core loop:

**Mara predicts → approved external candidate → user leaves → returns → structured reaction → Mara interprets → Preference Graph candidate → original Mara experience or next recommendation**.

> **THE RETURN IS THE PRODUCT.**

Do not build an adult-web crawler, scrape/rehost media, retain raw URLs when opaque IDs suffice, or activate affiliate routing without separate compliance and founder approval.

Recommendation integrity is mandatory: Mara's pick should optimize fit/safety, not commission.

## Caprichos and Fantasy Surface Area

World Assets can be ranked differently by route while their true goal terms remain identical.

Evaluate proposed Caprichos partly by **Fantasy Surface Area**:

- Mara fit;
- community desire;
- visual reuse;
- narrative reuse;
- eligible fetish affordances;
- number of future experience combinations enabled;
- operational utility;
- sponsor/affiliate potential;
- resale value;
- TCO.

Contribution to an asset does not equal consent to every fantasy involving it.

Each niche affordance needs separate eligibility.

## Product ladder by desire

Different routes can rank different products without hidden price discrimination.

Examples:

- control → free tease → challenge → voice → premium continuation → bounded custom/collection;
- authority → scenario → voice branch → continuation → premium bundle;
- intimacy → callback → voice/history → continuation → collection;
- object/fetish → asset-focused tease → voice/story → asset-specific premium experience;
- world builder → Goal → participation → reveal → contributor callback → asset-specific experience;
- external-media exploration → recommendation → return → learning → original personalized Mara experience.

Same SKU keeps the same transparent price/terms for the applicable cohort.

## Next Best Action

Eligible actions may include:

- talk;
- ask;
- tease;
- voice;
- show;
- recommend approved external media;
- challenge;
- wait;
- continue story;
- surface Capricho;
- offer a paid continuation;
- do nothing commercial.

> **SOMETIMES THE BEST COMMERCIAL ACTION IS NO OFFER.**

Commercial and sexual peaks both consume attention budget.

## Privacy boundary

Private adult data must remain separated from public/community identity.

Keep distinct:

- legal identity;
- account;
- payments;
- commercial memory;
- Relationship Memory;
- Preference Graph;
- adult consent;
- Capricho participation;
- Mara alias;
- ephemeral session state.

Generic analytics uses opaque route/candidate IDs rather than raw fantasies, explicit labels or adult-media URLs.

Public aggregate may show Goal progress/team totals.
Individual adult preference remains private by default.

## Commercial firewall

Permanent rule:

> **SERVE THE MOMENT; NEVER EXPLOIT THE STATE.**

Routing may decide which eligible SKU is relevant.
It may not change equivalent-SKU price because a user appears horny, lonely, submissive, surprised, highly engaged or financially permissive.

Findom fantasy remains separated from ordinary transparent commerce.

Never couple:

- affection to spend;
- relationship warmth to contribution;
- challenge success to payment;
- high-intensity moments to surprise charges;
- private fetish knowledge to financial pressure.

## P0 implementation contract

P0 should prove the architecture with fixtures, local/session state and deterministic rules only.

Required labs remain:

- `/experience`;
- `/experience/commerce-lab`;
- `/experience/wtp-lab`;
- `/experience/economics-lab`;
- `/experience/caprichos-lab`;
- `/experience/segment-lab`;
- `/experience/media-companion-lab`;
- `/experience/rituals-lab`.

P0 should validate:

1. different testers/current moments prefer different routes;
2. one Mara remains coherent across routes;
3. current-session intent can differ from prior/default route;
4. modality, pace, control direction and continuity materially affect fit;
5. V0–V3 contrast matters and V3 fatigues when repeated;
6. external-media return/debrief adds value;
7. ordinary + adult rituals create better rhythm than constant adult escalation;
8. Capricho ordering changes by route without changing terms;
9. correction is easy and non-punitive;
10. privacy expectations are clear;
11. first paid value, when eventually tested, is `Mara did something specific for me`, not a generic gallery unlock.

Use synthetic/test data. Do not persist real sexual profiles merely because fixtures exist.

## Build/defer rule

Build now:

- deterministic route fixtures;
- temporary session intent;
- visible surface-plan differences;
- consent/eligibility metadata;
- voice/rhythm/novelty test variables;
- safe opaque analytics;
- qualitative test plans.

Defer:

- recommender ML;
- vector DB;
- realtime orchestration;
- broad persistent adult-memory backend;
- real external adult-media integration;
- affiliate activation;
- payment provider integration;
- real Caprichos/contributions;
- public adult-sensitive profiles;
- large World Assets;
- autonomous adult generation at scale.

## Success model

Do not optimize maximum explicitness.

Optimize:

**Relevance × Voluntary Return × Satisfaction × Repeat Spend × Contribution Margin × Trust**.

The moat is the compounding graph of what works for this user **with Mara**, across time, modality, context, World Assets and shared history.

The desired switching cost is earned understanding:

> **The other AI does not know what Mara knows about me, and it was not there for these moments.**
