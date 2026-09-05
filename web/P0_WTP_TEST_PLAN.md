# Mara Vera — P0 Willingness-to-Pay Test Plan

## Purpose

Estimate **stated willingness to pay** for one controlled Mara product before authorizing real payments.

This is not a revenue experiment and must never be reported as conversion.

## Entry gate

Run this only after the A/B/C Momentum Commerce sanity test has identified which commercial treatment to keep testing.

Do not change reward/ownership treatment and price at the same time in the primary WTP comparison.

## Canonical product

DEV route:

`/experience/wtp-lab`

Fixture:

`gym_late_voice_01 → gym_continue_01`

Same:
- Mara context;
- product scope;
- one-time purchase semantics;
- continuation promise;
- no real scarcity;
- no checkout.

Only primary variable:

**displayed hypothetical price**.

## Price buckets

One tester/session sees one price:

- `P1_low` → `US$7.99`
- `P2_core` → `US$12.99`
- `P3_high` → `US$19.99`

Never show all three in the primary comparison.

These are hypotheses, not Mara launch prices.

## Why these buckets

Directional market anchor as of 2026-09-02:
- Fanvue reports roughly `US$9.99–15` as a strong subscription range in its platform guidance;
- Fanvue's PPV guide recommends roughly `US$10–15` as a sensible floor for inexpensive PPV.

Mara tests below/near/above this region because its product is not a conventional static creator post: it combines context, interaction, continuity and potentially voice/ownership.

External creator benchmarks do not substitute for Mara purchase evidence.

## Tester flow

For each tester:
1. open `/experience/wtp-lab` in development;
2. use the DEV panel to force `P1_low`, `P2_core` or `P3_high`;
3. forcing the price clears the safe event log and starts a clean session;
4. tester sees exactly one hypothetical one-time price;
5. tester chooses:
   - `Sí, a ese precio seguiría`;
   - `Tal vez / depende`;
   - `No a ese precio`;
6. after the response, `Seguir con Mara` records whether the price exposure preserved momentum;
7. copy the scorecard/log if needed;
8. collect qualitative explanation separately.

## Analytics semantics

Events:
- `wtp_price_assigned`;
- `wtp_price_shown`;
- `wtp_response_yes`;
- `wtp_response_maybe`;
- `wtp_response_no`;
- `wtp_post_price_continued`.

A `yes` means only:

> **tester stated they would continue at that hypothetical price.**

It does not mean:
- purchase;
- checkout start;
- conversion;
- payer;
- revenue;
- entitlement.

## Directional scorecard

For each bucket compare:
- exposures;
- yes;
- maybe;
- no;
- post-price continuation;
- qualitative value clarity;
- qualitative price reaction.

Small samples are for obvious directional signal only.

Suggested first pass:
- 3–5 testers per bucket after A/B/C treatment is frozen.

Do not claim elasticity from this sample.

## Qualitative questions

Ask after the choice:
1. What did you think you were buying?
2. Did the price feel cheap, fair, expensive or impossible to judge?
3. What would have made the value clearer?
4. Did seeing a price change how Mara felt?
5. Would voice/personalization/ownership materially change what you would pay?
6. What would make this worth buying a second time?

Do not record intimate preference details in generic analytics.

## Decision rule

Do not pick the highest price merely because a tiny sample says yes.

Prefer a bucket that balances:

**stated WTP × value clarity × post-price continuation × plausible margin × second-purchase potential**.

If `P3_high` has fewer yes responses but much stronger perceived premium value, it may deserve a different product tier rather than becoming the base price.

If `P1_low` creates high yes intent but users perceive the product as cheap/commodity, do not automatically choose it.

## Product ladder after price learning

Only after the canonical WTP test is directional:
- impulse/text continuation: test around `US$4.99–7.99`;
- voice/richer continuation: test around `US$9.99–14.99`;
- personalization/agency: test around `US$14.99–29.99`;
- custom/high scope: test around `US$39.99–79.99+` if fulfillment economics justify it;
- membership: test later, not before recurring value exists.

These are experiment bands, not a public price list.

## Real-payment transition

Stated WTP cannot validate price by itself.

Before real payment:
- processor/business model compliance review;
- exact SKU scope;
- real fulfillment path;
- contribution-margin estimate;
- refunds/chargebacks policy;
- taxes/final-price disclosure;
- exact-state checkout resume;
- founder authorization.

The first real test should preserve:

**context → clear price → checkout → exact-state resume → immediate payoff → continuation → second-purchase opportunity**.

## Permanent boundary

No individualized price changes based on:
- affection/relationship state;
- loneliness;
- distress;
- debt;
- sexual arousal;
- inferred dependence;
- prior refusal;
- perceived desperation.

Price can vary only through explicit SKU/scope/cohort/market rules that are transparent and commercially defensible.
