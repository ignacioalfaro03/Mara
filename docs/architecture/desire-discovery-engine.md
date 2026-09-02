# Mara Vera — Desire Discovery Engine

## Status

Authoritative architecture for **Playable Personalization** inside the existing Foundation outcome. It does not create a parallel memory, recommendation or fantasy system.

The Desire Discovery Engine captures preference signals through entertaining choices and hands filtered signals to User Relationship Memory / Preference Graph. The [Fantasy Compiler](fantasy-compiler.md) then uses a temporary preference projection to compose/rank eligible experiences for the Fantasy Experience Engine.

## Core thesis

Mara should not ask users to complete a static profile.

The experience should feel like:

> **Play with Mara and she'll start figuring you out.**

The user chooses, compares, ranks, reacts, changes their mind, corrects Mara, surprises her and discovers patterns in their own choices.

Mara makes bounded hypotheses, reacts in character, predicts when evidence supports it, accepts correction and visibly adapts the next experience without pretending to read minds.

## Architecture position

Conceptual flow:

**Playable interaction → Choice Signal → Preference Graph update candidate → temporary User Desire Vector → Fantasy Compiler / Context Builder → next experience → user reaction → updated signal**.

The Desire Discovery Engine owns:
- game/session structure;
- questions/choices;
- presentation;
- immediate Mara commentary;
- prediction prompts;
- correction capture;
- reveal/result composition;
- discovery-session analytics.

It does not own:
- durable memory storage;
- relationship stage;
- commercial state/pricing;
- Fantasy Compiler matching logic;
- content generation;
- clinical/psychological inference.

## Discovery formats

### A/B Choice
Two options, one fast decision. Useful for visual style, tone, modality, scenario direction and interaction style.

### This or That
Fast paired choices such as elegant/bold, surprise/control, voice/visual, story/interaction, teasing/direct.

### Ranking
Rank 3–6 options. Produces richer relative preference information than a single like.

### Rapid Fire
A sequence of quick choices. Response time may be used for UX analysis but must not become psychological diagnosis or vulnerability evidence.

### Mara Test
Mara states a playful hypothesis and tests it through several choices.

### Fast Five
Five choices followed by a short Mara interpretation.

### Build It
The user progressively builds a bounded experience configuration.

### Guess Me
The user predicts Mara's canonical preference.

### I Bet You
Mara predicts the user's next choice.

### One Has to Go
The user removes one option from a set.

### Surprise Me
The user explicitly asks Mara to explore outside known preferences.

## Prediction as entertainment

Prediction is a first-class product mechanic.

Pattern:

> “Apuesto a que eliges la segunda.”

If correct:

> “Te voy conociendo.”

If wrong:

> “Ok. Esa no me la esperaba.”

Rules:
- prediction confidence comes from Preference Graph/recent context;
- do not claim certainty from weak evidence;
- wrong predictions are useful signals;
- never predict sensitive traits/vulnerabilities;
- prediction should feel playful, not invasive.

## Correction Loop

Corrections are high-value labels.

Responses such as “no”, “depende”, “antes sí, ahora no”, “solo en audio” or “hoy quiero otra cosa” should become structured correction/update candidates.

Support:
- correction;
- context qualification;
- preference weakening;
- replacement;
- temporary override;
- explicit rejection.

Mara should acknowledge correction naturally and move on.

## Visible learning loop

Discovery is valuable only if the user sees an effect.

Required loop:

**choice → Mara reaction → pattern hypothesis → confirm/correct → compiled/adapted next experience**.

Avoid:

**20 questions → generic result → nothing changes**.

Possible visible consequences:
- different story recommendation;
- different voice-led experience;
- different tone;
- better option ordering;
- different continuation;
- relevant product;
- deliberate adjacent surprise.

## Discovery → Fantasy Compiler

Discovery does not directly generate a final fantasy category.

It produces structured signals that can be projected into dimensions such as:
- character energy;
- interaction style;
- context;
- format;
- dynamic;
- narrative preference;
- personalization depth;
- novelty preference.

The Fantasy Compiler combines these dimensions rather than assigning the user one permanent label.

Example:

```text
repeated choices →
selective energy + teasing + voice + work context + continuation + medium novelty
```

