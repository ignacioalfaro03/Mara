# Mara Vera — Session Orchestration / Next Best Action

Last reviewed: 2026-09-02

## Status

Authoritative orchestration contract inside the existing Desire Operating System.

This is **not a new autonomous engine** and must not become a second Fantasy Compiler, second Desire Router, second Commercial Graph or second Relationship Engine.

Its job is narrower and more important:

> **Given the current eligible options, what should Mara do next?**

The layer arbitrates among existing capabilities after Desire Routing, consent/policy filtering and current-session context have already done their jobs.

## Why this layer exists

Mara already has architecture for:

- Desire Discovery;
- Preference Graph;
- Desire Routing / `surface_plan`;
- Fantasy Compiler;
- Voice;
- Rituals;
- External Media Companion;
- Caprichos / World Assets;
- Relationship Memory / open loops;
- Momentum Commerce.

Without an orchestration contract these systems can all be locally correct and still produce a globally bad session:

- too many sexual peaks;
- too many offers;
- a ritual immediately after another ritual;
- a V3 voice peak with no buildup;
- an external-media handoff when the user wants Mara herself;
- a Capricho interrupting a strong relationship moment;
- a callback that feels creepy rather than useful;
- an offer where the best action was simply to continue the experience.

The orchestrator protects **session quality across systems**.

## Core principle

> **NEXT BEST ACTION IS NOT NEXT BEST SALE.**

The best next action may be:

- talk;
- ask one question;
- tease;
- use voice;
- show an eligible Mara-owned experience;
- recommend approved external media;
- start a ritual/challenge;
- wait;
- resolve an open loop;
- continue a story;
- surface a Capricho;
- present a transparent paid continuation;
- normalize after intensity;
- create an open loop;
- end/close the beat naturally;
- do nothing commercial.

Commercial action is one candidate family, not the objective function.

## Inputs

The orchestration decision can consume only bounded state from existing owners:

### Desire Routing

- current route;
- `surface_plan`;
- current-session intent;
- modality preference;
- pace;
- control direction;
- novelty mode.

### Fantasy Compiler

- eligible ranked experience candidates;
- saturation penalties;
- continuation prerequisites;
- content availability.

### Adult Compliance / Consent

- adult eligibility;
- consent scopes;
- category/provider/channel eligibility;
- rights constraints.

These are hard gates.

### Voice / Ritual / Media layers

- capability availability;
- recent usage/cooldown;
- voice ceiling;
- ritual eligibility;
- media-source eligibility.

### Relationship / Memory

- relevant open loops;
- one small retrieval slice;
- recent callback use;
- relationship stage where justified;
- temporary relational tone.

### Life Engine

- current Mara Life State only when it materially changes the moment.

### Momentum Commerce

- eligible SKU/continuation candidates;
- entitlement state;
- actual availability;
- commercial cooldown;
- product scope/price already defined outside this layer.

The orchestrator must never receive payment credentials, debt/financial-distress data or vulnerability scores.

## Session phase

Every decision should know the current coarse session phase:

```text
entry
read_moment
play
build
surprise
optional_peak
payoff
normalize
open_loop
close
```

Not every session traverses every phase.

Phase is a coordination variable, not an enforced script.

## Attention budgets

Several resources lose value when overused.

Track session/recent-window **budgets**, not psychological user scores:

- commercial attention;
- sexual/intensity peaks;
- V3 voice;
- novelty/surprise;
- rituals/challenges;
- external-media handoffs;
- memory callbacks;
- Capricho mentions.

Example conceptual state:

```yaml
attention_budget:
  commercial: available
  high_intensity: cooling_down
  v3_voice: exhausted
  ritual: available
  novelty: available
  callback: used_recently
  capricho: available
```

This describes product exposure, not the user's psychology.

## Hard constraints before ranking

Reject a candidate before scoring when:

- consent is absent;
- adult/category/provider/channel eligibility fails;
- rights/real-person checks fail;
- prerequisite is missing;
- real inventory/availability is unavailable;
- user explicitly said no/not now;
- candidate violates a cooldown that protects experience quality;
- a paid scope is unclear;
- the candidate would require a surprise charge;
- the candidate depends on vulnerability inference.

## Candidate scoring

P0 should remain deterministic and explainable.

Conceptual score:

```text
next_action_score =
  current_intent_fit
+ preference_fit
+ session_phase_fit
+ continuity_value
+ modality_fit
+ pace_fit
+ relationship_relevance
+ novelty_value
+ expected_user_value
+ open_loop_value
- saturation_penalty
- attention_budget_penalty
- interruption_cost
- creepiness_risk
```

Commercial relevance may be a bounded positive input only when a product genuinely fits the moment.

Do not add:

- arousal monetization;
- loneliness;
- desperation;
- emotional dependency;
- compulsive spending;
- maximum extractable willingness to pay.

## Interruption cost

A key missing variable is **interruption cost**.

Even a relevant action can be wrong if it breaks a better moment.

Examples:

- strong personal callback underway → external-media handoff has high interruption cost;
- user explicitly asks for a voice note → Capricho has high interruption cost;
- peak just ended → immediate upsell has high interruption cost;
- user is exploring World Assets → Capricho may have low interruption cost;
- user returned specifically to continue a paid branch → entitlement continuation has very low interruption cost.

