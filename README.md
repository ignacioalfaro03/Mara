# Mara

> ## 🔒 READ THIS FIRST — FOUNDER BUSINESS CONSTITUTION
>
> **The highest-priority business authority for this repository is [`MARA_FOUNDER_BUSINESS_CONSTITUTION.md`](./MARA_FOUNDER_BUSINESS_CONSTITUTION.md).**
>
> Mara is now defined as a **private creator economy marketplace and monetization operating system** for verified adult creators who want to build and monetize digital personas while retaining control over how much of their real-world identity becomes public.
>
> Core promise: **YOUR IDENTITY STAYS YOURS. YOUR CHARACTER EARNS.**
>
> **Mara Vera is Creator Zero.** She is the first character, initial demand engine and reusable commerce proof — not the ceiling of the company.
>
> Older Mara-only, chatbot-first, relationship-first, adult-catalog-first or storefront-only assumptions are subordinate when they conflict with the Founder Business Constitution.
>
> Founder boundary: **NO MERGE without Ignacio saying exactly `mergea`.** No production deployment, payment activation, payout activation or external spend is implied by strategy work.

## Business thesis

Mara exists to unlock creator supply that conventional public creator platforms may fail to capture: adults who want to monetize personality, creativity, voice, content, experiences or bounded time without making their legal identity, employer-facing identity or personal social graph the public product.

The platform separates:

**PRIVATE VERIFIED CREATOR → PUBLIC CHARACTER → SKU / EXPERIENCE → CUSTOMER → TRANSACTION → CREATOR EARNINGS**

Public pseudonymity is not regulatory anonymity. Mara must privately verify creators and satisfy age, identity, consent, payment, tax and lawful-disclosure requirements where applicable.

Mara must also be truthful with customers about whether they are interacting with:

- a fictional AI-generated character;
- a verified adult creator operating a character;
- AI-generated output;
- the creator directly;
- or an explicitly disclosed combination.

Privacy is a product benefit. Deception is not.

## Mara Vera = Creator Zero

Mara Vera remains strategically important.

She is:

- the first character;
- the initial social acquisition engine;
- the first storefront;
- the first content catalog;
- the first conversion test;
- the first reusable commerce template;
- the proof that a character can create demand and transactions.

Her current Character Canon remains authoritative for Mara Vera specifically:

[`MARA_CHARACTER_CANON.md`](./MARA_CHARACTER_CANON.md)

Permanent character rule remains:

**ONE MARA. MANY CONTEXTS.**

The character canon does not define the entire future marketplace. Future verified creators may have their own characters and character-specific canons.

## Current product architecture

The company now has two linked systems.

### 1. Mara Originals / Creator Zero

Current reusable commercial loop:

**Social → Mara → storefront → free taste → purchase → library → related product → repeat purchase**

This continues because it proves the transaction primitive the future marketplace needs.

### 2. Mara Creators

Future marketplace loop:

**Creator → character → product/SKU → buyer → earnings → repeat buyer → more creator supply**

Initial creator products may include:

- digital collections;
- audio;
- personalized digital products;
- bounded paid chat windows;
- scheduled audio/video interaction where enabled;
- memberships;
- bundles;
- later creator collaboration products.

Sexual explicitness is not the monetization ladder.

Higher willingness to pay should primarily come from:

**MORE ACCESS + MORE PERSONALIZATION + MORE SCARCITY + MORE CREATOR TIME + BETTER CATALOG + BETTER DISTRIBUTION.**

## Creator exposure ladder

Creators should be able to stop at any level they choose.

1. **Character only** — public digital persona; minimal public personal exposure.
2. **Voice** — optional voice products/interactions.
3. **Selective real content** — only creator-approved real media.
4. **Direct interaction** — bounded, scheduled interaction under creator-defined rules.

No creator should need to connect her full public identity merely to make the product economically viable.

## Monetization architecture

Mara should not depend on a single revenue stream.

Potential engines, subject to real validation:

- marketplace transaction take rate;
- creator SaaS / Pro tooling;
- managed Studio/setup services;
- Creator Privacy Pro;
- merchandising/catalog optimization tooling;
- personalized digital products;
- bounded scheduled creator time;
- creator referrals/collaborations;
- consumer Mara Pass later;
- promoted discovery later;
- B2B / white-label creator infrastructure later.

Every monetization mechanism must be evaluated on contribution margin, creator benefit, customer value, scalability, founder burden, payment risk and compliance risk.

