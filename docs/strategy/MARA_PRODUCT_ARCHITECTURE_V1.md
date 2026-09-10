# MARA — PRODUCT ARCHITECTURE V1

Status: **CANONICAL PRODUCT ARCHITECTURE**  
Parent authority: `MARA_FOUNDER_CONSTITUTION_V2.md`  
Effective: 2026-09-08

This file maps the company thesis into a small number of engines, surfaces and monetization rails. It also prevents the user experience from degenerating into either a generic marketplace or an overbuilt virtual world.

---

# 1. ARCHITECTURE IN ONE VIEW

`CREATOR IDENTITY & PRIVACY`
+
`DEMAND`
+
`COMMERCE & FULFILLMENT`
+
`WORLD, MEMORY & RETENTION`

→

`CONNECTED CREATOR WORLDS`

→

`FULFILLED DEMAND GMV + RETURN`

Mara is the connective host/intelligence layer across the Worlds. Mara is not another creator competing inside the network.

---

# 2. EXPERIENCE CONTRACT

The economics underneath can behave like a marketplace. The product surface should feel like a connected set of living Creator Worlds.

Permanent rule:

> **DO NOT BUILD IMMERSION. DESIGN THE FEELING OF IMMERSION.**

The product should achieve that feeling with only three mechanisms unless evidence justifies more:

1. **Creator World** — one coherent creator space.
2. **Mara Connects** — lightweight discovery/context across Worlds.
3. **Continuity** — meaningful user actions reappear later as history, progress or consequence.

No 3D world, game map, complex lore, XP economy or metaverse is required.

A proposed immersive feature must improve at least one of:

- conversion;
- return/retention;
- demand quality;
- cross-World discovery.

Otherwise do not build it.

---

# 3. ENGINE MAP

| Engine | Job | Core objects | Primary surfaces | Primary KPI |
|---|---|---|---|---|
| Creator Identity & Privacy | unlock creator supply safely | Creator, Persona, Exposure Policy, Geo Policy, Voice Policy | Privacy Shield, Creator World Manager | creator activation / privacy-safe supply |
| Demand | capture and aggregate desire | Demand Request, Cluster, WANT, PLEDGE, COMMIT, WTP | Make It Happen, What Your World Wants | Verified Demand GMV |
| Commerce & Fulfillment | turn demand/inventory into delivered value | Offer, Purchase, Entitlement/Booking, Fulfillment | contextual offers, checkout, library/history | Fulfilled Demand GMV |
| World, Memory & Retention | make participation accumulate | World, History Event, Collection, Membership, Activity | Creator World, For You, My History, Since You Left | repeat purchase / returning-buyer GMV |

---

# 4. MARA'S PRODUCT ROLE

Mara is the layer behind the network that:

- connects Creator Worlds;
- curates relevant discovery;
- remembers meaningful participation;
- detects and aggregates demand;
- helps creators understand opportunity;
- applies privacy/trust rules;
- improves offer packaging and timing;
- coordinates commerce and later fulfillment.

Mara Vera may remain a brand/experience persona and product-test asset, but should not be presented as “another creator” or used as the structural template for every creator.

Internal principle:

> **MARA IS BEHIND THE WORLDS, NOT JUST ANOTHER WORLD.**

---

# 5. CONSUMER INFORMATION ARCHITECTURE

Target conceptual navigation:

- **FOR YOU / HOME**
- **MAKE IT HAPPEN**
- **ACTIVITY**
- **ME**

Avoid marketplace-first navigation dominated by `Creators / Store / Events / Buy`.

Commerce should remain easy to access, but inside context.

## For You / Home

Mara can surface simple connective cards such as:

- something new from a followed World;
- a demand item that is growing;
- an item the user joined that changed state;
- a relevant new creator;
- “while you were away” updates.

This is not a generic feed. Every card should have a clear reason to exist.

## Creator World

A World progressively contains:

- creator persona/identity;
- what is new;
- current offers/unlocks;
- active demand;
- membership/Inner Circle;
- collections;
- creator-approved availability;
- relevant community activity;
- the user's history with that creator;
- later licensed local activations.

A Creator World replaces the need to think of profile, store, community and demand as separate businesses.

## Make It Happen

Demand creation/joining surface.

The UX may use human language like:

- “people are asking for this”;
- “this is growing”;
- “join”;
- “I'd pay…”;
- “help make it happen”.

The underlying economic states must remain explicit and truthful.

## Activity / History

Shows:

- demand joined;
- pledge/commit state;
- purchases;
- unlocks;
- fulfillment;
- relevant callbacks.

This is where continuity becomes visible.

---

# 6. COMMERCE CLARITY RULE

Immersive presentation stops being abstract when money moves.

