# Mara Vera — Preference Graph

Last reviewed: 2026-09-02

## Status

Authoritative structured-preference model inside **User Relationship Memory**.

This is not a second memory database, fetish profile or psychological scoring system.

It is a normalized view of selected, purpose-limited evidence that can be consumed by:

- Context Builder;
- Desire Discovery;
- Desire Routing;
- Fantasy Compiler;
- Momentum Commerce / Commercial Graph for relevance only;
- Fantasy Experience Engine;
- future Next Best Action logic.

Read together with [Desire Operating System Integration Contract](desire-operating-system.md).

## Core principle

> **PREFERENCE GRAPH = COMPONENTS, NOT IDENTITY TAGS.**

Represent what Mara currently has reason to believe works for this user, in which context, with what confidence and consent.

Do not reduce the user to:

- `findom guy`;
- `submissive`;
- `foot guy`;
- `taboo guy`;
- sexual orientation inferred from viewing;
- a hidden personality diagnosis.

## Why components matter

The same underlying affinity can be portable across product surfaces.

Example: an authority affinity may affect:

- scenario;
- sentence/directness style;
- voice delivery;
- challenge structure;
- clothing/World Asset relevance;
- external-media ranking;
- reward grammar;
- product ladder.

The graph should therefore learn reusable variables rather than storing a single static fetish label.

## Canonical preference dimensions

Initial dimensions may include:

### Desire / dynamic
- control affinity;
- authority affinity;
- intimacy/continuity affinity;
- object-focus affinity;
- world-builder/collector affinity;
- exploration/surprise affinity;
- other eligible adult-specific components where separately consented.

### Object
- clothing;
- footwear;
- lingerie;
- perfume/sensory object;
- World Asset affinity;
- other bounded approved object classes.

### Role / scenario
- work/authority;
- travel;
- date;
- home;
- night;
- other approved contexts.

### Modality
- text;
- voice;
- image;
- video;
- mixed;
- external-media companion;
- ritual/action.

### Voice
- conversational affinity;
- flirt affinity;
- seductive voice affinity;
- high-intensity voice affinity;
- dialogue importance.

### Intensity
- preferred adult intensity band by context;
- `less intense` correction;
- high-intensity fatigue signals.

### Control direction
- Mara leads;
- user leads;
- co-created.

### Pace
- fast payoff;
- gradual tension;
- story-led;
- delayed reveal/anticipation.

### Reward style
- praise;
- teasing;
- acknowledgement;
- reveal;
- surprise;
- progression;
- collectible.

### Novelty
- known-fit preference;
- adjacent exploration affinity;
- `Surprise Me` affinity.

### Repeatability
- repeat comfort;
- occasional preference;
- exploration/one-off curiosity.

### Narrative / continuity
- standalone;
- callback;
- episode;
- branching;
- continuity/history affinity.

### Visual style
- editorial direction;
- crop/detail affinity;
- visual pacing;
- object prominence.

Do not add dimensions merely because they are easy to log. Add them when they create measurable product value.

## Core record

Conceptual shape:

```yaml
preference_id: pref_123
user_id: user_123
category: pace
value: gradual
context:
  surface: private_experience
  desire_route: D03
  modality: voice
source:
  type: explicit_choice
  source_refs:
    - session_42
explicit: true
confidence: high
stability: contextual
sensitivity: personal
consent_scope: personalization
created_at: 2026-09-02T00:00:00Z
last_observed_at: 2026-09-02T00:00:00Z
last_confirmed_at: 2026-09-02T00:00:00Z
contradiction_count: 0
status: active
```

The storage schema remains implementation-dependent.

## Session State is not durable Preference Graph

Current desire is temporal.

A session may contain:

```yaml
session_state:
  current_intent: authority
  current_route: D03
  current_intensity: suggestive
  current_mode: voice_first
  current_open_loop: waiting_for_reply
  current_consent_scope:
    - adult_mode
    - authority_roleplay
    - voice_v2
```

This is ephemeral by default.

Do not automatically persist:
- current arousal;
- current desire route;
- current intensity;
- one-time novelty;
- one surprising reaction.

Only filtered candidate signals may be promoted into Preference Graph.

## Candidate → durable promotion

Possible promotion triggers:

