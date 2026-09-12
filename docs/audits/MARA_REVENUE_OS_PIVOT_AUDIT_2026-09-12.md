# Mara Revenue OS Pivot Audit — 2026-09-12

Branch base audited: `codex/full-product-realization-v1` at `53d82deba8958ba4994d76d93caf02403c3607fb`.

## Executive conclusion

Mara should **not** be rebuilt.

The latest implementation already contains a meaningful part of the new Revenue OS spine:

- authenticated creator activation;
- public creator surface;
- offer creation;
- checkout intent / purchase primitives;
- creator-scoped customers;
- GMV summaries;
- repeat-customer signal;
- customer detail;
- deterministic Next Best Action;
- fulfillment;
- telemetry;
- tenant isolation / RLS;
- hosted proof / CI infrastructure.

The pivot is therefore an **authority + information architecture + metric + sequencing reset**, not a greenfield rewrite.

## KEEP

Preserve as core infrastructure unless later evidence identifies a defect:

### Identity / security

- auth and session verification;
- creator ownership model;
- RLS and tenant isolation;
- server-owned writes;
- secrets boundaries;
- audit / telemetry safety contracts.

### Commerce

- `commerce_offers` and existing creator offer flow;
- checkout intents;
- purchases;
- entitlement / fulfillment logic;
- signed-test proof infrastructure;
- payment activation guards.

### Creator CRM

- creator-customer relationship spine;
- customer summaries;
- creator GMV per customer;
- purchase count;
- lifecycle stage;
- customer detail surfaces;
- Next Best Action.

### Operations

- pending fulfillment;
- creator dashboard data loader;
- public creator profile/store surface;
- CI / build / browser smoke infrastructure.

## ADAPT

### Creator `World`

The database/runtime concept may remain temporarily where renaming would create migration risk.

In product language it should become:

- creator profile;
- storefront;
- public creator page;
- creator business surface.

Do not perform a destructive schema rename solely for branding.

### Demand opportunities

Existing demand signals can remain one source of opportunity, but **Demand is no longer the company thesis**.

The Opportunity Engine must eventually accept multiple sources:

- repeat-ready buyer;
- abandoned checkout;
- high-value inactive customer;
- pending fulfillment;
- product performance;
- bundle affinity;
- creator-entered campaign;
- explicit customer request / demand signal.

### Next Best Action

Keep deterministic V1.

Expand gradually from operational actions into measurable commercial actions with attribution.

### Consumer account / app shell

Keep code if stable, but demote it from roadmap priority.

Fan mobile web and direct creator links are the acquisition/purchase path.

A network-level consumer app requires evidence before further investment.

## DEPRECATE AS PRODUCT AUTHORITY

The following no longer define the company, roadmap or launch:

- Mara Vera character canon;
- Mara Vera storefront as company center;
- chatbot / AI companion;
- relationship-engine-first strategy;
- connected Creator Worlds as primary metaphor;
- immersion / continuity as core category;
- private demand network as company thesis;
- consumer social app as primary product;
- IRL host marketplace as near-term target;
- content inventory / adult audio strategy as company roadmap.

These can remain in history until cleanup is safe.

## Important current implementation truth

`web/app/creator/page.tsx` already behaves substantially like an early Revenue OS:

- computes creator GMV;
- counts repeat customers;
- surfaces pending fulfillment;
- surfaces a recommended action;
- creates offers;
- lists creator customers;
- links to customer detail;
- converts demand signal into an offer.

This should become the canonical product center rather than being replaced.

## Gap analysis

### P0 — needed for the new MVP proof

1. Revenue OS terminology and navigation.
2. Creator-first public positioning.
3. Fan storefront link that does not require consumer-app discovery.
4. Clear order → creator-customer relationship proof.
5. Basic revenue metrics: GMV, AOV, repeat rate.
6. Opportunity Engine contract beyond demand-only framing.
7. Revenue attribution fields/events for actions that can generate incremental revenue.
8. Explicit first-sale and second-sale funnel telemetry.

### P1 — after first real transactions

1. abandoned-checkout opportunity;
2. repeat-ready customer opportunity;
3. high-value inactive customer opportunity;
4. post-purchase cross-sell;
5. lifecycle segments;
6. basic automations;
7. offer performance dashboard;
8. cohort/repeat reporting.

### P2 — after proven repeat behavior

1. Next Best Offer scoring;
2. automated experimentation;
3. AI commercial copilot;
4. Creator Pro packaging;
5. native creator app if mobile usage warrants it;
6. network-level consumer app only if multi-creator retention exists.

## What should not block this pivot

Do not block Revenue OS work on:

- Mara Vera visual asset recovery;
- character consistency;
- consumer feed polish;
- immersive content production;
- world/lore work;
- new demand-marketplace features;
- native fan app.

If an inherited CI gate is tied exclusively to deprecated Mara Vera assets, it should be reviewed separately and replaced with a relevant product-integrity gate rather than silently bypassed.

## Canonical implementation target

`CREATOR → OFFER → PUBLIC LINK → CHECKOUT → PURCHASE → CREATOR CUSTOMER → CRM → OPPORTUNITY → ACTION → SECOND PURCHASE`

## Recommended migration policy

- additive first;
- no destructive DB renames for terminology;
- preserve RLS;
- preserve payment fail-closed behavior;
- no production activation without explicit authorization;
- no merge without founder authorization.

## Branch decision

This pivot branch is intentionally based on PR #66's head because it contains the richest reusable commerce + CRM implementation.

It does **not** imply PR #66's consumer-app-first strategy remains authoritative.

The code is reused. The old strategy is not.
