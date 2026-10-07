# MARA — CREATOR BUSINESS OS V1

Status: **STRATEGIC / PRODUCT EXTENSION — SUBORDINATE TO `MARA_FOUNDER_CONSTITUTION_V3.md`**  
Effective: **2026-10-06**  
Tracking: **#91**

> **THE CREATOR KEEPS USING THE CHANNELS THAT ALREADY WORK. MARA BECOMES THE INTELLIGENCE LAYER THAT TELLS HER HOW THE BUSINESS IS PERFORMING AND WHAT TO DO NEXT.**

## 1. Why this exists

Creator Sites remain the canonical public product. This extension makes Creator OS economically useful across the creator's business rather than limiting intelligence to transactions that happen inside one surface.

Mara should progressively answer:

1. How am I doing?
2. Will I hit my goal?
3. Why?
4. Where is the gap?
5. What revenue is at risk?
6. What action has the highest expected economic value?
7. When does moving an activity into Mara improve economics?

## 2. Entry strategy

Do not require migration from another platform as the first step.

Preferred wedge:

`CONNECT / IMPORT → UNDERSTAND → ADVISE → EXECUTE → PROVE ROI → MIGRATE WHEN ECONOMICALLY RATIONAL`

A creator may continue to use OnlyFans, Arsmate, Instagram, TikTok, X or other channels. External platforms are sources only when Mara has an authorized, technically real integration or an explicit import path.

No scraping. No fake connector badges. No inferred data that Mara does not actually possess.

## 3. Creator business control loop

`ACTUAL → GOAL → FORECAST → GAP → ROOT CAUSE → ACTION → OUTCOME → LEARNING`

V1 starts with the pieces that can be made honest from current product truth:

- actual Mara revenue;
- creator-defined monthly revenue goal;
- creator-defined fixed costs;
- creator-defined variable-cost rate;
- transparent monthly forecast baseline;
- forecast gap/surplus;
- contribution margin;
- break-even revenue;
- expected operating result.

## 4. UX rule

The backend may become sophisticated. The creator-facing experience should remain reducible to:

- **Cómo voy**
- **Por qué**
- **Qué hago ahora**

Do not turn Creator OS into a BI suite.

## 5. Multi-platform source contract

Canonical source labels in the domain layer:

- MARA
- ONLYFANS
- ARSMATE
- INSTAGRAM
- TIKTOK
- X
- OTHER

A label is not a connector.

Future ingestion order:

1. official API / OAuth;
2. approved partner API or webhook;
3. creator-authorized CSV / Excel import;
4. creator-authorized report ingestion;
5. manual data entry;
6. Mara-native events.

Every external observation must eventually preserve source, provenance, occurred time, imported time, currency and stable source identifier where available.

## 6. Forecast integrity

Forecast V1 is deliberately simple:

- month-to-date daily pace is the base forecast;
- trailing seven calendar days create an explainable low/high comparison range;
- output exposes model name and confidence;
- no claim of advanced predictive accuracy is made.

Future forecasting may add seasonality, cohorts, recurrence, campaigns and churn only after enough history exists.

## 7. Financial integrity

Money is always stored in canonical minor units.

One control snapshot is single-currency. Cross-currency aggregation requires an explicit FX layer and must not silently combine currencies.

Break-even uses:

`fixed costs / contribution margin`

where contribution margin is:

`1 - variable cost rate`.

## 8. What comes next

P1:
- normalized external revenue import;
- revenue bridge;
- monthly ramp;
- channel economics;
- simple retention/churn definitions backed by real recurrence data;
- revenue at risk.

P2:
- creator/customer cohorts;
- LTV/ARPU;
- risk and propensity;
- source-level unit economics.

P3:
- recommendation impact;
- recommendation outcome tracking;
- Mara-attributed incremental revenue.

P4:
- scenario and sensitivity engine;
- pricing experiments;
- aggregated privacy-safe benchmarks.

## 9. Safety and business quality

Mara optimizes durable creator economics, not pressure.

Recommendations must account for:
- customer fatigue;
- creator workload;
- long-term retention;
- pricing integrity;
- privacy;
- platform rules;
- legal/payment constraints.

A valid recommendation may be **do nothing** or **do not contact this customer**.

## 10. Founder boundary

This document does not activate payments, payouts, external connectors or production database changes.

**NO MERGE unless Ignacio explicitly writes `mergea`.**


## 11. P1 implementation status — 2026-10-07

P1 moves the product from simple financial control into explainable business diagnostics.

Implemented on branch `feature/creator-business-control-v1`:

- six-month revenue ramp;
- new / repeat / reactivated customer decomposition;
- revenue bridge with exact reconciliation;
- same-day-of-month comparison for current vs previous month;
- transactional customer health;
- conservative revenue-at-risk;
- Top 1 / Top 3 / Top 5 concentration;
- existing Creator OS Next Best Action reuse;
- canonical external revenue CSV parser;
- external data provenance and stable-record dedupe contracts;
- prepared external-source/import/revenue-event persistence with RLS.

### Churn terminology

Do not use `churn` for ordinary transactional inactivity.

Until Mara has a canonical recurring membership/subscription contract, use:

- repeat;
- dormant;
- reactivated;
- revenue at risk.

### Revenue-at-risk V1

P1 does not run a black-box predictive model.

It measures explainable exposure:

> one historical average purchase for a repeat customer materially outside their observed purchase cadence.

This amount is not guaranteed lost revenue and must be shown with confidence/context.

### External source truth

Only Mara-native purchase data is currently connected.

OnlyFans, Arsmate, Instagram, TikTok, X and OTHER remain source labels / future import targets.

CSV parsing does not mean a live connector exists.

### Next strategic slice

After P1 is green, the preferred sequence is:

`IMPORT PREVIEW → VERIFIED EXTERNAL DATA → CHANNEL ECONOMICS → BETTER FORECAST → ACTION OUTCOME LEARNING`

Do not jump directly to probabilistic LTV, dynamic pricing or AI propensity before the external data contract is proven.
