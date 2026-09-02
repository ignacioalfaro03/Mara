# Mara Vera — Preference Graph

## Status

Authoritative structured-preference model inside **User Relationship Memory**.

This is not a second memory database. It is a normalized view of selected user preference signals that can be consumed by the Context Builder, Desire Discovery Engine, Fantasy Experience Engine and future Next Best Experience logic.

## Purpose

Represent what Mara currently has reason to believe a user prefers, with enough context to avoid treating one choice as permanent truth.

The graph should support:
- explicit preferences;
- inferred preferences;
- confidence;
- context;
- format/modality;
- recency;
- contradiction;
- decay;
- correction;
- sensitivity;
- consent;
- user control.

## Core record

Conceptual shape:

```yaml
preference_id: pref_123
user_id: user_123
category: interaction_style
value: teasing
context:
  surface: private_chat
  modality: text
  scenario: null
source:
  type: repeated_choices
  source_refs:
    - discovery_session_4
explicit: false
confidence: medium
stability: emerging
sensitivity: normal
consent_scope: personalization
created_at: 2026-09-02T00:00:00Z
last_observed_at: 2026-09-02T00:00:00Z
last_confirmed_at: null
contradiction_count: 0
status: active
```

The exact storage schema remains implementation-dependent.

## Explicit vs inferred

### Explicit

The user directly states or confirms a preference.

Examples:
- “prefiero audio”;
- “no me gusta eso”;
- “háblame más directo”;
- “solo en historias”.

Explicit records normally receive higher confidence, subject to recency and later correction.

### Inferred

Derived from repeated behavior such as:
- repeated A/B choices;
- ranking;
- selected branches;
- repeated format consumption;
- accepted recommendations.

Inferred records remain hypotheses.

Mara should use confidence-aware language rather than treating them as identity facts.

## Context model

Preferences can vary by context.

Avoid global statements when the evidence is modality- or situation-specific.

Model dimensions where useful:
- surface;
- modality;
- narrative vs conversation;
- public vs private;
- adult-mode context;
- intensity band;
- time/moment;
- specific experience family.

Example:

A user can prefer:
- teasing in text;
- direct voice delivery;
- elegant visual aesthetics;
- surprise in story branches.

Do not collapse these into `user_prefers_teasing = true` globally.

## Confidence model

Initial rule-based model:

### Low
- one inferred signal;
- old or weak evidence;
- contradictory evidence exists.

### Medium
- several consistent signals;
- repeated recent behavior;
- one explicit but context-dependent statement.

### High
- explicit recent confirmation;
- repeated consistent behavior plus user confirmation;
- durable preference with no meaningful contradiction.

Confidence must be reducible.

## Stability

Candidate states:
- `experimental` — one-off/new exploration;
- `emerging` — repeated but not stable;
- `stable` — consistent across time/context;
- `contextual` — reliable only under specific conditions;
- `changing` — recent evidence differs from older pattern;
- `rejected` — user explicitly rejected;
- `expired` — no longer considered current.

## Preference decay

Do not treat old inferred preferences as permanent.

Decay can depend on:
- time since observation;
- confidence;
- explicit vs inferred source;
- contradiction count;
- context stability;
- sensitivity.

P0 can use simple rules rather than a numeric decay algorithm.

Example:
- one inferred choice → short lifetime;
- repeated recent choices → longer;
- explicit stable preference → long-lived until correction;
- adult/sensitive inferred preference → conservative retention and re-confirmation requirements.

## Contradictions

Contradiction is expected and valuable.

When new behavior conflicts with an existing preference:
1. record the new signal;
2. reduce confidence if appropriate;
3. check context differences;
4. avoid immediately deleting the older record;
5. if repeated, mark `changing` or split by context;
6. if explicitly corrected, update/reject the old preference.

Mara may surface contradiction playfully:

> “Eso sí que no te lo tenía.”

But should not pressure the user to explain.

## Correction handling

Correction types:
- `wrong` — Mara inferred incorrectly;
- `contextual` — true only in some contexts;
- `changed` — preference evolved;
- `temporary_override` — today is different;
- `reject` — do not use this preference;
- `reset` — remove a class of personalization.

Corrections should have stronger weight than weak inferred signals.

## Sensitivity classes

Suggested classes:
- `normal` — style, format, humor, pacing;
- `personal` — relationship/interaction preferences;
- `adult_sensitive` — adult fantasy/intensity preferences;
- `prohibited_inference` — must never be created.

`adult_sensitive` records require stricter consent, visibility, retention and analytics separation.

## Prohibited preference nodes

Do not create nodes for:
- loneliness;
- depression;
- trauma diagnosis;
- bereavement vulnerability;
- debt;
- financial distress;
- desperation;
- emotional dependency;
- compulsive spending;
- sexual compulsion;
- inferred orientation from indirect choices;
- other vulnerability scores intended for monetization.

## Source provenance

Every inferred preference should be explainable internally through source references such as:
- discovery session;
- story branch;
- explicit statement;
- correction;
- repeated modality choice;
- purchase/experience completion where appropriate.

Do not store raw intimate content if a structured low-sensitivity signal is sufficient.

## Commercial separation

Preference Graph may influence **relevance**, such as:
- which SKU is highlighted;
- which experience family is recommended;
- which modality is shown first;
- which story continuation is prioritized.

It must not be used to:
- set personalized prices based on willingness-to-pay inference;
- infer vulnerability;
- increase emotional pressure;
- alter baseline respect/affection;
- hide cheaper equivalent products from vulnerable users.

Pricing remains governed by transparent SKU/cohort rules.

## Context Builder handoff

The Context Builder should retrieve only the smallest useful preference subset.

Example context block:

```text
RELEVANT PREFERENCES
- voice format: high confidence, explicitly confirmed
- interaction style: teasing, medium confidence, private text only
- story mode: surprise, emerging
- do not use: X (explicit rejection)
```

Do not dump the whole graph into every prompt.

## Fantasy Engine handoff

The Fantasy Experience Engine can use the graph to select:
- eligible story families;
- branch ordering;
- voice vs visual emphasis;
- intensity defaults within consent;
- personalization level;
- explore/serendipity candidates.

Adult eligibility/consent always overrides preference relevance.

## User-visible Desire Profile

A future user-facing summary may translate graph data into playful, editable language.

Example:

**Por lo que has ido eligiendo**
- Voz: alta afinidad
- Storytelling: alta
- Sorpresa: media
- Tensión: alta

Rules:
- no diagnosis;
- no hidden sensitive inference;
- allow correction/reset;
- do not reveal internal confidence mechanics unless useful;
- private by default.

## P0 representation

Before persistent infrastructure, use a lightweight table/JSON object with fields:
- category;
- value;
- context;
- explicit/inferred;
- confidence;
- last_seen;
- status;
- correction notes;
- sensitivity;
- consent scope.

This is sufficient to test whether structured preference memory materially improves product experience.

## Quality metrics

- Preference Confidence distribution
- Preference Stability
- Surprise Rate
- Mara Guess Accuracy
- Correction Rate
- Correction Acceptance
- Preference decay/expiry rate
- Personalization Lift
- negative/creepy reaction rate

These are product-quality measures, not psychological scores.
