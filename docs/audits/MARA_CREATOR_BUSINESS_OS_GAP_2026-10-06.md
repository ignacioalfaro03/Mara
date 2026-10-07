# MARA — CREATOR BUSINESS OS GAP AUDIT — 2026-10-06

Status: implementation audit for #91  
Base: `main@42b9569d3b59d0cf00881a2d73b75d07bf3849be`

## Current state reused

Mara already has useful business primitives on `main`:

- `creators`;
- Creator Sites through the legacy-compatible `creator_worlds` persistence model;
- `commerce_offers`;
- `commerce_purchases`;
- `creator_customer_relationships`;
- `creator_customer_summary`;
- `creator_next_best_actions`;
- `creator_demand_opportunities`;
- real `/creator` Creator OS;
- RLS-scoped creator reads and writes.

Conclusion: **do not build another CRM, payment model or creator identity graph for this slice.**

## Material gap

Current Creator OS can answer sales/demand/fulfillment/action questions, but it cannot yet answer the founder's new economic-control questions:

- What is my monthly target?
- What will I close at?
- What is the projected gap?
- What is my break-even point?
- What operating result does this trajectory imply?
- What part of revenue came from each business source?

## Slice implemented

Branch: `feature/creator-business-control-v1`

Adds:

1. `web/lib/creator-business-control.ts`
   - normalized source-aware revenue observations;
   - monthly actual;
   - transparent run-rate forecast;
   - trailing-7-day forecast range;
   - goal gap/surplus;
   - contribution margin;
   - break-even;
   - expected operating result.

2. `/creator/business`
   - creator-only business-control surface;
   - no synthetic revenue;
   - Mara purchases are the initial real source;
   - external channels are described as future sources, never as connected.

3. `creator_business_settings` prepared SQL contract
   - creator-scoped settings;
   - RLS;
   - owner-only authenticated policies;
   - no anonymous access.

4. capability flag
   - `MARA_CREATOR_BUSINESS_CONTROL_ENABLED=false` by default;
   - route and UI remain inaccessible until schema exists in an authorized Mara environment.

## Supabase execution boundary

The currently connected Supabase tooling exposes no dedicated Mara project. It exposes a different product environment only.

Therefore this pass intentionally did **not**:

- apply DDL;
- run a Mara production migration;
- alter a non-Mara database;
- claim live persistence proof.

The SQL is kept under `web/supabase/prepared/` rather than migration history until a dedicated Mara environment is connected and a canonical migration can be generated and verified.

## Deferred intentionally

Not implemented yet:

- OnlyFans API connector;
- Arsmate API connector;
- RRSS OAuth connectors;
- CSV importer;
- identity resolution across platforms;
- churn;
- LTV;
- ramp;
- sensitivity;
- benchmark engine;
- automatic recommendations from financial gaps.

Reason: each requires either a verified external data contract or more historical signal than current `main` guarantees.

## Collision audit

Do not merge old #67 wholesale. It is a large stacked Revenue OS branch rooted in a superseded product authority.

Do not duplicate #88 Creator Site operability.

Do not duplicate #90 payment ledger/payout work.

This slice is intentionally orthogonal: **business intelligence/control above existing product truth.**

## Next safe execution step

When a dedicated Mara Supabase environment is available:

1. generate a canonical migration from the prepared contract;
2. apply to non-production Mara;
3. run security + performance advisors;
4. verify creator A cannot read/write creator B settings;
5. enable the feature flag only in that environment;
6. run exact-head build and authenticated UI proof.

**NO MERGE unless Ignacio explicitly writes `mergea`.**
