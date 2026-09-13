# Mara — Chargeback Product Reversal Audit

Date: 2026-09-12
Status: DRAFT / DO NOT MERGE
Parent: PR #76
Branch: `execution/mara-chargeback-product-reversal-v1`

## Objective

Close the downstream product-state gap after a provider-authoritative financial chargeback has already been materialized and balanced.

## Explicit product semantics

The existing commerce kernel only supports `succeeded`, `failed`, and `refunded` purchases. This draft adds an explicit `chargeback` product state instead of mislabeling a chargeback as a refund.

Contributions also receive an explicit `chargeback` state. Entitlements continue to use the existing `revoked` state with chargeback metadata.

## Preconditions

Product reversal can execute only when:

- the caller supplies a Mara payment UUID;
- the payment exists on the supported sandbox rail;
- the payment is already `chargeback` financially;
- exactly one full provider chargeback case is `lost` and has `financial_loss_materialized_at`;
- the disputed amount equals the captured amount;
- a matching chargeback ledger transaction exists;
- that ledger transaction is balanced;
- purchase provider/payment/amount/currency truth matches the payment.

An open dispute cannot satisfy these conditions and therefore cannot revoke product access.

## Effects

After all financial preconditions pass:

- purchase status becomes `chargeback`;
- purchase records `charged_back_at` and chargeback case/ledger traceability;
- entitlements become `revoked` with chargeback reason;
- contributions become `chargeback`;
- contribution goal funding is recalculated using the canonical goal refresh function.

## Financial separation

This RPC does not update `commerce_payments`, `commerce_payment_cases`, or append/modify ledger transactions. Financial truth must already exist before product state is changed.

## Reconciliation

The read-only reconciliation surface detects:

- chargeback payment with product reversal still pending;
- chargeback purchase with an active entitlement;
- chargeback purchase with a contribution not reversed.

## Explicitly not performed

- no production DDL;
- no remote Supabase mutation;
- no real chargeback;
- no public chargeback endpoint;
- no migration repair;
- no merge.
