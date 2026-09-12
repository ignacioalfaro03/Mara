# Mara

> ## READ THIS FIRST — STRATEGIC AUTHORITY
>
> **The sole highest-priority company and product authority is [`docs/foundation/MARA_FOUNDATIONAL_THESIS.md`](./docs/foundation/MARA_FOUNDATIONAL_THESIS.md).**
>
> Effective 2026-09-12, Mara is **the Revenue OS for creators**.
>
> [`docs/product/CREATOR_MONETIZATION_ENGINE.md`](./docs/product/CREATOR_MONETIZATION_ENGINE.md) is the authoritative implementation contract for creator monetization under that thesis.
>
> Older founder constitutions, Mara Vera character documents, demand-network theses, Creator World strategy, chatbot/relationship strategy and consumer-app-first work are **historical evidence only**. If they conflict with the foundational thesis, the foundational thesis wins.
>
> Founder boundary: **NO MERGE unless Ignacio explicitly writes `mergea`.** No production deployment, real-payment activation, payout activation or external spend is implied by branch work.

---

# Company thesis

# MARA IS THE REVENUE OS FOR CREATORS.

Mara helps creators turn an audience they already have into customers, repeat customers and measurable revenue.

Primary product-design ICP: **content creators with an existing audience**, especially creators who already receive purchases, DMs, custom requests, support and high-intent engagement but still manage monetization manually.

Canonical loop:

`AUDIENCE → CUSTOMER → COMMERCIAL CONTEXT → OFFER → PURCHASE → LEARNING → NEXT BEST ACTION → REPURCHASE`

The creator brings the audience. Mara helps monetize it better.

---

# Product architecture

## Creator side — primary product

The creator experience is the operating system of the business:

- Home / Today;
- Monetization;
- Opportunities;
- Customers / CRM;
- Offers;
- Orders / Fulfillment;
- Automations;
- Analytics;
- Payments / Payouts when authorized.

The product must answer:

1. What happened?
2. Who needs attention?
3. What should I sell now?
4. What action has the highest expected commercial value?
5. Is Mara increasing my revenue?

## Creator Commerce Engine

Mara should support multiple monetization mechanisms while preserving one creator-scoped customer relationship:

- fixed-price sales;
- wishes/goals/contributions;
- auctions;
- custom requests and counteroffers;
- limited drops;
- memberships;
- paid interactions/chat/media where permitted.

The creator controls the paywall: what is free, what is paid and how much it costs within platform/compliance limits.

`AUCTION`, `WISH`, `CUSTOM_REQUEST` and `PAID_INTERACTION` are product/commercial events. They do not bypass canonical checkout/payment/purchase truth.

## Fan side — mobile web first

Fans arrive from social links, creator links or QR codes.

Canonical fan path:

`SOCIAL / LINK → CREATOR STOREFRONT → MONETIZABLE INTERACTION → CHECKOUT → PURCHASE → DELIVERY`

Do not require a native fan app before purchase.

A standalone consumer app is deferred until repeat usage and multi-creator behavior justify it.

---

# North Star

# GMV PER ACTIVE CREATOR

Supporting metrics:

- visitor → buyer conversion;
- average order value;
- repeat purchase rate;
- returning-buyer GMV;
- revenue per buyer;
- time to first sale;
- creator retention;
- GMV retention;
- creator net earnings;
- Mara take rate;
- contribution margin;
- auction bidder → later buyer conversion;
- request → purchase conversion;
- wish-support recurrence.

Strategic proof metric:

# MARA REVENUE LIFT

Do not claim incremental lift without attribution, experiments or valid cohort evidence.

---

# Immediate vertical slice

The product priority is:

# CREATOR → OFFER → FAN → CHECKOUT → PAYMENT → CUSTOMER → CRM → OPPORTUNITY → SECOND PURCHASE

The first magic moment is a sale becoming a real customer relationship.

The second — and more important — magic moment is Mara identifying a useful opportunity that leads to another purchase.

Additional monetization surfaces strengthen this loop; they do not replace it.

---

# Reuse existing infrastructure

Do not rebuild working primitives. Preserve and adapt:

- auth/session;
- creator identity;
- public creator profile/storefront;
- offers;
- checkout intents;
- purchases;
- entitlements and fulfillment;
- commerce goals/contributions for wishes;
- creator requests for custom requests;
- creator threads/messages/content for chat/media;
- creator-customer relationship data;
- CRM summaries;
- deterministic Next Best Action;
- telemetry;
- RLS / tenant isolation;
- CI/CD and hosted proof.

New schema should be additive and only introduced where a real gap exists, such as auctions or explicit Taste Engine events.

---

# Deprecated as strategic center

These may remain temporarily as legacy code or evidence, but they no longer define roadmap:

- Mara Vera as a product/persona center;
- virtual-character business;
- chatbot / AI companion;
- Creator Worlds as the primary product metaphor;
- immersive-world strategy;
- demand-network-first strategy;
- consumer social feed;
- consumer-app-first roadmap;
- IRL marketplace-first roadmap.

Do not delete stable infrastructure merely because its original framing is deprecated. Reuse what supports the Revenue OS loop.

---

# Product principle

> **COMPLEX INTELLIGENCE UNDERNEATH. OBVIOUS ACTION ABOVE.**

Every new feature should materially support at least one:

- conversion;
- repeat purchase;
- AOV;
- creator workload reduction;
- retention;
- trust;
- commercial intelligence.

If it does not, defer it.

Revenue Intelligence must use observable evidence. Do not introduce hidden vulnerability scoring, psychographic exploitation, fake urgency or invented conversion probabilities.

---

# Payment boundary

Current verdict remains **NOT PAYMENT READY**.

New monetization mechanisms may be modeled and tested, but real payment activation still requires the canonical provider/OAuth/KYC, secure credential storage, webhook verification, ledger, reconciliation, refunds/chargebacks, payout operations, compliance and explicit founder authorization gates.

---

# MVP validation

Prove sequentially:

1. creator activation;
2. first offer published;
3. fan purchase;
4. customer appears in creator CRM;
5. creator sees useful context;
6. Mara recommends a commercial action;
7. creator uses it;
8. a second purchase occurs.

Then validate additional mechanisms without losing the core loop:

- first real wish contribution;
- first auction with multiple legitimate bidders;
- first losing bidder converted later;
- first repeated-request pattern converted into an offer.

Initial business evidence targets:

- 5 activated creators;
- 5 published offers;
- 10 real transactions once payments are authorized;
- at least one repeat buyer;
- first real platform revenue;
- first creator with measurable Mara Revenue Lift.

---

# Governance

Current authority order:

1. [`docs/foundation/MARA_FOUNDATIONAL_THESIS.md`](./docs/foundation/MARA_FOUNDATIONAL_THESIS.md)
2. [`docs/product/CREATOR_MONETIZATION_ENGINE.md`](./docs/product/CREATOR_MONETIZATION_ENGINE.md) and other implementation contracts explicitly created under the thesis;
3. current code and tests where compatible;
4. older strategy/product documents as historical evidence only.

**NO MERGE unless Ignacio explicitly writes `mergea`.**
