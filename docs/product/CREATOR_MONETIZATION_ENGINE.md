# Mara Creator Monetization Engine

Status: **AUTHORITATIVE PRODUCT CONTRACT UNDER THE FOUNDATIONAL THESIS**

Effective: 2026-09-12

This document operationalizes `docs/foundation/MARA_FOUNDATIONAL_THESIS.md` for Mara's creator-commerce surface. It does not replace the foundational thesis. It defines how Mara lets creators monetize an existing audience while converting every legitimate commercial interaction into creator-scoped customer intelligence.

## 1. Product promise

Mara is the Revenue OS for creators. The creator decides what is free, what is paid, what is sold, how it is priced and which requests are accepted. Mara supplies the commerce infrastructure, CRM, fulfillment state, analytics and evidence-based Next Best Actions.

Primary design ICP: creators with an existing audience, especially content creators who already receive purchases, DMs, custom requests, support and high-intent engagement but manage monetization manually.

The governing product question is:

> Does this help a creator earn more from an existing audience or manage that monetization with less manual work?

If not, it is not a core Mara feature.

## 2. One commerce engine, multiple mechanisms

Do not build separate businesses for every monetization surface. Model **what is sold** separately from **how it is monetized**.

Canonical mechanisms:

- `FIXED_PRICE`: ordinary direct sale.
- `AUCTION`: free bidding; only the winner pays.
- `WISH`: contribution toward a creator-declared wish/goal.
- `CUSTOM_REQUEST`: fan proposes a request and optional offered price; creator accepts, rejects or counters.
- `LIMITED_DROP`: fixed inventory or time-constrained release.
- `MEMBERSHIP`: recurring or period-based access.
- `PAID_INTERACTION`: chat/session/message/media monetization controlled by the creator.

No pay-per-bid, bid-fee, lottery or gambling mechanics.

## 3. Direct sales

Creators may sell permitted digital or physical goods and services through the existing offer/checkout/purchase/fulfillment backbone. Examples include audio, photo, video, digital bundles, accessories, apparel, signed items, physical goods, memberships and custom deliverables.

Price truth remains server-authoritative. A browser-provided price is never payment truth.

## 4. Wishes / goals / caprichos

A creator may publish a goal such as buying a camera, financing a production expense or reaching another creator-declared target. Product language should prefer **wish**, **goal**, **support** or **contribution** rather than assuming a legal/charitable donation classification.

Minimum model:

`creator -> wish -> target -> contributions -> progress -> CRM signals`

Initial implementation should not custody funds until a target is reached. When real payments are authorized, each contribution should remain an ordinary provider transaction with Mara's platform economics applied through the payment architecture.

Each successful contribution is a creator-scoped customer event. Refunds reduce effective progress.

## 5. Auctions

Auctions are a general pricing mechanism for unique or scarce permitted inventory. The engine must not be designed around one sensitive category.

Minimum auction state:

- creator;
- optional sellable/offer link;
- currency;
- starting bid;
- minimum increment;
- starts at;
- ends at;
- current winning bid;
- current winning bidder;
- status;
- anti-sniping window;
- anti-sniping extension;
- winner;
- payment window;
- fulfillment state.

### 5.1 Bidding invariants

Bid validation must be server-side and atomic at persistence time:

1. auction is active;
2. current time is inside the allowed window;
3. amount is a positive integer in minor units;
4. first bid is at least the starting bid;
5. later bid is at least `current bid + minimum increment`;
6. idempotency identity is unique;
7. the decision is evaluated against the locked/current auction state, not a browser-supplied current price.

The pure TypeScript contract may calculate whether a bid is valid and whether the close should extend, but the eventual database write must use a transaction/RPC or equivalent serialization to prevent race conditions.

### 5.2 Anti-sniping

If an accepted bid arrives inside the configured final window, extend the auction by the configured extension. The extension is a product rule, not a client-side timer trick.

### 5.3 Auction intelligence

The winner is not the only valuable signal. A losing bid is observed willingness-to-pay.

Mara may deterministically surface:

- `AUCTION_LOSER`: a customer bid and lost;
- `HIGH_INTENT_BIDDER`: a losing bid reached a transparent threshold relative to the winning price;
- later conversion of a losing bidder to another purchase.

Do not infer psychological vulnerability. Use only observed commercial behavior.

## 6. Custom requests

Reuse the existing `creator_requests` commercial backbone instead of creating a parallel request system.

Canonical semantic lifecycle:

`REQUESTED -> REVIEWING -> COUNTERED | ACCEPTED | DECLINED | CANCELLED -> PAYMENT_PENDING -> PAID -> IN_PROGRESS -> DELIVERED -> COMPLETED`

A request is not a purchase. Acceptance is not a purchase. Payment/purchase must remain explicit financial events.

A creator may turn a repeated request pattern into a public/private offer, but Mara never auto-publishes one.

Repeated-demand opportunity rule may be deterministic, for example: at least three distinct customers with the same normalized request key in a defined window.

## 7. Monetizable chat and media

Reuse `creator_threads`, `creator_messages`, `creator_content`, `commerce_offers`, `commerce_purchases` and entitlements where possible.

Creator-controlled monetization modes may include:

- free chat;
- paid chat access;
- paid session/time block;
- paid message;
- paid audio;
- paid photo;
- paid video;
- paid attachment;
- custom request.

The creator controls the paywall. Mara must clearly show the buyer what is being bought, the amount, the billing boundary and what will be delivered.