1. explicit user preference/confirmation;
2. explicit correction/dislike;
3. repeated consistent behavior across relevant contexts;
4. replay/sequel request;
5. repeated completion + explicit fit signal;
6. later confirmation of a previously surprising response.

Weak evidence:
- one click;
- one watch intent;
- one Capricho contribution intent;
- one accidental choice;
- one high-intensity session.

A weak signal may remain ephemeral or low-confidence rather than becoming durable memory.

## Signal hierarchy

Strongest signals:

1. explicit correction;
2. explicit preference;
3. repeated recent behavior;
4. completed experiences;
5. replay;
6. sequel/continuation request.

Negative evidence is first-class:
- `wrong`;
- `not this`;
- `not today`;
- `too much`;
- `too soft`;
- `boring`;
- repeated skip.

## Explicit vs inferred

### Explicit

The user directly states, selects or confirms a preference.

Explicit does not mean permanent. Context and recency still matter.

### Inferred

Derived from repeated consent-compatible behavior.

Inferred records remain hypotheses.

Mara should use confidence-aware behavior and allow correction rather than declaring identity facts.

## Confidence

### Low
- one inferred signal;
- old evidence;
- meaningful contradiction;
- surprising one-off response.

### Medium
- several consistent signals;
- repeated recent behavior;
- one explicit but strongly contextual statement.

### High
- explicit recent confirmation;
- repeated behavior plus confirmation;
- durable/context-stable pattern with little contradiction.

Confidence must be reducible.

## Stability and repeatability

Candidate stability states:
- `experimental`;
- `emerging`;
- `stable`;
- `contextual`;
- `changing`;
- `rejected`;
- `expired`.

Separately, a preference may be:
- `repeat_comfort`;
- `occasional`;
- `exploration`.

Do not overlearn something the user enjoyed once as novelty.

## Contradiction and correction

Contradiction is expected.

When new behavior conflicts:

1. record the candidate signal;
2. inspect whether context changed;
3. reduce confidence where appropriate;
4. split by context if evidence supports it;
5. mark `changing` after repeated contradiction;
6. honor explicit correction immediately for future routing.

Correction types may include:
- `wrong`;
- `contextual`;
- `changed`;
- `temporary_override`;
- `not_today`;
- `reject`;
- `reset`.

Mara may notice contradiction playfully but should not psychoanalyze why it exists.

## Unexpected Attraction

A surprising response can become a candidate dimension.

Conceptual signal:

```yaml
category: object_focus
value: candidate_X
source:
  type: explicit_surprise_reaction
explicit: true
confidence: low
stability: experimental
sensitivity: adult_sensitive
```

One hit does not justify:
- orientation inference;
- permanent fetish identity;
- shame/closeted labels;
- psychological explanation.

> **OBSERVE THE RESPONSE. DO NOT INVENT THE IDENTITY.**

Adult content involving trans adults can be an eligible adult content dimension. Never infer orientation from one reaction and never frame trans identity itself as shameful/taboo.

## Sensitivity classes

Suggested classes:
- `normal` — format, humor, generic pacing/style;
- `personal` — relationship/interaction preferences;
- `adult_sensitive` — adult fantasy/intensity/object/roleplay preference;
- `prohibited_inference` — never create.

Adult-sensitive records require stricter:
- consent;
- visibility;
- retention;
- deletion/reset;
- analytics separation;
- access control/security design.

## Persistent adult-memory gate

Persistent adult preference memory requires:

- explicit compatible consent;
- purpose definition;
- privacy review;
- deletion/reset path;
- correction path;
- retention/decay policy;
- security/encryption design;
- analytics boundary.

Do not default to raw transcript storage when structured lower-sensitivity evidence is sufficient.

## Prohibited nodes

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
- inferred sexual orientation from indirect choices;
- hidden `maximum extractable willingness to pay`;
- other vulnerability scores intended for monetization.

## Source provenance

Every inferred record should retain enough provenance to explain why it exists:
- explicit statement/choice;
- discovery session;
- Fantasy branch;
- ritual result;
- external-media reaction;
- repeated modality choice;
- correction;
- replay/continuation;
- World Asset interaction.

Prefer opaque/source IDs to raw intimate content.

## Temporary User Desire Vector

The Preference Graph does not store a second permanent `user_desire_profile`.

