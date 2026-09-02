# Mara Vera — Fantasy Compiler / Desire Composition Engine

## Status

Authoritative composition and recommendation layer inside the existing Foundation outcome.

The Fantasy Compiler does **not** create a new user profile, memory system, content engine or payment layer. It consumes filtered signals from the [Preference Graph](preference-graph.md), [Desire Discovery Engine](desire-discovery-engine.md), Context Builder, Life Engine and Relationship Memory, then composes/ranks eligible experience configurations for the [Fantasy Experience Engine](fantasy-experience-engine.md) to deliver.

## Core thesis

Do not build Mara as:

**fetish category → user selects → content consumed**.

Build:

**Discover → Understand → Compose → Deliver → React → Learn → Continue.**

The commercial unit is not one category such as `dominance`, `roleplay` or `audio`.

It is a **combination of desire variables**.

Example:

```yaml
energy: selective
interaction: teasing
context: work
format: voice
dynamic: mara_leads
narrative: continuation
personalization: preference_aware
novelty: adjacent
```

The AI-native advantage is the ability to combine a bounded set of reusable dimensions into many coherent, Mara-specific experiences without mass-producing every combination as a separate asset.

## Architecture position

Conceptual flow:

**Desire Discovery → Preference Graph slice → Context Builder / Life State → Fantasy Compiler → eligible Experience Vector(s) → Fantasy Experience Engine → user reaction → preference/memory update candidate**.

The Fantasy Compiler owns:
- experience-variable schema;
- User Desire Vector projection;
- Experience Vector representation;
- eligibility filtering;
- rule-based matching;
- known-fit vs explore selection;
- saturation/novelty adjustment;
- sequence eligibility;
- candidate ranking;
- composition metadata;
- experiment assignment where relevant.

It does not own:
- durable user memory;
- relationship stage;
- raw adult preference storage;
- character canon;
- payment/pricing state;
- generation providers;
- final content safety review;
- clinical/psychological inference.

## Priority fantasy families for P0

The first experiment set should remain narrow.

### S — Relationship / personal relevance
Core promise: **“Mara me conoce.”**

Test:
- correct callbacks;
- prediction;
- preference-aware recommendation;
- personalized voice;
- continuation based on prior choice.

### S — Confident / selective / light-dominant Mara
Aligned with Character Bible:
- self-possessed;
- no validation seeking;
- no financial neediness;
- playful control;
- explicit consent for stronger adult intensity.

### S — Situational roleplay
Reusable contexts such as:
- gym;
- work;
- home;
- night;
- travel;
- party;
- date.

### S — Desire discovery
The discovery interaction itself can be part of the fantasy/entertainment value.

### S — Voice-first
Voice is a multiplier across families, not merely another category.

### A — Novelty / Surprise Me
Bounded exploration outside the highest-scoring known fit.

### Later experiments
Only after signal:
- third-party / multi-person fantasy;
- consensual jealousy/sharing dynamics;
- micro-niches.

High-risk/extreme categories are not launch-core and remain subject to Adult Compliance, provider/payment/platform limits and founder review.

## Fantasy Variable Model

P0 dimensions:

### Character energy
- `warm`
- `confident`
- `selective`
- `light_dominant`
- `playful`

### Interaction style
- `teasing`
- `direct`
- `mysterious`
- `conversational`
- `challenging`

### Context
- `gym`
- `work`
- `home`
- `night`
- `travel`
- `party`
- `date`
- other explicitly modeled safe contexts

### Format
- `text`
- `voice`
- `image`
- `video`
- `mixed`

### Dynamic
- `mara_leads`
- `user_leads`
- `collaborative`
- `surprise`
- `choose_your_path`

### Narrative
- `standalone`
- `episode`
- `continuation`
- `callback`
- `branching`

### Personalization depth
- `P0_generic_mara`
- `P1_nominal_contextual`
- `P2_preference_aware`
- `P3_continuity_aware`
- `P4_relationship_aware`

### Novelty
- `known_fit`
- `adjacent`
- `surprise_me`

These dimensions are intentionally bounded. Add new variables only when they create measurable product value.

## Experience Vector

Conceptual P0 schema:

