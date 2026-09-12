# MARA — Payments & Ledger Architecture

Status: **NOT PAYMENT READY**  
Authority: `docs/foundation/MARA_FOUNDATIONAL_THESIS.md`  
Scope: architecture only. This document does **not** authorize production payments, payouts or database activation.

## Decision

Mara must not infer creator earnings, platform revenue or cash available from `commerce_purchases` alone.

The financial source of truth must be an append-only ledger capable of reconciling:

`CHECKOUT → PAYMENT → PURCHASE → FEES → CREATOR EARNING → REFUND/CHARGEBACK → PAYOUT`

A purchase is a commercial event. It is not a ledger.

## Chile MVP provider direction

Primary integration candidate for the Chile MVP: **Mercado Pago Split Payments 1:1**.

Current official Mercado Pago Chile documentation states that Split Payments 1:1 is available in Chile, requires seller authorization through OAuth, supports Checkout Pro / Checkout API / Checkout Bricks and lets the marketplace charge a marketplace/application fee while the payment is processed for the seller.

Sources reviewed 2026-09-12:

- https://www.mercadopago.cl/developers/es/docs/split-payments/split-1-1/overview
- https://www.mercadopago.cl/developers/es/docs/split-payments/split-1-1/prerequisites
- https://www.mercadopago.cl/developers/es/docs/split-payments/split-1-1/integration-configuration/integrate-marketplace

Important operational consequence: seller OAuth/KYC is part of creator payment onboarding. Refund behavior and seller balance availability must be treated as operating constraints, not hidden implementation details.

Stripe Connect remains an expansion/alternative candidate. Chile appears in current Connect connected-account availability, but the exact eligibility and platform-country structure must be validated commercially before choosing it as Mara's Chile launch rail.

This is a **technical/product provider direction, not legal, tax or payment-services approval**.

## Hard gate

Production payments remain disabled until ALL are true:

1. provider account/application approved;
2. creator onboarding/KYC flow defined;
3. provider OAuth/token storage implemented securely;
4. provider checkout adapter implemented;
5. webhook signature/event authenticity implemented against provider docs;
6. idempotency tested for checkout + webhook retries;
7. ledger migration reviewed and explicitly activated;
8. reconciliation job/report exists;
9. refunds/chargebacks have deterministic accounting treatment;
10. platform fee and creator earning calculations are server-authoritative;
11. payout operating model is defined;
12. terms/privacy/refund/compliance review completed;
13. founder explicitly authorizes real payments.

Until then `MARA_PAYMENT_PROVIDER=signed_test` is the only executable payment runtime.

## Canonical financial objects

### Payment

Provider-side money movement associated with a checkout intent.

Required truth:

- provider;
- provider payment ID;
- checkout intent;
- amount/currency;
- status;
- captured/failed timestamps;
- total refunded amount.

A payment may exist before a purchase is materialized.

### Purchase

Commercial record that the buyer acquired an offer. Existing `commerce_purchases` remains the product/fulfillment spine.

### Refund

Explicit refund object. Do not collapse refund history into a single `refunded_at` timestamp if partial refunds or multiple provider refund events are possible.

### Platform Fee

Revenue owed to Mara for a transaction. It must be represented in ledger entries, not recomputed later from whatever the current take-rate happens to be.

### Processor Fee

Fee charged by the payment provider. Provider truth wins over estimates.

### Creator Earning

Amount economically attributable/payable to the creator after the transaction's defined fee model.

### Payout

Settlement from provider/platform flow to the creator. A payout is not equivalent to a purchase.

### Balance Transaction / Ledger Entry

Immutable accounting line explaining how value moved between financial accounts.

## Ledger model

Mara should use a small double-entry journal:

- `commerce_payments`
- `commerce_refunds`
- `creator_payment_accounts`
- `creator_payouts`
- `commerce_ledger_transactions`
- `commerce_ledger_entries`

The SQL design is staged in:

`web/supabase/drafts/mara_payment_ledger_v1.sql`

It is deliberately **not** in `supabase/migrations` because this PR does not authorize applying a schema migration. When activation is authorized, create the real migration through the Supabase CLI (`supabase migration new ...`), copy/review the audited SQL, apply it first to a development/preview database, run advisors and reconciliation tests, and only then consider production.

## Ledger accounts

Initial account codes:

- `processor_clearing`
- `creator_payable`
- `platform_revenue`
- `processor_fee_expense`
- `refund_liability`
- `chargeback_loss`
- `payout_clearing`

Every ledger entry has:

- positive amount in minor units;
- currency;
- `debit` or `credit` direction;
- immutable transaction header;
- optional creator/payment/refund/payout references.

A complete ledger transaction must balance by currency:

`SUM(DEBITS) = SUM(CREDITS)`

No dashboard may label a creator balance as withdrawable unless it is derived from ledger/payout truth.

## Example — successful sale

Illustrative only; actual fee amounts come from provider truth.

Buyer pays CLP 10,000. Provider fee = 500. Mara platform fee = 1,000. Creator earning = 8,500.

A balanced journal can represent the transaction as:

- Debit `processor_clearing` 10,000
- Credit `processor_fee_expense` 500
- Credit `platform_revenue` 1,000
- Credit `creator_payable` 8,500

The exact accounting account model must be reviewed with accounting/tax expertise before statutory use. Mara's operational ledger is for traceability and reconciliation; it does not replace formal accounting.

## Refund invariant

Refunds never delete the original payment, purchase or ledger entries.

They add new immutable records that reverse the relevant economics. This preserves audit history.

## Idempotency invariants

- one provider payment identity → one payment record;
- one provider refund identity → one refund record;
- one provider webhook event identity → one processed event;
- one provider payout identity → one payout record;
- one ledger transaction idempotency key → one journal transaction;
- duplicate provider delivery must converge to the existing result.

## Security

Financial tables must:

- have RLS enabled if they live in the exposed `public` schema;
- grant no browser write access;
- expose creator reads only through deliberately scoped views/RPCs when required;
- never expose OAuth access tokens to browser clients;
- never accept amount, platform fee, creator earning or payout state as browser-authoritative input;
- use server-side/provider truth for all money fields.

Provider OAuth credentials/tokens require a separate secret-storage design before activation.

## Reconciliation

Minimum daily reconciliation must be able to answer:

1. provider successful payments not materialized in Mara;
2. Mara payments absent at provider;
3. amount/currency mismatches;
4. refunds missing from Mara;
5. duplicate provider events;
6. ledger transactions that do not balance;
7. creator payable versus provider/payout state;
8. payout failures/reversals.

A payment system that can accept money but cannot reconcile it is not payment ready.

## Current verdict

**NOT PAYMENT READY.**

The architecture is now explicit, but the provider adapter, seller OAuth/KYC, activated ledger schema, reconciliation and production authorization still intentionally do not exist.