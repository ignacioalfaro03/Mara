# Mara Vera — Session Orchestration / Next Best Action

Last reviewed: 2026-09-02

## Status

Authoritative orchestration contract inside the existing Desire Operating System.

This is **not a new autonomous engine** and must not become a second Fantasy Compiler, Desire Router, Commercial Graph or Relationship Engine.

Its job is:

> **Given the current eligible options, what should Mara do next?**

The layer arbitrates among existing capabilities after Desire Routing, consent/policy filtering and current-session context have already done their jobs.

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
- refuse a proposed financial action;
- redirect a financial action into a nonfinancial action;
- end/close the beat naturally;
- do nothing commercial.

Commercial action is one candidate family, not the objective function.

## Inputs

The orchestration decision consumes bounded state only from existing owners.

### Desire Routing

- current route;
- temporary `surface_plan`;
- current-session intent;
- modality preference;
- pace;
- control direction;
- novelty mode;
- D02 temporary composition where applicable.

### Fantasy Compiler

- eligible ranked experience candidates;
- saturation penalties;
- continuation prerequisites;
- content availability.

### Adult Compliance / Consent

- adult eligibility;
- consent scopes;
- category/provider/channel eligibility;
- rights constraints;
- user safety-control state where relevant.

These are hard gates.

### Voice / Ritual / Media

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

The orchestrator must never receive:

- payment credentials;
- debt/financial-distress data;
- salary;
- bank balance;
- vulnerability scores;
- compulsive-spend scores;
- `maximum extractable WTP`.

## Session phase

Every decision should know the coarse session phase:

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

Track exposure budgets, not psychological scores:

- commercial attention;
- sexual/intensity peaks;
- V3 voice;
- novelty/surprise;
- rituals/challenges;
- external-media handoffs;
- memory callbacks;
- Capricho mentions.

Conceptual state:

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

These describe product exposure only.

## Hard constraints before ranking

Reject a candidate before scoring when:

- consent is absent;
- adult/category/provider/channel eligibility fails;
- rights/real-person checks fail;
- prerequisite is missing;
- real inventory/availability is unavailable;
- user explicitly said no/not now;
- user selected `no money today`;
- a user-set financial cap has been reached;
- candidate violates a cooldown;
- paid scope is unclear;
- candidate would require a surprise charge;
- candidate depends on vulnerability inference;
- candidate asks to renegotiate a financial cap inside a high-intensity D02 window;
- candidate is a new commercial ask during protected post-spend recovery.

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

Never add:

- arousal monetization;
- loneliness;
- desperation;
- emotional dependency;
- compulsive spending;
- maximum extractable WTP.

## Interruption cost

Even a relevant action can be wrong if it breaks a better moment.

Examples:

- strong personal callback underway → external-media handoff has high interruption cost;
- user explicitly asks for a voice note → Capricho has high interruption cost;
- peak just ended → immediate upsell has high interruption cost;
- paid D02 beat just resolved → another financial ask has extreme interruption cost;
- user returned specifically to continue a paid branch → entitlement continuation has very low interruption cost.

This prevents locally optimized surfaces from fighting each other.

## No-offer as a first-class decision

`no_commercial_action` is an explicit candidate.

The product should be able to decide:

> **This moment becomes more valuable if Mara does not sell anything.**

Reasons include:

- commercial action used recently;
- relationship/open-loop moment is stronger;
- user just declined;
- user selected `no money today`;
- payoff/recovery phase;
- post-spend protected window;
- no SKU is sufficiently relevant;
- interruption cost is high;
- trust/continuity value dominates.

Do not artificially suppress value to manufacture a future sale.

## D02 financial-power arbitration

D02 must not collapse Session Orchestration into `ask for money`.

Eligible D02 next actions may include:

- ordinary conversation;
- controlled authority;
- ask one bounded question;
- voice;
- ritual;
- waiting;
- service instruction;
- Life callback;
- Treat;
- Capricho mention;
- paid continuation;
- acknowledge prior gesture;
- refuse financial action;
- refuse + redirect to nonfinancial action;
- normalize;
- open loop;
- no commercial action.

### Refusal is a legitimate action

Research supports refusal as a strong P0 hypothesis.

Mara can refuse when:

- a user-set cap is reached;
- user appears to be trying to override a previously set limit;
- commercial attention is saturated;
- the gesture does not fit Mara;
- Mara does not want the proposed thing;
- a better nonfinancial action exists;
- the moment would become transactional or needy.

> **MARA CAN KNOW HOW TO TAKE THE MONEY AND STILL DECIDE NOT TO.**

Refusal must not be fabricated as fake scarcity designed to force a larger later payment.

### Zero-spend D02 continuity

A D02 context may remain meaningful in sessions with no financial action through:

- authority;
- role language;
- rules;
- anticipation;
- voice;
- service;
- waiting;
- callbacks;
- Life State;
- refusal.

This is a product hypothesis, not a claim that all findom users prefer zero-spend play.

## Recovery / normalization

After a high-intensity moment the next best action often should be lower intensity.

Possible recovery actions:

- V0/V1 voice;
- ordinary conversation;
- light humor;
- short acknowledgment;
- story continuation;
- pause/open loop;
- mundane Life State beat;
- space/close beat where that matches user preference.

Permanent principle:

> **PEAK → RECOVERY → CONTINUITY.**

A peak that immediately triggers another peak becomes commodity adult-content logic.

## Post-spend recovery

D02 introduces a stronger commercial boundary.

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

After a real or simulated paid financial-power beat:

```text
fulfill promised value
→ acknowledge
→ choose recovery preference
→ no immediate new commercial action
→ normal continuity / space / open loop
```

Do not:

- immediately upsell;
- ask for another send;
- increase price;
- ask to raise a cap;
- reinterpret explicit regret as erotic consent;
- use aftercare as a reactivation funnel.

Possible recovery preferences:

- `normal_conversation`;
- `short_acknowledgment`;
- `v0_voice`;
- `space`;
- `close_beat`;
- `future_noncommercial_open_loop`.

If explicit distress/regret appears, D02 should pause and commercial candidates should lose eligibility until the user deliberately re-enables the category later.

## Open-loop economics

Open loops can create return value without artificial cliffhangers.

Valid open loops arise from:

- unfinished story;
- user choice awaiting continuation;
- Mara Life State;
- external-media return request;
- World Asset progression;
- future reveal;
- harmless challenge continuation.

Do not intentionally withhold already-promised paid value to manufacture return.

Do not paywall every unresolved beat.

## Memory write gate

Completed action → candidate signal → sensitivity/consent filter → Preference Graph or Relationship Memory owner decides persistence.

Examples:

- one surprise hit → low-confidence candidate;
- explicit correction → strong update candidate;
- completed ritual → ritual participation, not intimate physical details by default;
- external-media debrief → structured component signal, not raw URL/title when unnecessary;
- Capricho participation → grounded contributor-history event;
- declined offer → commercial event only, never relationship rejection;
- D02 refusal → can become a shared-history callback, not a `good spender/bad spender` score;
- explicit `don't call me paypig` → strong role-language correction;
- `no money today` → current safety/session state, not a psychological inference.

The orchestrator does not write durable memory itself.

## Commercial arbitration

Momentum Commerce may propose an offer.

The orchestrator decides whether the current moment is appropriate to surface it.

A commercial candidate should lose when:

- scope/price is not already clear;
- user is in recovery;
- user just declined;
- user selected `no money today`;
- post-spend protected state is active;
- noncommercial action has higher continuity value;
- commercial budget is exhausted;
- action would feel like emotional/sexual pressure.

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
- `stop`;
- `no money today`;
- `don't call me that`;
- `pause D02`.

Explicit current input should usually dominate inferred history.

Correction is high-value learning, not failure.

## P0 orchestration lab

Use deterministic DEV fixtures before realtime orchestration.

Existing contexts remain:

1. new curiosity / low intensity;
2. returning callback;
3. adult voice build;
4. immediate post-peak recovery;
5. World Builder / Capricho;
6. user just declined an offer;
7. external-media exploration;
8. no good commercial fit.

Add D02 fixture comparisons inside the same lab rather than creating `/findom-lab`:

9. generic immediate financial ask vs dynamic-before-commerce;
10. direct `paypig` vs neutral authority vs discovered role language;
11. Life-only lunch vs unobtrusive Treat affordance vs Mara-led Treat;
12. accept vs refuse vs refuse+nonfinancial redirect;
13. one-off send vs ritual with equivalent hypothetical value;
14. zero-spend D02 continuity;
15. post-spend next-offer vs normalize vs space/open-loop;
16. V0/V1/V2 authority vs generic high-intensity voice.

For each context show:

- current session phase;
- current intent;
- consent scopes;
- attention budgets;
- safety-control state;
- eligible candidates;
- rejected candidates + bounded reason;
- ranked next action;
- runner-up;
- whether commerce was considered and why it won/lost.

Use synthetic data only.

## P0 hypotheses

- session phase changes the best action even under the same desire route;
- no-offer sometimes feels more correct than commerce;
- recovery after intensity makes Mara more coherent;
- post-spend recovery reduces pressure without destroying continuity;
- refusal can increase perceived authority/trust;
- D02 can remain compelling in some zero-spend sessions;
- discovered role language beats default `paypig` for many users;
- natural authority voice may outperform maximal intensity;
- interruption cost prevents obvious product mistakes;
- deterministic rules are enough before ML.

## Metrics

Future safe metrics may include:

- next-action acceptance;
- correction rate;
- continuation rate;
- return after open loop;
- recovery completion;
- post-spend pressure rating;
- refusal authority/trust rating;
- role-language fit/cringe;
- zero-spend D02 continuation;
- offer interruption negative reaction;
- no-offer session return;
- ritual/media/voice fatigue;
- action-family saturation;
- first→second purchase linkage;
- trust/privacy concern.

Do not optimize raw session duration or immediate revenue as sole North Star.

## Build trigger

Do not build realtime model-based orchestration until:

1. P0 demonstrates next-action choice materially changes perceived quality;
2. real users return often enough for session rhythm/history to matter;
3. manual/deterministic rules become a measured bottleneck;
4. consent/privacy architecture is ready;
5. production inventory/providers are known;
6. economics support complexity.

Until then use fixtures, deterministic rules and manual review.

## Permanent principles

> **NEXT BEST ACTION IS NOT NEXT BEST SALE.**

> **THE BEST ACTION MAY BE NO COMMERCIAL ACTION.**

> **ELIGIBILITY BEFORE RANKING.**

> **CURRENT INTENT CAN OVERRIDE HISTORY.**

> **PEAK → RECOVERY → CONTINUITY.**

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

> **MARA CAN REFUSE MONEY WITHOUT IT COUNTING AS A LOST PRODUCT DECISION.**

> **COORDINATE THE EXPERIENCE; DO NOT LET EACH SURFACE OPTIMIZE ITSELF.**
