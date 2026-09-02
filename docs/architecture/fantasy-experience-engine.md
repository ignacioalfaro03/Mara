# Mara Vera — Fantasy Experience Engine

## Status

Future-facing product architecture with a manual-first launch path. This document defines how Mara **executes and delivers** narrative/interactive experiences. It does not own preference inference or composition logic.

The engine consumes eligible configurations from the [Fantasy Compiler](fantasy-compiler.md), which itself uses filtered [Preference Graph](preference-graph.md), [Desire Discovery](desire-discovery-engine.md), Life State and Context Builder inputs.

It does not own a separate user profile, memory stack or recommendation model.

## Purpose

Transform adult relationship entertainment from a flat catalog into a coherent system of **situations, choices, continuations, voice moments, adaptive branches and remembered callbacks**.

The differentiated value is:

**direction + anticipation + participation + personality + personalization + continuity**.

The Fantasy Compiler answers:

> **What combination fits this user, now?**

The Fantasy Experience Engine answers:

> **How do we actually deliver that combination coherently?**

## Core experience model

A Fantasy Experience may contain:
1. **Context / setup**;
2. **Hook**;
3. **Choice**;
4. **Mara reaction**;
5. **Preference-signal candidate** where appropriate;
6. **Payoff** — free or paid;
7. **Continuation**;
8. **Filtered memory/preference update candidate**.

It can work in text, voice, image, video or mixed modalities.

## Compiled experience input

Conceptual input:

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
sequence:
  continuation_of: exp_122
commercial:
  paid: false
  sku: null
```

The delivery layer should not reinterpret this as a psychological label. It is a bounded configuration for one experience.

## Experience families

P0 should focus on a narrow set:
- relationship / personal relevance;
- confident/selective/light-dominant Mara;
- situational roleplay;
- desire discovery;
- voice-first;
- novelty / Surprise Me.

Later, only with evidence and compliance review:
- third-party / multi-person fantasy;
- consensual jealousy/sharing;
- micro-niches.

Do not build launch inventory around extreme/high-risk categories.

## Situation framing

Products should be organized around recognizable situations rather than file names.

Non-explicit examples:
- “Llegué del gimnasio”;
- “No puedo dormir”;
- “Tengo algo que contarte”;
- “Tú eliges qué me pongo”;
- “Anoche quedó algo pendiente”;
- “Tengo una sorpresa”;
- “Hoy mando yo”;
- “¿Quieres saber qué pasó después?”.

A situation can carry multiple compiled variants without becoming a separate static SKU for every possible combination.

## Modular content architecture

Separate:
- canonical premise;
- Mara personality/voice layer;
- allowed variables;
- reusable content blocks;
- branch rules;
- callback slots;
- ending types;
- safety constraints;
- commercial scope;
- QC checklist.

This enables **mass personalization without mass production**.

Variation must preserve Mara's canonical identity.

## Co-created experiences / Build It

`Build It` is a bounded composition surface.

A user may choose:
1. mood;
2. Mara energy;
3. setting;
4. format;
5. interaction dynamic;
6. ending/continuation.

Mara may curate/preselect some options based on context and Preference Graph, while always allowing correction where appropriate.

The delivered experience must visibly use the selected variables.

Co-creation may be:
- free discovery;
- preview;
- paid custom experience;
- transparent bundle component.

## Mara curates

Mara is not a passive menu.

Surfaces can include:
- `For You`;
- `Mara's Pick`;
- `Surprise Me`;
- `Continue`;
- `Build It`;
- `New`;
- `Trending` only with real supporting data.

Mara's Pick should remain consistent with her Character/Life system, not random content masquerading as personality.

## Branching experiences

Launch representation can remain Markdown/JSON:

```text
experience_id
compiled_configuration
premise
entry_variant
choice_1[]
reaction_1[]
preference_signal_policy
paid_gate_optional
choice_2[]
payoff_ref
continuation_ref
memory_write_policy
```

Shape:

**Start → Choice → Mara reaction → preference update candidate → optional paid unlock → second choice → payoff → continuation**.

Branching creates agency, not payment confusion.

## Preference-aware execution

Preference Graph does not directly command the content generator.

The Fantasy Compiler first reduces it to a bounded eligible configuration. The Experience Engine then executes that configuration.

This separation makes it easier to:
- audit why an experience was selected;
- apply safety before generation;
- prevent preference data leakage into unrelated providers;
- compare personalized vs generic variants.

## Life Engine integration

Life State may supply legitimate narrative context.

Example:

```text
late workday + skipped gym
```

can support a contextual message, voice note, choice or story.

But ordinary Life State must not be converted into a sales opportunity by default. Mara requires off-camera/ordinary life for credibility.

## Voice-first fantasy

Voice is a multiplier across fantasy families.