At checkout/commitment boundaries Mara must clearly state:

- exact product/experience;
- price;
- fulfillment owner;
- what the user gets;
- expected timing;
- rules;
- cancellation/refund conditions where applicable.

Principle:

> **WORLD ON THE SURFACE. COMMERCE CLARITY AT CHECKOUT.**

Do not hide material commercial facts behind narrative language.

---

# 7. CREATOR INFORMATION ARCHITECTURE

## Creator World Manager

Controls:

- public persona;
- disclosure mode;
- offers/catalog;
- availability;
- World configuration.

Creators should not need to become game designers or daily community operators.

## Privacy Shield

Controls:

- face/real-content exposure;
- voice mode;
- target markets;
- excluded markets;
- protected geographic zones;
- identity-leak warnings;
- representative/operator visibility rules.

## What Your World Wants

Shows aggregated opportunity:

- demand clusters;
- commitment level;
- WTP;
- verified demand GMV;
- safe geography;
- fulfillment complexity;
- suggested next action.

## Commerce

Controls:

- offers;
- pricing;
- inventory/capacity;
- fulfillment state;
- earnings;
- refunds/cancellations where supported.

## Creator OS

Creator OS is the collection of these creator-side operating surfaces. It is not a fifth engine and not a separate thesis.

---

# 8. CORE DOMAIN OBJECTS

Use reusable primitives rather than feature-specific ledgers.

## Creator / Persona

Private verified operator + public persona relationship.

## Exposure Policy

Controls identity, face, real content, voice, geography and direct interaction.

## Creator World

Persistent container connecting persona, offers, demand, activity and history.

## Demand Request / Demand Cluster

Represents raw desire and grouped similar demand.

Conceptual fields:

- World/Creator;
- category;
- desired fulfillment;
- location where applicable;
- privacy mode;
- WANT count;
- PLEDGE/WTP;
- COMMIT signal;
- threshold;
- status.

## Offer

Reusable sellable contract.

Families:

- DIGITAL_PRODUCT;
- PERSONALIZED_DIGITAL;
- MEMBERSHIP;
- BOUNDED_INTERACTION;
- MERCH/PREORDER later;
- PHYSICAL/HYBRID EXPERIENCE later.

## Purchase / Entitlement / Booking

Commerce truth. Do not create one ledger per branded experience.

## Fulfillment

Tracks promised value becoming delivered value.

## History Event

Meaningful consequence such as:

- DEMAND_CREATED;
- DEMAND_JOINED;
- PLEDGE_CREATED;
- COMMIT_CREATED;
- DEMAND_UNLOCKED;
- PURCHASE_COMPLETED;
- FULFILLMENT_COMPLETED;
- MEMBERSHIP_STARTED;
- EVENT_ATTENDED later.

---

# 9. CONCEPT CONSOLIDATION MATRIX

| Concept | Decision | Strategic home | Reason / destination |
|---|---|---|---|
| Mara | KEEP | connective host/intelligence layer | connects Worlds, demand, memory and discovery |
| Mara Vera | KEEP | brand/experience persona | acquisition + brand + controlled product testing; not another marketplace creator |
| Creator Zero framing | DEMOTE | historical/product proof | useful internally for old commerce evidence, not current user-facing company model |
| Character Canon | KEEP | specialist execution | Mara Vera-specific identity only |
| chatbot | DEMOTE | World/retention | bounded assistance, not core business |
| Relationship Engine | DEMOTE | World/retention | reuse only where it improves return/commerce |
| rituals | MERGE | Offer / World content | SKU/engagement format |
| Story Pass | MERGE | Offer | commercial format, not platform engine |
| audio inventory | MERGE | Offer | offer format |
| immersive scenes | MERGE | Offer | offer/content format, not product architecture |
| Creator Store | MERGE | Creator World | commerce surface inside World |
| Creator World | KEEP | World/retention | canonical creator container |
| Creator OS | KEEP | creator back office | cross-engine operating surface |
| Fan 360 | DEMOTE | Creator OS | transaction-scoped context only |
| Caprichos | MERGE | Demand + Commerce | branded demand/goal UX, no separate ledger |
| Make It Happen | KEEP | Demand | primary demand-creation action |
| WANT / PLEDGE / COMMIT | KEEP | Demand | economic signal ladder |
| Demand Marketplace | KEEP | Demand | canonical integrating DEV lab / network primitive |
| Demand Graph | KEEP | Demand/moat | aggregate compounding asset |
| My History | KEEP | World/retention | continuity and return |
| Since You Left | KEEP | World/retention | return cue after history exists |
| Mara Connects / For You | KEEP | World/retention | lightweight cross-World connection, not generic feed |
| Inner Circle | KEEP | World + Commerce | membership family, evidence-gated |
| Creator Privacy Shield | KEEP | Identity & Privacy | core supply differentiator |
| voice transformation | MERGE | Privacy Shield | voice exposure control |
| geo-fencing | MERGE | Privacy Shield | geographic exposure control |
| City Activation | DEFER | Demand + Privacy | requires geo liquidity |
| Creator Host | DEFER | Fulfillment | future representative/operator role |
| Host Marketplace | DEFER | Fulfillment | requires validated physical demand |
| Role Marketplace | DEFER | Fulfillment | later supply/reputation layer |
| MARA IRL | DEFER | Fulfillment | later, gated by safety/ops/provider readiness |
| VIP | DEFER | Commerce | scarcity/service/privacy/priority, never consent |
| Concierge | DEFER | Fulfillment/Commerce | high operational load |
| Creator Pro | KEEP | monetization | only after real workflow value exists |
| Creator Growth | DEFER | Creator OS | after creator pilot |
| Agency OS | DEFER | B2B | later scale layer |
| Brand Marketplace | DEFER | B2B | later |
| promoted discovery | DEFER | marketplace revenue | requires organic discovery liquidity |
| generic social feed | KILL | none | complexity without clear strategic value |
| unlimited AI chat | KILL | none | variable cost + strategic distraction |
| 3D world/metaverse | KILL | none | immersion does not require it |
| game map / heavy lore | KILL | none | operational complexity without current KPI case |
| XP/complex badge economy | KILL | none | unnecessary gamification |
| crypto/NFT economy | KILL | none | no current business need |
| separate new lab per idea | KILL | governance | causes strategic entropy |

