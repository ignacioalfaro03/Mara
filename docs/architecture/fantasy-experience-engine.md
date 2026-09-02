# Mara Vera — Fantasy Experience Engine

## Status

Future-facing product architecture with a manual-first launch path. This document defines narrative and interactive commerce patterns. It does not authorize production activation, real payments or expensive realtime infrastructure.

The engine consumes filtered [Preference Graph](preference-graph.md) signals and [Desire Discovery](desire-discovery-engine.md) outputs through the existing Relationship Memory / Context Builder architecture. It does not own a separate user profile.

## Purpose

Transform adult content from a flat catalog into a coherent system of **situations, choices, continuations, voice moments, adaptive branches and remembered callbacks**.

The differentiated value is:

**direction + anticipation + participation + personality + personalization + continuity**.

## Core experience model

A Fantasy Experience may contain:

1. **Context / setup** — Mara starts a recognizable situation.
2. **Hook** — a question, tension or unresolved moment.
3. **Choice** — the user selects among bounded options.
4. **Reaction** — Mara responds in character.
5. **Preference signal** — the choice may create a low-confidence structured signal where appropriate.
6. **Payoff** — free or paid content/interaction is delivered.
7. **Continuation** — a future branch, sequel or callback remains possible.
8. **Memory write** — only the minimum useful, consented state is retained where enabled.

This can work in text, voice, image, video or combinations.

## Preference-aware experience selection

The Preference Graph may influence:
- experience ranking;
- voice vs visual emphasis;
- story family;
- branch ordering;
- Mara tone within consented intensity;
- context/style;
- personalization depth;
- which continuation is surfaced;
- whether to show a known-fit option or a bounded exploration option.

Rules:
- explicit consent/boundaries override preference fit;
- adult mode eligibility overrides all inferred interest;
- one weak inferred signal must not lock the user into a category;
- explicit correction/rejection must propagate immediately;
- sensitive preferences should use conservative retention/retrieval.

## Explore, exploit and Surprise Me

The experience selector should balance:

### Known fit
Use reliable preferences to improve relevance.

### Exploration
Offer reasonable adjacent alternatives to avoid a filter bubble and learn changing tastes.

### Surprise Me
A user-controlled exploration mode that increases novelty while respecting boundaries.

This is recommendation-system logic only; it is never a license to exploit users economically.

## Fantasy Marketplace

Products should be organized around recognizable situations, not only file formats.

A marketplace item can define:
- title;
- short premise;
- adult intensity band;
- included formats;
- personalization options;
- relevant preference tags;
- exploration eligibility;
- duration/length;
- whether choices are included;
- whether continuation is available;
- clear price/scope;
- expiry/availability only when real;
- consent/boundary requirements.

### Example situation framing

Non-explicit examples:
- "Llegué del gimnasio";
- "No puedo dormir";
- "Tengo algo que contarte";
- "Tú eliges qué me pongo";
- "Anoche quedó algo pendiente";
- "Tengo una sorpresa";
- "Hoy mando yo";
- "Quieres saber qué pasó después".

The situation is a product wrapper. The exact content remains governed by adult compliance and user boundaries.

## Co-created experiences

`Build It` can turn discovery into product creation.

Example bounded sequence:
1. mood;
2. setting;
3. look;
4. interaction tone;
5. preferred modality;
6. continuation type.

The resulting experience should visibly use the selected variables.

This creates a stronger sense of personalization than choosing a finished catalog item, while keeping generation constrained and operable.

Co-creation can be:
- free discovery;
- a preview;
- a paid custom experience;
- part of a transparent bundle.

## Branching experiences

A simple branch should not require a game engine.

Launch representation can be Markdown/JSON:

```text
experience_id
premise
intensity_band
preference_tags[]
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

Example interaction shape:

**Start → Choice → Mara reaction → Preference update candidate → Optional paid unlock → Second choice → Payoff → Future continuation**

Branching should create agency, not payment confusion.

## Commercial gates

A paid gate may appear only when:
- the user has enough context to understand the value;
- price and scope are visible;
- the purchase is optional;
- declining does not reduce baseline respect or previously earned continuity;
- adult-mode requirements have been satisfied where applicable.

Do not surprise-charge or interrupt a highly aroused adult moment with opaque pricing.

Preference signals may improve **which offer is shown**, not produce vulnerability-based pricing.

## Narrative retention

The engine should create reasons to return beyond asset novelty.

Potential structures:
- episodes;
- mini seasons;
- recurring scenarios;
- unresolved loops;
- user-chosen consequences;
- discovery callbacks;
- callbacks;
- anniversary/seasonal moments;
- sequels;
- collections.

The target behavior is:

> **I want to know what happens next.**

not simply:

> **I want another generated image.**

## Voice-first fantasy

Voice is a primary modality because it can create intimacy at lower production complexity than video.

Candidate products:
- personalized greetings;
- narrated stories;
- short contextual voice notes;
- episodic audio;
- responses tied to an earlier choice;
- roleplay voice experiences where permitted;
- audio-first bundles.

Preference Graph signals can prioritize voice when the user has explicitly or reliably demonstrated voice affinity.

Quality bar follows `docs/character/voice-bible.md`:
- natural cadence;
- Mara-specific delivery;
- conversational pacing;
- emotional range;
- no generic narrator/TTS feel.

At launch, validate willingness to replay, return and pay for Mara voice before investing in realtime voice infrastructure.

## Personalization depth

Not every product needs deep personalization.

Candidate levels:

### P0 — Generic but Mara-specific
Same core experience for all users.

### P1 — Nominal/contextual
Preferred name and one explicit context variable.

### P2 — Preference-aware
Tone, format or theme based on explicit/high-confidence preference signals.

### P3 — Continuity-aware
Uses a prior story/discovery choice or safe callback.

### P4 — Relationship-aware
Uses durable relationship context, only after consent-based persistent memory is justified.

Higher depth should command higher price only if it creates measurable value and reasonable contribution margin.

## Modular content architecture

To scale without feeling templated, separate:
- canonical premise;
- Mara voice/personality layer;
- allowed variables;
- preference tags;
- exploration tags;
- content blocks;
- branch rules;
- callback slots;
- ending types;
- safety constraints;
- QC checklist.

Variation must preserve character consistency.

Do not expose raw prompt templates to users as the product. Sell the experience.

## Bounded surprise

Safe variation may affect:
- opening line;
- format;
- branch;
- callback timing;
- reward type;
- narrative reveal;
- nearby preference exploration;
- tone inside the approved range.

Surprise must never alter:
- price after purchase;
- purchased entitlements;
- consent requirements;
- baseline respect;
- relationship treatment based on spend.

## Collectibility and history

A future account may show a private "My history with Mara" view containing only appropriate user-owned records such as:
- acquired episodes;
- story arcs completed;
- saved/owned media entitlements;
- milestones;
- opted-in memorable moments;
- selected discovery results where appropriate;
- available continuations.

This should create useful continuity, not emotional pressure.

## Experience economics

For each experience, track:
- production/review cost;
- fulfillment time;
- conversion from preview;
- completion rate;
- continuation rate;
- preference-relevant vs generic performance;
- first → second purchase linkage;
- repeat rate;
- refund/dispute;
- contribution margin;
- negative reaction / stop rate.

Do not optimize solely for `purchase_after_cliffhanger`. A cliffhanger that harms trust is a bad product even if short-term conversion rises.

## MVP tests

Manual-first priority tests:

1. Flat asset vs situation-framed asset.
2. Situation + voice vs situation without voice.
3. Single path vs one meaningful user choice.
4. No continuation vs explicit sequel/continuation.
5. Generic vs P1 personalized short audio/message.
6. No callback vs relevant callback from the prior episode.
7. Generic experience recommendation vs Preference Graph-informed recommendation.
8. Known-fit recommendation vs `Surprise Me` exploration.
9. Finished catalog choice vs `Build It` co-created experience.
10. Discovery result only vs discovery result + immediately adapted fantasy experience.

Use spreadsheets/Markdown/JSON to operate tests before building workflow engines.

## Build trigger

Automate only when:
1. users repeatedly complete or purchase narrative experiences;
2. preference-aware selection shows measurable lift;
3. continuation behavior predicts return or spend;
4. manual fulfillment becomes a measured bottleneck;
5. contribution margin can support the infrastructure;
6. provider/payment/legal constraints are resolved;
7. the Traction → Investment Gate is satisfied or the founder explicitly authorizes a bounded test.
