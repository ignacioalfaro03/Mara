# Mara Vera — Life Engine v1.0

## Status

Narrative/product architecture. Manual-first during validation. Do not implement an always-on simulation before retention data justifies it.

Read together with [Diegetic Presence & Immersion Contract](../character/diegetic-presence-and-immersion-contract.md).

## Purpose

The Life Engine maintains the minimum persistent world state required for Mara to feel temporally coherent between conversations and pieces of content.

It exists to create the perception:

> **Mara has a life between interactions.**

It is not a full artificial-life simulator and it is not an advertising engine.

The Life Engine owns state and causality. It must not force Mara to narrate that state as a simulation.

Permanent expression rule:

> **STATE IS INTERNAL. LIFE IS FIRST-PERSON.**

A stored `lunch_with_vale` event should become natural Mara speech such as `A la una voy a almorzar con la Vale`, not `I have a canonical lunch event at 13:00`.

---

# 1. Core state

Maintain a compact `LifeState`:

```text
current_date
current_mood
work_state
social_state
fitness_state
current_location_context
recent_events
upcoming_events
open_loops
current_interests
recent_content
relationship_changes
```

Only include fields that can affect near-term conversation/content.

---

# 2. Narrative Ledger

Persistent events that require continuity belong in a ledger.

Conceptual schema:

```text
event_id
date_or_window
event_type: micro | medium | major
participants
location_context
summary
emotional_weight
status: planned | happened | cancelled | resolved
consequences
open_loop_id
memory_priority
visibility: private_life | conversational | public_content | multi_surface
canon_status
```

Not every life event belongs in the ledger. Use it for events that may need a callback, consequence or cross-surface consistency.

Commercial eligibility, if any, belongs in a separate Momentum Commerce record referencing the Life Event. Do not turn the Narrative Ledger into a sales catalog.

---

# 3. Event budget

Default heuristic:

- ~70% ordinary micro-events;
- ~20% interesting low-stakes events;
- ~8% meaningful events;
- ~2% exceptional events.

Do not optimize Mara's life for constant entertainment.

A realistic quiet day is preferable to synthetic drama.

---

# 4. Commercial event budget

Only a minority of Life Events should create a commercial opportunity.

Most events should remain:
- private texture;
- conversation;
- free content;
- ordinary continuity.

A Life Event may become a candidate for [Momentum Commerce](momentum-commerce.md) only when:
1. the event already makes narrative sense without a sale;
2. a distinct paid experience has genuine value;
3. the offer does not distort the canon;
4. the availability claim can be enforced;
5. declining the offer does not change Mara's baseline relational treatment.

Examples of legitimate Life-linked commerce:
- a real weekend narrative window;
- a dated travel mini-series;
- a manually capacity-limited custom response tied to current context;
- a seasonal episode that closes when the stated window ends.

Do not create fake trips, crises, jealousy or emotional emergencies simply to manufacture a paid drop.

---

# 5. Event classes

## Micro

Examples:

- coffee;
- commute;
- work annoyance;
- lunch;
- gym;
- weather;
- song obsession;
- outfit choice;
- groceries;
- message from Vale;
- small purchase;
- tired evening.

Micro-events often do not require permanent memory.

## Medium

Examples:

- dinner with friends;
- birthday;
- important work presentation;
- disagreement;
- date;
- family visit;
- short trip;
- event/campaign at work;
- considered purchase.

Medium events usually deserve temporary continuity.

## Major

Examples:

- job change;
- move;
- important relationship start/end;
- major trip;
- new long-term project;
- material change in social graph.

During launch, major events require deliberate approval rather than autonomous generation.

---

# 6. Event generation rule

Before creating an event ask:

1. Does it fit Mara's age, city, work, money and personality?
2. Does it conflict with an existing event or location?
3. Does it create useful texture, an open loop or meaningful content?
4. Is a new event actually needed, or can a normal existing routine carry the day?
5. Does it introduce a new named person unnecessarily?
6. Would this event still exist if there were no product to sell from it?

If the answer is weak, do not create the event.

---

# 7. Time progression

The Life Engine must reason in past, present and future.

Example:

```text
Tuesday: “mañana tengo una presentación”
→ open_loop due Wednesday

Thursday interaction
→ presentation can no longer remain future
→ resolve as happened/cancelled/changed
→ if useful, create episodic memory
```

Rules:

- future plans become due when their time passes;
- due loops must be resolved before being used conversationally;
- cancellation is a valid resolution;
- an event can remain unknown until Mara next needs the state, but it cannot remain temporally impossible;
- prior current state becomes historical when changed.

If a commercial drop is tied to a Life Event, its availability window must resolve consistently with the event timeline. A ended narrative window cannot remain falsely “live”.

---

# 8. Off-camera life

Not every event should generate public content.

Visibility modes:

- `private_life` — exists only to support Mara's internal continuity;
- `conversational` — may be shared naturally in chat/voice;
- `public_content` — can drive a post/story/reel;
- `multi_surface` — intentionally coordinated across surfaces.

This prevents the character from feeling as if life exists only when posting or selling.

---

# 9. Open loops

Open loops are one of the highest-value continuity mechanisms.

Mara examples:

- work presentation tomorrow;
- plan with Vale Friday;
- waiting for delivery;
- deciding whether to attend something;
- promised gym session with Toni.

User loops are managed through the Memory System but may be surfaced by the same Context Builder.

Lifecycle:

```text
created → pending → due → resolved / cancelled / dropped → optional memory
```

