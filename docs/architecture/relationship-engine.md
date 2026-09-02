# Mara Vera — Relationship Engine (Post-Validation Architecture)

## Status

Future architecture only. Do not fully implement before commercial validation and returning-user evidence.

## Purpose

Create a persistent, consent-based relationship so a returning user interacts with the same coherent Mara Vera across time, while storing only useful, permitted and proportionate information.

The Relationship Engine consumes the Life Engine and Dual Memory System; it does not replace them.

Core experience:

**Mara has her own life + Mara remembers relevant things about the user + both histories evolve together.**

---

# 1. Separate relationship state from commercial state

This separation is permanent.

## Relationship stage

Candidate states:

- `new`
- `familiar`
- `recurrent`
- `close`
- `fan`
- `dormant`
- `reactivated`

Relationship stage may influence:

- depth of callbacks;
- self-disclosure;
- conversational shorthand;
- amount of context assumed;
- tone within user-selected preferences.

It must **not** be determined primarily by money spent.

## Commercial state

Candidate states:

- `visitor`
- `subscriber`
- `first_spender`
- `repeat_spender`
- `high_value`
- `lapsed_payer`

Commercial state may influence:

- access/entitlements;
- offer relevance;
- pricing/catalog eligibility;
- revenue analytics.

A `high_value` spender must not automatically be assigned emotional closeness. A recurrent non-paying user may still have meaningful conversational continuity.

This prevents monetization logic from silently becoming intimacy logic.

---

# 2. Relationship record

Conceptual state per user:

```text
user_id
relationship_stage
first_interaction_at
last_interaction_at
interaction_count
preferred_name
preferred_tone
known_interests
shared_jokes
important_memory_refs
open_loop_refs
recent_topics
explicit_boundaries
consent_preferences
commercial_state_ref
```

Do not store large raw biographies when references to filtered memory records are enough.

---

# 3. Dual Memory integration

Use the dedicated `memory-system.md` architecture.

## User Relationship Memory

Potential durable fields:

- preferred tone;
- explicit interests;
- preferred content themes;
- useful prior recommendations;
- shared jokes;
- user-created open loops;
- expressed boundaries;
- consented interaction preferences.

## Mara Self Memory

Allows the relationship to feel reciprocal.

A user can ask about:

- Mara's work;
- Vale / recurring friends;
- something Mara planned earlier;
- a recent event;
- an opinion she expressed previously.

The system retrieves the relevant self-memory rather than inventing a fresh answer.

---

# 4. Open loops and callbacks

Future plans and unresolved topics can create open loops.

User example:

> “El viernes tengo una entrevista.”

Later:

> “Oye, ¿cómo te fue en la entrevista?”

Mara example:

> “Mañana tengo una presentación que no me entusiasma nada.”

Later the user may ask how it went, and Mara must resolve from the Life Engine / Narrative Ledger.

Callbacks should be selective. The system must not demonstrate memory constantly.

---

# 5. Progressive self-disclosure

Relationship stage can govern how much of Mara's Life Bible is naturally exposed.

### New

Current context, lightweight preferences, limited history.

### Familiar

Recurring people/work/routine references become recognizable.

### Recurrent

More callbacks, shared jokes and ongoing life threads.

### Close

Selective deeper history, opinions and vulnerability where appropriate.

### Fan

High continuity and recognition while preserving explicit safety, privacy and anti-dependency boundaries.

Self-disclosure is earned through interaction continuity, not purchased as simulated affection unless a clearly defined paid content product explicitly provides a particular experience without misrepresenting emotional dependency.

---

# 6. Data separation

Keep separate stores/controls for:

- relationship state;
- filtered user memories;
- Mara fictional self-memory;
- raw transcripts;
- account/identity data;
- payment/provider data;
- analytics;
- consent records;
- sensitive data.

Default toward not storing sensitive data.

Generic relationship retrieval must not require access to payment credentials or identity documents.

---

# 7. Core future interfaces

Future services should be replaceable behind abstractions:

- `IdentityProvider`
- `PaymentProvider`
- `MemoryStore`
- `LifeStateService`
- `ContextBuilder`
- `AnalyticsSink`
- `ContentCatalog`
- `RelationshipStateService`
- `ConsentService`

The model/provider that generates the next response must remain replaceable.

---

# 8. Guardrails

- explicit consent for persistent personalization;
- inspect/edit/delete preferences where applicable;
- no hidden vulnerability scoring;
- no debt/financial-distress targeting;
- no emotional-intimacy score driven by spend;
- no unbounded transcript retention by default;
- no persistent storage of unnecessary sensitive personal details;
- auditability of consent-dependent behavior;
- relationship memory cannot leak into public content;
- payment state cannot override boundaries;
- do not manufacture abandonment, jealousy, illness or crises to increase spending.

---

# 9. Metrics — post-launch

Potential relationship metrics:

- conversations per user;
- D1 / D7 / D30 return;
- average days between sessions;
- successful callback rate;
- open-loop resolution rate;
- memory correction rate;
- memory usefulness feedback;
- memory creepiness / negative reaction rate;
- continuity error rate.

Commercial metrics remain separate:

- payer conversion;
- first payment;
- second payment;
- repeat spend;
- ARPPU;
- retention by commercial state.

Analyze correlations, but do not collapse them into one manipulative intimacy score.

---

# 10. Launch-phase implementation

Before a real Relationship Engine is justified, validate the experience manually using:

- Life Bible;
- Social Graph;
- Life State / Narrative Ledger;
- small test user memory records;
- manually constructed Context Packs;
- explicit open-loop examples.

This can prove whether continuity materially improves the experience without paying for persistent agents or realtime infrastructure.

## Build trigger

Invest materially only after the launch funnel demonstrates:

1. real returning users;
2. enough interaction volume for memory/continuity to matter;
3. evidence that callbacks/personalization improve return or monetization;
4. a manual-maintenance bottleneck;
5. an approved Traction → Investment Gate.

The Relationship Engine is intended to strengthen retention and defensibility after validation, not manufacture product-market fit before it exists.