Do not implement open-ended metering that can create unclear or unbounded charges.

## 8. Taste Engine

The Taste Engine is **fast entertainment plus declared preference capture**, not psychological profiling.

Allowed interaction shapes include:

- A/B choice;
- swipe;
- quick rank;
- reaction;
- explicit preference selection.

A stored signal should minimally contain:

`creator_id? + user_id + prompt/choice id + selected option + presented alternatives/version + timestamp + source`

Preferences must be creator-scoped when creator-specific, editable/clearable when feasible, and never used to derive protected/sensitive traits or exploit vulnerability.

## 9. One customer, many commercial events

A bidder, buyer, contributor, requester and chat customer are not separate identities. They are the same creator-scoped `CreatorCustomer` relationship when they map to the same authenticated user.

Conceptual graph:

`CreatorCustomer -> purchases -> fulfillment -> bids -> auction outcomes -> wish contributions -> requests -> paid interactions -> declared preferences -> creator actions -> opportunities`

The graph must remain tenant isolated. One creator cannot inspect another creator's private customer relationship.

## 10. Deterministic Revenue Intelligence

Before ML, Mara should build transparent opportunities from observed evidence.

Canonical types include:

- `SECOND_PURCHASE` — already implemented separately;
- `AUCTION_LOSER`;
- `HIGH_INTENT_BIDDER`;
- `REPEATED_REQUEST`;
- `WISH_REPEAT_SUPPORTER`;
- `DORMANT_HIGH_VALUE`;
- `UNFULFILLED_ORDER`;
- `POST_PURCHASE_CARE`.

Each opportunity must expose:

- action;
- reason;
- priority;
- evidence;
- source/version;
- generated time;
- cooldown/outcome when applicable.

No hidden vulnerability scores. No invented probability. No fake urgency.

## 11. Free and Plus

### Mara Free

The free tier must be capable of producing real value and a real first sale. Candidate baseline:

- creator profile/storefront;
- direct offers;
- basic CRM;
- basic wishes;
- requests;
- fulfillment;
- essential metrics;
- success-based platform take rate.

### Mara Plus

Plus should concentrate capabilities that measurably improve revenue or reduce work:

- advanced Revenue Intelligence;
- segmentation;
- automation;
- advanced auctions;
- deeper analytics;
- pricing/offer insights;
- lifecycle tools;
- advanced chat commerce;
- bundles/cross-sell;
- attribution/Revenue Lift tooling;
- team/export/API capabilities later.

Do not hard-code a permanent Plus price before validation.

## 12. Events and attribution

Target event vocabulary:

- `OFFER_VIEWED`
- `CHECKOUT_STARTED`
- `PURCHASE_COMPLETED`
- `FULFILLMENT_COMPLETED`
- `AUCTION_VIEWED`
- `BID_PLACED`
- `BID_OUTBID`
- `AUCTION_WON`
- `AUCTION_LOST`
- `WISH_VIEWED`
- `WISH_CONTRIBUTION`
- `REQUEST_CREATED`
- `REQUEST_ACCEPTED`
- `REQUEST_COUNTERED`
- `REQUEST_REJECTED`
- `CHAT_STARTED`
- `PAID_MESSAGE_PURCHASED`
- `MEDIA_UNLOCKED`
- `TASTE_CHOICE`
- `OPPORTUNITY_GENERATED`
- `OPPORTUNITY_ACTIONED`
- `SECOND_PURCHASE`

Financial amounts are in minor units with currency. Monetary truth must derive from server/provider records, not analytics payloads.

Revenue Lift claims require defensible attribution and, where possible, holdouts/controlled experiments. Do not claim causal lift from simple correlation.

## 13. Trust, privacy and compliance

Because the primary ICP includes content creators, Mara must be designed for strong privacy and category gating.

Separate public identity from legal/payment identity. Do not expose creator private phone, address, email, KYC or payout information to buyers.

Sensitive inventory/categories must be gateable by:

- region;
- payment provider;
- creator verification;
- age/compliance policy;
- fulfillment policy.

`AUCTION` can be globally available while a specific inventory category remains disabled.

## 14. Payment boundary

Current verdict remains **NOT PAYMENT READY**.

No new monetization surface may bypass the existing payment architecture, ledger plan, provider authorization/KYC, webhook verification, reconciliation, refund/chargeback model or founder production authorization.

`REQUEST`, `BID`, `WISH` and `CHAT` are product events. They do not become settled revenue until the canonical payment/purchase flow says so.

## 15. MVP execution order

P0:

1. direct sale;
2. Customer Graph;
3. checkout test path;
4. fulfillment;
5. Second Purchase Engine;
6. requests;
7. wishes;
8. basic auctions.

P1:

1. Taste Engine;
2. basic monetizable chat/media;
3. repeated-request clustering;
4. auction-loser/high-intent opportunities.

P2:

1. Plus packaging;
2. automation;
3. advanced analytics;
4. offer affinity;
5. attribution and controlled Revenue Lift experiments.

## 16. Definition of success

The monetization engine is successful when Mara can truthfully run this loop:

`AUDIENCE -> MONETIZABLE INTERACTION -> PAYMENT -> CREATOR CUSTOMER GRAPH -> EVIDENCE-BASED OPPORTUNITY -> CREATOR ACTION -> NEXT PURCHASE`

The goal is not maximum feature count. The goal is **more revenue per creator/customer relationship with less manual work**.
