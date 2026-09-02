# Mara Vera — Pricing & Willingness-to-Pay Architecture

## Status

Authoritative pricing-learning layer for the Foundation outcome. It does **not** authorize real payments, production prices, individualized pricing, discounts, scarcity claims, a payment processor or launch.

## Objective

Find the highest **healthy willingness to pay** for Mara experiences while preserving momentum, repeat purchase, trust and contribution margin.

The core question is not:

> How high can we price this user?

It is:

> **What product/scope/format creates enough perceived value that a clear, transparent price feels natural and the user still wants to continue with Mara afterwards?**

Pricing must therefore be learned together with:
- product scope;
- modality;
- personalization depth;
- agency/control;
- ownership;
- continuation;
- operational cost;
- repeat purchase.

## Permanent pricing principles

1. **Price the product, not the user's vulnerability.**
2. **Same applicable SKU/cohort = same price/terms.**
3. No hidden individualized price discrimination based on relationship state, arousal, loneliness, distress, debt, spending compulsion or inferred dependence.
4. More expensive should mean visibly more scope, personalization, modality, exclusivity, priority or operational cost.
5. No fake crossed-out prices or fake discounts.
6. No surprise charge inside an emotionally intense/adult moment.
7. Pricing tests must not alter Mara's baseline respect/affection.
8. Real price changes require clear terms and, for recurring products, explicit renewal/cancellation disclosure.
9. **First payment is evidence of willingness. Second payment is stronger evidence of delivered value.**
10. Optimize contribution margin and repeat value, not gross ticket alone.

## External creator-market anchor — directional only

As of 2 September 2026, current Fanvue guidance says:
- subscription prices of roughly **US$9.99–15** perform best on average in its creator data;
- subscriptions are only a minority of early creator earnings in its sample, with paid messages producing a much larger share;
- its PPV guide recommends roughly **US$10–15 as a sensible floor** for the cheapest PPV item rather than anchoring value too low;
- Fanvue allows paid posts across a much wider range, so these figures are guidance, not platform constraints on Mara.

Sources used as market anchors:
- Fanvue Help Centre — Subscription Pricing & Retention Guide, accessed 2026-09-02.
- Fanvue Help Centre — PPV Media: A Creator's Strategy Guide, accessed 2026-09-02.

These benchmarks are **not Mara prices**. Mara must validate its own willingness to pay because its value proposition is different: character + voice + interaction + personalization + continuity + ownership/shared history.

## Initial product-value ladder — hypothesis, not price list

The point is to create testable bands, not to publish a catalog.

### Tier A — impulse continuation
Examples:
- short text continuation;
- small branch unlock;
- short contextual reveal.

Initial test band:
- **US$4.99–7.99**

Reason to test below creator PPV anchors: Mara may support smaller, high-frequency conversational purchases with low marginal cost.

### Tier B — voice / richer continuation
Examples:
- short voice continuation;
- contextual audio;
- stronger narrative payoff;
- ownership of the moment where applicable.

Initial test band:
- **US$9.99–14.99**

This overlaps current creator PPV guidance and is the strongest candidate for the first WTP test.

### Tier C — personalized / agency
Examples:
- preference-aware voice;
- Build It with meaningful control;
- deeper continuation;
- multimodal small experience.

Initial test band:
- **US$14.99–29.99**

The value increase must be visible to the user.

### Tier D — custom / high-scope
Examples:
- manually reviewed custom;
- deeper multi-format output;
- priority fulfillment;
- bounded custom voice/narrative work.

Initial test band:
- **US$39.99–79.99+**

Only test if fulfillment cost, review capacity and quality justify it.

### Membership — later
Hypothesis band only after recurring-value evidence:
- **US$9.99–14.99/month** as a starting benchmark range to test.

Membership should be a base premium layer, not an everything-unlocked ceiling.

## Price ladder logic

The commercial ladder should ideally move through value, not arbitrary upsells:

**small continuation → richer modality → personalization/agency → custom/high scope**.

Do not require every user to climb the ladder.

## First WTP product hypothesis

Use one controlled product first:

### `gym_continue_01`
A contextual continuation attached to the canonical P0 commerce fixture.

Why this product:
- already exists in P0;
- occurs after demonstrated personalization/context;
- is collection-linked for ownership experiments;
- does not require real explicit content;
- can later become voice/mixed-media;
- allows price to be isolated from product differences.

