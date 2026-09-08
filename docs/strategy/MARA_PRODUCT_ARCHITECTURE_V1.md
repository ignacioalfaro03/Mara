# MARA — PRODUCT ARCHITECTURE V1

Status: **CANONICAL PRODUCT ARCHITECTURE**  
Parent authority: `MARA_FOUNDER_CONSTITUTION_V2.md`  
Effective: 2026-09-08

This file maps the company thesis into a small number of engines, product surfaces and monetization rails. It exists to prevent strategy fragmentation.

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

`FULFILLED DEMAND GMV`

Mara does not need another strategic engine unless a future founder decision explicitly replaces this architecture.

---

# 2. ENGINE MAP

| Engine | Job | Core objects | Primary surfaces | Primary KPI |
|---|---|---|---|---|
| Creator Identity & Privacy | unlock creator supply safely | Creator, Character, Exposure Policy, Geo Policy, Voice Policy | Privacy Shield, Creator World Manager | creator activation / privacy-safe supply |
| Demand | capture and aggregate desire | Demand Request, Cluster, WANT, PLEDGE, COMMIT, WTP | Make It Happen, What Your World Wants | Verified Demand GMV |
| Commerce & Fulfillment | turn demand into delivered value | Offer, Purchase, Entitlement/Booking, Fulfillment | Store/Offers, checkout, library | Fulfilled Demand GMV |
| World, Memory & Retention | make participation accumulate | World, History Event, Collection, Membership, Activity | Creator World, My History, Since You Left | repeat purchase / returning-buyer GMV |

---

# 3. CONSUMER INFORMATION ARCHITECTURE

Target conceptual navigation:

- **HOME / WORLDS**
- **MAKE IT HAPPEN**
- **ACTIVITY**
- **ME**

Do not force a navigation rewrite merely for conceptual purity. Existing routes may be reused until the new architecture is production-proven.

## Creator World

A World should progressively contain:

- character identity;
- current offers;
- active demand;
- membership / Inner Circle;
- collections;
- relevant community activity;
- creator-approved availability;
- history / outcomes;
- future licensed local activations.

A Creator World replaces the need to think of profile, store, community and demand as four separate businesses.

---

# 4. CREATOR INFORMATION ARCHITECTURE

## Creator World Manager

Controls:

- public character identity;
- disclosure mode;
- offer/catalog settings;
- availability;
- World configuration.

## Privacy Shield

Controls:

- face / real-content exposure;
- voice mode;
- target markets;
- excluded markets;
- protected geographic zones;
- identity-leak warnings;
- representative / operator visibility rules.

## What Your World Wants

Shows aggregate opportunity:

- demand clusters;
- committed users;
- WTP;
- pledged/verified demand GMV;
- geography where safe;
- fulfillment complexity;
- suggested next commercial action.

## Commerce

Controls:

- offers;
- pricing;
- inventory/capacity;
- fulfillment state;
- earnings;
- refunds/cancellations where supported.

## Creator OS definition

“Creator OS” is the collection of these creator-side operating surfaces. It is not a fifth engine and not a separate strategic thesis.

---

# 5. CORE DATA / DOMAIN OBJECTS

The conceptual domain should converge around reusable primitives rather than feature-specific ledgers.

## Creator / Character

Represents verified private operator + public persona relationship.

## Exposure Policy

Defines what may be public across:

- identity;
- face;
- real content;
- voice;
- geography;
- direct interaction.

## Demand Request / Demand Cluster

Represents raw desire and grouped similar demand.

Fields conceptually include:

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

Potential families:

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

Records meaningful consequence such as:

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

# 6. CONCEPT CONSOLIDATION MATRIX

