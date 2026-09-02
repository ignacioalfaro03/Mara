# Mara Vera — Context Builder v1.0

## Status

Future interaction architecture with a manual/testable launch equivalent. The Context Builder is the bridge between Life State, dual memory and the model that generates Mara's next response.

## Purpose

Before Mara replies, provide only the context that is useful for this interaction.

The goal is not maximum retrieval. It is **relevant continuity with minimum creepiness and minimum context cost**.

---

# 1. Context Pack

Conceptual structure:

```text
MARA IDENTITY
MARA CURRENT LIFE STATE
RELEVANT RECENT MARA EVENTS
RELEVANT MARA SELF MEMORIES

USER PROFILE — MINIMAL
RELEVANT USER MEMORIES
USER OPEN LOOPS
RELATIONSHIP STATE

CURRENT CONVERSATION
SURFACE / MODE / SAFETY CONTEXT
```

Do not load the entire lifetime history into each turn.

---

# 2. Retrieval dimensions

Rank candidate memories/events by a combination of:

- semantic relevance to the current message;
- temporal relevance;
- importance;
- confidence;
- unresolved open-loop priority;
- relationship relevance;
- current Life State relevance;
- risk of contradiction.

A recent low-value fact should not automatically beat an older highly relevant preference.

---

# 3. Retrieval order

Recommended sequence:

1. fixed character identity / behavior constraints;
2. current Life State;
3. due/open loops that directly relate to the user/message;
4. high-confidence relevant user memories;
5. high-confidence relevant Mara self memories;
6. recent conversation context;
7. lower-priority episodic memory only if it adds natural continuity.

---

# 4. Context budget

Use a compact budget rather than dumping raw records.

Example conceptual allocation:

- identity/personality: stable compact summary;
- current Mara state: 3–8 facts;
- recent self-events: 0–5;
- user memories: 0–5;
- open loops: 0–3;
- relationship state: compact;
- current conversation: enough turns to preserve local coherence.

Exact counts are experimental and model-dependent.

---

# 5. Callback policy

A retrieved memory does not have to be spoken.

Use callbacks when they are:

- relevant;
- naturally timed;
- likely to feel attentive rather than invasive;
- useful for continuing a prior open loop.

Avoid callback stacking.

Bad:

> “¿Cómo estuvo tu entrevista? ¿Y el gimnasio? ¿Y tu jefe? ¿Y la película que dijiste que verías?”

Better:

> “Oye, ¿y al final cómo te fue en la entrevista?”

One strong callback can outperform five demonstrations of memory.

---

# 6. Creepiness filter

Before surfacing user memory, ask:

1. Would a normal attentive person plausibly remember this?
2. Is it appropriate to mention now?
3. Did the user explicitly share it in a relational context?
4. Is the information sensitive?
5. Has enough time/context passed that the callback feels natural?

If uncertain, use the memory silently for understanding or do not surface it.

---

# 7. Confidence-aware language

High confidence:

> “¿Cómo te fue en la entrevista?”

Medium confidence:

> “Creo que me habías dicho que tenías una entrevista, ¿o estoy mezclando?”

Low confidence:

Do not state the memory as fact. Prefer not to surface unless clarification is useful.

---

# 8. Relationship stage vs commercial state

The Context Builder may consume both, but they must remain separate.

### Relationship stage

Possible future states:

`new → familiar → recurrent → close → fan`

Driven by interaction history, continuity and explicit preference — not simply spend.

### Commercial state

Possible states:

`visitor → subscriber → first_spender → repeat_spender → high_value`

Driven by commerce.

A high spender must not automatically receive false emotional intimacy. A non-paying recurrent user can still have meaningful conversational continuity.

---

# 9. Progressive self-disclosure

Relationship stage may influence how much of Mara's Life Bible is naturally exposed.

### New

Mostly current context + light preferences.

### Familiar

Recurring work/social references become recognizable.

### Recurrent

More callbacks, open loops and personal opinions.

### Close

Selective deeper history and vulnerability can surface where appropriate.

### Fan

High continuity and recognition, but still bounded by consent, privacy and anti-dependency rules.

This is a narrative pacing tool, not a reward schedule for spending.

---

# 10. Bidirectional context

The Context Builder must support both directions:

- Mara remembers the user;
- Mara remembers herself.

This enables interactions such as:

> User: “¿Cómo terminó lo de Vale?”
>
> Mara: answers from Self Memory, then naturally connects a relevant user open loop if one exists.

The experience should feel mutual rather than user-profile-centric.

---

# 11. Memory write handoff

After the response/session, pass only candidate updates to the Memory System.

Possible candidates:

- new explicit stable preference;
- resolved user open loop;
- new future plan;
- correction to old memory;
- new Mara self-event created during conversation;
- relationship/social-graph consequence.

Do not let the response model directly dump arbitrary prose into durable memory without filtering.

---

# 12. Surface-aware behavior

The same memory may be appropriate in one surface and not another.

### Private conversation

Can use relevant relationship memory with user consent.

### Public social content

Must not leak private user memory.

### Premium interaction

Commercial context may affect offer eligibility/relevance but must not rewrite emotional relationship state.

### Voice

Use the same Context Pack so spoken Mara and text Mara share continuity.

---

# 13. Launch implementation

Before a real persistent system exists, the Context Builder can be tested manually with a structured prompt block containing:

- current Life State;
- 3–5 relevant Mara memories;
- 3–5 relevant user memories;
- open loops;
- current relationship stage;
- current conversation.

This is sufficient to validate whether the experience feels materially better before building retrieval infrastructure.

## Success criterion

The Context Builder works when users experience callbacks and continuity without noticing the machinery or feeling monitored.