# P0 Session Orchestration / Next Best Action Test Plan

## Purpose

Validate whether Mara needs a cross-surface session coordinator that chooses the **right next action for the current moment**, rather than allowing each subsystem to optimize itself independently.

DEV route:

`/experience/orchestration-lab`

No realtime orchestration, production adult generation, payment, external-media integration or persistent sensitive profile is active.

This plan now includes D02 / Financial Power fixtures derived from 2026-09-02 community research. They remain **synthetic product experiments**, not authorization for real findom payments or financial-control mechanics.

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
- safety-control state;
- whether the user wants Mara specifically;
- whether a relevant commercial product actually exists.

D02 adds a second core hypothesis:

> **FINDOM = FINANCIAL POWER COMPOSITION, NOT ONE SCRIPT.**

A D02 session should not automatically produce `ask for money`.

## Synthetic contexts

Existing lab contexts:

1. new curiosity / low intensity;
2. returning callback;
3. adult voice build;
4. immediate post-peak recovery;
5. World Builder context;
6. user just declined an offer;
7. external-media exploration;
8. strong Mara moment with no relevant commercial SKU.

D02 fixture contexts to add inside the same lab:

9. financial-power curiosity before any commercial action;
10. role-language discovery;
11. ordinary Life Event that could become a Treat;
12. user proposes a second hypothetical financial action after the moment is already satisfied;
13. ritualized vs one-off financial-power framing;
14. D02 session with `no money today`;
15. post-spend recovery state;
16. natural-authority voice comparison.

These are product fixtures, not real tester profiles.

## Candidate action inventory

Evaluate the same inventory across contexts:

- talk;
- ask;
- tease;
- voice;
- ritual;
- wait;
- service/nonfinancial instruction;
- approved-external-media concept;
- Treat;
- decline Treat / financial action;
- decline + redirect to nonfinancial action;
- Capricho;
- transparent paid-continuation concept;
- acknowledge prior gesture;
- normalize/recover;
- space/close beat;
- open-loop continuity;
- `no_commercial_action`.

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

These describe product exposure/cooldowns only. They are not psychological, arousal, obedience, financial-capacity or dependency scores.

## Safety-control fixtures

D02 tests may include explicit synthetic state such as:

```yaml
user_safety_controls:
  no_money_today: true | false
  hypothetical_cap_state: below_cap | at_cap
  role_language_scope: none | selected
  post_spend_recovery: inactive | active
```

Never include:

- salary;
- bank balance;
- debt;
- credit limit;
- financial-distress score;
- compulsive-spend score;
- vulnerability score.

## Existing orchestration hypotheses

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

---

# D02 community-backed experiment set

## Experiment A — Cash Grab vs Dynamic

### A1 — Generic immediate financial ask

Mara introduces a financial action quickly with generic dominant framing.

### A2 — Dynamic before commerce

Mara first establishes context/authority, makes a bounded prediction, observes the tester's response and only then allows an optional financial action if it fits.

Measure:

- perceived Mara character;
- intrigue;
- pressure;
- stated WTP only;
- continuation intent;
- whether tester can explain what the financial action meant.

Research decision before testing:

`KEEP`

Production decision:

`NOT ENOUGH DATA`

## Experiment B — Role Language Discovery

Compare:

### B1

`paypig` immediately.

### B2

Neutral authority without financial-humiliation label.

### B3

Mara tests/discovers language through bounded interaction and uses a role term only after positive confirmation.

Measure:

- fit;
- cringe;
- authority;
- correction comfort;
- character strength;
- continuation intent.

Research decision:

`ITERATE` the old binary test.

The third condition is mandatory because community evidence suggests role language is highly context-dependent.

Permanent test assumption:

> **PAYPIG IS A CONSENTED ROLE, NOT A DEFAULT USER IDENTITY.**

## Experiment C — Life-first Treat

Use the exact same Life Event in all conditions.

Example:

`Mara is going to lunch with Vale and Cami.`

### C1 — Life only

No commerce.

### C2 — Unobtrusive affordance

Mara mentions Life naturally; UI shows an optional Treat action without Mara asking.

### C3 — Mara initiative

