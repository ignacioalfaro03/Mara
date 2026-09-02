# Mara Vera — Preference Graph

## Status

Authoritative structured-preference model inside **User Relationship Memory**.

This is not a second memory database. It is a normalized view of selected user preference signals that can be consumed by the Context Builder, Desire Discovery Engine, [Fantasy Compiler](fantasy-compiler.md), [Momentum Commerce](momentum-commerce.md), Fantasy Experience Engine and future Next Best Experience logic.

## Purpose

Represent what Mara currently has reason to believe a user prefers, with enough context to avoid treating one choice as permanent truth.

The graph supports:
- explicit and inferred preferences;
- confidence;
- context/modality;
- recency;
- contradiction;
- stability/decay;
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
- A/B choices;
- ranking;
- story branches;
- repeated format consumption;
- accepted recommendations.

Inferred records remain hypotheses. Mara should use confidence-aware language rather than treating them as identity facts.

## Context model

Preferences can vary by:
- surface;
- modality;
- narrative vs conversation;
- public vs private;
- adult-mode context;
- intensity band;
- time/moment;
- experience family.

Example: a user may prefer teasing in text, directness in voice, elegant visual aesthetics and surprise in story branches. Do not collapse these into one global boolean.

## Confidence model

### Low
- one inferred signal;
- old/weak evidence;
- meaningful contradiction.

### Medium
- several consistent signals;
- repeated recent behavior;
- one explicit but contextual statement.

### High
- explicit recent confirmation;
- repeated behavior plus confirmation;
- durable preference with no meaningful contradiction.

Confidence must be reducible.

## Stability and decay

Candidate states:
- `experimental`;
- `emerging`;
- `stable`;
- `contextual`;
- `changing`;
- `rejected`;
- `expired`.

Decay can depend on time since observation, confidence, explicit/inferred source, contradiction count, context stability and sensitivity.

P0 should use simple rules. Adult-sensitive inferred preferences receive conservative retention and re-confirmation treatment.

## Contradictions and corrections

Contradiction is expected and useful.

When new behavior conflicts with an existing preference:
1. record the new signal;
2. reduce confidence if appropriate;
3. inspect context differences;
4. avoid immediately deleting the older record;
5. if repeated, mark `changing` or split by context;
6. if explicitly corrected, update/reject the old preference.

Correction types:
- `wrong`;
- `contextual`;
- `changed`;
- `temporary_override`;
- `reject`;
- `reset`.

Mara may surface contradiction playfully — “Eso sí que no te lo tenía” — but should not pressure the user to explain.

## Sensitivity classes

Suggested classes:
- `normal` — style, format, humor, pacing;
- `personal` — relationship/interaction preferences;
- `adult_sensitive` — adult fantasy/intensity preferences;
- `prohibited_inference` — never create.

`adult_sensitive` records require stricter consent, visibility, retention and analytics separation.

## Prohibited preference nodes

Never create nodes for:
- loneliness;
- depression;
- trauma diagnosis;
- bereavement vulnerability;
- debt/financial distress;
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
- experience completion/purchase where appropriate.

Do not store raw intimate content if a structured lower-sensitivity signal is sufficient.

## User Desire Vector projection

The Preference Graph does not permanently store a second `user_desire_profile` object.

When the Fantasy Compiler needs recommendations, create a **temporary decision projection** containing only relevant dimensions.

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

Every projected value inherits:
- confidence;
- recency;
- context;
- explicit/inferred source;
- sensitivity;
- consent;
- correction/rejection state.

The compiler must not treat projection fields as permanent identity labels.

## Fantasy Compiler handoff

The Fantasy Compiler may use the graph to compare a temporary User Desire Vector with eligible Experience Vectors.

The graph can inform:
- character energy fit;
- interaction-style fit;
- format affinity;
- context affinity;
- narrative preference;
- personalization depth;
- novelty/exploration preference;
- explicit dislikes/boundaries.

The graph does **not** provide:
- vulnerability scores;
- maximum willingness-to-pay estimates;
- relationship closeness derived from spend;
- permission to bypass adult-mode or safety requirements.

## Novelty preference

A low-sensitivity interaction preference may represent how much novelty the user appears to enjoy:
- `low`;
- `medium`;
- `high`.

It should come from harmless interaction behavior and remain confidence/context-aware.

Do not label it as impulsivity, personality type or psychological need.

Use it only to choose between known-fit, adjacent and `Surprise Me` candidates.

## Reward / agency interaction preferences

Only after repeated, consent-compatible evidence, the graph may represent contextual preferences such as:
- `praise_affinity`;
- `teasing_reward_affinity`;
- `challenge_affinity`;
- `control_affinity`;
- `surprise_affinity`;
- `collector_affinity`.

These describe **how an experience works best**, not who the user “is”.

Example:

```yaml
category: reward_style
value: praise
context:
  surface: private_experience
  dynamic: mara_leads
confidence: medium
stability: contextual
sensitivity: personal
```

Rules:
- one “Good boy” reaction or one purchase does not justify a durable node;
- reward affinity must be correctable and decayable;
- stronger adult-coded praise/dominance remains subject to adult-mode/consent rules;
- reward preference does not authorize payment-conditioned affection;
- collector affinity may rank collections/owned-history surfaces but not create fake scarcity or pressure.

## Saturation feedback

The graph may receive structured update candidates when repeated experiences stop performing, such as:
- explicit “otra cosa”;
- repeated skips;
- repeated correction/rejection.

Do not persist a psychological `boredom_score`. Saturation belongs primarily to the Fantasy Compiler/experience-history layer; only durable preference changes should flow back into the graph.

## Commercial separation

Preference Graph may influence relevance:
- which SKU/experience is highlighted;
- modality shown first;
- story continuation priority;
- known-fit vs explore recommendation;
- eligible reward presentation/cadence;
- collection or agency surface ordering.

It must not be used to:
- set vulnerability-based personalized prices;
- infer financial/emotional weakness;
- increase emotional pressure;
- alter baseline respect/affection;
- hide cheaper equivalent products from vulnerable users;
- change relational tone because a purchase was declined.

Pricing remains governed by transparent SKU/cohort rules.

## Context Builder handoff

Retrieve only the smallest useful preference subset.

Example:

```text
RELEVANT PREFERENCES
- voice: high confidence, explicitly confirmed
- teasing: medium confidence, private text only
- praise: medium confidence, Mara-led experiences only
- surprise: emerging
- do not use: X (explicit rejection)
```

Do not dump the whole graph into every prompt.

## Fantasy Experience handoff

The Fantasy Experience Engine can consume the selected/compiled configuration to determine:
- eligible story family;
- branch ordering;
- voice vs visual emphasis;
- intensity defaults within consent;
- personalization level;
- explore/serendipity candidate;
- reward-style eligibility where the experience includes one.

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
- private by default.

## P0 representation

Before persistent infrastructure, use a lightweight table/JSON object with:
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

This is sufficient to test whether structured preference memory materially improves product experience and compiled recommendations.

## Quality metrics

- Preference Confidence distribution
- Preference Stability
- Surprise Rate
- Mara Guess Accuracy
- Correction Rate
- Correction Acceptance
- Preference decay/expiry rate
- Personalization Lift
- reward-style acceptance/correction where tested
- negative/creepy reaction rate

These are product-quality measures, not psychological scores.
