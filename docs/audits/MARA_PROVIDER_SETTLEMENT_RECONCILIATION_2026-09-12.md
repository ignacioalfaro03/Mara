# Mara — Provider Settlement Reconciliation Audit

Date: 2026-09-12
Status: DRAFT / DO NOT MERGE
Parent: PR #75
Branch: `execution/mara-provider-settlement-reconciliation-v1`

## Objective

Add a provider-evidence layer that lets Mara compare its internal payment ledger with Mercado Pago Account Money reports before any payout automation is considered.

## Current Mercado Pago evidence used

The Account Money report exposes transaction categories such as `SETTLEMENT`, `REFUND`, `CHARGEBACK` and `DISPUTE`, plus `SOURCE_ID`, `EXTERNAL_REFERENCE`, `TRANSACTION_AMOUNT`, `TRANSACTION_CURRENCY`, `SELLER_AMOUNT`, `FEE_AMOUNT`, `SETTLEMENT_NET_AMOUNT`, `REAL_AMOUNT`, dates and metadata.

`FEE_AMOUNT` is explicitly treated conservatively because Mercado Pago documents it as an aggregate that may include processing, shipping, financing and coupon-related fees. Mara does not equate it automatically with the payment snapshot's processor fee.

## Completeness boundary

A missing provider settlement row becomes a release-gate failure only if a provider report batch is explicitly marked `complete` and its declared coverage window includes the payment capture timestamp.

This prevents incomplete exports or partially imported CSVs from generating false reconciliation failures.

A batch can be completed only when the actual imported row count matches the caller-supplied imported count and, when available, the expected provider row count.

## Evidence integrity

Provider report rows are append-only. A corrected export must be imported with new batch/row identity rather than rewriting historical evidence.

Browser roles receive no access. Import and reconciliation RPCs are service-role only.

## V1 currency scope

V1 is intentionally restricted to Mercado Pago Chile / CLP. Non-CLP evidence fails closed. CLP report amounts must be integral pesos before comparison with Mara's bigint minor-unit values.

## Reconciliation findings

Critical findings include:

- captured payment covered by a complete report period but missing SETTLEMENT evidence;
- provider SETTLEMENT amount/currency mismatching Mara capture truth;
- non-integral CLP money evidence;
- provider money movement in a complete batch that cannot be correlated to a Mara payment.

Warnings include:

- aggregate provider fee evidence requiring review;
- settlement/net/real amount evidence that may reflect fees, refunds, disputes or chargebacks and therefore must not auto-generate an accounting adjustment.

## Explicitly not performed

- no production DDL;
- no Supabase remote mutation;
- no live provider report download;
- no provider CSV uploaded;
- no payout automation;
- no ledger auto-heal;
- no migration repair;
- no merge.

## Next safe slice

Use this evidence model in an isolated non-production database, import a real Mercado Pago sandbox Account Money export covering known test payments, and prove zero unexplained critical variance across capture → refund → chargeback paths before any payout/release logic is enabled.
