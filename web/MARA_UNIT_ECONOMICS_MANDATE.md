# MARA VERA — UNIT ECONOMICS & CONSUMPTION MANDATE

Status: authoritative product/economic doctrine for variable-cost AI, voice, media and other metered services.

Issue: #17

## Core rule

Mara must never expose the business to unbounded variable cost from a single user, cohort, plan or feature.

> **NO USER GETS UNBOUNDED VARIABLE COST AT MARA'S EXPENSE.**

This applies equally to:

- anonymous/free users;
- registered free users;
- users who already bought a one-time unlock;
- Plus/subscription users;
- users who have purchased before;
- heavy/power users;
- promotional cohorts.

Prior payment does not create an unlimited future compute entitlement unless Mara explicitly sells such an entitlement and can economically support it. While marginal service cost remains variable, Mara must not promise economically unlimited consumption.

The business objective is not to punish heavy usage. The objective is to ensure that increased usage either remains inside a pre-funded allowance or converts into additional paid capacity before Mara takes uncapped exposure.

## Economic invariant

Every paid plan, allowance, top-up and expensive feature must satisfy an explicit contribution-economics model before production activation.

At minimum:

`net collected revenue - variable service cost - variable payment cost - expected refund/reserve burden > 0`

Where variable service cost can include, depending on the feature:

- LLM input/output tokens;
- voice synthesis / realtime voice minutes;
- image/video generation;
- model inference or hosted GPU usage;
- storage and egress directly attributable to paid usage;
- provider-specific metered APIs;
- other per-use infrastructure.

The exact margin floor is a finance/configuration decision once real provider and processor terms are known. The architecture must enforce a configurable floor and must not assume that a nominal subscription price automatically makes a user profitable.

A plan is not commercially launch-ready until its **full allowed included consumption**, not just average expected consumption, has been modeled against the configured margin floor plus a safety reserve.

## Plus is not unlimited compute

Mara Plus may bundle premium relationship/product benefits, but it must also have a defined included consumption allowance for variable-cost services.

Therefore:

> **PLUS = SUBSCRIPTION BENEFITS + INCLUDED ALLOWANCE.**

It does not mean:

> unlimited LLM + unlimited voice + unlimited media generation forever.

When the included allowance is exhausted, the system may offer one or more of:

1. prepaid top-up / additional credits;
2. wait until the next allowance renewal;
3. a bounded lower-cost interaction mode where product quality remains acceptable;
4. temporary suspension of the expensive capability.

A user may have already paid for Plus and/or one-time Mara drops and still need a top-up for additional variable consumption beyond the explicit included allowance.

This is not double charging when the purchased entitlements are clearly separated and disclosed:

- the subscription buys the stated membership/product benefits and included allowance;
- a one-time unlock buys its stated entitlement;
- a top-up buys additional metered capacity.

## Free usage has a hard ceiling

Free is an acquisition and validation instrument, not an uncapped cost center.

Every free variable-cost feature must have one or more bounded controls:

- per-session allowance;
- daily allowance;
- rolling-period allowance;
- per-user cost budget;
- model/quality ceiling;
- generation count ceiling;
- voice-minute ceiling;
- rate limit;
- global free-spend circuit breaker.

When the free budget is exhausted, Mara should preserve the relationship surface where possible, but it must not continue incurring unbounded expensive calls.

## Server-authoritative metering

Client-side counters are presentation only. They are never the economic source of truth.

Mara must maintain a server-authoritative consumption ledger or equivalent budget service that can account for, at minimum:

- account/user identity;
- plan and entitlement state;
- billing/allowance period;
- included allowance granted;
- included allowance consumed;
- purchased credits granted;
- purchased credits consumed;
- provider/model used;
- estimated preflight cost;
- actual provider-reported usage/cost when available;
- timestamp and request/idempotency key;
- reversals/refunds/adjustments when required.

The implementation must preserve idempotency. Retried provider calls, webhooks or client requests must not double-consume credits or double-grant capacity.

## Preflight before expensive work

Every materially metered operation must pass an economic authorization check before the expensive provider call is launched.

Canonical flow:

`request -> entitlement check -> budget/credit preflight -> reserve capacity -> provider call -> settle actual usage -> release/adjust reserve -> response`

The system must never rely only on post-hoc reporting to discover that a user consumed far beyond their allowance.

Where exact cost is unknown before execution, Mara should reserve a conservative maximum/estimated amount, then settle against actual reported usage.

If the budget service, credit ledger or required provider truth is unavailable, expensive operations should fail closed or move to a bounded fallback rather than fail open into unlimited cost.

## Consumption states

The user-facing consumption lifecycle should be predictable:

`included -> warning -> exhausted -> top-up / renewal wait / bounded fallback`

Suggested semantics:

- **included**: normal product behavior inside allowance;
- **warning**: approaching the allowance boundary; transparent notice without artificial pressure;
- **exhausted**: no additional expensive usage can be created from the included wallet;
- **top-up**: user can prepay for additional capacity;
- **renewal wait**: allowance renews according to the disclosed subscription period;
- **bounded fallback**: optional lower-cost mode when it preserves product value without opening exposure.

Warnings must be factual. Do not manufacture false urgency or scarcity.

