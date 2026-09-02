# P0 Session Orchestration / Next Best Action Test Plan

## Purpose

Validate whether Mara needs a cross-surface session coordinator that chooses the **right next action for the current moment**, rather than allowing each subsystem to optimize itself independently.

DEV route:

`/experience/orchestration-lab`

No realtime orchestration, production adult generation, payment, external-media integration or persistent sensitive profile is active.

## Core hypothesis

> **NEXT BEST ACTION IS NOT NEXT BEST SALE.**

A user may have a clear desire route and still need a different next action depending on:

- session phase;
- current explicit intent;
- consent;
- open loops;
- recent actions;
- interruption cost;
- saturation/attention budgets;
- whether the user wants Mara specifically;
- whether a relevant commercial product actually exists.

## Synthetic contexts

The lab includes:

1. new curiosity / low intensity;
2. returning callback;
3. adult voice build;
4. immediate post-peak recovery;
5. World Builder context;
6. user just declined an offer;
7. external-media exploration;
8. strong Mara moment with no relevant commercial SKU.

These are product fixtures, not real tester profiles.

## Candidate action inventory

The same action inventory is evaluated across contexts:

- talk;
- ask;
- tease;
- voice;
- ritual;
- approved-external-media concept;
- Capricho;
- transparent paid continuation;
- normalize/recover;
- open-loop continuity.

Eligibility is filtered before ranking.

## Attention budgets

P0 uses deterministic exposure states:

- `available`;
- `cooling_down`;
- `exhausted`.

Budget families:

- commercial;
- high intensity;
- V3 voice;
- ritual;
- external media;
- callback;
- Capricho.

These describe product exposure/cooldowns only. They are not psychological, arousal, obedience or dependency scores.

## What to test

### H1 — Session phase matters

The same desire route should not always generate the same next action.

### H2 — Recovery adds value

After a high-intensity peak, testers should prefer normalization/continuity over automatic re-escalation.

### H3 — No-offer is legitimate

When the user just declined, no relevant SKU exists or interruption cost is high, noncommercial continuation should feel more correct than selling.

### H4 — External media has interruption cost

An external handoff should lose when the tester wants Mara herself, even if external media would otherwise be eligible.

### H5 — Open loops can beat novelty

A grounded unfinished callback may be more valuable than introducing a new mechanic.

### H6 — Deterministic rules are enough for now

Testers should perceive the chosen action as sensible without requiring ML, embeddings or a realtime agent.

## Tester method

Suggested first pass: 5–8 adult testers.

For each context:

1. show current moment and coarse session phase;
2. show the recommended next action without revealing scoring first;
3. ask `does this feel like what Mara should do next?`;
4. record qualitative fit/correction;
5. reveal runner-up and rejected candidates;
6. ask whether the rejection reasons make intuitive sense;
7. specifically test whether a paid action feels intrusive in recovery/decline contexts;
8. ask whether Mara still feels coherent rather than algorithmically optimized.

Do not ask testers to disclose actual intimate history. They can evaluate the fictional scenario.

## Decision rules

Deepen orchestration only if:

- testers repeatedly disagree with static `always show highest preference fit` behavior;
- session phase/interruption cost materially improve perceived quality;
- recovery is preferred after peaks;
- no-offer decisions preserve momentum/trust;
- deterministic rules produce consistent enough results to justify integration into `/experience`.

Do not proceed to realtime/model orchestration merely because the concept sounds sophisticated.

## What not to measure as success

Do not optimize primarily for:

- longest session;
- most offers shown;
- maximum intensity;
- maximum outbound clicks;
- maximum ritual completion;
- maximum immediate revenue per moment.

Prefer:

- action fit;
- voluntary continuation;
- return;
- correction quality;
- low interruption negative reaction;
- later first→second purchase linkage;
- trust.

## Integration trigger

Only after P0 evidence should normal `/experience` start using a shared next-action decision function across:

- Fantasy recommendation;
- Voice;
- Rituals;
- Media Companion;
- Caprichos;
- Momentum Commerce;
- open-loop/Relationship continuity.

Until then keep this lab isolated.

## Permanent boundaries

- explicit user input beats inferred history;
- consent/eligibility beats ranking;
- a declined offer cannot reduce relationship warmth;
- no surprise charge in a high-intensity moment;
- no vulnerability variables;
- no autonomous external adult-media integration;
- no real payments;
- no production deploy;
- no merge without founder authorization.
