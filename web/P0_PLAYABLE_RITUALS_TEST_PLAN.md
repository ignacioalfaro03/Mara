# P0 Playable Rituals Test Plan

## Purpose

Test whether Mara creates more engagement when she sometimes gives the user a bounded game/ritual/challenge instead of only conversation or passive media.

DEV route:

`/experience/rituals-lab`

No explicit media generation, realtime sexual instruction, payment or persistent adult-sensitive preference storage is active.

## Core hypotheses

### H1 — Participation value
Users should prefer at least some sessions where Mara asks them to do/choose/wait rather than only consume.

### H2 — Anticipation value
A short bounded `not yet` / waiting mechanic should create interest without needing maximum explicitness.

### H3 — Reward fit
Different users should prefer different completion payoffs such as praise, teasing, reveal or surprise.

### H4 — Contrast
Ordinary/absurd dares should make Mara feel more like a coherent character and preserve the impact of adult intensity peaks.

### H5 — Skip safety
Users should understand that skipping/failing a ritual has no relationship, entitlement or price penalty.

### H6 — Saturation
High-intensity rituals should lose appeal if shown too frequently. `rare` cadence should test better than constant repetition for the anticipation fixture.

## Canonical fixtures

- `R01` — appearance/wardrobe tease.
- `R02` — Mara-led choice/control.
- `R03` — short bounded anticipation/self-control concept.
- `R04` — ordinary/absurd harmless dare.

The fixtures are intentionally abstract. P0 is validating interaction mechanics, not adult-content production quality.

## Suggested first test

5–8 adult testers.

For each tester:
1. show all four fixtures in varied order;
2. ask which they would actually play;
3. ask which reward style feels most motivating;
4. simulate completion;
5. ask whether Mara still feels authentic;
6. explicitly test whether `Skip` feels consequence-free;
7. ask which fixture would become annoying fastest if repeated;
8. compare interest before and after explaining that rituals can be rare/contextual rather than constant.

## Safe events

- `ritual_viewed`;
- `ritual_play_intent`;
- `ritual_completed_simulated`;
- `ritual_skipped`;
- `ritual_reward_preference`.

Use opaque ritual IDs in analytics.

Do not log raw adult instructions, arousal state or private physical details.

## Decision criteria

Continue deeper only if:
- at least one ritual family materially improves perceived participation;
- users value anticipation/reward rather than only explicitness;
- skip/failure feels safe;
- testers prefer contextual cadence over constant challenges;
- the same Mara remains recognizable across ritual families.

Stop/rework if:
- rituals feel like chores;
- users feel punished for skipping;
- adult intensity needs to be constant to hold attention;
- Mara feels like a generic command bot;
- challenge completion starts being interpreted as a requirement for affection or payment.

## Deferred

Do not activate before separate evidence/review:
- explicit production rituals;
- realtime sexual instruction;
- physical-risk challenges;
- persistent adult challenge preferences;
- payment-gated high-intensity ritual during an active adult moment;
- financial punishment or spend-based compliance mechanics.