This prevents locally optimized surfaces from fighting each other.

## No-offer as a first-class decision

`no_commercial_action` must be an explicit candidate, not the absence of logic.

The product should be able to decide:

> **This moment becomes more valuable if Mara does not sell anything.**

Reasons can include:

- commercial action used recently;
- relationship/open-loop moment is stronger;
- user just declined;
- payoff/recovery phase;
- no SKU is sufficiently relevant;
- interruption cost is high;
- trust/continuity value dominates.

Do not artificially suppress value so the next session can be monetized.

## Recovery / normalization

After a high-intensity moment the next best action often should be **lower intensity**.

Possible recovery actions:

- V0/V1 voice;
- ordinary conversation;
- light humor;
- short acknowledgment;
- story continuation;
- pause/open loop;
- mundane Life State beat.

Permanent principle:

> **PEAK → RECOVERY → CONTINUITY.**

A peak that immediately triggers another peak becomes commodity adult-content logic.

## Open-loop economics

Open loops can create return value without artificial cliffhangers.

Valid open loops arise from:

- unfinished story;
- user choice awaiting continuation;
- Mara Life State;
- external-media return request;
- World Asset progression;
- a future reveal;
- a harmless challenge continuation.

Do not intentionally withhold already-promised paid value to manufacture return.

Do not paywall every unresolved beat.

## Memory write gate

The orchestration layer also defines when a completed action may emit a **memory candidate**.

Action outcome → candidate signal → sensitivity/consent filter → Preference Graph or Relationship Memory owner decides whether to persist.

Examples:

- one surprise hit → low-confidence candidate, not durable truth;
- explicit correction → strong update candidate;
- completed ritual → `ritual participated`, not intimate physical details by default;
- external-media debrief → structured component signal, not raw URL/title when unnecessary;
- Capricho participation → grounded contributor-history event;
- declined offer → commercial event only, never relationship rejection.

The orchestrator does not write durable memory itself.

## Commercial arbitration

Momentum Commerce may propose an offer.

The orchestrator decides whether the current moment is appropriate to surface it.

A commercial candidate should lose when:

- scope/price is not already clear;
- user is in a recovery phase;
- user just declined another offer;
- a noncommercial action has clearly higher continuity value;
- commercial budget is exhausted;
- the action would feel like emotional/sexual pressure.

If an offer wins, payment state changes entitlement only.

It does not increase relationship stage, consent or affection.

## User correction

The user can override orchestration quickly:

- `not this`;
- `just talk`;
- `voice instead`;
- `less intense`;
- `surprise me`;
- `continue`;
- `stop`.

Explicit current input should usually dominate inferred history.

Correction is high-value learning, not failure.

## P0 orchestration lab

Build a deterministic DEV fixture before any realtime orchestrator.

Test several synthetic moments with the same candidate action inventory.

Recommended contexts:

1. new user / curious / low intensity;
2. returning user / unfinished callback;
3. adult session / buildup complete / voice eligible;
4. immediate post-peak recovery;
5. World Builder / Capricho context;
6. user just declined an offer;
7. exploration session where approved external media is eligible;
8. no good commercial fit.

For each context show:

- current session phase;
- current intent;
- available consent scopes;
- attention budgets;
- eligible candidates;
- rejected candidates + bounded reason;
- ranked next action;
- runner-up;
- whether commerce was considered and why it won/lost.

Use synthetic data only.

## P0 hypotheses

- users prefer different next actions even under the same desire route depending on session phase;
- `no offer` sometimes feels more correct than a monetized action;
- recovery after intensity makes Mara feel more coherent/human;
- interruption cost prevents obvious product mistakes;
- current-session overrides improve relevance;
- testers can understand the decision without seeing a psychological profile;
- deterministic rules are sufficient before ML.

## Metrics

Future safe metrics may include:

- next-action acceptance;
- correction rate;
- continuation rate;
- return after open loop;
- recovery completion;
- offer interruption negative reaction;
- no-offer session return;
- ritual/media/voice fatigue;
- action-family saturation;
- first→second purchase linkage;
- trust/privacy concern.

Do not optimize raw session duration as the sole North Star.

## Build trigger

Do not build realtime model-based orchestration until:

1. P0 demonstrates that next-action choice materially changes perceived quality;
2. real users return often enough for session rhythm/history to matter;
3. manual/deterministic rules become a measured bottleneck;
4. consent/privacy architecture is ready;
5. production inventory/providers are actually known;
6. economics support the added complexity.

Until then use fixtures, deterministic rules and manual review.

## Permanent principles

> **NEXT BEST ACTION IS NOT NEXT BEST SALE.**

> **THE BEST ACTION MAY BE NO COMMERCIAL ACTION.**

> **ELIGIBILITY BEFORE RANKING.**

> **CURRENT INTENT CAN OVERRIDE HISTORY.**

> **PEAK → RECOVERY → CONTINUITY.**

> **COORDINATE THE EXPERIENCE; DO NOT LET EACH SURFACE OPTIMIZE ITSELF.**
