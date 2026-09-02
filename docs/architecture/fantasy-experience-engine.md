# Mara Vera — Fantasy Experience Engine

## Status

Future-facing product architecture with a manual-first launch path. This document defines narrative and interactive commerce patterns. It does not authorize production activation, real payments or expensive realtime infrastructure.

## Purpose

Transform adult content from a flat catalog into a coherent system of **situations, choices, continuations, voice moments and remembered callbacks**.

The differentiated value is:

**direction + anticipation + participation + personality + continuity**.

## Core experience model

A Fantasy Experience may contain:

1. **Context / setup** — Mara starts a recognizable situation.
2. **Hook** — a question, tension or unresolved moment.
3. **Choice** — the user selects among bounded options.
4. **Reaction** — Mara responds in character.
5. **Payoff** — free or paid content/interaction is delivered.
6. **Continuation** — a future branch, sequel or callback remains possible.
7. **Memory write** — only the minimum useful, consented state is retained where enabled.

This can work in text, voice, image, video or combinations.

## Fantasy Marketplace

Products should be organized around recognizable situations, not only file formats.

A marketplace item can define:
- title;
- short premise;
- adult intensity band;
- included formats;
- personalization options;
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

## Branching experiences

A simple branch should not require a game engine.

Launch representation can be Markdown/JSON:

```text
experience_id
premise
intensity_band
entry_variant
choice_1[]
reaction_1[]
paid_gate_optional
choice_2[]
payoff_ref
continuation_ref
memory_write_policy
```

Example interaction shape:

**Start → Choice → Mara reaction → Optional paid unlock → Second choice → Payoff → Future continuation**

Branching should create agency, not payment confusion.

## Commercial gates

A paid gate may appear only when:
- the user has enough context to understand the value;
- price and scope are visible;
- the purchase is optional;
- declining does not reduce baseline respect or previously earned continuity;
- adult-mode requirements have been satisfied where applicable.

Do not surprise-charge or interrupt a highly aroused adult moment with opaque pricing.

## Narrative retention

The engine should create reasons to return beyond asset novelty.

Potential structures:
- episodes;
- mini seasons;
- recurring scenarios;
- unresolved loops;
- user-chosen consequences;
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
Tone, format or theme based on explicit preferences.

### P3 — Continuity-aware
Uses a prior story choice or safe callback.

### P4 — Relationship-aware
Uses durable relationship context, only after consent-based persistent memory is justified.

Higher depth should command higher price only if it creates measurable value and reasonable contribution margin.

## Modular content architecture

To scale without feeling templated, separate:
- canonical premise;
- Mara voice/personality layer;
- allowed variables;
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
- available continuations.

This should create useful continuity, not emotional pressure.

## Experience economics

For each experience, track:
- production/review cost;
- fulfillment time;
- conversion from preview;
- completion rate;
- continuation rate;
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

Use spreadsheets/Markdown/JSON to operate tests before building workflow engines.

## Build trigger

Automate only when:
1. users repeatedly complete or purchase narrative experiences;
2. continuation behavior predicts return or spend;
3. manual fulfillment becomes a measured bottleneck;
4. contribution margin can support the infrastructure;
5. provider/payment/legal constraints are resolved;
6. the Traction → Investment Gate is satisfied or the founder explicitly authorizes a bounded test.