KILL means do not roadmap/build. Existing code need not be destructively removed unless maintenance later justifies cleanup.

---

# 10. LAB PORTFOLIO

Canonical strategic integrator:

`/experience/demand-marketplace-lab`

Supporting evidence labs:

- `creator-os-lab`;
- `revenue-engine-lab`;
- `commerce-lab`;
- `caprichos-lab`;
- `wtp-lab`;
- `rituals-lab`;
- other historical labs as research.

Do **not** create a separate “immersive world lab”. The practical experience hypothesis should be tested by improving existing surfaces.

> **NO NEW DEV LAB IF THE HYPOTHESIS CAN BE PROVEN BY EXTENDING THE CANONICAL INTEGRATOR OR AN EXISTING SPECIALIST LAB.**

---

# 11. MONETIZATION MAP

| Rail | Payer | Engine | Phase | Value |
|---|---|---|---|---|
| transaction take | Creator/buyer economics | Commerce | NOW/NEXT | demand + checkout + fulfillment infrastructure |
| differentiated source economics | Creator | Demand + Commerce | NEXT | fair pricing based on who generated demand |
| Creator Pro | Creator | Creator OS | NEXT/LATER | analytics/automation/merchandising/privacy workflow |
| Inner Circle | buyer | World + Commerce | NEXT | recurring access/belonging |
| Studio/setup | Creator | Privacy + Commerce | LATER | managed persona/business setup |
| VIP | buyer | Commerce | LATER | scarcity, service, privacy, hospitality |
| Host/licensing fees | Host/Creator/operator | Fulfillment | LATER | validated demand + orchestration |
| venue/capacity matching | Venue/Host | Fulfillment | LATER | demand access and utilization |
| concierge | buyer | Fulfillment | LATER | high-value coordination |
| Agency OS | agency | Creator OS | LATER | multi-creator operations |
| promoted discovery | Creator/brand | Demand/discovery | LATER | paid distribution after organic liquidity |

---

# 12. BUILD FILTER

A feature may enter execution only if it materially improves at least one:

- creator activation;
- demand quality;
- fulfillment/conversion;
- repeat purchase;
- cross-World discovery;
- creator earnings;
- contribution margin;
- trust/privacy/compliance;
- operating leverage.

It must also have:

- one strategic engine;
- one accountable KPI;
- one phase;
- one clear user/payer;
- an existing surface whenever possible.

Otherwise: backlog, not roadmap.

---

# 13. FINAL PRODUCT TEST

The architecture is coherent when the user can feel:

`I ENTER A WORLD → SOMETHING MATTERS → I PARTICIPATE → SOMETHING CHANGES → MARA REMEMBERS → I DISCOVER WHAT COMES NEXT`

while the business underneath runs:

`PRIVACY-SAFE CREATOR SUPPLY → DEMAND → OFFER → PURCHASE → FULFILLMENT → HISTORY → RETURN`

The first loop is the experience.

The second loop is the business.

They should reinforce each other without requiring a complex virtual world.

**NO MERGE unless Ignacio explicitly writes `mergea`.**