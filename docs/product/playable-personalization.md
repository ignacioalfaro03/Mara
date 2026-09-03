# Mara Vera — Playable Personalization

## Status

Product/UX pattern library for the Desire Discovery Engine.

The purpose is to make preference learning feel like **play, flirtation, challenge, surprise and reciprocity**, not setup work.

## Product principle

Do not ask:

> “Tell Mara everything about you.”

Prefer:

> **“Play with Mara and she’ll start figuring you out.”**

Every discovery interaction should ideally contain at least two of:
- choice;
- Mara reaction;
- prediction;
- reveal;
- correction;
- visible adaptation;
- reciprocity.

## Core UX rules

1. Keep sessions short by default.
2. Avoid visible survey progress unless it improves the game.
3. Mara reacts between choices; she is not a silent form.
4. Do not over-explain every option.
5. Make corrections easy and low-friction.
6. Show a consequence after learning something.
7. Alternate familiarity with novelty.
8. Never present playful results as science.
9. Adult discovery requires adult eligibility and explicit opt-in.
10. Sensitive results are private by default.

## Game families

### Fast Five
Five quick decisions followed by Mara's short interpretation.

Flow:

**hook → 5 choices → Mara reveal → confirm/correct → immediate adaptation**

Good for:
- onboarding;
- recurring re-discovery;
- format preference;
- mood/theme discovery.

### I Bet You
Mara predicts a choice before the user answers.

Flow:

**prediction → choice → reaction → confidence update**

The miss is as useful as the hit.

### Guess Me
The user predicts Mara.

Flow:

**Mara presents options → user guesses → Mara reveals canonical choice → short explanation**

This strengthens reciprocity and character lore.

### Choose Your Type
Choose between synthetic adult character energies/styles or abstract style categories.

Do not use unlicensed real-person imagery for sexual comparison.

### What Would You Do?
Short scenario with two or more bounded responses.

The value is the narrative context, not psychological labeling.

### Build It
Progressively construct an experience.

Example dimensions:
1. mood;
2. setting;
3. Mara look;
4. tone;
5. modality;
6. optional continuation.

The final output should visibly use the choices.

### One Has to Go
Eliminate one from a small set.

Useful for relative preference and playful commentary.

### Rank Them
Order 3–6 choices.

Mara can react to the top/bottom choice rather than narrating the whole ranking.

### Surprise Me
Explicit exploration mode.

Mara intentionally picks outside the highest-confidence preference region, but within boundaries.

### Secret Choice
The user picks a door/card/path without knowing the exact narrative consequence.

If monetization follows, price and product category/scope must be clear before payment. Mystery cannot hide commercial terms.

## Playable onboarding

Test against traditional onboarding.

Candidate first-session flow:

1. AI/adult disclosure where relevant.
2. Mara: “Antes de hablar mucho contigo, quiero probar algo.”
3. Three lightweight choices.
4. Mara gives one low-confidence playful hypothesis.
5. User confirms/corrects.
6. Home/next content reflects at least one result.

Do not request dozens of preferences upfront.

## Mara commentary

Commentary should be:
- short;
- characterful;
- confidence-aware;
- sometimes surprising;
- not repetitive.

Good patterns:
- “Eso sí te lo veía venir.”
- “Mmm. Anotado.”
- “Ok, esa me cambió la teoría.”
- “Te tenía por el otro.”
- “Hasta ahora vas muy por voz.”
- “No te voy a encasillar todavía.”

Avoid:
- long analysis after every click;
- diagnostic language;
- fake certainty;
- constant praise.

## Reveal design

A reveal can show 1–3 useful patterns.

Example structure:

**Mi teoría por ahora**
- Te atrae más la tensión que ir directo.
- Estás eligiendo voz más de lo que esperaba.
- Con historias prefieres sorpresa.

Then:

**¿Te acerté?**
- Sí.
- Más o menos.
- Para nada.

The feedback should update Preference Graph candidates.

## Desire Profile

A future private profile can summarize selected non-diagnostic dimensions.

Possible UI:
- Tensión — alta
- Sorpresa — media
- Voz — alta
- Storytelling — alta
- Control — medio
- Personalización — alta

Framing:

> “Por lo que has ido eligiendo…”

Controls:
- edit;
- correct;
- reset;
- hide;
- adult-preference privacy controls where applicable.

## Progressive discovery cadence

Discovery should appear naturally across the product rather than as a standalone quiz center only.

Possible cadence:
- onboarding: 3 choices;
- story: 1 choice;
- conversation: 1 prediction;
- return session: Fast Five;
- post-experience: 1 reaction;
- weekly: optional Mara Test;
- seasonal/social: shareable safe quiz.

Do not create mandatory streak pressure.

## Adaptive UX

As confidence grows, Mara may:
- preselect likely options;
- reorder recommendations;
- shorten obvious questions;
- suggest a likely preferred modality;
- provide a `Surprise Me` escape;
- ask only when uncertainty matters.

Always allow the user to override.

## Social acquisition

Platform-safe quizzes can start on social surfaces.

Example funnel:

**Story poll → result/tease → “haz el test con Mara” → web → playable onboarding → personalized next experience**

Do not expose intimate results publicly.

## Share cards

Only safe outputs should be shareable.

Examples:
- “Mara dice que soy 72% caos.”
- “8/10 elecciones iguales que Mara.”
- style/mood archetypes;
- prediction streak.

Never default-share adult fantasy data or relationship-memory details.

## Monetization connection

Discovery should improve product relevance, not create pressure.

Examples:
- high voice affinity → feature voice experience;
- strong narrative affinity → feature continuation;
- personalization preference → feature custom experience;
- exploration mode → feature a new but bounded experience.

Do not use discovered preference signals to infer maximum willingness to pay or vulnerability-based pricing.

## P0 prototype

P0 can be operated with:
- static JSON question sets;
- simple branching rules;
- manual Mara commentary templates with character review;
- rule-based preference scoring;
- no durable account required for single-session tests;
- small consented test records for return-session experiments.

The purpose is to validate fun + adaptation before building recommender infrastructure.

## UX success criteria

Playable Personalization should increase at least one of:
- onboarding completion;
- meaningful interaction;
- session depth;
- return rate;
- preference confirmation;
- personalized content engagement;
- first/second purchase;

without materially worsening:
- privacy perception;
- creepiness reactions;
- skip/abandon rate;
- support burden.
