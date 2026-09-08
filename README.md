# Mara

> ## 🔒 READ THIS FIRST — CURRENT FOUNDER AUTHORITY
>
> **The highest-priority business authority is now [`MARA_DEMAND_TO_EXPERIENCE_FOUNDER_AMENDMENT.md`](./MARA_DEMAND_TO_EXPERIENCE_FOUNDER_AMENDMENT.md).**
>
> The prior [`MARA_FOUNDER_BUSINESS_CONSTITUTION.md`](./MARA_FOUNDER_BUSINESS_CONSTITUTION.md) remains valid as the creator-economy and privacy foundation wherever it does not conflict with the newer demand-to-experience amendment.
>
> Core thesis: **MARA TURNS DESIRE INTO DEMAND, AND DEMAND INTO EXPERIENCES.**
>
> Founder boundary: **NO MERGE without Ignacio saying exactly `mergea`.** Strategy or prototype work does not authorize production deployment, real payments, payouts, venue bookings or external spend.

## Company definition

Mara is evolving into a **demand-to-experience marketplace**.

People express what they want to happen. Other people see that demand and join it. Mara measures the quality of the demand, including willingness to pay and eventually verified commitment. Hosts, Creators and Operators can then compete or collaborate to make the experience happen.

Canonical company loop:

**DESIRE → DISCOVERY → JOIN → WTP → COMMIT → VERIFIED DEMAND → HOST / CREATOR / OPERATOR → UNLOCK → TRANSACTION → EXPERIENCE → MEMORY → NEXT DESIRE**

The business should not begin by guessing which events or products to produce.

It should begin with:

> **What do people want to happen, how many people want it, and how economically real is that demand?**

## The strategic asset

The long-term asset is the **Demand Graph**.

Mara should learn, in a privacy-safe way:

- what groups of people want;
- in which city or market;
- when they want it;
- what formats they prefer;
- how many people will join;
- how much they are willing to pay;
- how much demand is actually verified;
- which Hosts can fulfill it reliably;
- which experiences generate repeat demand.

The primary North Star hypothesis is:

# VERIFIED DEMAND GMV

Do not confuse interest with verified demand, unlocked demand or executed GMV.

## What users do

A first-time user should understand Mara in seconds:

> **Aquí veo cosas que la gente quiere hacer. Me puedo sumar o puedo proponer lo mío.**

Core consumer actions:

1. discover public demand;
2. tap **ME SUMO**;
3. optionally state willingness to pay;
4. later make a stronger commitment when the payment model is authorized;
5. propose a new idea;
6. join an existing similar demand instead of fragmenting the market;
7. bring successful experiences to another city.

A user does not need to think like an event producer. A request such as “quiero karaoke con gente de Mara en Chillán” is enough to begin forming demand.

## Marketplace actors

### Demanders

Users who propose or join demand.

### Creators

Creators or characters who may contribute audience, identity, IP, content, approval, digital participation or physical presence.

### Creator Hosts

Authorized people or teams that operate experiences for a Creator.

### Venue Hosts

Businesses such as pubs, bars, restaurants, hotels, clubs, studios, gyms or event venues that can fulfill demand.

### Operators

Independent organizers or production teams capable of executing an opportunity.

One entity may perform more than one role.

## Mara Vera = Creator Zero

Mara Vera remains strategically important.

She is:

- Creator Zero;
- the first character;
- an initial acquisition engine;
- the first demand-generating universe;
- the first reusable commerce proof;
- a source of seeded marketplace liquidity;
- a future source of repeatable Experience Templates.

But Mara Vera is **not the ceiling of the company**.

An Experience may belong to:

- Mara Vera;
- another Creator;
- a Host;
- a community;
- or no Creator at all.

Her Character Canon remains authoritative specifically for Mara Vera:

[`MARA_CHARACTER_CANON.md`](./MARA_CHARACTER_CANON.md)

## Creator economy remains a supply engine

The private creator-economy thesis is not discarded.

It becomes one powerful supply layer inside the broader marketplace.

Creators can still build character businesses, monetize digital products, voice, personalized products, bounded availability and memberships. They can also originate or license experiences and let third-party Hosts execute them.

The privacy principle remains:

> **Your character can be public. You do not have to be.**

Public pseudonymity is not regulatory anonymity. KYC, age, consent, tax, payout and lawful-disclosure obligations still apply where required.

## Demand objects

### DemandRequest

A raw expression of desire from a user.

### DemandCluster

A canonical pool that aggregates sufficiently similar demand in the same relevant market.

Demand should concentrate instead of fragmenting across near-duplicate ideas.

Example:

- “Mara Party Chillán”
- “Fiesta de Mara en Chillán”
- “Mara Night Chillán”

should normally trigger an existing-demand suggestion before creating three separate pools.

## Demand lifecycle

Canonical states:

**IDEA → RISING → VALIDATED → HOST WANTED → HOST PROPOSALS → UNLOCKED → BOOKING → HAPPENING → COMPLETED → MEMORY**

Not every experience needs every state, but the system must preserve the distinction between demand formation, supply matching and real execution.

## Host thesis

Do not sell a pub or hotel generic advertising.

Sell a validated opportunity.

Canonical Host proposition:

> **There are people near you who want this, and Mara can show the quality of that demand.**

A Host opportunity can eventually include aggregated metrics such as:

- city;
- category;
- interested people;
- verified commitments;
- average willingness to pay;
- potential demand GMV;
- capacity requirement;
- time window;
- Creator / IP requirements.

Mara should not expose private individual buyer histories merely to make an opportunity attractive.

## Operating rule

# MARA ORCHESTRATES. HOSTS EXECUTE.