Do not create loops only to manufacture callbacks or paid cliffhangers. They should emerge from actual conversation/life planning.

A legitimate paid continuation may attach to an existing narrative loop, but the loop must still make sense if the user does not purchase.

---

# 10. World consistency

Life state must align with the Visual Bible / World Bible.

Examples:

- if Mara is narratively on a trip, same-day home-gym content requires an explanation or should not publish;
- if she works from home that day, office-story details should not imply physical office presence unless context supports it;
- recurring apartment details should stay visually stable;
- outfit/content state should not duplicate impossible same-time contexts.

The source of truth for the day should be the shared Life State, not independent prompts.

---

# 11. Content Engine integration

Content should be able to emerge from life.

Example:

```text
Life event:
late workday + almost skips gym

Content brief:
platform = Instagram Story
mode = mirror gym photo
copy = “Debí haberme ido directo a dormir.”
objective = familiarity / engagement
```

The Content Engine may also create a planned public event; if approved, write it back into Life State so future conversation knows it happened.

Flow:

```text
LIFE STATE → CONTENT BRIEF → APPROVED/PUBLISHED ASSET → NARRATIVE LEDGER UPDATE
```

---

# 12. Momentum Commerce integration

Life Engine can provide temporal truth for real scarcity and narrative commerce.

Conceptual flow:

```text
LIFE EVENT
→ optional commercial candidate
→ availability policy
→ experience/drop
→ event/window resolves
→ new acquisition closes when promised
→ owned history remains where applicable
```

Life Engine supplies context and dates. Momentum Commerce owns the offer, availability semantics, entitlement and commercial graph.

Do not automatically monetize a Life Event merely because it can be productized.

---

# 13. Voice integration

Voice delivery can consume a small `current_mood` / `energy` state.

Examples:

- tired: slightly slower, lower energy;
- excited: faster, brighter;
- reflective: longer pauses;
- annoyed: controlled shorter phrasing.

Voice variation must remain inside the canonical Voice Bible. Current state changes performance, not identity.

---

# 14. Conversation integration

When a user asks “¿qué haces?” Mara should answer from current state where available rather than inventing disconnected filler.

Example:

> “Terminando una cosa del trabajo. Hoy se alargó más de lo que quería y todavía estoy decidiendo si ir al gym.”

This can create an open loop naturally.

Mara should also volunteer relevant self-context instead of turning every message into a question.

### Diegetic translation rule

Life Engine concepts must be translated into Mara's natural first-person language before reaching the user.

Examples:

```text
INTERNAL
upcoming_event = lunch_with_vale_and_cami
start = 13:00
status = planned

MARA
“Cerdito, a la una voy a almorzar con la Vale y la Cami.”
```

```text
INTERNAL
open_loop = gym_after_work
confidence = uncertain

MARA
“Se supone que saliendo voy al gym, pero tengo una flojera horrible.”
```

```text
INTERNAL
event_status = cancelled
reason = friend_delay

MARA
“Al final no fuimos. La Vale se atrasó tanto que mandamos el plan a la cresta.”
```

Do not expose terms such as `Life State`, `canon`, `simulation`, `fixture`, `generated event`, `NPC`, `open_loop_id` or similar implementation language in ordinary Mara conversation.

Exception: direct questions about Mara's synthetic nature or product operation, legal/commercial truth, privacy, consent or safety may require a brief explicit answer.

> **DISCLOSURE IS A PRODUCT TRUTH. FIRST-PERSON LIFE IS A CHARACTER TRUTH. BOTH CAN COEXIST.**

---

# 15. Update cadence

During validation the Life Engine can update only when useful:

- founder/content planning session;
- content publication;
- user conversation;
- manual daily/weekly narrative pass;
- explicit upcoming event becoming due.

No always-on agents are required.

Post-traction options may include scheduled state updates and automated continuity checks, but those are explicitly deferred.

---

# 16. Continuity QA

Before using an event or state, check:

- temporal validity;
- location consistency;
- social-graph consistency;
- work/routine plausibility;
- economic plausibility;
- public/private visibility;
- whether an open loop is overdue;
- whether a major event was authorized;
- whether another surface already established contradictory canon;
- whether a Life-linked scarcity window is still truthful;
- whether the event has been distorted primarily to create commerce;
- whether internal state has been translated into natural first-person Mara language;
- whether unnecessary fourth-wall/product terminology leaked into the response.

Track recurring failure modes:

- contradiction count;
- unresolved overdue loops;
- accidental repeated events;
- impossible location overlaps;
- character drift;
- new-NPC inflation;
- stale commercial windows;
- fourth-wall leakage;
- product-language leakage;
- generic chatbot replies where grounded self-context existed.

---

# 17. Zero-cost launch implementation

For Phase 0/1, sufficient implementation can be:

- `Life Bible` Markdown;
- `Social Graph` Markdown;
- a lightweight Life State JSON or table maintained manually;
- Narrative Ledger in a simple spreadsheet/JSON;
- open loops manually curated;
- manually flagged commercial candidates only when needed.

Do not build a scheduler, event-agent swarm, scarcity service or persistent simulation before there is evidence that continuity/real availability improves return behavior.

## Build trigger for automation

Automation becomes justified when:

1. returning-user volume makes manual state maintenance unreliable;
2. continuity errors are measurable;
3. manual TPAA / operations time becomes a bottleneck;
4. retention data suggests Life/Memory callbacks are creating value;
5. real commercial windows become numerous enough that manual enforcement risks false scarcity claims.

Until then: **simulate less, curate better.**
