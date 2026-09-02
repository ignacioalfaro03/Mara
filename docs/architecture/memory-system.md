# Mara Vera — Dual Memory System v1.0

## Status

Architecture and product rules only. Do not build a complex persistent memory service before returning-user behavior justifies it.

## Purpose

Mara needs two distinct memory domains:

1. **Mara Self Memory** — what Mara remembers about her own life.
2. **User Relationship Memory** — what Mara remembers about a specific user's interactions, preferences and open loops.

The system succeeds when memory creates natural continuity without feeling like surveillance or CRM playback.

---

# 1. Memory domains

## A. Mara Self Memory

Stores durable or useful facts about the fictional character and her evolving life.

Examples:

- current home/city;
- work role;
- recurring friends;
- preferences/tastes;
- current goals;
- past events;
- current open loops;
- recent places / activities;
- opinions already expressed;
- major prior states that became history.

## B. User Relationship Memory

Stores only useful, permitted and proportionate details that improve future interaction.

Examples:

- preferred name/nickname;
- explicit interests;
- hobbies;
- work context the user chose to share;
- music/film preferences;
- prior recommendations;
- shared jokes;
- user open loops;
- preferred interaction style;
- explicit boundaries / consent preferences where needed for product safety.

Do not use this store for payment data, identity documents or unbounded raw transcripts.

---

# 2. Memory tiers

## Tier 1 — Core Memory

Very persistent.

Mara examples:

- identity;
- current job;
- recurring relationships;
- foundational tastes;
- major history.

User examples:

- preferred name;
- stable preferences that repeatedly matter;
- explicit long-term interaction boundaries.

## Tier 2 — Relationship Memory

Persistent while useful.

Examples:

- recurring topics;
- shared jokes;
- meaningful user goals;
- prior recommendations;
- established conversational preferences.

## Tier 3 — Episodic Memory

Specific moments with potential decay.

Examples:

- Mara had dinner with Vale;
- user had an interview on Friday;
- Mara complained about a bad coffee;
- user planned to run a race.

## Tier 4 — Working Memory

Current-session context. Normally not persisted independently.

---

# 3. Memory candidate schema

```text
memory_id
owner: mara | user:<id>
kind: core | relationship | episodic | working
subject
summary
source_event_id
created_at
last_confirmed_at
valid_from
valid_until
status: current | historical | superseded | expired
importance
confidence
sensitivity_class
open_loop_id
retrieval_tags
```

This is a conceptual schema. A launch implementation may be JSON/SQLite/simple tables.

---

# 4. Importance score

Do not persist every sentence.

Score a candidate using a lightweight rubric:

- future relevance;
- likely recurrence;
- emotional/narrative significance;
- usefulness for a callback;
- relation to a future plan/open loop;
- relationship value;
- need for safety/consent continuity.

Recommended conceptual scale: 0–100.

### 80–100

Likely Core or durable Relationship Memory.

### 50–79

Useful episodic/relationship memory.

### 20–49

Keep only if an open loop or current narrative requires it.

### 0–19

Normally ignore.

Numbers are heuristics, not a psychological score of the user.

---

# 5. Confidence

Every persistent claim should have confidence.

Examples:

- explicit user statement in current session: high;
- inferred preference from one interaction: low;
- repeated explicit preference: very high;
- old memory contradicted by a newer explicit statement: superseded.

Low-confidence memory should surface softly:

> “Creo que habías dicho que…”

not as absolute fact.

---

# 6. Contradiction handling

New explicit current information supersedes stale current state.

Example:

```text
old_job = current
user says “ya no trabajo ahí”
old_job -> historical
new_job -> current
```

Do not delete history when historical context may still be useful.

The same logic applies to Mara's own life.

---

# 7. Open loops

Future-oriented statements can create an `open_loop`.

Examples:

- “mañana tengo una entrevista”;
- “el viernes le voy a hablar a mi jefe”;
- Mara has a presentation tomorrow;
- Vale is waiting for an answer about something.

Open-loop fields:

```text
open_loop_id
owner
created_at
due_at_or_window
summary
related_people
status: open | due | resolved | dropped
resolution
resolution_date
priority
```

A resolved loop may become episodic memory if it remains useful.

---

# 8. Memory write pipeline

```text
CONVERSATION / LIFE EVENT
        ↓
MEMORY CANDIDATES
        ↓
IMPORTANCE FILTER
        ↓
SENSITIVE-DATA FILTER
        ↓
DEDUPLICATION
        ↓
CONTRADICTION CHECK
        ↓
CONFIDENCE ASSIGNMENT
        ↓
WRITE / UPDATE / IGNORE
```

Never use:

```text
EVERY MESSAGE → PERMANENT DATABASE
```

---

# 9. Sensitive-data rules

Default to not retaining sensitive personal data that is unnecessary for the relationship experience.

Avoid persistent storage of:

- medical/health details;
- precise location/address;
- government identifiers;
- financial account/debt details;
- political affiliation;
- religious beliefs;
- sexual orientation or sexual-history details;
- passwords/secrets;
- criminal-history details.

If a sensitive detail appears transiently in a conversation, the system can respond in context without converting it into durable relationship memory by default.

Safety/consent boundaries can be stored in the minimum necessary abstract form, e.g. `allowed_tone=playful`, rather than retaining intimate narrative detail.

---

# 10. Data separation

Keep logically separate:

- Mara fictional self-memory;
- user relationship memory;
- raw conversation/transcripts;
- account/identity data;
- payment data;
- analytics events;
- consent records.

A generic memory retrieval should never need payment credentials or identity documents.

---

# 11. User controls — future

When persistent user memory launches, support an appropriate product surface for:

- inspect useful remembered preferences;
- correct them;
- delete them;
- turn persistent personalization off;
- delete account/memory as required.

The exact UX is deferred until the Relationship Engine is implemented.

---

# 12. Decay

Human-like continuity does not require infinite retention.

Suggested rules:

- Core Memory: no automatic decay unless superseded;
- Relationship Memory: revalidate over time;
- Episodic Memory: decay unless referenced, emotionally important or tied to an open loop;
- Working Memory: session-limited.

Decay must not erase unresolved commitments or safety boundaries accidentally.

---

# 13. Natural surfacing

Memory is valuable when it disappears into conversation.

Prefer:

> “¿Y al final cómo te fue en la entrevista?”

over:

> “Recuerdo que el 2 de septiembre declaraste tener una entrevista.”

Do not prove memory constantly. Frequent irrelevant callbacks can feel invasive.

---

# 14. Launch implementation

Before traction, the system may be represented with:

- Markdown canon;
- small JSON state files;
- a simple spreadsheet/SQLite table for tests;
- manually curated open loops.

Do not introduce vector databases, always-on agents or complex memory orchestration merely because the final architecture may eventually use them.

First prove that callbacks and continuity materially improve user return behavior.