# MARA — DEMAND-TO-EXPERIENCE MARKETPLACE V1

Status: Founder strategy + product execution contract  
Effective: 2026-09-08  
Parent authority: `MARA_DEMAND_TO_EXPERIENCE_FOUNDER_AMENDMENT.md`

> **MARA TURNS DESIRE INTO DEMAND, AND DEMAND INTO EXPERIENCES.**

---

# 1. EXECUTIVE THESIS

Mara should not begin with the question “what event should we sell?”.

Mara should begin with:

> **What do people want to happen?**

Then:

> **How many other people want the same thing?**

Then:

> **How much of that interest is economically real?**

Finally:

> **Who can execute it safely and profitably?**

The company is therefore evolving into a **demand-to-experience marketplace**.

The marketplace can include Creators, but it does not require a Creator in every transaction. Mara Vera is Creator Zero, the first demand-generating universe and the first IP around which repeatable Experience Templates can be tested.

The durable asset is not a catalog of events. It is the **Demand Graph**: privacy-safe knowledge of what groups of people want, where they want it, when they want it and what they are prepared to pay.

---

# 2. PRODUCT CATEGORY

Mara is not primarily:

- an event ticketing site;
- a crowdfunding site;
- a generic social feed;
- a venue marketplace;
- a creator subscription page;
- an AI chatbot;
- a single virtual-character storefront.

Mara combines four systems:

1. **Demand Engine** — captures, groups and validates what people want.
2. **Experience Marketplace** — converts validated demand into executable opportunities.
3. **Host / Creator / Operator Network** — supplies venues, IP, production and execution.
4. **Transaction + Trust Layer** — handles payment, access, reputation, rules, refunds, compliance and revenue splits when authorized.

---

# 3. CORE LOOP

Canonical loop:

`DESIRE → DISCOVER → JOIN → WTP → COMMIT → VALIDATE → HOST → UNLOCK → BOOK → EXPERIENCE → MEMORY → NEXT DESIRE`

## Desire
A user expresses something they want to happen.

## Discover
Other users see existing demand in a public, community, unlisted or private context.

## Join
A user says “I want this too”.

## WTP
The user indicates willingness to pay.

## Commit
A stronger economic signal is recorded. In the future this may be a deposit, reservation or provider-supported authorization. V1 does not activate real money.

## Validate
The demand reaches a threshold sufficient to become a business opportunity.

## Host
A venue, operator or Creator Host can apply to execute it.

## Unlock
Required conditions are met.

## Book
Real transaction phase starts once provider, legal, operational and payment gates are cleared.

## Experience
Digital, physical or hybrid fulfillment occurs.

## Memory
The user receives history, media, reviews, callbacks, repeat options and related demand.

## Next Desire
Completed experiences create new demand.

---

# 4. ACTORS

## 4.1 Demander

A user who proposes or joins demand.

The Demander should not need to know venue capacity, production requirements or operating economics.

The minimum valid input is a natural-language desire plus enough context to place it in a market.

Example:

> “Quiero karaoke con gente de Mara en Chillán.”

## 4.2 Creator

A creator or character can add:

- audience;
- identity;
- IP;
- approval;
- digital content;
- attendance;
- voice;
- experience design.

A Creator may be present physically, digitally, through licensed IP, or not at all.

## 4.3 Creator Host

An authorized person or team that operates experiences for a Creator.

## 4.4 Venue Host

Examples:

- pub;
- bar;
- restaurant;
- hotel;
- event venue;
- club;
- studio;
- gym;
- entertainment business.

The Venue Host supplies physical capacity and operating execution.

## 4.5 Operator

Independent organizer / production capability that can assemble the required supply even without owning the venue.

---

# 5. DEMAND OBJECTS

Mara needs two related concepts.

## DemandRequest

Raw expression of desire.

Example:

> “Quiero una fiesta de máscaras de Mara en Chillán.”

A DemandRequest may have only one user.

## DemandCluster

Canonical grouped demand representing sufficiently similar requests.

Example:

`MARA_MASKED_NIGHT / CHILLAN`

The cluster holds aggregated marketplace truth:

- canonical title;
- city / market;
- category;
- Creator / IP when applicable;
- visibility;
- interested count;
- willingness-to-pay distribution;
- verified commitments;
- target threshold;
- stage;
- Host status;
- variants;
- source mix.

One Experience can later be created from a DemandCluster.

---

# 6. DUPLICATE PREVENTION AND CLUSTERING

Demand fragmentation is a direct liquidity risk.

Before a user creates a new public demand, Mara should search for similar existing clusters.

Example inputs:

- “Mara Party Chillán”
- “Fiesta de Mara en Chillán”
- “Mara Night Chillan”

should trigger a suggestion that an existing demand may already represent the same outcome.

