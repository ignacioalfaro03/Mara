# Mara Vera — P0 First Payment Readiness

## Purpose

Bridge the gap between **stated willingness to pay** and a future authorized real payment without activating a processor prematurely.

This document does not authorize checkout, charges, provider onboarding, deployment or production.

## Current evidence sequence

1. `/experience/commerce-lab`
   - hold the experience/offer constant;
   - compare A offer-only vs B reward vs C ownership;
   - choose the commercial treatment that preserves desire + Commercial Inertia.

2. `/experience/wtp-lab`
   - freeze the winning commercial treatment;
   - hold the product constant;
   - compare one hypothetical price per tester:
     - P1 = US$7.99;
     - P2 = US$12.99;
     - P3 = US$19.99;
   - record yes / maybe / no + post-price continuation.

3. `/experience/economics-lab`
   - compare the same price buckets against a 65% P0 contribution-margin design target;
   - enter actual variable-cost assumptions only when known;
   - do not invent processor fees.

4. Future authorized real-payment test
   - one SKU;
   - one selected price/cohort rule;
   - one approved processor;
   - small bounded cohort;
   - first payment → exact-state resume → payoff → continuation → second-purchase opportunity.

## Unit-economics lab

The DEV-only economics route uses the pure calculator in:

`lib/p0/unit-economics.ts`

Variable cost categories:
- processor effective variable cost;
- generation;
- human QC/review;
- expected support/refunds;
- delivery/storage;
- expected fraud/chargeback cost.

At 65% target contribution margin, approximate total variable-cost envelopes are:
- US$7.99 → ~US$2.79;
- US$12.99 → ~US$4.54;
- US$19.99 → ~US$6.99.

These are not forecasts. They answer:

> **How much total variable cost can this price tolerate before missing the current design target?**

Rolling reserves, payout delay, card-brand registration, fixed provider fees and taxes are separate cash-flow/fixed-cost questions.

## First paid SKU candidate

Working hypothesis:

**Mara Contextual Continuation**

Canonical precursor:
- experience `gym_late_voice_01`;
- offer `gym_continue_01`;
- one-time purchase;
- exact-state resume;
- no relationship penalty if declined/cancelled.

Preferred paid value if production-ready:
- canonical Mara voice continuation;
- contextual follow-up;
- optional validated reward/ownership treatment.

Fallback if production voice is not ready:
- bounded compiled mini experience;
- text/story + meaningful branch;
- no browser TTS sold as production voice.

## Payment provider boundary

Current Foundation research says:
- Stripe is not a candidate for Mara's intended adult scope under current policy;
- CCBill supports adult merchants but its published direct Visa/Mastercard merchant regions currently do not include Chile;
- Segpay is a priority adult/high-risk due-diligence candidate but Mara/entity acceptance must be confirmed;
- Centrobill is a secondary adult/high-risk/LATAM due-diligence candidate but Mara/entity acceptance and actual contracted economics must be confirmed.

No provider is approved.

Do not add SDKs or submit applications from this branch.

## 2026-09-03 launch revenue loop update

The product commerce layer now has a Supabase-backed checkout-intent and fulfillment contract, but real payment remains inactive until provider approval.

Implementation may use the non-production `signed_test` runtime to verify HMAC webhook handling, idempotent purchase creation, entitlement grants and Capricho contribution progress. `signed_test` is blocked in production by code and must not be represented as real revenue.

Current provider posture after live policy recheck:

- Stripe remains excluded for Mara's intended adult/sensual AI scope.
- PayPal remains excluded for sexually oriented digital goods/content.
- Segpay remains the priority due-diligence candidate for adult/high-risk and adult AI approval.
- CCBill remains an adult-capable candidate, with region/entity/card-network constraints to verify before committing.

## Pre-charge acceptance criteria

Before first real payment:
- treatment winner selected;
- price candidate selected;
- SKU exact scope frozen;
- provider explicitly accepts real entity + AI adult product scope;
- launch countries defined;
- age-assurance/compliance requirements resolved;
- actual processor fees/reserves entered into economics model;
- fulfillment cost measured;
- unit economics acceptable;
- successful entitlement/resume path designed;
- failed/cancelled payment safe-return path designed;
- refund/support workflow defined;
- founder separately authorizes provider activation;
- founder separately authorizes real payment activation;
- founder separately authorizes production/deployment.

## Decision rule

Do not pick the price with the most `yes` responses automatically.

The candidate must win on:

**WTP × post-price continuation × clarity/satisfaction × expected second purchase × contribution margin**.

And do not pick the easiest processor API.

Pick the processor that explicitly accepts the real Mara business and leaves healthy economics after fees/reserves.