## First pre-payment WTP buckets

For the **same exact product/scope/context**, show one price per tester/session:

- `P1_low` → **US$7.99**
- `P2_core` → **US$12.99**
- `P3_high` → **US$19.99**

Rationale:
- low tests impulse sensitivity below current PPV guidance;
- core sits inside/near current creator PPV guidance;
- high tests whether Mara-specific context/continuity supports a meaningful premium.

Do not show all three prices to the same tester in the primary comparison.

## Pre-payment WTP measurement

Because no money changes hands, this is **stated willingness to pay**, not conversion.

For one displayed price, capture:
- `yes` — “Sí, a ese precio seguiría.”
- `maybe` — “Tal vez / depende.”
- `no` — “No a ese precio.”

Then measure whether the user continues with Mara after answering.

Do not call `yes` a purchase.
Do not call the percentage a conversion rate.
Do not project revenue directly from stated WTP.

## Why not ask “what would you pay?” first

Open-ended willingness questions are useful qualitatively but can create unrealistic anchors and make cross-user comparison noisy.

P0 priority:
1. one real-looking but clearly hypothetical price;
2. forced same product/context;
3. yes/maybe/no;
4. continuation after price exposure;
5. qualitative interview afterwards.

Open-ended price comments can be collected manually after the session, outside generic analytics.

## Price exposure contract

A pre-payment test must visibly state:
- exact hypothetical price;
- exact product scope;
- one-time vs recurring;
- no real charge will occur in P0;
- what happens after a future real purchase;
- ownership/access rule.

Character copy can stay Mara-like, but transaction semantics must remain unambiguous.

## WTP test ordering

Do not test reward, ownership, product scope and price simultaneously in the primary price experiment.

Recommended sequence:

1. Determine best A/B/C commercial treatment using same product.
2. Freeze winning treatment.
3. Run price-only P1/P2/P3 comparison on the canonical product.
4. Validate winner again inside normal personalized `/experience` routing.
5. Only then consider a first real-payment test after separate authorization/compliance/provider review.

## WTP metrics

Pre-payment:
- price shown;
- yes / maybe / no;
- yes-rate by price bucket;
- no-rate by price bucket;
- post-price continuation;
- qualitative perceived value;
- “felt too cheap / fair / expensive / unclear” from manual interview;
- whether the user could explain what they would receive.

After future real payments:
- checkout start;
- purchase conversion;
- Purchase Resume Success;
- Post-Purchase Continuation Rate;
- first → second purchase;
- days to second purchase;
- refund/dispute;
- contribution margin;
- repeat modality;
- satisfaction.

## Pricing decision rule

Never choose price solely by highest stated revenue proxy.

A candidate price is stronger when it produces a good balance of:

**WTP × continuation × satisfaction × second-purchase potential × contribution margin**.

A higher price that destroys continuity or repeat may be economically worse than a lower one.

## Price elasticity learning

With enough real volume later, estimate elasticity by SKU/cohort and product scope.

Before that:
- use small controlled buckets;
- avoid false statistical certainty;
- do not dynamically raise price for an individual based on detected intent;
- do not repeatedly expose the same user to escalating prices in one session.

## Localization

P0 may use USD as the canonical benchmark/test currency because creator-market anchors are quoted in USD.

Before real launch:
- display local currency where the authorized processor supports it;
- validate taxes/VAT and final amount display;
- avoid hidden FX surprises;
- maintain a canonical SKU price policy and explicit localization rules.

## Unit economics gate

Before activating a real SKU, model:

**Contribution Margin = price − generation − voice/video − manual review/QC − payment/provider fees − storage/delivery − support/refund cost**.

A product can have strong WTP and still fail if fulfillment is too expensive.

## First real-payment gate

Do not activate merely because stated WTP is positive.

Require:
1. P0 experience itself is credible;
2. commercial treatment does not kill momentum;
3. users understand the offer;
4. a price band has directional support;
5. fulfillment can deliver the promised payoff;
6. contribution margin looks viable;
7. processor/business model review is complete;
8. age/compliance/privacy/terms/refund flows are ready;
9. founder separately authorizes real payment activation.

## Final principle

> **Price should be evidence of value, not a lever for emotional pressure.**

Mara wins when the user thinks:

> “Eso sí vale lo que cuesta porque está hecho para este momento conmigo.”

—not because they fear losing Mara if they do not pay.
