# MARA VERA — LOW-MAINTENANCE REVENUE MACHINE

Status: **latest founder operating direction**.

This document supersedes any older assumption that Mara should be optimized primarily as a chatbot, relationship simulator, or high-frequency content operation. Existing infrastructure may remain when it is cheap and useful, but roadmap priority is governed by this document.

## 1. Founder objective

Mara must maximize:

`REVENUE / FOUNDER HOUR`

Target steady-state founder load after setup:

**2–4 hours per month.**

Mara should be rich for the customer and boring to operate.

## 2. Product definition

Mara is:

**virtual interactive character + digital IP + premium experience catalog + automated commerce.**

Mara is not primarily:

- an unlimited chatbot;
- a relationship SaaS;
- a daily creator operation;
- a custom-content service;
- a product that depends on founder DMs or manual fulfillment.

The core commercial loop is:

`SOCIAL ATTENTION → STOREFRONT → FREE TASTE → FIRST PURCHASE → LIBRARY → RELATED PRODUCT → COLLECTION/BUNDLE → REPEAT PURCHASE`

Membership is optional and deferred until the evergreen catalog is deep enough to support it without recurring founder labor.

## 3. Priority order

### P0 — Evergreen commerce

1. Editorial storefront.
2. Named bounded experiences.
3. One-time purchase.
4. Server-authoritative entitlement.
5. Customer library / replay surface.
6. Related-product upsell.
7. Collections and bundles.
8. Funnel analytics.

### P1 — Lifecycle automation

- email capture;
- welcome flow;
- purchase follow-up;
- related-product recommendation;
- collection completion;
- reactivation;
- occasional drop announcement.

### P2 — Lightweight interactivity

Chat, preferences, memory and World may support:

- sampling Mara;
- onboarding;
- product recommendation;
- short bounded character interactions;
- optional continuity.

They are not roadmap blockers for commerce.

### P3 — High-operations experiments

Caprichos, custom generation, complex relationship state, open-ended AI use and high-touch features are experiments only after the evergreen machine proves demand and unit economics.

Caprichos infrastructure may be retained, but it must not displace storefront, catalog, library, bundles or lifecycle automation.

## 4. Product rule

Every new feature must materially improve at least one of:

- traffic;
- conversion;
- average order value;
- repeat purchase;
- gross margin;
- founder-time reduction.

If not, do not build it.

## 5. Content operating model

Default social cadence:

**approximately one strong new publication per week.**

Build 12–24 weeks of inventory in batches. One production session should create multiple commercial outputs:

`MASTER ASSET → SOCIAL POST → REEL → STORY → FREE PREVIEW → PRODUCT COVER → PREMIUM EXPERIENCE → BUNDLE ASSET → EMAIL CREATIVE`

Create once, distribute many times, sell many times.

## 6. Commercial ladder

Initial order of operations:

1. Free taste.
2. Low-friction entry product.
3. Core experience.
4. Related experience.
5. Collection / bundle.
6. Repeat purchase.
7. Membership only when inventory depth supports it.

Do not make prepaid chat packs a P0 launch dependency. Variable-cost AI use must remain bounded if retained.

## 7. Storefront philosophy

The public web experience should feel like a premium character storefront, not a SaaS dashboard.

Home hierarchy:

`MARA → FEATURED EXPERIENCE → START HERE → COLLECTIONS → FREE TASTE → LIBRARY / ACCOUNT`

The primary CTA should lead to what can be consumed or purchased. Free chat/experience can remain a secondary sample path.

## 8. Library philosophy

Purchased experiences should persist in a simple customer library.

The library exists for:

- ownership;
- replay;
- purchase history;
- collection completion;
- next-product recommendation.

Do not turn it into a complex gamification system.

## 9. Current infrastructure classification

### KEEP

- Supabase Auth;
- RLS and ownership boundaries;
- commerce offers;
- checkout intents;
- purchases;
- entitlements;
- webhook idempotency;
- refunds/revocation;
- first-party analytics;
- character canon;
- reusable content/scene/ritual inventory.

### SIMPLIFY / REPOSITION

- DM experience → free taste / optional interaction;
- memory → optional continuity, not core value proposition;
- World → narrative asset, not launch dependency;
- preferences → lightweight recommendations.

### DEPRIORITIZE

- chat packs as primary monetization;
- complex relationship progression;
- continuous AI usage;
- new World engineering before storefront conversion is proven;
- daily content operations.

### RETAIN AS OPTIONAL EXPERIMENT

- Caprichos;
- Reward Engine;
- high-ticket world participation.

They should not consume founder time until base commerce works.

## 10. Founder scorecard

Monthly review should fit on one page:

- revenue;
- orders;
- buyers;
- site conversion rate;
- AOV;
- revenue per visitor;
- repeat purchase rate;
- top product;
- top traffic source;
- founder hours;
- **revenue / founder hour**.

Then choose at most one operating action for the next month.

## 11. Product freeze rule

Once the loop works:

`DISCOVER → SAMPLE → BUY → ACCESS → RECOMMEND → REPURCHASE`

freeze feature development.

Reopen engineering only when evidence identifies a commercial bottleneck.

## 12. Current execution focus

The first transformation slice is:

1. make `/shop` the editorial commercial surface;
2. keep `/experience` as a secondary free sample;
3. expose the existing fixed paid unlock as the first real purchasable item;
4. surface the next prepared experience families without falsely claiming unproduced media exists;
5. add `/library` on top of existing server-authoritative entitlements/purchases;
6. preserve Caprichos and relationship infrastructure without putting them at the center;
7. do not activate real payments, deploy production, or merge without founder authorization.

## 13. Override rule

When older documents conflict with this direction, use this decision:

> **MARA IS A LOW-MAINTENANCE DIGITAL CATALOG BUSINESS FIRST. CHAT IS SUPPORTING UX, NOT THE PRODUCT CENTER.**