Mara should own the marketplace infrastructure:

- discovery;
- demand aggregation;
- clustering;
- commitments;
- payment orchestration when authorized;
- QR / access primitives;
- reputation;
- Host proposals;
- Creator approvals;
- rules / compliance;
- revenue splits;
- refunds / disputes;
- analytics.

Mara should avoid becoming the default physical producer of every experience.

The business should remain asset-light and operationally scalable.

## Experience types

Mara can support:

### Physical

Legal entertainment, hospitality, food, sports, culture, social, community, educational or creator formats.

### Digital

Creator sessions, livestreams, group experiences, digital challenges, classes or guided experiences.

### Hybrid

Physical fulfillment combined with digital participation, Creator IP, content or post-experience products.

Physical adult-oriented experiences must not become a mechanism for sexual services, coercion, illegal activity or unsafe conduct. Payment never changes consent or safety boundaries.

## Monetization architecture

Mara should monetize the value created by demand in multiple layers without destroying trust.

Priority engines:

- marketplace transaction take rate;
- commitment / reservation economics only after legal and provider validation;
- Host performance fees or Host Pro;
- Creator royalty / licensing administration;
- VIP and upgrades;
- experience extras;
- post-experience commerce;
- Host SaaS / CRM / analytics;
- aggregated Demand Intelligence;
- idle-capacity matching;
- later promoted opportunities with explicit labeling.

Do not optimize only headline take rate.

Optimize:

**VALUE CREATED × CONVERSION × REPEAT × CONTRIBUTION MARGIN × TRUST**

## Current V1 implementation

The current demand-marketplace implementation is deliberately **DEV-only and synthetic**.

Route:

`/experience/demand-marketplace-lab`

It proves:

- visible public demand;
- **ME SUMO**;
- willingness-to-pay selection;
- synthetic commitment;
- unlock progress;
- Interest GMV;
- Verified Demand GMV;
- idea proposal;
- basic same-city duplicate detection;
- join-existing vs create-variant behavior;
- **HOST WANTED**;
- synthetic Host interest;
- experiences with and without Creator dependency.

The route must return 404 outside development.

No real payment, reservation, Host contract, venue booking, payout, production database migration or physical fulfillment is activated by this V1.

See:

[`docs/strategy/MARA_DEMAND_TO_EXPERIENCE_MARKETPLACE_V1.md`](./docs/strategy/MARA_DEMAND_TO_EXPERIENCE_MARKETPLACE_V1.md)

## Supporting strategic layers

The following remain active where compatible with the demand-to-experience amendment:

- [`MARA_FOUNDER_BUSINESS_CONSTITUTION.md`](./MARA_FOUNDER_BUSINESS_CONSTITUTION.md) — creator economy, privacy, creator business and marketplace foundation;
- Creator OS / Fan Intelligence strategy — creator-side CRM and monetization intelligence;
- Creator Commerce / Caprichos strategy — offers, creator demand and audience monetization;
- Revenue Expansion Platform strategy — transaction, SaaS, Growth, agency, brand and ecosystem revenue layers;
- [`MARA_LOW_MAINTENANCE_REVENUE_MACHINE.md`](./MARA_LOW_MAINTENANCE_REVENUE_MACHINE.md) — operating leverage doctrine;
- [`MARA_MONETIZATION_OS.md`](./MARA_MONETIZATION_OS.md) — existing monetization and commerce primitives;
- Character / World / social canons — execution systems, not the definition of the company.

## Marketplace moat

The defensible system can become the combination of:

**DEMAND GRAPH**
+
**WILLINGNESS-TO-PAY SIGNALS**
+
**VERIFIED COMMITMENTS**
+
**HOST NETWORK**
+
**CREATOR / IP NETWORK**
+
**EXPERIENCE TEMPLATES**
+
**TRANSACTION HISTORY**
+
**REPUTATION**
+
**CAPACITY MATCHING**
+
**MEMORY / REPEAT DEMAND**

The strategic advantage is knowing what people want before traditional supply knows what to build.

## Payment, compliance and trust are P0 architecture

Before real marketplace transactions activate, Mara must validate the actual business model with the relevant payment / payout providers and legal requirements.

That includes, where applicable:

- marketplace structure;
- third-party payouts;
- target geography;
- age / identity verification;
- Creator consent and IP rights;
- adult-oriented content/service compatibility;
- fraud / chargebacks;
- Host responsibility;
- cancellations / refunds;
- complaints / takedowns;
- physical-event safety;
- prohibited transaction categories.

A successful test payment is not proof that the business model is permitted.

## Premium and private data security

This repository is public.

Do not commit:

- final paid/private assets;
- private Creator source material;
- identity-verification documents;
- consent evidence;
- payout/tax records;
- private customer demand histories.

Private delivery and sensitive marketplace truth must remain server-authoritative with appropriate authorization.

## Current engineering boundary

The demand marketplace branch is intentionally stacked on the latest Creator OS + Revenue Platform branch rather than rebuilding from `main`.

No production alias movement, payment activation, payout activation, venue operation or merge is implied.

The repository still has an inherited independent launch blocker: the approved canonical Mara JPEG is truncated, and the dedicated integrity job must remain red until the exact approved source is restored. Do not “repair” that asset by merely appending bytes.

## Final operating doctrine

Mara should be rich for users, Creators and Hosts — and operationally boring for the founder.

Build systems that increase:

- verified demand;
- marketplace liquidity;
- transaction volume;
- Creator / Host earnings;
- repeat experiences;
- contribution margin;
- operating leverage.

Do not build complexity that does none of those things.

# DESIRE → DEMAND → EXPERIENCE → REVENUE → MEMORY → DESIRE
