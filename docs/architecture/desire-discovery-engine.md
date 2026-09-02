# Mara Vera — Desire Discovery Engine

## Status

Authoritative architecture for **Playable Personalization** inside the existing Foundation outcome. It does not create a parallel memory or recommendation system.

The Desire Discovery Engine captures preference signals through entertaining choices and hands filtered signals to the existing User Relationship Memory / Preference Graph, Context Builder and Fantasy Experience Engine.

## Core thesis

Mara should not ask users to complete a static profile.

The experience should feel like:

> **Play with Mara and she'll start figuring you out.**

The user:
- chooses;
- compares;
- ranks;
- reacts;
- changes their mind;
- corrects Mara;
- surprises Mara;
- discovers patterns in their own choices.

Mara:
- makes bounded hypotheses;
- reacts in character;
- predicts when confidence supports it;
- accepts correction;
- adapts the next experience;
- makes the learning visible without pretending to read minds.

## Architecture position

Do not build a second user profile.

Conceptual flow:

**Playable interaction → Choice Signal → Preference Graph update candidate → filtered Relationship Memory → Context Builder → next interaction / Fantasy Experience / offer relevance → user reaction → updated signal**

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
- commercial state;
- pricing;
- payment data;
- clinical/psychological inference.

## Discovery formats

### A/B Choice
Two options, one fast decision.

Useful for:
- visual style;
- tone;
- modality;
- scenario direction;
- interaction style.

### This or That
Fast paired decisions such as:
- elegant / bold;
- surprise / control;
- voice / visual;
- story / interaction;
- teasing / direct.

### Ranking
Rank 3–6 options. This produces richer relative preference information than a single like.

### Rapid Fire
A sequence of quick choices. Response time may be recorded for UX analysis, but must not be treated as psychological diagnosis or hidden vulnerability evidence.

### Mara Test
Mara states a playful hypothesis and tests it through several choices.

### Fast Five
Five choices, followed by a short Mara interpretation.

### Build It
The user progressively builds a scenario through bounded variables.

### Guess Me
The user predicts Mara's own canonical preference.

### I Bet You
Mara predicts the user's next choice.

### One Has to Go
The user removes one option from a set.

### Surprise Me
The user explicitly asks Mara to explore outside known preferences.

## Prediction as entertainment

Prediction is a first-class product mechanic.

Example pattern:

> “Apuesto a que eliges la segunda.”

If correct:

> “Te voy conociendo.”

If wrong:

> “Ok. Esa no me la esperaba.”

Rules:
- prediction confidence must come from the Preference Graph or explicit recent context;
- do not claim certainty when evidence is weak;
- wrong predictions are useful signals, not failures to hide;
- prediction must remain playful, not creepy or authoritative;
- never predict sensitive traits or vulnerabilities.

## Correction Loop

Corrections are high-value labels.

User responses such as:
- “no”;
- “depende”;
- “antes sí, ahora no”;
- “solo en audio”;
- “hoy quiero otra cosa”;

should be represented as structured correction/update candidates rather than discarded contradiction.

The system should support:
- correction;
- context qualification;
- preference weakening;
- preference replacement;
- temporary override;
- explicit rejection.

Mara should acknowledge correction naturally and move on.

## Visible learning loop

Discovery is valuable only if the user sees an effect.

Required loop:

**choice → Mara reaction → pattern hypothesis → user confirms/corrects → next experience changes**.

Avoid:

**20 questions → generic result → nothing changes**.

The next visible consequence can be:
- different story recommendation;
- different voice-led experience;
- different tone;
- different visual option;
- better default ordering;
- different continuation;
- a relevant offer;
- a deliberate surprise.

## Discovery vs psychology

Mara may talk about:
- patterns;
- tendencies;
- repeated choices;
- preferences;
- contradictions;
- current mood;
- surprise.

Mara must not claim to diagnose or reveal:
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

Where allowed, it may explore bounded categories such as:
- initiative;
- surprise;
- control;
- teasing;
- narrative;
- voice;
- roleplay;
- intensity;
- duration;
- interaction format;
- aesthetic/context.

Requirements:
- adult eligibility;
- explicit adult-mode opt-in;
- skip/stop;
- user corrections;
- privacy controls;
- no permanent inference from a single choice;
- no raw intimate answers in general analytics.

## Explore vs exploit

Recommendation terminology only:

### Exploit
Use known preferences to increase relevance.

### Explore
Test reasonable alternatives to avoid repetition and discover change.

Never interpret “exploit” as exploiting the user financially or psychologically.

A healthy system needs both:
- enough familiarity to feel understood;
- enough novelty to remain interesting.

## Serendipity

Mara should occasionally test a nearby alternative with reasonable likelihood of success.

If the user likes it:
- create/update the relevant preference signal.

If not:
- capture the correction;
- reduce confidence;
- do not repeatedly push the same choice.

## Progressive discovery

Do not front-load the entire profile.

Possible rhythm:
- onboarding: 3 lightweight choices;
- later session: one Fast Five;
- story: one branch choice;
- conversation: one natural correction;
- after experience: one lightweight feedback signal;
- weekly: optional Mara Test or Guess Me.

The Preference Graph should emerge over time.

## Reciprocal play

Mara also has canonical preferences from her Character/Life system.

Some games should reverse direction:
- user guesses Mara;
- compare choices;
- show playful agreement/disagreement;
- let Mara defend a preference.

This prevents the product from feeling like a disguised CRM.

## Compatibility framing

Allowed as entertainment:

> “Coincidimos en 7 de 10.”

> “Tenemos gustos peligrosamente parecidos.”

Do not frame this as scientific relationship compatibility or psychological prediction.

## Social/share loop

Safe, non-sensitive discovery outputs can become shareable cards.

Examples:
- playful energy/archetype;
- agreement score with Mara;
- harmless style/mood result;
- prediction streak.

Private by default.

Never auto-share:
- adult fantasies;
- sexual preferences;
- intimate answers;
- private relationship memory.

## P0 implementation

Do not build ML/recommender infrastructure.

P0 can use:
- Markdown/JSON question sets;
- simple rule-based scoring;
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
3. Result only vs result + immediate adapted experience.
4. Mara prediction vs no prediction.
5. Generic offer vs preference-relevant offer.
6. Known-preference choice vs Surprise Me alternative.
7. Static result vs editable/correctable result.
8. Static quiz vs branching quiz.
9. Private result vs safe share card.
10. No follow-up vs callback based on prior discovery session.

## Success criteria

The engine matters if it improves:
- activation;
- meaningful interaction;
- session depth;
- return rate;
- voice/story engagement;
- first purchase;
- second purchase;
- personalized conversion;
- retention;
- Preference Graph quality.

It does not succeed merely because users answer many questions.

## Build trigger

Automate materially only when:
1. discovery sessions are repeatedly used;
2. personalization lift is measurable;
3. manual scoring/curation becomes a real bottleneck;
4. data/privacy architecture is approved;
5. incremental value can justify cost;
6. the Traction → Investment Gate is satisfied or a bounded founder-authorized experiment exists.
