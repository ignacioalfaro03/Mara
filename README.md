# Mara

> ## READ THIS FIRST — STRATEGIC AUTHORITY
>
> **The sole highest-priority company authority is [`MARA_FOUNDER_CONSTITUTION_V3.md`](./MARA_FOUNDER_CONSTITUTION_V3.md).**
>
> Product architecture: [`docs/strategy/MARA_PRODUCT_ARCHITECTURE_V2.md`](./docs/strategy/MARA_PRODUCT_ARCHITECTURE_V2.md)
>
> Current sequencing: [`docs/strategy/MARA_EXECUTION_ROADMAP_90D_V2.md`](./docs/strategy/MARA_EXECUTION_ROADMAP_90D_V2.md)
>
> New-idea governance: [`docs/strategy/MARA_IDEA_INTAKE_GOVERNANCE_V1.md`](./docs/strategy/MARA_IDEA_INTAKE_GOVERNANCE_V1.md)
>
> Older constitutions, amendments, V1 architecture/roadmap files and Mara Vera material are historical/specialist context only. **V3 wins on every conflict.**
>
> Founder boundary: **NO MERGE unless Ignacio explicitly writes `mergea`.** No production deployment, payment activation, payout activation, production migration or external spend is implied by strategy work.

---

# Company thesis

Mara is a **web-first creator commerce, audience intelligence and demand network**.

> **MARA HELPS CREATORS TURN AUDIENCE INTO A BETTER BUSINESS THROUGH THEIR OWN SITE, DEMAND INTELLIGENCE, COMMERCE, MEMORY AND FULFILLMENT.**

The visible product is the creator's own site inside Mara.
The compounding system underneath is Mara.
Primary commercial case:

- an already-recognized creator or influencer;
- with an existing audience on Instagram, TikTok, X, YouTube, Twitch or another platform;
- sends that audience to her Mara URL;
- Mara helps her understand demand, sell, fulfill, retain and decide what to do next.

Mara also supports pseudonymous, privacy-protected and virtual identities where legitimate, but **privacy is a configurable capability, not the primary product definition**.

**Mara Vera is no longer part of the product thesis.**

**Creator World / World is no longer product language.**

Legacy `world_*` database, API, telemetry and migration identifiers may remain temporarily as compatibility internals until a safe migration is justified.

---

# Canonical public object

# CREATOR SITE

Conceptual URL:

`mara.com/<creator>`

It should feel like the creator's official digital property, not a seller card inside a marketplace.

A Creator Site can progressively contain:

- identity, bio and links;
- products and offers;
- experiences;
- audience requests and active demand;
- memberships and drops;
- community proof;
- fan history;
- personalization;
- fulfillment state.
Modules are optional. The creator should reach value before configuration complexity.

The creator should be comfortable placing her Mara URL in the bio of her existing social channels.

---

# Fan promise

> **Mara brings you closer to the creators you care about.**

The fan should not need to understand CRM, demand intelligence, analytics or SaaS.

Fan-facing UX should be:

- mobile-first;
- fast;
- visual;
- creator-led;
- commercially clear;
- simple enough to understand immediately from an in-app social browser.

---

# Creator promise

> **Mara helps you turn your audience into a better business.**

Creator OS should answer:

- what did I sell;
- what does my audience want;
- what should I offer next;
- who is close to buying;
- what must I fulfill;
- what action has the highest expected value.

Action beats dashboard decoration.

---

# Canonical economic loop

`CREATOR → CREATOR SITE → AUDIENCE → IDENTITY/MEMORY → WANT → DEMAND → COMMITMENT → AGGREGATED DEMAND → OFFER → TRANSACTION → FULFILLMENT → OUTCOME → MEMORY → NEXT BEST ACTION → RETURN`
WANT, PLEDGE, COMMIT and PURCHASE are distinct economic states and must never be presented as equivalent.

---

# Four platform engines

## 1. Creator Identity & Site

Creator identity, site configuration, branding, exposure controls, public presence and privacy settings.

## 2. Demand Intelligence

Demand requests, clustering, WANT, PLEDGE, COMMIT, WTP, opportunity detection and Demand Graph.

## 3. Commerce & Fulfillment

Offers, checkout, purchase truth, entitlements, delivery, refunds and payout rails when compliant.

