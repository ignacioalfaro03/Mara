# CREATOR BUSINESS DATA MODEL V1

Status: **PREPARED / IMPLEMENTED DOMAIN CONTRACT — 2026-10-07**  
Branch: `feature/creator-business-control-v1`  
Tracking: #91, #94

## 1. Purpose

Creator Business OS needs one economic model above Creator Sites, commerce and CRM without duplicating those systems.

Current real flow:

`commerce_purchases → BusinessRevenueObservation → CreatorBusinessHealthSnapshot → /creator/business`

Future external flow:

`authorized source/import → normalized external revenue event → BusinessRevenueObservation → same intelligence layer`

A source label is not proof of a connector.

## 2. Canonical revenue observation

Domain object:

- id;
- source;
- occurredAt;
- amountMinor;
- currency;
- customerKey when known;
- sourceRecordId when available;
- importedAt when applicable;
- provenanceType.

Supported source labels:

- MARA
- ONLYFANS
- ARSMATE
- INSTAGRAM
- TIKTOK
- X
- OTHER

Supported provenance labels:

- MARA_NATIVE
- OFFICIAL_API
- CSV_IMPORT
- XLSX_IMPORT
- MANUAL_ENTRY
- PARTNER_EXPORT

Mara-native purchases are currently the only connected production-shaped source in this branch.

## 3. Currency contract

All amounts use integer minor units.

No silent FX.

Every calculation is single-currency. Observations in a different currency are excluded from that snapshot and external import preview reports currencies separately.

An FX layer is explicitly deferred.

## 4. Monthly ramp

`buildMonthlyRevenueRamp` emits up to six visible periods by default.

For each period:

- revenue;
- transactions;
- active customers;
- new customers;
- repeat customers;
- reactivated customers;
- new revenue;
- retained/repeat revenue;
- reactivated revenue;
- average transaction;
- ARPU;
- repeat customer rate.

Definitions:

**NEW**  
First observed purchase for the customer occurs in that period.

**REPEAT**  
Customer has an observed purchase before that period.

**REACTIVATED**  
Customer has older observed history, did not purchase in the immediately previous month and purchases again in the target month.

Classification quality depends on available history. The Mara reader currently requests available canonical purchase history up to a hard 5,000-row guard and exposes truncation explicitly.

## 5. Revenue bridge

Bridge compares two periods and can cap both periods to the same day-of-month.

For the current business screen:

`previous month through day N ↔ current month through day N`

Movements:

- new revenue;
- reactivated revenue;
- expansion;
- contraction;
- lost/non-repeated revenue;
- unassigned customer delta.

Reconciliation invariant:

`START + NEW + REACTIVATION + EXPANSION - CONTRACTION - LOST + UNASSIGNED_DELTA = END`

The contract fails if this identity does not hold exactly.

This is decomposition, not causal inference.

## 6. Transactional customer health

Current canonical main does not expose a recurring membership contract in the generated database types.

Therefore P1 does **not** call transactional inactivity "churn".

States:

- FIRST_TIME
- HEALTHY
- WATCH
- AT_RISK
- DORMANT
- REACTIVATED

Cadence is estimated from observed intervals between purchases.

For repeat customers with enough history, the latest interval is excluded from the baseline when evaluating whether that latest interval itself represents a reactivation. This prevents the outlier being measured from inflating its own expected cadence.

If creator-wide history has at least three valid repeat intervals, the median creator cadence is available as context.

If insufficient history exists, a 30-day operational fallback remains internal and is marked low-confidence. It is not presented as learned behavior.

One-purchase customers stay FIRST_TIME with low confidence and contribute zero revenue-at-risk.

## 7. Revenue at risk V1

Method:

`ONE_AVERAGE_PURCHASE_OUTSIDE_EXPECTED_CADENCE_V1`

Only repeat customers classified as AT_RISK or DORMANT contribute.

Per-customer amount:

`historical observed average transaction value`

This is not:

- a probability-weighted forecast;
- LTV;
- guaranteed lost revenue;
- a sensitive-trait model.

It is an explainable economic exposure measure.

## 8. Concentration

Current-month revenue concentration:

- Top 1;
- Top 3;
- Top 5.

Known-customer shares use total revenue as the denominator, so unassigned revenue cannot artificially inflate customer concentration.

## 9. Action integration

P1 does not create a second CRM action database.

The health layer accepts existing `creator_next_best_actions`.

If the highest-risk customer already has an existing Creator OS action, Business Control reuses it and adds economic context.

This means a current Creator OS action such as `wait` remains authoritative; Business Control does not override it merely because revenue is at risk.

If no existing action exists, Business Control can recommend review, not automatic contact.

## 10. External import foundation

Canonical CSV columns:

- source
- source_record_id
- occurred_at
- customer_external_id
- event_type
- gross_amount
- currency

P1 parser:

- validates;
- normalizes;
- rejects future dates;
- rejects MARA as an external CSV source;
- converts decimal major amounts exactly to minor units;
- deduplicates `source + source_record_id`;
- keeps SALE and REFUND separate;
- reports per-currency preview;
- marks provenance as CSV_IMPORT.

No upload/persistence UI is activated.

## 11. Prepared persistence

Prepared only:

- `creator_external_sources`
- `creator_import_batches`
- `creator_external_revenue_events`

No separate cross-platform customer identity table is created yet.

Reason:

P1 has no trustworthy automatic identity-resolution contract.

`customer_external_id` remains source-local until a future explicit mapping system exists.

Prepared tables use RLS and authenticated owner-only SELECT. Writes remain service-controlled.

## 12. Identity rules

Allowed future joins:

- platform-native stable identifier;
- explicit creator mapping;
- verified identifier when lawfully available;
- explicit user/creator-authorized merge.

Not allowed in P1:

- probabilistic auto-merge based on username similarity;
- psychographic matching;
- sensitive inference.

## 13. Sensitive-data boundary

Economic risk may use:

- purchases;
- dates;
- amounts;
- observed cadence;
- existing commercial action state.

It must not use:

- weakness fields;
- intimate preferences;
- sexual orientation;
- health;
- psychological vulnerability;
- private sensitive traits.

## 14. Current deployment boundary

The connected Supabase tooling currently exposes only `rivalia-staging`.

No Mara schema has been applied.

Prepared SQL must remain unapplied until a dedicated authorized Mara environment exists.

## 15. Next schema step

When Mara Supabase is available:

1. generate a canonical migration from prepared SQL;
2. apply only to non-production Mara;
3. run security/performance advisors;
4. prove Creator A cannot access Creator B external business data;
5. test source-record dedupe;
6. only then consider a controlled import preview/persist API.