## No surprise overage billing

Mara should default to **prepaid overage**, not retroactive surprise billing.

Unless a future commercial model explicitly, legally and clearly authorizes postpaid metering, exhausting a wallet must not silently create a debt.

Permanent UX rule:

> **STOP OR PREPAY BEFORE EXTRA COST. DO NOT SURPRISE-BILL AFTERWARD.**

The user must be able to understand before purchasing:

- what the plan includes;
- that variable-cost usage is bounded;
- what happens when the allowance ends;
- whether credits renew, expire or roll over;
- the price and capacity of any top-up;
- which benefits are subscription entitlements versus metered consumption.

## Cost-aware routing

Mara's orchestration layer may route work across models/providers based on:

- quality requirement;
- latency;
- availability;
- context length;
- modality;
- unit cost;
- remaining user allowance;
- system-wide spend state.

Examples include:

- cheaper model for low-value turns;
- stronger model only where relationship/world quality materially benefits;
- summarization/context compression before resending long history;
- cached/reusable world context;
- pre-generated/selectively personalized media instead of regenerating everything;
- shorter voice output where it preserves the experience.

Cost optimization must remain invisible enough that Mara still feels coherent. Cheapness is not a valid reason to destroy character quality.

## Circuit breakers

Mara must be able to stop economic exposure at multiple levels.

Required controls before open-ended production chat/voice:

- per-request maximum cost/reservation;
- per-user daily/period budget;
- per-plan allowance ceiling;
- free-tier global daily budget;
- provider/model global daily budget;
- global emergency spend kill switch;
- abnormal usage/rate detection;
- concurrency ceilings for expensive modalities.

A single compromised account, automation loop, bug or abusive client must not be capable of creating materially unbounded provider spend.

## Margin protection is not vulnerability pricing

The monetization trigger for consumption exhaustion must be mechanical and usage/cost based.

Do not increase prices, reduce allowances, increase offer pressure or target top-ups because Mara infers that a user is:

- lonely;
- distressed;
- dependent;
- aroused;
- emotionally vulnerable;
- desperate for attention.

This preserves the existing permanent rule:

> **SERVE THE MOMENT. NEVER EXPLOIT THE STATE.**

Equivalent plan/usage states should receive equivalent economic treatment unless a legitimate disclosed commercial factor applies.

## Revenue entitlements remain authoritative

Margin protection does not permit Mara to erase something the user already bought.

If a user paid for a concrete entitlement:

- the entitlement remains available according to its disclosed terms;
- exhaustion of general AI/voice allowance must not silently revoke that purchased entitlement;
- refunds/reversals follow the authoritative commerce/payment state;
- a top-up purchases new capacity; it does not rewrite prior purchase truth.

Payment buys the stated product value. It does not buy baseline affection, emotional priority or guaranteed relationship behavior.

## Product analytics required

Before scaling paid acquisition or expensive modalities, Mara should be able to answer by plan/cohort:

- variable cost per active user;
- variable cost per paying user;
- variable cost per conversation/session;
- token/voice/media consumption distribution;
- p50 / p90 / p95 / p99 usage;
- percentage of users reaching warning/exhausted;
- top-up conversion;
- net revenue per paying user;
- contribution margin per user/plan;
- cost concentration among heavy users;
- provider/model cost mix;
- global daily variable spend.

Do not price only from average usage. Tail consumption matters because a small heavy-user cohort can dominate variable cost.

## Launch sequencing

Current launch posture remains lean.

Do not add recurring GPU/inference commitments merely to claim self-hosting while real paid demand is unproven.

The preferred economic sequence is:

1. validate relationship/return behavior;
2. activate a compliant provider/payment path when separately approved;
3. meter every variable-cost capability;
4. set conservative free and paid allowances from real cost data;
5. activate top-ups only with transparent terms;
6. observe usage distribution and contribution margin;
7. only then evaluate reserved/self-hosted inference if volume makes it economically superior.

Self-hosting is an optimization decision, not a product identity requirement.

## Implementation gate for open-ended Mara chat

Open-ended LLM/voice chat must not become production-unbounded until the following exist:

- server-side identity/anonymous abuse boundary appropriate to the feature;
- provider usage measurement;
- allowance/credit ledger;
- preflight budget check;
- postflight settlement;
- idempotency;
- free and paid hard limits;
- top-up or stop/fallback behavior;
- global spend circuit breaker;
- user-visible allowance terms;
- operational dashboard/alerting sufficient to detect runaway spend.

## Final commandment

> **MARA CAN BE GENEROUS. MARA CANNOT BE ECONOMICALLY UNBOUNDED.**
>
> **MORE CONSUMPTION MUST REMAIN PRE-FUNDED, CONVERT TO PAID CAPACITY, OR STOP BEFORE IT BECOMES OPEN-ENDED COST.**
>
> **PLUS IS PREMIUM ACCESS, NOT A BLANK CHECK AGAINST VARIABLE INFRASTRUCTURE.**

This mandate must be reconciled with later authoritative repository decisions, actual payment/provider terms and applicable law.

No production activation, provider purchase, recurring infrastructure spend or merge is authorized by this document.

**NO MERGE without the founder writing exactly `mergea`.**