## 4. Audience Memory & Retention

History, preferences, outcomes, relevant continuity, next-best-action and cross-creator discovery when justified by real activity.

---

# Network advantage

Mara is not valuable because it can render profile pages.

Its potential moat is:

`CREATOR NETWORK + FAN IDENTITY + DEMAND GRAPH + TRANSACTION HISTORY + OUTCOME MEMORY + COMMERCE INTELLIGENCE`

Each creator relationship should feel direct and creator-owned while Mara compounds network-level intelligence under explicit privacy rules.

---

# Commerce clarity

When money moves, Mara must clearly show:

- what is being purchased;
- price;
- who fulfills it;
- what the buyer receives;
- expected timing;
- material rules;
- cancellation/refund terms where applicable.
The creator owns the spotlight. Mara owns the infrastructure and operating intelligence underneath.

---

# North Star

# FULFILLED DEMAND GMV

Leading indicators may include:

- creator activation;
- Creator Site publish rate;
- qualified audience visits;
- Verified Demand GMV;
- demand-to-offer conversion;
- purchase conversion;
- fulfillment completion;
- repeat purchase rate;
- returning-buyer GMV;
- creator net earnings / creator hour;
- Mara contribution margin.

Followers, likes, messages and generated-content volume are not the North Star.

---

# Current execution priority

## NOW

1. keep strategy/repo aligned to Creator Sites;
2. creator interviews and supply validation, prioritizing creators with existing audiences;
3. Creator Site mobile UX and shareability;
4. 3–5 creator pilot preparation;
5. payment/payout/compliance feasibility;
6. demand behavior validation;
7. reuse existing commerce and fulfillment proof;
8. instrument source-of-demand and creator-site conversion.

## NEXT — only after evidence

- production-safe demand persistence;
- creator authorization/ownership;
- creator-specific SEO;
- site customization;
- demand → approved offer → purchase → fulfillment;
- audience history and repeat loop;
- Creator OS next-best-action;
- cross-creator discovery after real multi-creator activity.
## LATER

- custom domains;
- Creator Pro;
- deeper merchandising intelligence;
- creator collaborations and bundles;
- physical/hybrid experiences;
- agency tooling;
- promoted discovery;
- broader B2B infrastructure.

## NOT NOW

- Mara Vera product resurrection;
- Creator World positioning;
- metaverse or 3D;
- generic social feed;
- unlimited AI chat;
- native mobile as a launch dependency;
- crypto/token systems;
- open marketplace before pilot evidence;
- a new DEV lab for every new idea.

---

# Trust boundary

No real marketplace payment/payout activation until the selected provider explicitly supports the actual Mara structure, target geography and enabled product/content categories.

Required operating principles include:

- adult/identity verification where required;
- creator rights and consent;
- truthful creator/AI disclosure where applicable;
- anti-impersonation controls;
- moderation/report/takedown capability;
- chargeback/fraud controls;
- private paid assets outside the public repository;
- no payment purchasing another person's consent.

The current Alpha may remain adult-only while existing legal/content/payment assumptions require it.
---

# Low-maintenance operating rule

Founder and creator time are scarce.

Preferred system:

`AUTOMATION + CREATOR SUPPLY + AUDIENCE ACTIVITY + AGGREGATED DEMAND + REUSABLE DIGITAL FULFILLMENT + THIRD-PARTY FULFILLMENT LATER`

Do not create a business that requires daily founder posting, continuous chat, manual event coordination or high-touch content operations.

---

# Repository governance

Read current strategy in this order:

1. `MARA_FOUNDER_CONSTITUTION_V3.md`;
2. `docs/strategy/MARA_PRODUCT_ARCHITECTURE_V2.md`;
3. `docs/strategy/MARA_EXECUTION_ROADMAP_90D_V2.md`;
4. `docs/strategy/MARA_IDEA_INTAKE_GOVERNANCE_V1.md`;
5. specialist strategy/product docs;
6. historical founder docs and legacy labs as evidence only.

Current realignment audit:

[`docs/audits/MARA_CREATOR_SITES_REALIGNMENT_2026-09-20.md`](./docs/audits/MARA_CREATOR_SITES_REALIGNMENT_2026-09-20.md)

**NO MERGE unless Ignacio explicitly writes `mergea`.**
