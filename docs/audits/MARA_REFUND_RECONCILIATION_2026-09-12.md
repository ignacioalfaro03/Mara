# MARA — Refund + Reconciliation Control Plane Audit

Date: 2026-09-12  
Execution line: `execution/mara-refund-reversal-reconciliation-v1`  
Parent: `execution/mara-payment-backed-fulfillment-v1` / PR #72

## Executive outcome

Mara now has a staged financial-reversal and reconciliation design for Mercado Pago sandbox that preserves the core control sequence:

`PROVIDER REFUND TRUTH → REFUND OBJECT → IMMUTABLE REVERSAL JOURNAL → PRODUCT REVERSAL GATE → RECONCILIATION`.

No production payment/refund execution was enabled and no financial draft was applied to the connected Supabase project.

## Mercado Pago economic rule applied

Current Mercado Pago Split Payments 1:1 documentation establishes two important economic facts for Mara's creator/seller model:

1. the Mercado Pago processing commission is deducted from the seller/creator before the marketplace commission;
2. when a refund is executed, the refunded customer amount is taken proportionally from seller and marketplace.

The Mara rail therefore treats the creator as the processor-fee bearer for capture accounting and applies proportional creator/platform reversal for refunds.

The code deliberately does **not** assume that Mercado Pago processing fees are reimbursed on refund. Processor-fee reversal stays unmaterialized until settlement/report evidence proves the actual provider fee credit.

## Refund financial draft

`web/supabase/drafts/mara_payment_refund_materialization_v1.sql`

### Refund context RPC

`mara_mp_sandbox_refund_context_v1(payment_id)`

Service-only lookup returns:

- Mara payment id;
- creator id;
- provider payment id;
- provider account id;
- opaque credential reference;
- captured amount;
- cumulative refunded amount;
- currency.

It returns no raw provider token.

### Refund materializer

`materialize_mara_payment_refund_v1(...)`

Controls:

- locks the canonical payment;
- accepts only previously captured/refundable payment states;
- requires canonical purchase linkage;
- provider refund id is idempotent;
- cumulative refunds cannot exceed captured amount;
- currency and original marketplace economics come from the payment snapshot;
- partial refunds use cumulative proportional allocation to prevent rounding drift;
- a full refund converges exactly to reversal of the original marketplace fee;
- journal must balance before commit.

Refund journal:

- debit creator payable for creator share;
- debit platform revenue for marketplace share;
- credit processor clearing for total refunded customer amount.

Processor-fee reimbursement is intentionally excluded from automatic reversal.

## Refund provider coordinator

`web/lib/commerce/mercado-pago-sandbox-refund.ts`

The coordinator is server-only and fail-closed:

- production blocked;
- requires separate `MARA_MP_SANDBOX_REFUNDS_ENABLED=true`;
- starts from Mara `paymentId` rather than raw provider payment data;
- reloads provider/credential context server-side;
- uses provider refund idempotency key;
- uses Mercado Pago's returned refund ID and refunded amount as provider truth;
- materializes only a succeeded provider refund;
- no public refund endpoint has been opened yet.

The absence of a public endpoint is intentional. Authorization, creator/customer permissions and commercial refund policy must be explicitly defined rather than inferred.

## Product state remains separate

Financial refund materialization does not directly:

- mark the purchase refunded;
- revoke entitlements;
- reverse creator-request state;
- reverse a contribution.

Those effects remain a separate payment-backed product reversal gate so financial provider truth and application access control cannot be accidentally conflated.

## Read-only reconciliation snapshot

`web/supabase/drafts/mara_payment_reconciliation_snapshot_v1.sql`

Service-only RPC:

`mara_payment_reconciliation_snapshot_v1()`

The snapshot performs no auto-healing and emits explicit control exceptions.

### Critical issues

- `PAYMENT_CAPTURE_LEDGER_MISSING`
- `PAYMENT_PURCHASE_MISMATCH`
- `PAYMENT_REFUND_TOTAL_MISMATCH`
- `REFUND_LEDGER_MISSING`
- `LEDGER_TRANSACTION_UNBALANCED`
- `PAYMENT_PROVIDER_ACCOUNT_SCOPE_MISMATCH`

Any critical issue must fail the future payment release gate.

### Warning issues

- `SUCCEEDED_PAYMENT_UNFULFILLED`
- `FULL_REFUND_PRODUCT_REVERSAL_PENDING`

Warnings indicate financially coherent state whose product/operational convergence is incomplete.

## CI controls

Added:

- `npm run payment-refund-materialization:contract`
- `npm run payment-reconciliation-snapshot:contract`

Web Launch CI now validates both boundaries before typecheck/build/smoke.

The contracts enforce:

- production refund block;
- service-only financial RPCs;
- provider refund idempotency;
- refund-over-capture prevention;
- proportional marketplace reversal;
- no invented processor-fee reimbursement;
- financial/product reversal separation;
- append-only ledger dependency;
- reconciliation snapshot remains read-only;
- reconciliation drafts remain outside `supabase/migrations`.

## Environment blocker

The connected Supabase project currently has no development branches. These drafts therefore cannot be rehearsed safely against an isolated Supabase environment yet.

Creating a Supabase development branch may have a provider cost and is intentionally not being done without explicit founder authorization.

## Still not done

- no production Supabase DDL;
- no migration-history repair;
- no real Mercado Pago credentials;
- no real payment;
- no real refund;
- no chargeback materialization;
- no product reversal execution;
- no provider settlement import;
- no production reconciliation job;
- no merge.

## Next release-control sequence

`REFUND FINANCIAL PROOF → PRODUCT REVERSAL → CHARGEBACK JOURNAL → PROVIDER SETTLEMENT RECONCILIATION → ISOLATED NON-PROD E2E → PAYMENT GO/NO-GO`.

Current posture:

**MARA PAYMENT CONTROL PLANE SUBSTANTIALLY PREPARED / REAL-MONEY RELEASE NOT AUTHORIZED.**
