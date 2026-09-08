# MARA — LOW-MAINTENANCE REVENUE MACHINE

Status: **ACTIVE OPERATING-EFFICIENCY DOCTRINE, SUBORDINATE TO [`MARA_FOUNDER_BUSINESS_CONSTITUTION.md`](./MARA_FOUNDER_BUSINESS_CONSTITUTION.md).**

This document no longer defines what the company is. It defines **how Mara should operate efficiently** inside the private creator economy thesis.

If anything here conflicts with the Founder Business Constitution, the constitution wins.

The former Mara-only storefront strategy remains useful as **Creator Zero proof** and as a template for future creator storefronts.

---

## 1. Founder objective

Mara must maximize:

`ENTERPRISE VALUE + CONTRIBUTION MARGIN + CREATOR EARNINGS / FOUNDER HOUR`

Founder operating principle:

> **Mara should be rich for creators and customers and boring for the founder to operate.**

The founder must not become a full-time creator operator, moderator, customer-service agent or manual fulfillment layer.

---

## 2. Updated product interpretation

Mara is now:

**private creator economy marketplace + character commerce infrastructure + Mara Originals + automated monetization tooling.**

Mara Vera remains Creator Zero.

The current Creator Zero commercial loop remains valid:

`SOCIAL ATTENTION → STOREFRONT → FREE TASTE → FIRST PURCHASE → LIBRARY → RELATED PRODUCT → COLLECTION/BUNDLE → REPEAT PURCHASE`

The marketplace loop that sits above it is:

`CREATOR → CHARACTER → SKU → BUYER → REPEAT BUYER → PAYOUT → MORE CREATOR SUPPLY`

Membership is optional and should not become a founder-labor obligation.

---

## 3. Priority order

### P0 — Creator Zero commerce proof

Keep proving:

1. editorial storefront;
2. named bounded experiences;
3. one-time purchase;
4. server-authoritative entitlement;
5. customer library / replay;
6. related-product upsell;
7. collections and bundles;
8. funnel analytics.

This is no longer the final business model. It is the first reusable commerce template.

### P1 — Supply discovery

Before building large marketplace infrastructure:

- interview/recruit target creators;
- validate public-pseudonymity demand;
- understand exposure boundaries;
- understand which SKUs they would actually sell;
- measure willingness to join under different take-rate / SaaS models.

### P2 — Creator acquisition surface

Build a low-maintenance creator application/waitlist that captures structured demand without requiring manual daily operations.

### P3 — Payment/compliance path

Resolve payment-provider eligibility, payouts, KYC/consent requirements, moderation and takedown operations before real creator commerce is activated.

### P4 — Private creator pilot

Operate manually enough to learn, but do not over-automate before repeated creator earnings are proven.

### P5 — Marketplace automation

Only automate workflows that have demonstrated transaction value.

---

## 4. Product rule

Every new feature must materially improve at least one of:

- creator acquisition;
- creator activation;
- creator earnings;
- traffic;
- conversion;
- AOV;
- repeat purchase;
- cross-creator discovery;
- contribution margin;
- founder-time reduction;
- safety/compliance;
- marketplace liquidity.

If not, do not build it.

---

## 5. Content operating model

Mara Originals and creator tooling should default to batch production and reuse.

Default Mara social cadence remains approximately:

**one strong publication per week**, unless evidence shows a different cadence is required.

Build inventory in batches.

One production session should create multiple outputs:

`MASTER ASSET → SOCIAL POST → REEL → STORY → FREE PREVIEW → PRODUCT COVER → PREMIUM PRODUCT → BUNDLE ASSET → EMAIL/CRM CREATIVE`

For creators, the same principle becomes:

> **Turn existing inventory into SKUs before asking for more production.**

Create once, distribute many times, sell many times.

---

## 6. Commercial ladder

For Mara Originals and future creators:

1. free discovery;
2. low-friction entry product;
3. core product;
4. related product;
5. collection/bundle;
6. repeat purchase;
7. membership where catalog depth supports it;
8. bounded personalization/time where the creator chooses it.

Do not make open-ended chat a P0 dependency.

Variable-cost AI use must remain bounded.

---

## 7. Storefront philosophy

The public experience should feel like entering character worlds, not a SaaS dashboard.

Each creator storefront should make the commercial action obvious:

`CHARACTER → FEATURED PRODUCT → START HERE → COLLECTIONS → FREE TASTE → LIBRARY / ACCOUNT`

The primary CTA should lead to something consumable or purchasable.

---

## 8. Library philosophy

Purchased products should persist in a simple customer library.

The library exists for:

- ownership;
- replay;
- purchase history;
- collection completion;
- next-product recommendation;
- later cross-creator discovery.