```yaml
experience_id: exp_123
family: situational_roleplay
energy: selective
interaction: teasing
context: gym
format: voice
dynamic: mara_leads
narrative: continuation
personalization: P2_preference_aware
novelty: known_fit
adult_intensity_band: selective
eligibility:
  adult_mode_required: false
  consent_tags: []
  prohibited_if: []
commercial:
  sku: null
  paid: false
sequence:
  prerequisite_experience_ids: []
  continuation_of: null
saturation:
  repeat_window_days: 7
```

The actual schema may evolve, but P0 should remain legible and manually operable.

## User Desire Vector

The compiler must not create a permanent second profile.

It should request a **temporary projection** from Preference Graph for the current decision.

Example:

```yaml
user_desire_vector:
  energy:
    confident: high
    selective: medium
  interaction:
    teasing: high
  format:
    voice: high
    visual: medium
  narrative:
    continuation: high
  novelty:
    preference: medium
  context:
    work: emerging
```

Each projection remains governed by:
- confidence;
- explicit vs inferred;
- context;
- recency;
- sensitivity;
- consent;
- correction/rejection state.

## P0 matching

No ML is required.

A transparent weighted score is sufficient:

```text
fit_score =
  energy_fit
+ interaction_fit
+ format_fit
+ context_fit
+ narrative_fit
+ personalization_fit
+ novelty_modifier
- saturation_penalty
- contradiction_penalty
```

Eligibility/safety is a hard filter, not another score.

Sequence prerequisites are also hard constraints where applicable.

Weights are experimental and must not be treated as psychological truth.

## Explore vs known fit

Do not always select the highest fit score.

P0 can test a bounded mixture such as:
- majority known-fit;
- minority adjacent exploration;
- explicit `Surprise Me` when user requests it.

Any numeric allocation is a hypothesis, not a permanent rule.

Exploration must remain inside:
- consent;
- adult eligibility;
- explicit boundaries;
- safety rules;
- provider/payment/platform constraints where relevant.

## Serendipity and novelty budget

Some users appear to prefer consistency; others repeatedly choose novelty.

Represent only a low-sensitivity interaction preference such as:
- `novelty_preference: low | medium | high`;

with confidence/context.

Do not label it as personality, impulsivity or psychological need.

Use it only to choose between known-fit, adjacent and `Surprise Me` candidates.

## Experience saturation

Repeatedly showing the same combination can reduce value.

P0 saturation signals:
- recent repetition;
- skip/abandon rate;
- falling completion;
- correction/rejection;
- declining conversion;
- explicit “otra cosa”.

A simple `saturation_penalty` can increase exploration without claiming boredom as a stable psychological trait.

## Fantasy sequencing

Not every experience should be immediately eligible.

Sequence may consider:
- unfinished continuation;
- prior branch;
- explicit user choice;
- story prerequisite;
- current Life State;
- relationship context;
- consented intensity progression;
- saturation.

The compiler should answer two separate questions:

1. **What fits this user?**
2. **What fits now?**

This prevents personalization from becoming a static recommendation list.

## Life Engine integration

Life State can provide a narrative context variable when relevant.

Example:

```text
Life State: late workday + skipped gym
```

Eligible outcomes might include:
- short contextual message;
- voice note;
- playful choice;
- story continuation.

Life State must not force every ordinary event into monetization.

Many life events should remain ordinary texture.

## Voice compilation

The compiler may pass performance guidance to the Voice/Human Presence layer, such as:
- energy;
- pace tendency;
- directness;
- conversational/playful mode;
- current mood;
- narrative role.

It must not create a different Mara voice identity per user.

Canonical voice always wins over personalization.

## Mara curates

Mara is not a passive configurator.

The UI can expose:
- `For You`;
- `Mara's Pick`;
- `Surprise Me`;
- `Continue`;
- `Build It`;
- `New`;
- `Trending` only when real data exists.

`Mara's Pick` should use Mara's canonical character/life preferences plus eligibility and context, not arbitrary randomness.

## Build It / co-creation

A user can progressively select a bounded subset of variables:
1. mood;
2. energy;
3. setting;
4. format;
5. dynamic;
6. ending/continuation.

The user does not need access to every internal variable.

Mara may preselect or curate options based on known context and allow correction.

The final experience should visibly reflect the chosen combination.

## Commercial integration

Fantasy Compiler may change:
- which eligible product/experience is highlighted;
- ranking/order;
- modality;
- family;
- continuation priority;
- personalization depth;
- explore/known-fit presentation.

