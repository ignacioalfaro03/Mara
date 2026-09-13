# MARA — Payment activation content lock

Date: 2026-09-12

## Decision

The payment stack remains **NO_GO** for production. This change does not activate payments or mutate Supabase.

## Purpose

The reviewed payment activation package now has an explicit content lock. Every SQL draft in `web/payment-activation-manifest.json` is pinned to its Git blob SHA in `web/payment-activation-lock.json`.

CI recomputes each Git blob SHA from the repository bytes and fails if:

- a locked activation draft changes without an explicit lock update;
- the lock and activation manifest differ in path or order;
- a locked draft disappears;
- a locked draft is silently copied into `supabase/migrations`;
- the migration reconciliation evidence snapshot changes without an explicit lock update;
- the fail-closed `NO_GO` / production-disabled policy is weakened.

## Locked activation order

1. payment ledger
2. Mercado Pago sandbox Vault bridge
3. Mercado Pago sandbox OAuth RPCs
4. Mercado Pago sandbox webhook binding
5. payment capture materialization
6. payment-backed fulfillment
7. refund materialization
8. payment reconciliation snapshot
9. full-refund product reversal
10. chargeback/dispute control
11. provider settlement reconciliation
12. chargeback product reversal

## Review model

The lock is intentionally not immutable forever. A legitimate SQL change must be reviewed, update the lock explicitly, and pass the complete payment CI stack again. The control prevents **silent drift**, not reviewed evolution.

## External blockers unchanged

Production remains blocked until migration history is reconciled, an isolated non-production database is authorized, reviewed drafts are converted into real migrations, real Mercado Pago sandbox credentials are configured, provider E2E succeeds, settlement evidence reconciles with zero unexplained critical issues, Supabase security advisors are clean, and the founder explicitly authorizes go-live.

## Safety boundary

No production DDL, remote Supabase mutation, migration repair, credential change, real payment/refund/chargeback, payout automation, or merge was performed by this slice.
