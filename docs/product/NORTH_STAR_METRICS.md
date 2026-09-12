# Mara North Star Metrics

Authority: `docs/foundation/MARA_FOUNDATIONAL_THESIS.md`

## Primary North Star

# GMV PER ACTIVE CREATOR

Definition for a reporting period:

`successful paid GMV attributable to a creator / creators active in that period`

A creator should count as active only when they perform a meaningful business action or generate/fulfill commerce activity. Do not inflate active creators with passive account existence.

## Core funnel

`STORE VISIT → OFFER VIEW → CHECKOUT START → PURCHASE → REPEAT PURCHASE`

Track by creator, offer, acquisition source and cohort where privacy rules allow.

## Creator metrics

- creator activation rate;
- time to first offer;
- time to first sale;
- creators with ≥1 sale;
- D7 / D30 / D90 creator retention;
- creator GMV retention;
- creator net earnings;
- GMV / active creator.

## Customer metrics

- new buyers;
- repeat buyers;
- repeat purchase rate;
- AOV;
- ARPPU / revenue per buyer;
- purchase frequency;
- days between purchases;
- returning-buyer GMV;
- refund / dispute rate.

## Offer metrics

- offer views;
- checkout-start rate;
- purchase conversion;
- GMV / offer;
- AOV / offer;
- repeat purchase generated after offer;
- fulfillment latency;
- refund rate.

## Opportunity Engine metrics

- opportunities generated;
- opportunities viewed;
- opportunity action rate;
- time to action;
- downstream purchase rate;
- downstream GMV;
- incremental lift where experimentally valid.

Never report downstream revenue as causal lift without an attribution or experimentation method that supports the claim.

## Mara economics

When real payments are active:

- GMV;
- platform fee revenue;
- processor fee;
- refunds;
- chargebacks;
- creator earnings;
- support / variable cost where available;
- contribution margin;
- effective take rate.

## Strategic metric: Mara Revenue Lift

`MARA_REVENUE_LIFT` is not a simple dashboard subtraction.

Valid approaches may include:

- randomized holdout;
- creator/customer cohort comparison with controls;
- automation holdout;
- offer experiment;
- pre/post only when confounders are explicitly acknowledged.

The product may show attributed revenue separately from experimentally measured incremental revenue.

## Guardrails

Revenue growth must not come at the expense of:

- spam;
- unauthorized profiling;
- privacy leakage;
- excessive refunds;
- misleading scarcity;
- manipulative pricing based on vulnerability;
- creator workload that destroys net earnings per hour;
- cross-tenant data exposure.
