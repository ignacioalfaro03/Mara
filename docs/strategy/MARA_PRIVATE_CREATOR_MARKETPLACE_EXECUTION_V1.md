# MARA — PRIVATE CREATOR MARKETPLACE EXECUTION V1

Status: **execution plan under `MARA_FOUNDER_BUSINESS_CONSTITUTION.md`**  
Date: **2026-09-07**

This plan turns the founder thesis into the smallest sequence that can prove a two-sided marketplace without prematurely building a full creator platform.

---

## 1. THE BUSINESS PROOF WE NEED

Do not ask whether creators like the idea.

Prove this chain:

`TARGET CREATOR → INTEREST → CHARACTER → FIRST SKU → FIRST BUYER → SECOND SALE → PAYOUT → CREATOR WANTS TO CONTINUE`

And on demand:

`BUYER → FIRST CHARACTER → FIRST PURCHASE → SECOND PURCHASE → SECOND CHARACTER`

The company is not validated until both supply and demand loops begin to work.

---

## 2. CURRENT IMPLEMENTATION IN THIS BRANCH

Prepared, not production-activated:

- root Founder Business Constitution;
- README authority/positioning rewrite;
- low-maintenance doctrine subordinated to the founder thesis;
- `/creators` acquisition page;
- `/api/creator-interest` server-side intake;
- `creator_interest` migration with RLS enabled and browser roles revoked;
- global navigation entry for `Para creadoras`;
- explicit copy that public pseudonymity is not regulatory anonymity;
- explicit copy that creator payouts are not yet active.

No production deployment, payment activation, creator payout or schema application is implied by the branch.

---

## 3. NEXT 10–20 CREATOR INTERVIEWS

Target recruiting mix:

- 5 women with no creator monetization history;
- 5 women who post lifestyle/fashion/fitness/social content but do not monetize it;
- 5 women who have sold content or attention privately but do not run a public adult creator brand;
- up to 5 women already monetizing publicly, used as a comparison group rather than the core ICP.

Interview questions should discover behavior, not merely opinions.

### A. Identity/exposure

- What part of your identity would you never want publicly connected to this?
- Would a separate character materially change your willingness to monetize?
- Which exposure level feels acceptable: character-only, voice, selective real content, direct interaction?
- What would still make the model feel too risky?

### B. Monetizable supply

- What do you already create that currently earns nothing?
- Would you rather sell content once, recurring access, personalized products or bounded time?
- How many hours per month would you realistically spend?
- What would make this feel operationally annoying?

### C. Economics

- What first monthly earning would make the experiment feel worthwhile?
- Which fee feels acceptable if Mara brings the customer?
- Which fee feels acceptable if you bring the customer?
- Would you pay a monthly Pro fee for lower commission + automation/privacy/distribution?

### D. Trust

- What would Mara need to prove before you upload anything?
- Which verification steps would you tolerate privately?
- What payout cadence feels acceptable?
- What would make you leave the platform immediately?

---

## 4. SUPPLY-SIDE EXPERIMENTS

### Experiment S1 — Positioning

Test three value propositions:

A. `Tu personaje puede ser público. Tú no tienes que serlo.`

B. `Monetiza online sin convertir tu identidad pública en el producto.`

C. `Crea un personaje. Mara te ayuda a convertirlo en un negocio.`

Primary metric:

`qualified creator interest / creator landing visitor`

Do not count low-intent email submissions as proof.

### Experiment S2 — Exposure ladder

Measure selected maximum exposure level.

If most ICP creators select character-only or voice, prioritize those product rails before real-content tooling.

### Experiment S3 — Product preference

Measure demand across:

- evergreen digital content;
- audio;
- personalized products;
- chat;
- scheduled sessions;
- membership.

Do not assume adult visual content is the dominant supply product.

### Experiment S4 — Demand-source pricing

Test creator reaction to:

- higher take when Mara sources the customer;
- lower take when creator sources the customer;
- optional paid Pro tier with lower fees.

Do not publish permanent pricing before interviews + unit economics.

---

## 5. INITIAL REVENUE MODEL TO TEST

These are hypotheses, not committed prices.

### Marketplace sourced transaction

Potential range:

`20–30% gross platform take`

Justification must be real distribution + commerce + trust + automation.

### Creator sourced transaction

Potential range:

`10–15% gross platform take`

Purpose:

- lower acquisition resistance;
- reward creators who bring demand;
- reduce pressure to bypass Mara.

### Creator Pro

Potential later range:

`USD 19–39 / month + lower take`

Possible value:

- creator privacy checks;
- more character assets;
- automated content packaging;
- scheduling;
- CRM;
- advanced analytics;
- pricing/merchandising suggestions;
- lower transaction fee.

### Studio

Managed setup for creators who want minimum operational effort.

Possible structure:

`SETUP FEE + MONTHLY FEE + REVENUE SHARE`

Do not build Studio operations until a few creators prove willingness to pay for hands-off setup.

---

## 6. UNIT ECONOMICS MODEL

For each creator transaction calculate:

`GMV`

less:

- creator payout;
- payment processing;
- payout processing;
- fraud reserve;
- chargebacks;
- refunds;
- customer support;
- moderation;
- storage/CDN;
- AI/media generation attributable to the transaction;
- creator acquisition incentive;
- compliance/tax costs where applicable;

=

`CONTRIBUTION MARGIN`

Track separately by product family:

- evergreen digital;
- personalized digital;
- chat/message;
- scheduled human time;
- membership;
- platform membership;
- SaaS.

Human-time products may produce attractive GMV but weaker platform margin/support economics. Do not compare them only on revenue.

---

## 7. PAYMENT + PAYOUT GATE

Before real-money creator pilot:

### Required evidence

- payment provider explicitly accepts the actual content/service mix;
- provider accepts platform/marketplace model;
- creator payout model is supported;
- target countries are supported;
- adult-oriented categories, if enabled, are explicitly eligible;
- settlement/reserve/chargeback rules are understood;
- statement descriptor implications are understood;
- KYC requirements are documented;
- creator tax/payout information requirements are documented.

### Architecture

Maintain a provider abstraction.

Do not allow product code to assume a specific mainstream processor is eligible.

Technical checkout success is not policy approval.

---

## 8. CREATOR TRUST + PRIVACY GATE

Before first creator uploads content:

- identity verification policy;
- age verification;
- likeness/voice rights contract;
- participant consent process;
- impersonation policy;
- creator boundary controls;
- takedown mechanism;
- complaint SLA;
- creator account compromise response;
- payout-change protection;
- content deletion/retention rules;
- privacy policy for creator application data.

### Creator Privacy Check — MVP

Before publishing creator media, eventually check for:

- metadata;
- obvious location data;
- readable documents/screens;
- reflections;
- usernames/watermarks;
- tattoos or highly distinctive identifiers;
- creator-confirmed voice exposure;
- creator-confirmed face exposure.

The platform should show the creator an explicit **exposure summary** before publishing.

---

## 9. CREATOR PILOT PRODUCT — MINIMUM DATA MODEL

Do not build full social profiles first.

Minimum entities:

### creator_account

- creator id;
- verification state;
- public character id;
- payout state;
- risk state;
- active state.

### character

- name;
- slug;
- disclosure mode;
- positioning;
- avatar assets;
- public bio;
- exposure level;
- active.

### creator_boundary

- allowed product types;
- allowed interaction types;
- maximum exposure level;
- availability;
- blocked categories;
- manual-review flags.

### product

- creator id;
- character id;
- product type;
- price;
- currency;
- fulfillment mode;
- inventory/capacity;
- active.

### order / entitlement

Reuse and generalize existing commerce contracts where possible instead of building a second payment system.