Do not turn it into complex gamification unless real retention data justifies it.

---

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
- reusable content/scene/ritual inventory as ideation/prototype material;
- storefront/library work;
- entitlement-gated private premium delivery.

### REPOSITION

- Mara storefront → Creator Zero commerce template;
- DM → free taste / optional bounded interaction;
- memory → optional continuity;
- World → character narrative asset;
- preferences → recommendations;
- character portfolio → precursor to multi-creator discovery.

### DEPRIORITIZE

- Mara-only product architecture as the final company;
- unlimited chat;
- complex relationship progression;
- continuous AI consumption;
- new World engineering before transaction proof;
- daily founder-run content operations;
- native mobile app as launch dependency.

### RETAIN AS OPTIONAL EXPERIMENT

- Caprichos;
- Reward Engine;
- high-ticket world participation.

These may remain experimental inventory for Mara Originals but do not define marketplace P0.

---

## 10. Premium asset security contract

The Mara repository is currently public. That creates a hard commercial boundary that remains valid under the new marketplace thesis.

### PUBLIC / SAFE TO COMMIT

- storefront code;
- product names;
- public descriptions;
- prices;
- teasers and previews intentionally given away;
- entitlement keys and non-secret catalog metadata;
- private storage object paths when the bucket itself is protected.

### PRIVATE / NEVER SHIP IN THE PUBLIC REPO OR CLIENT BUNDLE

- final paid scripts;
- paid photos;
- paid video;
- paid audio;
- complete premium experience payloads;
- creator premium assets;
- any asset whose scarcity/access is part of the purchase value.

Premium assets must be delivered through a private authenticated channel.

Current Creator Zero contract:

`AUTHENTICATED USER → ACTIVE ENTITLEMENT CHECK → SERVER ROUTE → PRIVATE STORAGE ASSET`

Checkout must remain closed unless both server-side gates are configured:

- `MARA_PREMIUM_STORAGE_BUCKET`
- `MARA_PREMIUM_DELIVERY_READY=true`

The readiness flag is deliberate. Merely configuring a bucket must never accidentally make an untested paid experience sellable.

The private content route must:

1. verify the current user server-side;
2. verify an active entitlement server-side;
3. retrieve the premium asset using server-only credentials;
4. never expose service credentials to the browser;
5. use private/no-store delivery semantics;
6. return no premium payload to unauthorized users.

Existing scene Markdown in this public repository is **prototype/ideation material**, not a secure final paid asset. Do not sell those files verbatim. Final premium versions must be produced separately and stored privately, or the repository itself must become private before those assets are committed.

For external creators, the same principle becomes stricter: creator-owned premium payloads, identity documents, KYC evidence and sensitive creator records must never be placed in the public repository.

---

## 11. Founder scorecard

Monthly review should fit on one page.

### Creator Zero

- revenue;
- orders;
- buyers;
- conversion rate;
- AOV;
- repeat purchase rate;
- top product;
- founder hours;
- revenue / founder hour.

### Marketplace supply

- creator leads;
- verified/qualified creator interviews;
- activated creators;
- first-SKU rate;
- first-earning rate;
- earnings per creator hour.

### Marketplace demand

- first purchase;
- second purchase;
- cross-creator purchase;
- contribution margin.

Choose at most one or two operating priorities per review period.

---

## 12. Product freeze rule

Once a loop works:

`DISCOVER → SAMPLE → BUY → ACCESS → RECOMMEND → REPURCHASE`

freeze feature development until evidence identifies a bottleneck.

Likewise, do not automate creator workflows before manual pilot evidence proves the workflow is economically valuable.

---

## 13. Current execution focus

1. keep `/shop` and `/library` as Creator Zero commerce proof;
2. preserve entitlement-gated private premium delivery and keep checkout closed until fulfillment passes end-to-end;
3. make Founder Business Constitution the repository authority;
4. validate the creator ICP before building full marketplace infrastructure;
5. prepare a truthful creator acquisition/waitlist surface;
6. resolve payment/payout/compliance feasibility;
7. recruit a small private creator pilot;
8. prove `FIRST SKU → FIRST SALE → SECOND SALE → PAYOUT`;
9. only then automate marketplace onboarding/discovery;
10. do not activate real payments, mutate production storage, deploy production, or merge without founder authorization.

---

## 14. Override rule

When older documents conflict with the company definition, use the Founder Business Constitution.

For operating efficiency, preserve this rule:

> **LOW-MAINTENANCE, HIGH-MARGIN, EVIDENCE-DRIVEN EXECUTION. CHAT IS SUPPORTING UX, NOT THE PRODUCT CENTER.**
