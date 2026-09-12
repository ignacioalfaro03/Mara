# Mara Revenue OS — Domain Model

Authority: `docs/foundation/MARA_FOUNDATIONAL_THESIS.md`

## Design principle

The canonical domain is creator commerce + creator-scoped customer intelligence.

Do not create a second parallel commerce ledger or CRM if current primitives can be extended safely.

## Core entities

### User

Authenticated platform identity.

### Creator

Business-side tenant/operator.

Key concerns:

- owner user;
- status;
- plan;
- payment/payout eligibility when activated;
- timestamps.

### CreatorProfile / Storefront

Public creator-facing surface.

Current implementation may continue using historical `World` persistence where destructive renaming would add risk. Product copy should use profile/storefront terminology.

### Offer

Sellable unit.

Minimum commercial contract:

- creator;
- storefront/profile;
- title;
- description;
- offer family;
- price;
- currency;
- status;
- fulfillment concept;
- optional source opportunity/demand provenance.

### CheckoutSession / CheckoutIntent

Server-authoritative purchase preparation.

Must snapshot relevant price/offer terms so browser state is not financial truth.

### Order / Purchase

Commercial transaction record.

Existing purchase primitives should be reused rather than duplicated.

### Payment

Provider-side monetary settlement truth when real rails are activated.

### Refund

Explicit reversal with traceable amount/reason/status.

### CreatorCustomer

Creator-scoped relationship between one creator and one customer/user.

This is the central CRM entity.

Expected aggregates / facts:

- first interaction;
- first purchase;
- last purchase;
- purchase count;
- creator GMV;
- lifecycle stage;
- recent activity;
- creator-scoped notes/tags where allowed.

### CustomerEvent

Commercially relevant behavior/event with provenance and timestamp.

Examples:

- storefront viewed;
- offer viewed;
- checkout started;
- purchase completed;
- fulfillment completed;
- repeat purchase completed.

### Opportunity

Actionable commercial or operational opportunity for one creator.

Recommended contract:

- id;
- creator_id;
- opportunity_type;
- customer_id nullable;
- offer_id nullable;
- source_type;
- source_id nullable;
- reason;
- priority;
- estimated_value_minor nullable;
- currency nullable;
- status;
- created_at;
- expires_at nullable;
- acted_at nullable;
- action_type nullable.

Initial types:

- `FULFILL_PAID_ORDER`
- `REPEAT_READY_CUSTOMER`
- `ABANDONED_CHECKOUT`
- `HIGH_VALUE_INACTIVE`
- `DEMAND_SIGNAL`
- `POST_PURCHASE_CROSS_SELL`

### Recommendation / NextBestAction

Can initially be deterministic and derived from current data.

Do not force an ML dependency.

### Automation

Creator-configured or system-configured lifecycle action.

Later entity, not P0 for first vertical slice.

### PlatformFee

Mara revenue component.

### ProcessorFee

Payment-provider cost component.

### CreatorEarning

Amount owed/earned by creator from settled commerce.

### Payout

Transfer of creator earnings when authorized.

### BalanceTransaction

Immutable financial movement for reconciliation.

## Relationship map

```text
User
  ├─ owns → Creator
  └─ buys from → Creator

Creator
  ├─ has → CreatorProfile/Storefront
  ├─ creates → Offer
  ├─ has many → CreatorCustomer
  ├─ receives → Order/Purchase
  └─ receives → Opportunity

CreatorProfile/Storefront
  └─ exposes → Offer

Offer
  └─ generates → CheckoutIntent → Purchase → Payment

Purchase
  ├─ updates → CreatorCustomer
  └─ can generate → Opportunity / Recommendation

CreatorCustomer
  ├─ accumulates → CustomerEvent
  └─ receives → NextBestAction
```

## Tenancy rule

Creator CRM data is creator-scoped by default.

One creator must not receive another creator's customer notes, hidden preferences, customer-level commercial context, purchases or recommendations unless a future explicit cross-creator product has a lawful and consented data contract.

## Data minimization

Do not infer or expose sensitive vulnerabilities to creators.

Avoid hidden profiling of protected/sensitive traits, desperation, loneliness, dependency, health or other inappropriate exploitation vectors.

The Revenue OS should optimize offers using legitimate commerce behavior, declared preferences and permitted context.

## Migration rule

Prefer additive migration.

Do not rename historical DB primitives such as `World` merely to match new terminology unless the benefit outweighs migration and RLS risk.

UI and domain adapters can translate old persistence names into current product language.

## Financial consistency

No dashboard should calculate authoritative payable balances from UI totals alone.

Money must reconcile through explicit transaction primitives.

Every provider webhook and payment mutation must be idempotent.