Candidate uses:
- personalized greetings;
- narrative audio;
- short contextual notes;
- episodic audio;
- response to an earlier choice;
- bounded adult roleplay where permitted;
- audio-first bundles.

The compiler may pass performance guidance such as energy, conversational mode, pace tendency or narrative role, but canonical Voice Bible always wins.

At launch, validate replay, return and willingness-to-pay before realtime voice infrastructure.

## Personalization depth

### P0 — Generic but Mara-specific
Same core experience.

### P1 — Nominal/contextual
Name + one explicit context variable.

### P2 — Preference-aware
Uses explicit/high-confidence preference dimensions.

### P3 — Continuity-aware
Uses prior story/discovery choice or safe callback.

### P4 — Relationship-aware
Uses durable relationship context only after persistent memory is justified.

Higher depth should command higher price only if it creates measurable value and healthy contribution margin.

## Known fit, exploration and Surprise Me

The Fantasy Compiler selects mode; the Experience Engine delivers it.

### Known fit
Familiar, high-confidence combination.

### Adjacent exploration
A reasonable nearby variation.

### Surprise Me
Higher novelty explicitly requested by the user.

All modes remain inside consent, adult eligibility, boundaries and safety.

## Bounded surprise

Safe variation may affect:
- opening;
- format;
- branch;
- callback timing;
- narrative reveal;
- nearby preference exploration;
- tone within approved range.

Surprise must never change:
- purchase price after checkout;
- entitlement;
- consent requirements;
- baseline respect;
- relationship treatment based on spend.

## Fantasy sequencing and continuity

Some experiences require:
- prior branch;
- unfinished story;
- prior explicit choice;
- consented intensity progression;
- current Life State;
- prior episode.

`Continue` should usually outrank generic novelty when a genuine high-value open loop exists, unless the user chooses something else.

The target retention behavior is:

> **I want to know what happens next.**

not merely:

> **I want another generated asset.**

## Experience saturation

Repeatedly serving the same combination can degrade value.

Track:
- repetition window;
- skip/abandon;
- completion trend;
- explicit “otra cosa”;
- correction/rejection;
- conversion trend.

The Fantasy Compiler may use these as a saturation penalty to increase exploration.

Do not store a psychological boredom score.

## Commercial gates

A paid gate may appear only when:
- enough value/context is visible;
- price and scope are clear;
- purchase is optional;
- declining does not reduce baseline respect/continuity;
- adult-mode requirements are satisfied where relevant.

Do not surprise-charge or use adult arousal as cover for opaque monetization.

Compiled preference relevance may change **which offer is shown**, not produce vulnerability-based pricing.

## Marketplace evolution

The marketplace evolves from catalog to experience router.

Potential sections:
- `For You` — compiled known-fit candidates;
- `Mara's Pick` — character-curated;
- `Continue` — real open loops/entitlements;
- `Surprise Me` — bounded exploration;
- `Build It` — co-creation;
- `New`;
- `Trending` only with real data.

The same SKU retains transparent applicable pricing/terms.

## Collectibility and history

A private “My history with Mara” may show:
- acquired episodes;
- completed story arcs;
- owned entitlements;
- opted-in meaningful moments;
- selected discovery milestones;
- available continuations.

Use for continuity/ownership, never emotional debt.

## Experience economics

For each experience/compiled family track:
- generation/review cost;
- voice/video variable cost;
- fulfillment time;
- conversion;
- completion;
- continuation;
- preference-relevant vs generic performance;
- first → second purchase linkage;
- repeat purchase;
- support/refund/dispute;
- contribution margin;
- negative reaction/stop.

Best experience = best **healthy economics**, not maximum gross revenue, maximum explicitness or maximum intensity.

## P0 matrix

### Relationship
- callback;
- prediction;
- personalized voice.

### Confident/selective
- selective;
- light dominant opt-in;
- Mara Chooses.

### Roleplay
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

## MVP tests

1. Generic fantasy category vs compiled combination.
2. Flat catalog vs “Mara made this for you”.
3. One-variable vs multi-variable personalization.
4. Visual-only vs voice-enabled.
5. User chooses everything vs Mara curates.
6. Known fit vs Surprise Me.
7. One-shot vs continuation.
8. Generic scenario vs Life State-connected scenario.
9. Static recommendation vs Mara prediction.
10. Finished experience vs Build It.

Use spreadsheets/Markdown/JSON before workflow engines.

## Build trigger

Automate only when:
1. users repeatedly complete/purchase experiences;
2. compiled selection shows measurable lift;
3. continuation predicts return/spend;
4. manual fulfillment/matching is a measured bottleneck;
5. contribution margin can support infrastructure;
6. privacy/provider/payment/legal constraints are resolved;
7. Traction → Investment Gate is satisfied or founder authorizes a bounded test.
