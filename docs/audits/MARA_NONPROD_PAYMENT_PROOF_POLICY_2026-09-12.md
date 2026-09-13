# MARA — Non-production payment proof policy

Date: 2026-09-12

## Decision

Payment activation remains **NO_GO**. No proof is considered satisfied until evidence is produced in an authorized isolated non-production environment.

## Purpose

`web/payment-nonprod-proof-manifest.json` defines the minimum evidence required before a later GO/NO-GO review can claim the payment stack was actually proven against a database and provider sandbox.

Each proof begins as `UNPROVEN` with `evidence: null`. CI rejects synthetic completion in this branch.

## Evidence required

The proof chain covers migration reconciliation, reviewed migration application, Supabase security advisors, creator OAuth, checkout, provider payment success, signed webhook verification, provider re-fetch, capture materialization, balanced ledger, fulfillment, partial refund behavior, full refund + product reversal, full lost chargeback + product reversal, completed Account Money evidence, and zero critical provider reconciliation issues.

Any future evidence record must carry at least `kind`, `source`, `reference`, and `observedAt`, plus immutable provenance for the Git commit, activation-lock commit, CI run and isolated environment.

## GO boundary

All proofs are required, all must refer to the same isolated environment and activation content, critical reconciliation issues must be zero, automatic promotion is forbidden, and founder go-live authorization remains mandatory.

## Safety boundary

No Supabase project/branch was created, no production mutation occurred, no credentials were configured, no payment/refund/chargeback was executed, and no PR was merged.