| Concept | Decision | Strategic home | Reason / destination |
|---|---|---|---|
| Mara Vera | KEEP | Creator Zero | acquisition + first commerce/demand proof |
| Creator Zero | KEEP | operating model | seed supply and reusable proof |
| Character Canon | KEEP | specialist execution | Mara-specific identity only |
| chatbot | DEMOTE | World/retention | bounded support, not core business |
| Relationship Engine | DEMOTE | World/retention | reuse only where it improves return/commerce |
| rituals | MERGE | Offer / World content | SKU/engagement format |
| Story Pass | MERGE | Offer | commercial format, not platform engine |
| audio inventory | MERGE | Offer | Creator Zero SKU format |
| immersive scenes | MERGE | Offer | Creator Zero SKU format |
| Creator Store | MERGE | Creator World | commerce surface inside World |
| Creator World | KEEP | World/retention | canonical creator container |
| Creator OS | KEEP | creator back office | cross-engine operating surface |
| Fan 360 | DEMOTE | Creator OS | transaction-scoped context only |
| Caprichos | MERGE | Demand + Commerce | branded demand/goal UX, no separate ledger |
| Make It Happen | KEEP | Demand | primary demand-creation action |
| WANT / PLEDGE / COMMIT | KEEP | Demand | economic signal ladder |
| Demand Marketplace | KEEP | Demand | canonical integrating DEV lab / future network primitive |
| Demand Graph | KEEP | Demand/moat | aggregate compounding asset |
| My History | KEEP | World/retention | consequence and return |
| Since You Left | KEEP | World/retention | return surface after history exists |
| Inner Circle | KEEP | World + Commerce | membership product family, NEXT |
| Creator Privacy Shield | KEEP | Identity & Privacy | core supply differentiator |
| voice transformation | MERGE | Privacy Shield | voice exposure control |
| geo-fencing | MERGE | Privacy Shield | geographic exposure control |
| City Activation | DEFER | Demand + Privacy | requires geo liquidity |
| Creator Host | DEFER | Fulfillment | future representative/operator role |
| Host Marketplace | DEFER | Fulfillment | requires validated physical demand |
| Role Marketplace | DEFER | Fulfillment | later supply/reputation layer |
| MARA IRL | DEFER | Fulfillment | later, gated by safety/ops/provider readiness |
| Event VIP | DEFER | Commerce | physical scarcity/service layer |
| Global VIP | DEFER | Commerce | requires multi-World liquidity |
| Concierge | DEFER | Fulfillment/Commerce | high operational load; later |
| Creator Pro | KEEP | monetization | only after real workflow value exists |
| Creator Growth | DEFER | Creator OS | distribution tooling after creator pilot |
| Agency OS | DEFER | B2B | later scale layer |
| Brand Marketplace | DEFER | B2B | later, after organic creator commerce |
| Creator App Store | DEFER | ecosystem | maturity-stage platform layer |
| promoted discovery | DEFER | marketplace revenue | requires organic discovery liquidity |
| Mara Pass | DEFER | consumer recurring | only after cross-World repeat value |
| generic social feed | KILL | none | weak strategic fit / complexity |
| unlimited AI chat | KILL | none | variable cost + strategic distraction |
| 3D world/metaverse | KILL | none | no MVP value |
| crypto/NFT economy | KILL | none | no current business need |
| separate new lab per idea | KILL | governance | causes strategic entropy |

KILL means do not roadmap/build. Existing code need not be destructively removed unless maintenance cost later justifies cleanup.

---

# 7. LAB PORTFOLIO

The repository currently contains multiple DEV labs. They are evidence, not independent product lines.

## Canonical integrator

`/experience/demand-marketplace-lab`

This should increasingly prove the end-to-end strategic loop because it already spans demand family, World context, privacy mode, WTP, commitment and opportunity.

## Supporting evidence labs

- `creator-os-lab` — creator back-office/provenance evidence;
- `revenue-engine-lab` — economic scenario evidence;
- `commerce-lab` — commerce primitives;
- `caprichos-lab` — branded goal/demand behavior;
- `wtp-lab` — WTP evidence;
- `rituals-lab` — Creator Zero content/engagement evidence;
- other historical labs — preserve as research unless maintenance becomes material.

Rule:

> **NO NEW DEV LAB IF THE HYPOTHESIS CAN BE PROVEN BY EXTENDING THE CANONICAL INTEGRATOR OR AN EXISTING SPECIALIST LAB.**

---

# 8. MONETIZATION MAP

| Rail | Payer | Engine | Phase | Value |
|---|---|---|---|---|
| transaction take | Creator/buyer economics | Commerce | NOW/NEXT | demand + checkout + fulfillment infrastructure |
| differentiated source economics | Creator | Demand + Commerce | NEXT | fair pricing based on who generated demand |
| Creator Pro | Creator | Creator OS | NEXT/LATER | analytics/automation/merchandising/privacy workflow |
| Inner Circle | buyer | World + Commerce | NEXT | recurring access/belonging |
| Studio/setup | Creator | Privacy + Commerce | LATER | managed character/business setup |
| VIP | buyer | Commerce | LATER | scarcity, service, privacy, hospitality |
| Host/licensing fees | Host/Creator/operator | Fulfillment | LATER | validated demand + orchestration |
| venue/capacity matching | Venue/Host | Fulfillment | LATER | demand access and utilization |
| concierge | buyer | Fulfillment | LATER | high-value coordination |
| Agency OS | agency | Creator OS | LATER | multi-creator operations |
| promoted discovery | Creator/brand | Demand/discovery | LATER | paid distribution after organic liquidity |

---

# 9. BUILD FILTER

A feature may enter execution only if it materially improves at least one:

- creator activation;
- demand quality;
- fulfillment/conversion;
- repeat purchase;
- creator earnings;
- contribution margin;
- trust/privacy/compliance;
- operating leverage.

It must also have:

- one strategic engine;
- one accountable KPI;
- one phase;
- one clear user/payer.

Otherwise: backlog, not roadmap.

---

# 10. FINAL PRODUCT TEST

The architecture is coherent when every meaningful feature can be explained as:

`PRIVACY-SAFE CREATOR SUPPLY → WORLD → DEMAND → OFFER → FULFILLMENT → HISTORY → RETURN`

Anything outside that loop requires exceptional justification.

**NO MERGE unless Ignacio explicitly writes `mergea`.**
