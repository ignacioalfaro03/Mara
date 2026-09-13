# Mara — Payment Activation Readiness Audit

Date: 2026-09-12
Status: NO-GO / DRAFT / DO NOT MERGE
Parent: PR #77
Branch: `execution/mara-payment-activation-readiness-v1`

## Objective

Turn the growing payment implementation into a controlled activation package without activating anything remotely.

The repository now has an explicit activation manifest that defines draft SQL order, required contracts, proof sequence, hard blockers, and forbidden actions before GO.

## Current decision

**NO-GO.**

This is intentional. Code readiness is not the same as payment-system release readiness.

## Hard blockers

Production cannot be considered until all of these are independently proven:

1. repository/remote Supabase migration history reconciled;
2. authorized isolated non-production database exists;
3. reviewed drafts are converted to proper migrations in that isolated environment;
4. Mercado Pago sandbox application/OAuth credentials are configured there;
5. real sandbox E2E proves capture → fulfillment → refunds → chargeback → product reversal;
6. completed Account Money report evidence reconciles with zero unexplained critical variance;
7. Supabase security/performance advisors pass after activation;
8. founder separately authorizes production activation.

## Activation order

The machine-readable manifest orders the core stack from financial ledger and Vault/OAuth boundaries through capture, fulfillment, refunds, chargebacks, provider settlement evidence and downstream product reversal.

The contract verifies all listed drafts exist, remain outside migrations, and respect key dependency ordering.

## Required proof sequence

The proof sequence explicitly requires, among other things:

- signed webhook + provider re-fetch;
- balanced capture ledger;
- purchase fulfillment;
- partial refund does not revoke product;
- full refund does revoke product after financial truth;
- clean full chargeback materialization;
- chargeback-backed product reversal;
- complete Account Money batch import;
- zero critical provider reconciliation findings.

## Forbidden before GO

- production DDL;
- production payment activation;
- automatic creator payouts;
- unreviewed migration repair;
- automatic ledger auto-heal;
- merge without founder command.

## External blocker

The connected Supabase project still has no authorized isolated development branch/database. Creating a managed branch may carry cost, so this audit does not create one.

## Next safe step

Once an isolated environment is explicitly authorized, convert reviewed drafts into migrations in dependency order, run advisors, configure real Mercado Pago sandbox credentials, and execute the proof sequence. Until then the correct state remains NO-GO.
