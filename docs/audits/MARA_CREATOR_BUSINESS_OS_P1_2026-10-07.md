# MARA — CREATOR BUSINESS OS P1 AUDIT — 2026-10-07

Status: **IMPLEMENTATION PASS IN PROGRESS**  
Branch: `feature/creator-business-control-v1`  
PR: #92  
Issues: #91, #94  
Security blocker: #93

## Mission

Move Creator Business OS from simple goal/forecast/break-even control to an explainable operating layer:

`RAMP → BRIDGE → TRANSACTIONAL HEALTH → REVENUE AT RISK → ACTION CONTEXT`

and prepare external revenue ingestion without pretending external connectors exist.

## Implemented as real code

### Economic intelligence

`web/lib/creator-business-control.ts`

Now includes:

- monthly revenue ramp;
- active/new/repeat/reactivated customer counts;
- ARPU;
- average transaction;
- exact revenue bridge;
- same-day-of-month comparison;
- customer cadence;
- FIRST_TIME / HEALTHY / WATCH / AT_RISK / DORMANT / REACTIVATED states;
- conservative revenue-at-risk;
- Top 1 / Top 3 / Top 5 concentration;
- Creator Business Health snapshot;
- economic drivers;
- integration with existing Creator OS Next Best Action.

### External import domain

`web/lib/creator-business-import.ts`

Canonical CSV preview supports:

- source validation;
- stable record identifier;
- occurred time;
- source-local customer identifier;
- SALE / REFUND;
- exact decimal money parsing;
- currency separation;
- row-level errors;
- duplicate detection;
- provenance = CSV_IMPORT.

No persistence is claimed.

### Real data read

Business Control now asks for available successful, non-refunded Mara purchase history up to a 5,000-row explicit guard.

Truncation is surfaced to the creator rather than silently accepted.

### Creator UX

`/creator/business`

Now prioritizes:

1. Cómo voy
2. Qué cambió
3. Qué está en riesgo
4. Qué hago ahora

It does not expose a BI-style KPI wall.

## Semantic decisions

### No fake churn

Current generated schema has no canonical recurring membership contract.

Transactional inactivity is therefore not called subscription churn.

### No fake AI prediction

Revenue-at-risk V1 is deterministic and explainable.

One-purchase customers never receive a confident repeat-risk classification.

### Existing action wins

If the current Creator OS already says `wait` for a customer, the Business OS does not replace that with an aggressive recovery action.

## Prepared but not activated

`web/supabase/prepared/creator_business_external_import_foundation.sql`

Prepared tables:

- creator_external_sources;
- creator_import_batches;
- creator_external_revenue_events.

No Mara DDL has been applied.

No external connector has been activated.

No CSV upload endpoint has been activated.

No external-customer identity auto-merge exists.

## Supabase blocker

Connected Supabase projects:

- rivalia-staging

No dedicated Mara project is available through the current connection.

Result:

**DO NOT APPLY THE PREPARED SQL.**

## Security blocker

#93 remains separate and authoritative for repository dependency risk.

Web Launch CI may remain red before application tests because the production audit currently reports:

- Next.js critical advisory;
- sharp high advisory;
- source-map-js high advisory.

P1 does not weaken or suppress that gate.

## P1 validation contract

New:

`npm run creator-business-p1:contract`

Must prove:

- bridge exact reconciliation;
- new/reactivated/expansion/contraction/lost classification;
- unassigned revenue reconciliation;
- ramp metrics;
- first-time low-confidence behavior;
- dormant classification;
- reactivation;
- revenue-at-risk;
- concentration;
- multi-currency separation;
- CSV validation/dedupe/provenance;
- RLS prepared contracts;
- no weakness/sensitive preference dependency;
- existing Creator OS action reuse.

## Intentionally deferred

- live external APIs;
- CSV persistence endpoint;
- XLSX ingestion;
- cross-platform identity resolution;
- recurring membership churn;
- LTV;
- probabilistic propensity;
- pricing elasticity;
- FX;
- creator benchmarks;
- Mara-attributed incremental revenue.

## Next decision after P1 is green

The highest-leverage next slice is not more dashboard work.

It is:

**IMPORT PREVIEW → VERIFIED EXTERNAL DATA → CHANNEL ECONOMICS**

but only after:

- P1 contract/typecheck/build are green;
- a dedicated Mara Supabase environment exists for persistence work;
- #93 is handled before production-sensitive release work.

## Founder boundary

NO MERGE.
NO PRODUCTION.
NO PAYMENTS.
NO PAYOUTS.

**NO MERGE unless Ignacio explicitly writes exactly `mergea`.**