V1 can use basic token similarity + same-city checks.

Future versions can add embeddings, semantic classification and operator moderation.

Rules:

1. same city strongly increases similarity;
2. same Creator / IP increases similarity;
3. category overlap increases similarity;
4. materially different privacy, date, capacity or format requirements can justify variants;
5. automatic merging must never destroy meaningful user intent.

---

# 7. DEMAND STATES

Canonical marketplace states:

## IDEA
Early demand.

## RISING
Momentum is increasing.

## VALIDATED
Enough economic signal exists to consider supply matching.

## HOST WANTED
Demand is sufficiently valuable and no suitable Host has been selected.

## HOST PROPOSALS
One or more Hosts are competing / proposing execution.

## UNLOCKED
Required demand and supply conditions are met.

## BOOKING
Real booking / transaction phase.

## HAPPENING
Experience is confirmed / active.

## COMPLETED
Fulfilled.

## MEMORY
Post-experience content, history and next-demand loop.

V1 implements the visual and business semantics of these states using synthetic data only.

---

# 8. CONSUMER DISCOVERY

The consumer Home should eventually answer:

> **What do you want to experience?**

Primary sections:

- Trending;
- Near You;
- Almost Unlocked;
- New Desires;
- Mara Picks;
- Hosts Wanted;
- Happening.

Demand itself becomes content.

Each card should prioritize emotion and clarity before analytics.

Minimum card contract:

- title;
- city;
- people interested;
- verified commitments;
- progress;
- willingness-to-pay signal;
- state;
- primary CTA: **ME SUMO**.

---

# 9. JOIN AND COMMITMENT LADDER

Interest quality is progressive.

## Signal 1 — Interested

“I like this.”

## Signal 2 — I’d go

“I would probably attend.”

## Signal 3 — I’d pay

“I would pay approximately X.”

## Signal 4 — Commit

Strongest signal.

Possible future mechanisms:

- deposit;
- reservation fee;
- preauthorization;
- balance / credit only after legal review.

V1 simulates commitment only. It must not claim a payment occurred.

---

# 10. WILLINGNESS TO PAY

WTP is strategically useful because it produces a demand curve rather than a vanity count.

Example:

- 42 users at CLP 15,000;
- 73 at CLP 25,000;
- 31 at CLP 40,000.

This supports aggregated pricing recommendations.

Do not use hidden individualized pricing based on personal vulnerability or private traits.

Price intelligence should be group-level and explainable.

---

# 11. DEMAND GMV MODEL

Mara must keep economic stages separate.

## Interest GMV
Estimated value inferred from non-verified WTP.

## Verified Demand GMV
Value represented by economically stronger verified commitments.

## Unlocked GMV
Value attached to demand that cleared marketplace thresholds.

## Executed GMV
Real completed marketplace transactions.

## Mara Revenue
Revenue earned by Mara from cleared transactions / services.

These values must never be presented as equivalent.

North Star hypothesis:

# VERIFIED DEMAND GMV

Reason: it measures whether Mara can convert desire into credible purchasing power before execution.

---

# 12. HOST MARKETPLACE

The Host proposition is not “advertise on Mara”.

It is:

> **There is validated demand near you. Can you fulfill it?**

A Host opportunity card may show:

- experience title;
- city;
- category;
- interested count;
- committed count;
- average WTP;
- potential GMV;
- required capacity;
- target date / window;
- Creator / license conditions;
- status.

CTA:

`APPLY TO HOST`

Future Host proposals can include:

- venue;
- date;
- capacity;
- base economics;
- revenue share;
- services included;
- security plan;
- production capability;
- cancellation terms.

---

# 13. HOST COMPETITION

Multiple Hosts may compete for validated demand.

This should improve:

- pricing;
- venue quality;
- economics;
- dates;
- capacity;
- reliability.

Mara should not blindly select the cheapest proposal.

Host ranking should eventually account for:

- economics;
- reputation;
- cancellation history;
- safety/compliance;
- experience fit;
- customer outcomes.

---

# 14. CREATOR IP AS EXPERIENCE SUPPLY

Creators can authorize experiences around their brand / character.

Possible settings:

- approved cities;
- formats;
- categories;
- Creator presence required: yes/no;
- royalty;
- minimum economics;
- approval required;
- branding rules;
- content assets;
- safety boundaries.

A successful Experience can become a repeatable template.

Example:

`MARA MASKED NIGHT`

can be copied from Santiago to Concepción to Chillán while retaining a proven operating blueprint.

This creates an **Experience Template / Experience Franchise** layer.

---

# 15. BRING THIS TO MY CITY

Every successful / visible experience should eventually support:

# BRING THIS TO MY CITY

A user can create a local DemandCluster derived from an existing Experience Template.

