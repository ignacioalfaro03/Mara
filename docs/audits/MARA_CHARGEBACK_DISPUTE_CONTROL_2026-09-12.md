# Mara — Chargeback / Dispute Control Audit

Date: 2026-09-12
Status: DRAFT / DO NOT MERGE
Parent: PR #74
Branch: `execution/mara-chargeback-dispute-control-v1`

## Objective

Close the next financial-integrity gap in the Revenue OS payment stack without touching the connected production database.

The control plane distinguishes a provider dispute/claim from a provider-confirmed chargeback loss. A dispute is operational risk, not automatically a realized financial loss.

## Provider-authoritative boundary

The draft accepts only service-side provider/report truth. Browser roles cannot read or write the case table and cannot execute the financial RPCs.

A `dispute` case may be recorded and reconciled, but does not mutate payment, purchase, entitlement, refund, or ledger state merely because it is open.

A chargeback loss can materialize only when all of these are true:

- case type is `chargeback`;
- case status is `lost`;
- the linked payment exists and belongs to the supported sandbox rail;
- the payment is still a clean `succeeded` capture;
- no refund has already been materialized;
- disputed amount equals the full captured amount;
- currency matches;
- original platform fee snapshot is valid.

Any partial chargeback or refund/chargeback overlap fails closed in V1 and must be reconciled from provider settlement/report truth before automation is expanded.

## Accounting policy

For a clean full chargeback, the draft reverses the principal economic split already recognized at capture:

- debit creator payable for the creator share;
- debit platform revenue for Mara's fee share;
- credit processor clearing for the full captured amount.

The journal must balance before payment state can move to `chargeback`.

The draft intentionally does not invent processor-fee reimbursement/reversal. That remains dependent on actual Mercado Pago settlement/report evidence.

## Idempotency

Chargeback journal identity is deterministic per provider case. Repeated execution converges to the existing journal when the payment/case are already materialized consistently.

A state claiming `chargeback` without its ledger transaction is treated as an integrity failure.

## Product state

Financial loss and product revocation remain separate gates. This draft does not directly revoke entitlements or rewrite purchase state. Reconciliation emits `CHARGEBACK_PRODUCT_REVERSAL_PENDING` until a downstream payment-backed product reversal is implemented.

## Reconciliation signals

The draft exposes service-only read-only signals for:

- missing chargeback ledger;
- product reversal still pending after financial chargeback;
- unsupported refund/chargeback overlap;
- open dispute with no automatic financial mutation.

## Security

- RLS enabled on `commerce_payment_cases`.
- `anon` and `authenticated` have no table grants.
- RPC execution revoked from `public`, `anon`, and `authenticated`.
- service role is the only execution path.
- all privileged SQL uses `search_path = ''` and schema-qualified objects.
- draft remains outside `supabase/migrations`.

## Explicitly not performed

- no Supabase remote DDL;
- no migration repair;
- no live provider credentials;
- no real dispute/chargeback;
- no settlement import;
- no production reconciliation job;
- no product chargeback reversal yet;
- no merge.

## Next safe slice

After CI is green, the next high-value slice is settlement/report reconciliation: import normalized provider money movements into a read-only/raw evidence layer, compare captures/refunds/chargebacks/fees against Mara's ledger, and fail the release gate on unexplained variance before any automated payout logic is considered.