It must not:
- estimate maximum extractable price;
- use vulnerability to select offers;
- hide cheaper equivalent offers based on inferred willingness to pay;
- change baseline affection/respect;
- create financial/emotional pressure.

Price remains transparent and governed by SKU/cohort rules.

## Fantasy economics

For compiled experiences measure:
- conversion;
- completion;
- continuation;
- first → second purchase linkage;
- repeat purchase;
- generation/review cost;
- voice/video variable cost;
- fulfillment time;
- support/refund load;
- contribution margin;
- Personalization Lift;
- negative reaction/stop.

The best family is the one with the best **healthy economics**, not maximum gross revenue or explicitness.

## Trend Watch

Create a lightweight research process, not an automatic production engine.

Separate:

### Global trend
External market/research signal.

### Mara audience trend
What Mara users actually choose, complete, return to and buy.

Once internal sample quality is sufficient, Mara audience behavior should outweigh generic market hype.

Conceptual opportunity score:

**Trend Opportunity = External Demand × Internal Interest × Monetization × Retention × Margin × Compliance Fit**.

Do not present the formula as statistical science before calibrated data exists.

## Privacy and safety

Fantasy preference data can be sensitive.

Rules:
- minimize;
- purpose-limit;
- private by default;
- separate from general analytics;
- reset/delete/decay;
- never sell personal preference data;
- do not use for external ad targeting without an appropriate legal/consent basis;
- never infer orientation, trauma or vulnerability from indirect choices;
- never create loneliness/depression/debt/dependency/compulsion scores.

Before an adult compiled experience is eligible, enforce:
1. adult eligibility;
2. explicit adult-mode/consent requirements;
3. boundaries/prohibited-category filtering;
4. real-person impersonation/deepfake restrictions;
5. provider/platform/payment compatibility where relevant;
6. privacy classification;
7. clear commercial scope where paid.

## P0 experiment matrix

Test only a small number of families first.

### Relationship / personal relevance
- callback;
- prediction;
- personalized voice.

### Confident/selective/light dominant
- selective;
- light dominant opt-in;
- `Mara Chooses`.

### Situational roleplay
- gym;
- work;
- night.

### Discovery
- Fast Five;
- I Bet You;
- Build It.

### Voice
- generic Mara;
- name-personalized;
- context-personalized.

### Surprise
- known fit;
- adjacent;
- Surprise Me.

## MVP experiments

1. Generic fantasy category vs compiled combination.
2. Flat catalog vs “Mara made this for you” framing.
3. One-variable vs multi-variable personalization.
4. Visual-only vs voice-enabled.
5. User chooses everything vs Mara curates.
6. Known fit vs `Surprise Me`.
7. One-shot vs continuation.
8. Generic scenario vs Life State-connected scenario.
9. Static recommendation vs Mara prediction.
10. Finished experience vs `Build It`.

Use qualitative learning until sample size supports stronger inference.

## KPIs

Track where implemented:
- compiler recommendation CTR;
- compiled experience start/completion;
- continuation rate;
- personalized vs generic conversion;
- Personalization Lift;
- Mara Guess Accuracy;
- Surprise Acceptance;
- second purchase;
- repeat family;
- cross-family discovery;
- saturation/skip rate;
- ARPPU;
- contribution margin;
- D7/D30 return;
- preference correction;
- negative reaction/stop.

## Build trigger

P0 is enough with:
- Markdown;
- JSON;
- spreadsheets;
- simple relational tables;
- weighted scoring;
- manual content blocks;
- deterministic rules.

Do not build custom recommender ML, embeddings/vector DB, expensive agents or realtime orchestration until:
1. compiled/personalized experiences show measurable lift;
2. users repeatedly return/buy;
3. manual matching becomes a measured bottleneck;
4. privacy architecture is approved;
5. contribution margin supports automation;
6. the Traction → Investment Gate is satisfied or the founder authorizes a bounded experiment.

## Permanent principle

Do not ask:

> “¿Cuál es tu fetiche?”

Use play, observation, correction and explicit consent to build a bounded combination.

Then deliver something that feels:

> **made for this user by Mara, because of the history and choices they already share.**

The moat is not knowing that a broad fantasy category is popular.

The moat is knowing which **combination of Mara character + voice + context + interaction + narrative + novelty** works for this user, while preserving consent, privacy, trust and healthy economics.