## Marketplace North Star

Do not optimize creator count or follower count in isolation.

The supply-side question is:

> **Can an adult creator who would not have built a conventional public creator business create a character, launch a SKU, earn money and repeat the process while exposing less of her real-world identity?**

Key operating metric:

**CREATOR NET EARNINGS / CREATOR HOURS INVESTED**

Key network behavior:

**FIRST PURCHASE → SECOND PURCHASE → SECOND CREATOR → NETWORK RETENTION**

## The moat

Avatar generation alone is not the moat. It will commoditize.

The defensible system is the combination of:

**PRIVATE CREATOR IDENTITY**
+
**CHARACTERS**
+
**CREATOR TRUST**
+
**CONTENT / PRODUCT INVENTORY**
+
**PAYMENTS / PAYOUTS**
+
**DISCOVERY**
+
**CUSTOMER DEMAND GRAPH**
+
**CREATOR CRM**
+
**BOOKING / CAPACITY**
+
**AUTOMATION**
+
**CROSS-SELLING**
+
**MARKETPLACE LIQUIDITY**

The strongest possible supply-side outcome is:

> **Creators make more money per hour on Mara while exposing less of their real identity than they would alone.**

## Web-first

The first-party website remains the core surface.

It must support:

- character discovery;
- creator storefronts;
- digital product commerce;
- creator intake;
- customer accounts/library;
- compliance/disclosure;
- analytics;
- later booking and cross-creator discovery.

Native mobile is not a launch dependency while adult-oriented creator/UGC distribution policy risk remains material.

## Payment and compliance are P0 architecture

Do not assume a generic payment processor will support the final model.

Before real third-party creator commerce activates, Mara must verify provider compatibility for:

- target geography;
- marketplace/platform structure;
- third-party creator payouts;
- adult-oriented content/services if present;
- AI/synthetic content if present;
- KYC/age verification;
- consent records;
- chargebacks/fraud;
- complaints/takedowns;
- prohibited transaction categories.

A successful test payment is not proof that the business model is permitted.

## Premium asset security

This repository is public.

Never commit final paid/private assets or creator-private source material to the public repo.

Private content delivery must remain server-authoritative and entitlement-gated. Creator identity artifacts, verification records, consent documentation and payout/tax data must live outside the public repository under appropriate access controls.

See [`MARA_LOW_MAINTENANCE_REVENUE_MACHINE.md`](./MARA_LOW_MAINTENANCE_REVENUE_MACHINE.md) for the active operating-efficiency and private premium delivery contract.

## Current implementation status

The active founder-thesis PR adds:

- the Founder Business Constitution;
- marketplace execution plan;
- `/creators` pilot acquisition surface;
- server-only creator-interest intake;
- RLS/revoked-browser-access migration contract;
- explicit creator-pilot privacy language;
- creator-intake CI smoke;
- synchronization with the latest storefront/private premium delivery base.

On the exact founder-thesis head, the main Web Launch `validate` job passes dependency audit, parser self-test, DEV-lab guard, TypeScript, production build and the full production mobile/browser smoke suite. The repository still has a separate pre-existing launch blocker: the canonical Mara JPEG is truncated and the dedicated integrity job correctly remains red until the exact approved source image is restored.

## Current validation sequence

1. Restore the exact approved canonical Mara source image; do not patch the truncated JPEG by merely appending bytes.
2. Apply the `creator_interest` migration only in an isolated/authorized environment.
3. Prove `/creators → persisted creator interest` end-to-end.
4. Interview/recruit 10–20 target adult creators.
5. Validate exposure preferences, product preferences and economics.
6. Resolve payment/payout/provider eligibility in parallel.
7. Design the 5–10 creator private pilot only after supply + provider credibility.
8. Prove `FIRST SKU → FIRST SALE → SECOND SALE → PAYOUT`.
9. Automate only after the manual pilot proves the workflow.

## Operating doctrine

The active low-maintenance operating rules remain useful, but are subordinate to the Founder Business Constitution:

[`MARA_LOW_MAINTENANCE_REVENUE_MACHINE.md`](./MARA_LOW_MAINTENANCE_REVENUE_MACHINE.md)

Core operating principle:

> **Mara should be rich for creators and customers and boring for the founder to operate.**

Build systems that increase creator earnings, demand, transactions, margin or operating leverage.

Do not build complexity that does none of those things.