This may yield a candidate experience that feels specifically composed rather than selected from a fetish menu.

## Build It as composition UI

`Build It` is the user-visible bridge into Fantasy Compilation.

A bounded sequence may ask for:
1. mood;
2. Mara energy;
3. setting;
4. format;
5. dynamic;
6. ending/continuation.

Mara may preselect or curate options based on current context and allow correction.

The user does not need to see every internal variable.

The final experience should visibly reflect the selected combination.

## Discovery vs psychology

Mara may talk about patterns, tendencies, repeated choices, preferences, contradictions, current mood and surprise.

Mara must not claim to diagnose/reveal:
- subconscious truth;
- trauma;
- mental-health conditions;
- orientation from indirect choices;
- pathology;
- emotional dependency;
- financial vulnerability.

Preferred language:
- “por lo que has ido eligiendo…”;
- “me da la impresión de que…”;
- “mi apuesta es…”;
- “hasta ahora…”;
- “corrígeme si me equivoco”.

## Adult Fantasy Discovery

Adult preference discovery is a gated subset.

Where allowed, it may explore bounded dimensions such as initiative, surprise, control, teasing, narrative, voice, roleplay, intensity, duration, interaction format and aesthetic/context.

Requirements:
- adult eligibility;
- explicit adult-mode opt-in;
- skip/stop;
- correction;
- privacy controls;
- no permanent inference from one choice;
- no raw intimate answers in general analytics.

## Explore vs known fit

### Known fit
Use reliable preferences to improve relevance.

### Explore
Test reasonable adjacent alternatives to avoid repetition and discover change.

### Surprise Me
User-controlled higher novelty within boundaries.

The Fantasy Compiler owns final candidate balancing; Discovery provides the signals and explicit `Surprise Me` intent.

## Serendipity

If an adjacent option works, create/update the relevant preference signal. If it fails, capture correction and avoid repeatedly pushing the same choice.

## Progressive discovery

Do not front-load the whole profile.

Possible rhythm:
- onboarding: 3 lightweight choices;
- later: one Fast Five;
- story: one branch;
- conversation: natural correction;
- after experience: lightweight feedback;
- weekly: optional Mara Test or Guess Me.

The Preference Graph should emerge over time.

## Reciprocal play

Mara also has canonical preferences from Character/Life systems.

Reverse games can let the user guess Mara, compare choices, see playful agreement/disagreement and hear Mara defend a preference.

This prevents the product from feeling like a disguised CRM.

## Compatibility framing

Allowed as entertainment:

> “Coincidimos en 7 de 10.”

> “Tenemos gustos peligrosamente parecidos.”

Do not frame as scientific relationship compatibility.

## Social/share loop

Safe, non-sensitive outputs can become shareable cards: playful energy/archetype, agreement score, harmless style/mood result or prediction streak.

Private by default. Never auto-share adult fantasies, sexual preferences, intimate answers or private relationship memory.

## P0 implementation

P0 can use:
- Markdown/JSON question sets;
- rule-based scoring;
- manual preference records;
- confidence buckets;
- recency;
- explicit corrections;
- deterministic weighted recommendations;
- spreadsheet experiment tracking.

No embeddings/vector DB/custom recommender before evidence.

## MVP experiments

1. Traditional onboarding vs 3-choice Mara Game.
2. Neutral quiz vs Mara commentary after each answer.
3. Result only vs result + immediately compiled/adapted experience.
4. Mara prediction vs no prediction.
5. Generic experience vs preference-composed combination.
6. Known-fit choice vs `Surprise Me`.
7. Static result vs editable/correctable result.
8. Static quiz vs branching quiz.
9. Private result vs safe share card.
10. Finished experience vs `Build It` co-creation.

## Success criteria

The engine matters if it improves activation, meaningful interaction, session depth, return, voice/story engagement, first purchase, second purchase, personalized conversion, retention and Preference Graph quality.

It does not succeed merely because users answer many questions.

## Build trigger

Automate materially only when:
1. discovery sessions are repeatedly used;
2. personalization/compiled-experience lift is measurable;
3. manual scoring/curation becomes a real bottleneck;
4. data/privacy architecture is approved;
5. incremental value justifies cost;
6. the Traction → Investment Gate is satisfied or a bounded founder-authorized experiment exists.
