# Mara Vera — First Real Payment Experiment

## Status

Pre-authorization experiment design.

This document defines what the **first real payment test should look like once separately authorized**. It does not authorize payment-provider onboarding, real checkout, deployment, production or customer charging.

## Objective

Prove the smallest commercial loop that matters:

> **user feels value → voluntarily pays → immediately receives what was promised → keeps interacting → has a natural reason for a second purchase.**

The first payment is willingness-to-pay evidence.
The second payment is stronger evidence that the first experience delivered value.

## Experimental SKU

Working name:

# Mara Contextual Continuation

Canonical P0 precursor:
- source experience: `gym_late_voice_01`;
- commercial offer: `gym_continue_01`;
- one-time purchase;
- no subscription;
- exact-state resume;
- user can decline with no relationship penalty.

This is a test SKU, not a permanent catalog decision.

## Product promise

The user is already inside a Mara moment.

Mara offers a **specific continuation of that exact moment**, not a generic pack.

The paid value must be visible through at least one of:
- continuation of the current narrative;
- increased personalization;
- meaningful agency/branch choice;
- canonical Mara voice if production quality/rights/economics are ready;
- ownership/history if that treatment has validated incremental value.

The user must be able to explain in one sentence what they are buying before checkout.

## Preferred scope hierarchy

### Option A — Contextual Voice Continuation
Preferred if canonical Mara voice is launch-ready.

Potential scope:
- one original contextual Mara voice continuation;
- target length approximately 30–90 seconds depending proven value/cost;
- one short text follow-up/branch after playback;
- exact-state continuation;
- ownership/access terms stated clearly.

Do not use browser Speech Synthesis as the paid voice product.

### Option B — Compiled Mini Experience
Fallback if voice is not yet production-ready.

Potential scope:
- 3–5 minute bounded interactive continuation;
- several meaningful text/story beats;
- one user branch/agency choice;
- preference/context-aware adaptation;
- no claim of realtime relationship memory beyond actual supported state.

### Option C — Build It Mini
Secondary candidate if agency materially outperforms passive continuation.

Potential scope:
- user chooses 2–4 bounded variables;
- Mara compiles the result;
- visible outcome difference;
- clear finite scope.

Do not launch all three simultaneously for the first payment test.

## Price

Do not freeze price from intuition.

Current pre-payment WTP buckets:
- US$7.99;
- US$12.99;
- US$19.99.

Selection rule:

Choose the price that best balances:
- stated WTP;
- post-price continuation;
- qualitative value clarity;
- expected second-purchase potential;
- actual contribution margin with contracted processor/fulfillment costs.

A high stated-WTP price that kills continuation or cannot support fulfillment is not the winner.

## Commercial treatment

Before pricing is finalized, first select the commercial presentation treatment from P0:
- A — offer only;
- B — offer + payoff/reward contract;
- C — offer + payoff/reward + ownership/history.

Then freeze the treatment during price comparison.

Do not simultaneously vary treatment + price in the first WTP test.

## Reward

If the winning treatment includes reward:
- reward must belong to the experience;
- reward should be contextual and earned;
- reward can include praise/teasing/acknowledgement/progression where appropriate;
- payment itself does not change baseline affection or relationship stage.

Examples such as `Good boy` are eligible only when the interaction dynamic supports them.

## Checkout contract

Before checkout the user sees:
- exact price;
- one-time vs recurring status;
- exact scope;
- ownership/access terms;
- expected delivery timing;
- refund/support link.

No ambiguous “unlock premium” copy.

## Successful-payment contract

Target sequence:

**provider confirms success → server verifies transaction → entitlement created → original resume state restored → Mara reacts → promised value begins immediately → continuation becomes available**.

The first visible screen after success should feel like Mara, not an ecommerce receipt.

Transaction/legal information remains accessible separately.

## Declined/cancelled-payment contract

If checkout is cancelled or payment fails:
- no entitlement;
- no reward delivery;
- no relationship penalty;
- Mara does not become colder because of payment status;
- user returns safely to the experience;
- offer may remain available under truthful availability terms.

Never monetize payment failure emotionally.

## Fulfillment SLA

