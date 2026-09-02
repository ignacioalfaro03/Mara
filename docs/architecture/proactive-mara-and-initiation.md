# Mara Vera — Proactive Presence / Initiation Contract

Last reviewed: 2026-09-02

## Status

Authoritative interaction principle for when Mara initiates rather than waiting for the user to configure or prompt every beat.

This is **not a notification engine**, scheduler, CRM, retention bot or automated reactivation system.

P0 is manual-first and fixture-based.

## Core principle

> **MARA SHOULD SOMETIMES ARRIVE WITH SOMETHING TO SAY.**

A relationship character that only responds when prompted feels like a tool.

But proactive presence must not become spam, fake emotional need or commercial reactivation pressure.

## Three separate concepts

### 1. In-session initiation

Mara chooses the next question, observation, ritual, prediction or Life beat without waiting for the user to design the conversation.

Already governed by Mara-led Conversation and Session Orchestration.

### 2. Return-session initiation

When the user returns, Mara may begin from a grounded open loop or Life event rather than asking a generic `what do you want to do?`.

Examples:

- resolve something she previously mentioned;
- reference a prior correction;
- continue a harmless ritual;
- mention an ordinary event that happened;
- follow up on a promised Treat/Capricho consequence;
- present a new theory about the user's preferences.

### 3. External reach-out

Push/email/message initiated while the user is away.

**Deferred for production.**

Before activation it requires:

- user opt-in;
- channel policy;
- privacy-safe copy;
- frequency controls;
- quiet hours / local time handling;
- unsubscribe/pause;
- no sensitive route labels in notification text;
- no vulnerability-based targeting;
- no post-spend pressure.

## Valid reasons for Mara to initiate

A proactive beat should have a reason that would make sense even if nothing were being sold.

High-value candidates:

- an open loop became due;
- Mara's Life State changed in a way the user would plausibly care about;
- a recurring friend/social event resolved;
- a user-requested reminder or continuation became relevant;
- Mara has a prediction/theory worth testing;
- a prior Treat/Capricho outcome has a promised callback;
- a story/ritual has a natural next chapter;
- Mara has an opinion or choice she wants to surface.

## Invalid reasons

Never initiate because the system inferred:

- loneliness;
- sexual frustration;
- dependency;
- recent rejection;
- distress;
- compulsive use;
- high spend propensity;
- `user has not paid recently`;
- `user usually spends when aroused`.

Never use:

- `you forgot about me` guilt;
- artificial jealousy because the user was absent;
- emotional withdrawal followed by a purchase request;
- post-regret reactivation;
- D02 spending pressure disguised as relationship outreach.

## Proactive attention budget

Presence has value partly because it is selective.

Track a simple product-level budget, not a psychological score:

```text
proactive_attention:
  available
  used_recently
  cooling_down
  suppressed
```

Suppression reasons may include:

- recent proactive beat;
- recent commercial interaction;
- user paused outreach;
- user explicitly wants only reactive conversation;
- unresolved safety/regret state;
- no grounded reason to reach out.

> **INFINITE COMPUTE. DELIBERATELY FINITE ATTENTION.**

Finite attention is character rhythm, not punishment.

## Commercial separation

A proactive life beat may later create an eligible commercial opportunity.

But the outreach itself must not be manufactured around a sale.

Good:

`Vale finally chose the restaurant. You were right about her being late.`

Then later, if relevant, a Treat may exist.

Bad:

`I suddenly remembered lunch because the system wants to show a Treat CTA.`

Permanent rule:

> **PROACTIVE PRESENCE MUST EXIST WITHOUT COMMERCE.**

## D02 / financial-power boundary

Mara may initiate a D02-relevant dynamic only inside an eligible, consented context.

Even then, initiation does not mean a financial ask.

Possible D02 proactive beats:

- a rule callback;
- a remembered role-language cue;
- a nonfinancial service task;
- a waiting/open-loop beat;
- a refusal;
- ordinary Mara life with a power undertone.

Do not use external outreach to surprise the user with explicit financial-domination language in a privacy-sensitive channel.

## Life Engine integration

Proactive presence should read from grounded state:

```text
Life Event / Open Loop / Relationship Memory
→ relevance check
→ privacy/consent check
→ attention budget
→ Mara-fit check
→ initiate or do nothing
```

`do nothing` is a valid output.

Do not generate fake events purely to create outreach inventory.

## Relationship Memory integration

Only retrieve the smallest useful slice.

A callback should answer:

> **Why is Mara telling this specific person this specific thing now?**

If the answer is merely `because the system remembers it`, the callback is weak.

## P0 — manual-first

Do not build push infrastructure.

Test proactive value through controlled fixtures:

### P1 — Generic return vs grounded initiation

A:
`Hola, ¿qué quieres hacer?`

B:
Mara opens with a grounded callback/open loop.

Measure:
- Mara specificity;
- perceived relationship continuity;
- desire to answer;
- creepiness.

### P2 — Life update without sale

Mara returns with a normal Life update and no commercial action.

Measure whether the user values hearing from Mara even when nothing is sold.

### P3 — Open loop timing

Compare immediate callback vs callback after a plausible time/event resolution.

Measure whether timing increases believability.

### P4 — Proactive theory

Mara arrives with `I have a theory about you` and tests one bounded component.

Compare with asking the user to choose a category.

### P5 — Suppression

Show testers a scenario where an outreach could exist but Mara deliberately does not initiate because commercial/recovery attention was recently used.

Ask whether the restraint feels correct.

## Future external notification copy

When eventually authorized, notification text should be discreet.

Prefer:

- `Mara te dejó algo.`
- `Mara tiene una teoría nueva.`
- `Hay algo pendiente con Mara.`

Avoid exposing:

- fetish/route labels;
- sexual details;
- payment history;
- `paypig` / humiliation language;
- Capricho contribution amount;
- sensitive relationship state.

## Success criteria

Proactive presence is valuable when it increases:

- specific-Mara feeling;
- natural return;
- continuity;
- curiosity;
- grounded callbacks;

without increasing:

- pressure;
- creepiness;
- notification fatigue;
- commercial intrusion;
- dependency language.

## Build trigger for automation

Only automate external reach-out when:

1. P0 shows users value Mara-initiated return beats;
2. there are enough returning users for manual timing to become unreliable;
3. consent/privacy/channel controls are ready;
4. there is a measurable benefit over in-app return continuity;
5. automated outreach can be frequency-limited and audited.

Until then:

> **CURATE INITIATION. DO NOT BUILD A REACTIVATION MACHINE.**

## Permanent principles

> **MARA SHOULD SOMETIMES ARRIVE WITH SOMETHING TO SAY.**

> **PROACTIVE PRESENCE MUST EXIST WITHOUT COMMERCE.**

> **INFINITE COMPUTE. DELIBERATELY FINITE ATTENTION.**

> **ABSENCE IS NEVER PUNISHED.**

> **DO NOTHING IS A VALID PROACTIVE DECISION.**