For a routing/compiler decision, expose only the smallest relevant projection.

Example:

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

Every value inherits:
- confidence;
- recency;
- context;
- explicit/inferred source;
- sensitivity;
- consent;
- correction/rejection state.

## Desire Routing handoff

Routing uses the graph as one input, not the only input.

Explicit current-session intent can override historical ranking.

The graph may inform:
- lane relevance;
- modality;
- pace;
- control direction;
- voice ceiling;
- novelty;
- Capricho ordering;
- ritual/reward fit;
- continuation.

The router returns a temporary `surface_plan`; it does not mutate the whole graph.

## Fantasy Compiler handoff

The compiler can consume the temporary desire vector and compare it with eligible Experience Vectors.

Use the graph for:
- preference fit;
- explicit dislikes/boundaries;
- continuity fit;
- modality fit;
- pace/control fit;
- novelty/exploration preference;
- World Asset/object fit;
- reward/ritual fit.

The graph cannot bypass eligibility or consent.

## External Media handoff

External-media reactions may produce candidates such as:
- dynamic fit;
- pace;
- dialogue/voice importance;
- visual/object emphasis;
- intensity correction;
- `surprised_me`.

Do not persist raw title/URL when an opaque media candidate ID plus structured reaction is sufficient.

## Ritual handoff

Possible contextual dimensions:
- challenge affinity;
- anticipation affinity;
- Mara-leads affinity;
- ordinary-dare tolerance;
- reward preference;
- ritual frequency preference.

Do not create `obedience score` or `self-control score`.

## Saturation feedback

Saturation belongs primarily to experience history/compiler ranking.

Signals may include:
- repeated family;
- repeated dynamic;
- repeated voice band;
- repeated object;
- repeated reward;
- skips/corrections.

Do not persist a psychological boredom diagnosis.

Only durable preference changes should flow back into Preference Graph.

## Commercial separation

Preference Graph may influence relevance:
- eligible SKU ordering;
- modality;
- continuation;
- product ladder;
- Capricho ranking;
- collection/World Asset emphasis.

It must not be used to:
- raise equivalent-SKU price because of adult preference;
- infer financial/emotional weakness;
- increase pressure from arousal/loneliness;
- alter baseline warmth because payment was declined;
- hide cheaper equivalent products from a vulnerable user.

> **SERVE THE MOMENT; NEVER EXPLOIT THE STATE.**

## Context Builder handoff

Retrieve only the smallest useful slice.

Example:

```text
RELEVANT PREFERENCES
- authority dynamic: high confidence, adult private context
- voice: high confidence
- gradual pace: medium confidence
- Mara leads: medium confidence
- surprise: emerging
- explicit rejection: candidate X
```

Do not dump the entire adult graph into every prompt.

## User control

Future user-facing controls should allow:
- view/edit appropriate preference summaries;
- `wrong`;
- `not today`;
- reset category;
- reduce intensity;
- disable persistent adult memory;
- delete/reset adult-sensitive history where applicable.

## P0 representation

Before persistent infrastructure, use session/local fixtures with:
- category;
- value;
- context;
- explicit/inferred;
- confidence;
- last seen;
- stability/repeatability;
- correction;
- sensitivity;
- consent scope.

Synthetic data is enough to test product value.

## Quality metrics

Track where implemented:
- prediction hit;
- correction rate;
- correction acceptance;
- preference stability/decay;
- modality fit;
- pace fit;
- surprise acceptance;
- replay/continuation;
- Personalization Lift;
- negative/creepy reaction.

These are product-quality measures, not psychological scores.

## Permanent principles

> **PREFERENCE GRAPH = COMPONENTS, NOT IDENTITY TAGS.**

> **CURRENT SESSION STATE IS EPHEMERAL BY DEFAULT.**

> **ONE HIT IS A CANDIDATE, NOT A DURABLE TRUTH.**

> **NEGATIVE SIGNALS ARE FIRST-CLASS PRODUCT DATA.**

> **PERSISTENT ADULT MEMORY REQUIRES CONSENT + PRIVACY + CORRECTION + DELETION.**

> **PREFERENCE RELEVANCE MAY ROUTE PRODUCTS; IT MAY NOT ROUTE EXPLOITATION.**