Benefits:

- organic geographic expansion;
- less ideation friction;
- reusable proven formats;
- stronger Creator licensing economics;
- faster Host matching.

---

# 16. EXPERIENCE TYPES

## Physical

Examples: legal entertainment, hospitality, food, sports, creator, cultural, educational, social or community formats.

## Digital

Examples: livestream, group session, creator session, guided digital experience, content event, challenge, class.

## Hybrid

Physical experience plus digital participation / Creator layer / post-experience content.

The data model must not assume a venue for every Experience.

---

# 17. VISIBILITY

Demand can be:

## PUBLIC
Discoverable.

## COMMUNITY
Restricted to an approved community.

## UNLISTED
Link-only.

## PRIVATE
Invitation-only.

Visibility is separate from commercial validity.

A private pool may still generate strong verified demand.

---

# 18. MONETIZATION ARCHITECTURE

Mara should monetize the lifecycle in multiple defensible layers.

## A. Transaction take rate
Core fee on executed GMV.

## B. Commitment economics
Reservation / commitment fee only after provider, refund and legal model is proven.

## C. Host fee
Performance, opportunity access or subscription economics where the Host receives measurable value.

## D. Creator royalty administration
Mara can facilitate licensing / revenue share and capture platform economics.

## E. VIP / upgrades
Higher-value tiers without obscuring base economics.

## F. Experience extras
Merch, media, add-ons, bookings or relevant services.

## G. Post-experience commerce
Memories, media, replay, follow-on experiences and related products.

## H. Host Pro
CRM, analytics, capacity tools, opportunity alerts, operational tooling.

## I. Demand Intelligence
Aggregated market intelligence.

## J. Capacity matching
Monetize filling idle capacity: quiet nights, unused studio slots, low-occupancy periods, etc.

## K. Featured opportunities
Later only, with clear labeling and marketplace trust controls.

Do not monetize by selling raw identifiable user histories.

---

# 19. IDLE CAPACITY MATCHING

Supply can also declare unused capacity.

Example Host supply object:

- Thursday;
- 20:00–02:00;
- capacity 220;
- minimum economics;
- accepted categories;
- city;
- venue characteristics.

Mara can match existing DemandClusters to this capacity.

This creates a second marketplace advantage:

> **Demand Intelligence + Capacity Intelligence**

---

# 20. TRUST & SAFETY

Trust & Safety is product infrastructure, not a footer.

Before real physical fulfillment, evaluate:

- Host verification;
- venue verification;
- age requirements;
- prohibited activity rules;
- QR / access control;
- refunds;
- cancellation responsibility;
- incident reporting;
- fraud / chargebacks;
- Creator consent / IP rights;
- operator responsibility;
- local legal requirements.

Physical adult-oriented experiences must never be used to facilitate sexual services, coercion, illegal activity or unsafe conduct.

Money never modifies consent or safety boundaries.

---

# 21. PAYMENT / LEDGER ARCHITECTURE

Future transaction architecture must record:

- gross amount;
- taxes;
- payment processing fee;
- Mara fee;
- Creator share;
- Host share;
- Operator share;
- refunds;
- chargeback exposure;
- payout state.

Do not activate real marketplace money until payment-provider eligibility for the actual business model is confirmed.

---

# 22. DATA MODEL DIRECTION

Do not create all of these production tables in V1. This is the target conceptual model.

## User
Marketplace participant.

## Creator
Creator / IP owner.

## Host
Entity capable of fulfillment.

## Venue
Optional physical location.

## Operator
Operational execution entity.

## DemandRequest
Raw user desire.

## DemandCluster
Canonical aggregate demand.

## DemandJoin
User-to-demand signal.

Fields should distinguish interest, WTP and commitment status.

## Experience
Executable market object derived from validated demand or direct supply.

## ExperienceTemplate
Repeatable blueprint.

## HostProposal
Host bid / proposal.

## CreatorApproval
IP / Creator permission state.

## Order
Commercial purchase.

## Ticket
Access right where relevant.

## Payment
Processor transaction state.

## RevenueSplit
Settlement contract.

## Review
Post-fulfillment reputation.

## Memory
Post-experience history / continuity.

---

# 23. V1 IMPLEMENTATION

The first code slice is deliberately DEV-only and synthetic.

Route:

`/experience/demand-marketplace-lab`

It must prove the product mechanics without touching production money or data.

V1 functionality:

1. display seeded demand ideas;
2. show stage / city / interest / commitment / progress / WTP;
3. `ME SUMO` modifies local state;
4. select WTP locally;
5. `COMMIT` simulates a verified commitment locally;
6. propose a new experience;
7. detect a likely similar demand before creation;
8. allow joining the similar demand instead;
9. allow creating a deliberate variant;
10. surface `HOST WANTED` opportunities;
11. allow a synthetic Host-interest action;
12. calculate summary Demand GMV concepts;
13. show explicit synthetic / no-money guardrails;
14. fail closed with 404 outside development.