The SKU must state whether value is:

### Immediate
Generated/delivered synchronously after payment.

or

### Manual/asynchronous fulfillment
Only if the product genuinely requires manual production/review and the promised delivery window is explicit before purchase.

For the first experiment prefer immediate or near-immediate fulfillment because Momentum Commerce is a core thesis.

Do not promise instant custom voice if manual QC makes that false.

## Fulfillment checklist

For each delivered unit record internally:
- transaction ID/provider reference;
- SKU;
- price;
- generation start/end;
- generation provider/model/version if used;
- generation cost;
- human review minutes;
- approval/rework count;
- delivery status;
- playback/completion where applicable;
- continuation opened;
- refund/support outcome.

Do not send intimate raw content into generic analytics.

## Unit-economics gate

Before launch use actual quotes/contracted costs.

At the current P0 65% contribution-margin design target, approximate maximum total variable cost is:
- US$7.99 price → ~US$2.80 max variable cost;
- US$12.99 → ~US$4.55;
- US$19.99 → ~US$7.00.

This variable-cost envelope must cover, as applicable:
- processor effective variable cost;
- generation;
- human QC;
- support/refund expectation;
- delivery/storage;
- fraud/chargeback expectation.

Rolling reserves and fixed card-brand/setup fees are modeled separately as cash-flow/fixed-cost constraints.

The 65% target is an early design target, not a permanent accounting policy.

## First → second purchase design

Do not make purchase #2 random.

The first product should create a legitimate next edge such as:

### Continuation → next episode
User finished a bounded continuation and can later choose another episode.

### Voice → contextual follow-up
User valued voice and later receives an eligible related voice opportunity.

### Mini experience → Build It
User wants more agency over the next experience.

### Collection-linked experience → next collection item
Only if collection/ownership proved valuable.

Never create a fake cliffhanger where the paid product feels intentionally incomplete.

Purchase #1 must deliver its full stated value by itself.

## Second-purchase metric

Primary commercial proof after basic payment integrity:

# First Payer → Second Payer

Track:
- percentage of first buyers who buy again;
- time to second purchase;
- same-family vs cross-family second purchase;
- first SKU → second SKU path;
- satisfaction after first purchase;
- refunds/disputes;
- contribution margin on both purchases.

Do not optimize only for first-purchase conversion.

## Sample experiment sequence

### Stage 0 — current P0
- A/B/C qualitative treatment test;
- WTP price test;
- unit-economics modeling;
- provider/compliance due diligence.

### Stage 1 — first authorized payment
One SKU.
One price/cohort rule.
One processor.
One launch jurisdiction set.
Small bounded user cohort.

### Stage 2 — delivery proof
Validate:
- payment success;
- entitlement;
- exact-state resume;
- immediate payoff;
- satisfaction;
- contribution margin;
- no broken decline/cancel flow.

### Stage 3 — second-payment proof
Expose one natural continuation opportunity after value has been delivered.

### Stage 4 — only then expand
Consider:
- voice upgrade;
- Build It;
- collection;
- custom;
- membership;
- real scarcity.

## Stop conditions

Pause the real-payment experiment if:
- processor flags the business/model;
- age/compliance requirements are not met;
- entitlement/payment state is unreliable;
- refunds/chargebacks are unexpectedly high;
- users misunderstand what they bought;
- fulfillment quality is inconsistent;
- contribution economics are structurally poor;
- commercial moments materially damage Mara retention/trust.

## Acceptance gate before charging the first user

All must be true:
- winning A/B/C treatment chosen;
- candidate price chosen from evidence;
- SKU scope frozen;
- processor has explicitly accepted actual Mara scope/entity;
- provider fees/reserves modeled;
- fulfillment quality passes internal review;
- adult/AI/age/privacy/refund terms complete;
- exact-state success path tested;
- cancel/decline safe return tested;
- entitlement source of truth defined;
- support/refund workflow defined;
- founder explicitly authorizes payment provider;
- founder explicitly authorizes real payment activation;
- founder explicitly authorizes deployment/production as needed.

## Permanent principle

> **The first paid product should feel like the next natural sentence in an experience that was already worth continuing.**