### session_booking

Only if scheduled human-time products make the pilot.

### creator_payout_ledger

Only after payment/payout provider eligibility is solved.

---

## 10. MARKETPLACE LIQUIDITY

A creator with no views will churn.

A customer with no interesting inventory will churn.

Therefore measure:

### Creator liquidity

`% of active creators receiving >= 1 purchase in 30 days`

and later:

`% receiving repeat customer purchase`

### Customer liquidity

`% of buyers shown >= 3 genuinely relevant purchasable options`

Do not open supply faster than demand can support it.

Curated marketplace > empty marketplace.

---

## 11. CROSS-SELL SYSTEM

The marketplace starts to become defensible when one buyer purchases from multiple character businesses.

Minimum recommendation surfaces later:

- after purchase;
- library;
- collection completion;
- home discovery;
- creator collaboration;
- compatible character recommendation.

Primary KPI:

`CROSS_CREATOR_BUYER_RATE`

This matters more strategically than total profile views.

---

## 12. NEW MONETIZATION OPPORTUNITIES TO KEEP ON THE MAP

Do not build all now.

### A. Creator Privacy Pro

Paid creator software centered on public-identity separation and exposure review.

### B. Merchandising Copilot

Turn existing creator inventory into recommended SKUs/bundles automatically.

### C. Demand-sourced commission premium

Higher take only when Mara actually creates the buyer relationship.

### D. Creator referral revenue

Creator A earns when her referral produces sales for Creator B.

### E. Character launch package

One-time paid setup for avatar, brand, storefront and first catalog.

### F. Catalog optimization

Paid Pro analytics that identifies pricing gaps, dead inventory and bundle opportunities.

### G. Bounded availability marketplace

Creators open paid time windows without needing to produce new media.

### H. Platform membership

Cross-character benefits and Mara Originals create platform-level recurring revenue independent of one creator.

### I. Brand/agency infrastructure

Later white-label or managed character commerce for agencies/brands.

---

## 13. ANTI-MONETIZATION RULES

Do not optimize revenue by:

- promising guaranteed earnings;
- implying perfect anonymity;
- hiding AI/virtual character nature;
- making payment equal consent;
- encouraging creators to exceed their boundaries;
- using customer vulnerability as a pricing signal;
- creating fake scarcity;
- creating fake creator availability;
- enabling unbounded human availability;
- enabling unbounded AI cost;
- facilitating offline sexual services or physical meetups.

---

## 14. 90-DAY DECISION FRAME

### Gate A — Supply signal

Proceed if enough target creators demonstrate genuine willingness to join under realistic verification/economic constraints.

### Gate B — Creator activation

Proceed if pilot creators can create a character + first SKU without high founder labor.

### Gate C — First earnings

Proceed if a meaningful percentage receives a real first purchase.

### Gate D — Repeat economics

Proceed if buyers repeat and/or cross-buy, contribution margin is credible and creators want to continue.

### Gate E — Scale

Only then invest in automated creator onboarding, discovery algorithms, creator SaaS and broader acquisition.

If supply likes the concept but refuses realistic KYC/payment requirements, the wedge is not validated.

If creators join but buyers do not purchase, the marketplace is not validated.

If buyers purchase but creator operations require large founder labor, the business model must be simplified before scale.

---

## 15. IMMEDIATE NEXT ENGINEERING SLICE AFTER THIS PR

Do not build the full marketplace next.

Next slice should be selected from evidence:

1. apply/test creator-interest schema in an isolated environment;
2. verify `/creators` mobile UX and successful persistence;
3. add founder-readable creator-interest report without exposing application PII in public telemetry;
4. run first creator interviews;
5. only after supply signal, design creator onboarding + character schema;
6. payment/provider diligence runs in parallel and remains a hard blocker for monetized pilot.

No merge, production deploy, payment activation, payout activation or external spend without founder authorization.
