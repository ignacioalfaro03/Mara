# Mara MVP Scope — Revenue OS V1

Authority: `docs/foundation/MARA_FOUNDATIONAL_THESIS.md`

## Objective

Prove one commercial loop with real users:

`CREATOR → OFFER → FAN → CHECKOUT → PURCHASE → CUSTOMER → CRM → OPPORTUNITY → SECOND PURCHASE`

The MVP is successful only if it creates real transaction and repeat-purchase evidence. It is not judged by feature completeness.

## P0 product surfaces

### 1. Creator activation

Creator can:

- sign in;
- activate creator account;
- define public profile/storefront;
- obtain a shareable public link.

Primary activation metric: `time_to_first_offer` and later `time_to_first_sale`.

### 2. Offer creation

Creator can create a sellable offer with:

- title;
- description;
- price;
- currency;
- offer family;
- delivery/fulfillment concept;
- active/draft status.

### 3. Fan storefront

Mobile-first public creator page must:

- identify the creator;
- show active offers;
- communicate price and deliverable clearly;
- allow direct checkout;
- avoid requiring a native app.

### 4. Checkout / purchase

System must preserve server-authoritative pricing and entitlement logic.

Before real payments are authorized, signed-test may prove contract behavior but must never be represented as real revenue.

### 5. Customer creation

A completed purchase must create/update a creator-scoped customer relationship.

Creator CRM must show at minimum:

- alias/identifier;
- first purchase;
- last purchase;
- purchase count;
- GMV;
- lifecycle stage;
- next recommended action when applicable.

### 6. Creator Home

Creator Home must prioritize:

- GMV;
- AOV;
- repeat purchase rate;
- pending paid fulfillment;
- highest-priority opportunity;
- customers needing attention.

### 7. Opportunity Engine V1

Opportunity types to support in this order:

1. `FULFILL_PAID_ORDER`
2. `REPEAT_READY_CUSTOMER`
3. `ABANDONED_CHECKOUT`
4. `HIGH_VALUE_INACTIVE`
5. `DEMAND_SIGNAL`
6. `POST_PURCHASE_CROSS_SELL`

Initial implementation may use deterministic rules. Predictive ML is not required.

Every surfaced opportunity needs:

- creator_id;
- opportunity_type;
- customer_id where relevant;
- reason;
- priority;
- estimated/relevant value where defensible;
- created_at;
- expires_at or freshness rule;
- status;
- source/provenance.

### 8. Commercial action attribution

When a creator acts from Mara, capture enough data to answer:

- which opportunity/action was used;
- which customer/segment/offer it targeted;
- whether a later purchase occurred;
- whether the purchase can be attributed or only correlated.

Do not claim causality from a simple time sequence.

## P0 events

Required event vocabulary should include or map to:

- `creator_activated`
- `creator_offer_created`
- `creator_storefront_viewed`
- `offer_viewed`
- `checkout_started`
- `checkout_abandoned`
- `purchase_completed`
- `customer_created`
- `repeat_purchase_completed`
- `opportunity_generated`
- `opportunity_viewed`
- `opportunity_actioned`
- `fulfillment_completed`

Telemetry must remain privacy-safe and must not leak customer free text or sensitive profile attributes.

## MVP business metrics

### North Star

`GMV / ACTIVE CREATOR`

### Creator activation

- creator signup → activation;
- activation → first offer;
- first offer → first sale;
- time to first sale.

### Customer economics

- visitor → buyer conversion;
- AOV;
- purchase frequency;
- repeat purchase rate;
- returning-buyer GMV;
- revenue per buyer.

### Creator retention

- D7/D30 active creator retention;
- creators with sale in period;
- GMV retention.

### Mara economics

When real money is authorized:

- gross GMV;
- platform fee;
- processor fees;
- refunds/chargebacks;
- creator earnings;
- contribution margin.

## Explicitly out of MVP

- native fan app;
- generic creator discovery feed;
- social graph as growth engine;
- Mara Vera character experience;
- chatbot / AI companion;
- virtual Worlds / immersion;
- IRL Host marketplace;
- advanced AI agent autonomy;
- predictive pricing;
- creator financing;
- brand marketplace;
- agency OS;
- crypto/wallet economy.

## Release evidence gates

Do not call the MVP commercially validated until there is evidence of:

- 5 activated real creators;
- 5 real published offers;
- 10 real transactions;
- at least one repeat buyer;
- at least one opportunity used by a creator;
- first platform revenue when payment activation is authorized;
- no critical cross-tenant data leakage;
- no money/entitlement inconsistency.

## Engineering principle

Reuse current commerce and CRM primitives. Prefer additive migration and terminology adaptation over destructive rewrites.
