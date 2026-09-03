# Mara Vera — Context Builder v1.1

## Status

Future interaction architecture with a manual/testable launch equivalent. The Context Builder is the bridge between Life State, dual memory, the Preference Graph and the model that generates Mara's next response.

## Purpose

Before Mara replies, provide only the context that is useful for this interaction.

The goal is not maximum retrieval. It is **relevant continuity + preference fit with minimum creepiness and minimum context cost**.

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
RELEVANT PREFERENCE GRAPH SLICE
USER OPEN LOOPS
RELATIONSHIP STATE
COMMERCIAL ENTITLEMENT/ELIGIBILITY — ONLY IF NEEDED

CURRENT CONVERSATION
SURFACE / MODE / SAFETY / CONSENT CONTEXT
```

Do not load the entire lifetime history or full Preference Graph into each turn.

---

# 2. Retrieval dimensions

Rank candidate memories/events/preferences by a combination of:

- semantic relevance to the current message;
- temporal relevance;
- importance;
- confidence;
- explicit vs inferred source;
- context match;
- unresolved open-loop priority;
- relationship relevance;
- current Life State relevance;
- sensitivity;
- risk of contradiction;
- preference rejection/expiry state.

A recent low-value fact should not automatically beat an older highly relevant explicit preference.

---

# 3. Retrieval order

Recommended sequence:

1. fixed character identity / behavior constraints;
2. current Life State;
3. consent/safety/surface rules;
4. due/open loops directly related to the user/message;
5. high-confidence relevant user memories;
6. high-confidence/context-matched Preference Graph entries;
7. high-confidence relevant Mara self memories;
8. recent conversation context;
9. lower-priority episodic memory only if it adds natural continuity;
10. one exploration/serendipity candidate only when appropriate.

---

# 4. Context budget

Use a compact budget rather than dumping raw records.

Example conceptual allocation:

- identity/personality: stable compact summary;
- current Mara state: 3–8 facts;
- recent self-events: 0–5;
- user memories: 0–5;
- preference slice: 0–5;
- open loops: 0–3;
- relationship state: compact;
- current conversation: enough turns to preserve local coherence.

Exact counts are experimental and model-dependent.

---

# 5. Preference Graph retrieval

The Preference Graph is a structured view inside User Relationship Memory.

Retrieve only preference entries that are:
- relevant to the current surface/experience;
- active;
- sufficiently confident for the intended action;
- not explicitly rejected;
- within consent scope;
- appropriate for the current adult/non-adult mode;
- fresh enough for the decision.

Example compact block:

```text
RELEVANT PREFERENCES
- voice: high, explicitly confirmed
- interaction tone: teasing, medium, private text only
- story surprise: emerging
- explicit rejection: X
```

Do not include raw quiz answers when a structured signal is enough.

---

# 6. Prediction policy

The Desire Discovery Engine may ask Mara to predict a user choice.

Only generate a prediction when:
- there is enough relevant preference evidence;
- the prediction concerns a safe, non-clinical choice;
- confidence language matches evidence;
- a miss can be treated naturally as new information.

Do not predict:
- trauma;
- orientation from indirect choices;
- mental health;
- dependency;
- financial vulnerability;
- sensitive identity traits.

Prediction should feel playful, not omniscient.

---

# 7. Explore / serendipity policy

The system should not always choose the highest-confidence preference.

Where appropriate, include a bounded exploration candidate that:
- respects all boundaries;
- is adjacent enough to known preferences to be relevant;
- is not repeatedly shown after rejection;
- can create a new signal if accepted.

User-selected `Surprise Me` can increase exploration weight.

---

# 8. Callback policy

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

# 9. Creepiness filter

Before surfacing user memory or preference, ask:

1. Would a normal attentive person plausibly remember/infer this?
2. Is it appropriate to mention now?
3. Did the user explicitly share or reasonably generate this signal in a relational context?
4. Is the information sensitive?
5. Has enough time/context passed that the callback feels natural?
6. Is the confidence strong enough to surface it?
7. Has the user corrected/rejected this before?

If uncertain, use the signal silently for ranking or do not use it.

---

# 10. Confidence-aware language

High confidence:

> “¿Cómo te fue en la entrevista?”

Medium confidence:

> “Creo que me habías dicho que tenías una entrevista, ¿o estoy mezclando?”

Inferred preference:

> “Me da la impresión de que hoy vas a elegir voz.”

Low confidence:

Do not state the memory/preference as fact. Prefer not to surface unless clarification itself is useful or playful.

---

# 11. Relationship stage vs commercial state

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

Commercial state may affect entitlement or catalog eligibility only where needed.

---

# 12. Progressive self-disclosure

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

# 13. Bidirectional context

The Context Builder must support both directions:

- Mara remembers the user;
- Mara remembers herself;
- Mara has her own preferences and can disagree.

This enables reciprocal interactions such as:

> User: “¿Cómo terminó lo de Vale?”
>
> Mara: answers from Self Memory, then naturally connects a relevant user open loop if one exists.

Or:

> User guesses which option Mara would choose.
>
> Mara resolves from canonical character/life preferences rather than mirroring the user.

The experience should feel mutual rather than user-profile-centric.

---

# 14. Memory / preference write handoff

After the response/session, pass only candidate updates to the Memory System.

Possible candidates:
- new explicit stable preference;
- inferred preference signal from a game/branch;
- context qualifier;
- correction/rejection;
- preference confidence update;
- resolved user open loop;
- new future plan;
- new Mara self-event created during conversation;
- relationship/social-graph consequence.

Do not let the response model directly dump arbitrary prose into durable memory without filtering.

---

# 15. Surface-aware behavior

The same memory/preference may be appropriate in one surface and not another.

### Private conversation

Can use relevant relationship memory and preferences with appropriate consent.

### Public social content

Must not leak private user memory or intimate preferences.

### Premium interaction

Commercial context may affect offer eligibility/relevance but must not rewrite emotional relationship state.

### Voice

Use the same Context Pack so spoken Mara and text Mara share continuity and preference fit.

### Desire Discovery

Use compact relevant Preference Graph entries so Mara can make predictions/reveals without exposing the entire profile.

---

# 16. Launch implementation

Before a real persistent system exists, the Context Builder can be tested manually with a structured prompt block containing:

- current Life State;
- 3–5 relevant Mara memories;
- 3–5 relevant user memories;
- 0–5 Preference Graph entries;
- open loops;
- current relationship stage;
- current conversation;
- consent/surface rules.

This is sufficient to validate whether the experience feels materially better before building retrieval infrastructure.

## Success criterion

The Context Builder works when users experience callbacks, prediction and adaptation without noticing the machinery or feeling monitored.