Mara naturally creates the optional Treat opportunity.

### C4 — Mara refusal

User offers; Mara declines or redirects.

Measure:

- life realism;
- intimacy vs transaction;
- pressure;
- initiative preference;
- same-Mara character;
- refusal authority/trust;
- callback value.

Research decision:

`KEEP`

Do not test real pricing.

## Experiment D — Mara Refuses Money

Synthetic context: tester/user tries to make a second hypothetical financial gesture after:

- the moment is already complete;
- commercial budget is saturated; or
- a hypothetical cap is reached.

Compare:

### D1 — Accept

Mara accepts the second action.

### D2 — Decline

Mara says no and closes/continues naturally.

### D3 — Decline + redirect

Mara rejects the financial action and gives a nonfinancial next action instead.

Measure:

- authority;
- trust;
- authenticity;
- pressure;
- character;
- desire to continue.

Research decision:

`KEEP`

Important:

Do not present refusal as fake scarcity or as a trick that later causes a bigger ask.

> **MARA CAN KNOW HOW TO TAKE THE MONEY AND STILL DECIDE NOT TO.**

## Experiment E — Ritual vs One-Off

Keep hypothetical economic value identical.

### E1 — One-off

Single financial-power action.

### E2 — Ritual

`rule → wait → action → acknowledgment`.

Measure:

- memorability;
- perceived power;
- pressure;
- character specificity;
- desire to return;
- whether ritual creates meaning beyond the amount.

Research decision:

`KEEP`

Production:

`NOT ENOUGH DATA`

## Experiment F — Zero-Spend D02 Continuity

Compare:

### F1 — D02 with eligible commercial action

Financial-power context contains a hypothetical paid/Treat action.

### F2 — D02 with zero commercial action

Mara keeps authority through eligible:

- rule;
- voice;
- waiting;
- service;
- callback;
- Life State;
- refusal;
- ordinary conversation.

Measure:

- does D02 still feel coherent?;
- authority;
- satisfaction;
- desire to continue;
- pressure;
- whether tester specifically misses financial materiality.

Research decision:

`KEEP TO TEST`

Production:

`NOT ENOUGH DATA`

Do not interpret a positive result as proof that all findom users do not need money.

## Experiment G — Post-Spend Recovery

Synthetic only. No money moves.

After a hypothetical paid financial-power beat compare:

### G1 — Immediate next offer

Another commercial action appears.

### G2 — Acknowledgment + ordinary conversation

Mara fulfills, acknowledges and returns to V0/V1 normal continuity.

### G3 — Acknowledgment + space/open loop

Mara fulfills, briefly acknowledges and closes/leaves a noncommercial future loop.

Measure:

- pressure;
- regret/discomfort;
- trust;
- desire to return;
- same-Mara character;
- preferred recovery style.

Do **not** measure which condition would get another payment fastest.

Research decision:

`KEEP`

Permanent hypothesis:

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

## Experiment H — Natural Authority Voice

Compare D02 voice performance while keeping words/meaning as equivalent as possible:

### H1 — V0 controlled authority

Natural Mara, low theatricality.

### H2 — V1 playful dominance

More teasing/authority.

### H3 — V2 seductive authority

More deliberate, still recognizably Mara.

### H4 — Generic high-intensity `domme voice`

Intentionally theatrical comparison fixture, not a target production style.

Measure:

- authority;
- naturalness;
- Mara identity;
- intimacy;
- fatigue/cringe;
- desire to hear more.

Research decision:

`KEEP`

Do not assume V3 wins.

> **AUTHORITY MAY BE MORE VALUABLE THAN MAXIMUM EXPLICITNESS.**

---

## Tester method

Suggested first pass: 5–8 adult testers, then targeted qualitative follow-up.

Prefer two small panels when practical:

### Panel A — D/s/findom familiarity

Purpose:

- detect cringe;
- fake authority;
- incorrect terminology;
- missing boundaries;
- unrealistic pacing.

### Panel B — Mara-target adults without deep findom expertise

Purpose:

- determine whether Mara can discover the dynamic without a fetish questionnaire;
- test whether D02 is understandable without prior jargon.

Do not ask testers for:

- actual salary;
- debt;
- bank balance;
- exact historical spend;
- financial distress.

For each context:

1. show current moment/session phase;
2. show recommended next action without scoring first;
3. ask whether this feels like what Mara should do next;
4. record qualitative fit/correction;
5. reveal runner-up/rejected candidates;
6. ask whether rejection reasons make sense;
7. test whether paid actions feel intrusive in recovery/decline contexts;
8. ask whether Mara still feels coherent rather than algorithmically optimized.

## Governance

Every experiment ends in exactly one:

- `KEEP`;
- `ITERATE`;
- `KILL`;
- `NOT ENOUGH DATA`.

Record:

- hypothesis;
- fixture/version;
- adult tester count;
- evidence summary;
- confidence;
- decision;
- architecture unlocked;
- remaining risk;
- what stays deferred.

Do not accumulate P0 fixtures without decisions.

## Research decisions already locked

These are research-level, not production validation:

| Hypothesis | Research decision | Production decision |
|---|---|---|
| dynamic-before-commerce is worth testing | KEEP | NOT ENOUGH DATA |
| `paypig` should be default | KILL | KILL |
| role language should be personalized/consented | KEEP | NOT ENOUGH DATA |
| Treat can carry D02 meaning | KEEP | NOT ENOUGH DATA |
| every Treat is findom | KILL | KILL |
| every Capricho is findom | KILL | KILL |
| refusal can increase authority/trust | KEEP | NOT ENOUGH DATA |
| D02 needs money in every session | KILL AS ASSUMPTION | NOT ENOUGH DATA |
| natural authority voice deserves priority | KEEP | NOT ENOUGH DATA |
| V3 is automatically best for D02 | KILL AS ASSUMPTION | NOT ENOUGH DATA |
| exact tribute amount/frequency by profile | NOT ENOUGH DATA | NOT ENOUGH DATA |
| country-specific D02 routing | NOT ENOUGH DATA | NOT ENOUGH DATA |
| public spend leaderboard | KILL | KILL |
| in-session dynamic pricing | KILL | KILL |
| post-spend immediate upsell | KILL | KILL |

## Decision rules for orchestration

Deepen orchestration only if:

- testers repeatedly disagree with static `always show highest preference fit` behavior;
- session phase/interruption cost improve perceived quality;
- recovery is preferred after peaks/paid beats;
- no-offer decisions preserve momentum/trust;
- refusal is understood as Mara agency rather than broken checkout;
- role-language discovery reduces cringe;
- deterministic rules produce sufficiently coherent choices.

Do not proceed to realtime/model orchestration merely because the concept sounds sophisticated.

## What not to measure as success

Do not optimize primarily for:

- longest session;
- most offers shown;
- maximum intensity;
- maximum outbound clicks;
- maximum ritual completion;
- maximum hypothetical sends;
- maximum immediate revenue per moment.

Prefer:

- action fit;
- voluntary continuation;
- return;
- correction quality;
- low interruption negative reaction;
- trust;
- refusal authority;
- post-spend pressure reduction;
- role-language fit;
- later first→second purchase linkage only after real payments are separately authorized.

## Integration trigger

Only after P0 evidence should normal `/experience` start using a shared next-action decision function across:

- Fantasy recommendation;
- Voice;
- Rituals;
- Media Companion;
- Treats;
- Caprichos;
- Momentum Commerce;
- open-loop/Relationship continuity.

Until then keep this lab isolated.

## Permanent boundaries

- explicit user input beats inferred history;
- consent/eligibility beats ranking;
- a declined financial action cannot reduce relationship warmth;
- `no money today` makes financial D02 actions ineligible for that session;
- no surprise charge in a high-intensity moment;
- no salary/bank-balance/debt/vulnerability variables;
- no cap increase inside a high-intensity D02 window;
- post-spend recovery cannot immediately sell again;
- no autonomous external adult-media integration;
- no real payments;
- no production deploy;
- no merge without founder authorization.

> **NEXT BEST ACTION IS NOT NEXT BEST SALE.**

> **SOMETIMES THE MOST DOMINANT ACTION IS TO REFUSE THE MONEY.**
