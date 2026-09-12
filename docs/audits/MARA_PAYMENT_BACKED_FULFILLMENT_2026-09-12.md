# MARA — Payment-Backed Fulfillment Audit

Date: 2026-09-12  
Execution line: `execution/mara-payment-backed-fulfillment-v1`  
Parent: `execution/mara-mp-sandbox-payment-materialization-v1` / PR #71

## Executive outcome

Mara now has a staged product-fulfillment boundary where a provider webhook cannot directly create a purchase or entitlement.

The authoritative sequence becomes:

`AUTHENTIC PROVIDER EVENT → PROVIDER RE-FETCH → ACCEPTANCE → FINANCIAL PAYMENT MATERIALIZATION → PAYMENT-BACKED FULFILLMENT → PURCHASE / ENTITLEMENT / CONTRIBUTION`.

This line reuses the existing canonical commerce fulfillment kernel but removes provider/money truth from the new caller interface.

## New database draft

`web/supabase/drafts/mara_payment_backed_fulfillment_v1.sql`

RPC:

`fulfill_mara_materialized_payment_v1(p_payment_id uuid)`

The caller supplies **only** a Mara payment UUID.

The RPC reloads and locks:

- `commerce_payments`;
- the associated `commerce_checkout_intents`.

It requires:

- payment exists;
- payment status is `succeeded`;
- payment is linked to the expected checkout;
- provider matches checkout snapshot;
- provider account matches the frozen checkout account;
- amount matches;
- currency matches;
- provider checkout ID exists;
- checkout is still fulfillable.

Only then does it invoke the existing canonical product fulfillment kernel using database-loaded values.

The resulting purchase is linked back through:

`commerce_payments.purchase_id`.

## Idempotency / replay behavior

If `commerce_payments.purchase_id` already exists, the RPC returns the existing purchase immediately.

A deterministic synthetic fulfillment event identity is derived from the Mara payment UUID:

`financial_fulfillment:<payment_uuid>`

This makes provider webhook retries converge rather than producing duplicate purchases.

The payment row is locked during the operation, providing serialization for concurrent fulfillment attempts.

## Financial auditability

The payment capture ledger remains append-only.

This RPC does **not** mutate historical ledger entries to inject a purchase ID later. Instead the trace is:

`ledger transaction → commerce_payment → commerce_purchase`.

That preserves the original capture journal while still providing end-to-end commercial traceability.

## Application coordinator

`web/lib/commerce/payment-backed-fulfillment.ts`

The runtime is fail-closed:

- `VERCEL_ENV=production` → disabled;
- `MARA_MP_SANDBOX_FULFILLMENT_ENABLED` must explicitly equal `true`;
- caller may submit only `paymentId` to the RPC wrapper;
- no provider payment ID, amount, currency, offer ID or buyer ID is accepted from the HTTP layer.

## Webhook orchestration

The Mercado Pago sandbox webhook route now treats fulfillment as a distinct gate after materialization.

Fulfillment can run only when:

1. provider webhook was authentic;
2. provider payment was re-fetched;
3. checkout economics passed acceptance;
4. financial materialization succeeded;
5. a canonical Mara `paymentId` was returned;
6. non-production fulfillment is separately enabled.

If fulfillment is enabled but the payment was not materialized, the route refuses fulfillment with:

`materialized_payment_required`.

An enabled fulfillment failure returns HTTP 503 so a provider retry can safely converge through the idempotent payment/purchase path.

## CI contract

Added:

`web/scripts/payment-backed-fulfillment-contract.mjs`

CI enforces:

- production hard block;
- separate fulfillment switch;
- only `paymentId` reaches the application RPC;
- succeeded payment requirement;
- DB reload of checkout truth;
- provider/account/amount/currency re-validation;
- deterministic replay identity;
- service-role-only execution;
- materializer itself still creates no purchase or entitlement;
- fulfillment SQL remains a draft, not a migration.

## Deliberately not done

- no Supabase DDL;
- no production mutation;
- no real Mercado Pago transaction;
- no payout;
- no refund/chargeback accounting execution;
- no reconciliation execution;
- no production fulfillment enablement;
- no merge.

## Next gate

The next financial-risk slice is:

`REFUND / PARTIAL REFUND / CHARGEBACK → IMMUTABLE REVERSAL JOURNALS → ENTITLEMENT/REQUEST REVERSAL → DAILY RECONCILIATION → NON-PROD E2E PROOF`.

Mara remains:

**PAYMENT-TO-PRODUCT PATH PREPARED / REAL-MONEY RELEASE NOT AUTHORIZED.**