No production persistence in V1.

---

# 24. INITIAL SEEDED DEMAND

Use representative synthetic examples across multiple states.

Examples:

- Mara Masked Night — Chillán — HOST WANTED;
- Karaoke Mara — Concepción — RISING;
- Rooftop dinner — Santiago — VALIDATED;
- Digital creator session — Remote — ALMOST / UNLOCKED-style behavior.

The lab must demonstrate that Mara Vera is one source of marketplace liquidity, not a required parent entity for every experience.

---

# 25. UX PRINCIPLES

Consumer experience:

- mobile-first;
- emotional before analytical;
- visible progress;
- obvious join action;
- fast proposal flow;
- no corporate dashboard feel.

Host experience:

- commercially legible;
- demand quality before vanity reach;
- estimated economics;
- clear next action.

Copy examples:

Prefer:

- `ME SUMO`
- `QUIERO ESTO`
- `MAKE IT HAPPEN`
- `HOST WANTED`
- `BRING THIS TO MY CITY`
- `UNLOCKED`

Avoid:

- “registrar solicitud de evento”;
- “participar en demanda”;
- “umbral de validación alcanzado”.

---

# 26. METRICS

## Primary hypothesis

**VERIFIED DEMAND GMV**

## Funnel

- demand requests created;
- duplicate suggestion rate;
- join rate;
- WTP completion rate;
- join → commitment rate;
- commitments per DemandCluster;
- time to validation;
- validation → Host proposal rate;
- Host response time;
- Host proposal → unlock rate;
- unlocked → paid conversion;
- executed GMV;
- Mara Revenue;
- effective take rate;
- contribution margin;
- cancellation / refund rate;
- repeat experience rate.

## Marketplace health

- active demand per city;
- verified demand per city;
- Hosts per validated cluster;
- supply response coverage;
- demand concentration / fragmentation;
- repeat Hosts;
- repeat Demanders.

---

# 27. PRODUCT RISKS

## Fake demand
Mitigate with progressively stronger signals and commitments.

## Demand fragmentation
Mitigate with duplicate detection and clustering.

## Empty marketplace
Seed with Mara Vera / Mara Originals and Host-originated proposals.

## Host quality
Verification, reputation, proposal rules and operational evidence.

## Founder operations explosion
Keep Mara orchestration-first; external Hosts / Operators fulfill.

## Payment / payout restrictions
Provider diligence before activation.

## Physical safety
Do not activate categories / markets without sufficient Trust & Safety architecture.

## Privacy leakage
Show Hosts aggregated demand first, not private buyer identity.

## Marketplace spam
Rate limits, structured categories, duplicate suggestions and moderation.

---

# 28. 90-DAY VALIDATION LOGIC

This document does not authorize a literal production launch sequence, but product validation should follow this order:

## Phase 1 — Prototype behavior

- test whether users understand public demand;
- test join behavior;
- test WTP input;
- test idea creation;
- measure duplicate suggestions;
- test Host value proposition with businesses manually.

## Phase 2 — Real demand without real fulfillment complexity

- limited markets;
- narrow safe categories;
- manual Host conversations;
- no broad marketplace automation;
- validate whether Hosts care about verified demand.

## Phase 3 — Controlled transactions

Only after provider, refund, legal, Host and Trust & Safety gates are closed.

## Phase 4 — Repeatable Experience Templates

Scale only formats with proven repeat economics and operational quality.

---

# 29. STRATEGIC MOAT

The moat is not event listings.

The moat can become:

**DEMAND GRAPH**
+
**WILLINGNESS-TO-PAY DATA**
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

If Mara knows what people want before traditional supply knows what to create, it can become a demand-discovery layer for many categories of experiences.

---

# 30. FINAL PRODUCT TEST

A first-time user should understand in less than ten seconds:

> **“Aquí veo cosas que la gente quiere hacer. Me puedo sumar o puedo proponer lo mío.”**

A Host should understand:

> **“Mara no me está vendiendo alcance; me está mostrando clientes potenciales con una intención económica concreta.”**

A Creator should understand:

> **“Mi comunidad puede convertir deseo en experiencias y yo puedo participar, licenciar o aprobar sin producir cada operación.”**

The business should understand:

> **“Mara captures value whenever verified demand becomes a market-clearing transaction.”**

---

# FINAL LOOP

`DESIRE → DEMAND → EXPERIENCE → REVENUE → MEMORY → DESIRE`

**NO MERGE unless Ignacio explicitly writes `mergea`.**
