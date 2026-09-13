# Mara payment E2E dry-run evidence — 2026-09-12

## Purpose

Advance payment-release readiness without mutating the connected Supabase project, repairing migration history, provisioning paid infrastructure, storing real provider credentials, or activating production payments.

## Added controls

### Isolated payment E2E harness

`web/scripts/payment-isolated-e2e-harness.mjs`

- Reads `payment-activation-manifest.json` as the authoritative activation gate.
- Requires activation status to remain `NO_GO` while external proof is missing.
- Dry-run mode emits the ordered provider proof sequence and performs zero mutations.
- `--execute` fails closed unless the environment declares an isolated non-production target and an explicit execution acknowledgement.
- Explicitly blocks the currently connected Mara Supabase project identifier.
- Explicitly blocks Vercel production execution.
- Even after the environment gate passes, the execution adapter remains intentionally disabled until isolated infrastructure is authorized and wired.

This is deliberate: the harness cannot become a hidden path to production activation.

### Mercado Pago Account Money dry-run validator

`web/scripts/mercado-pago-account-money-dryrun.mjs`

The validator is read-only and prepares provider settlement evidence before database import.

V1 rules:

- requires the provider evidence columns used by Mara reconciliation;
- accepts CLP only;
- treats one CLP minor unit as one peso and rejects decimal peso values;
- rejects duplicate evidence rows using provider source/type/date/amount identity;
- summarizes transaction counts and provider monetary evidence;
- treats `FEE_AMOUNT` only as aggregate provider fee evidence, never as a pure processor fee;
- performs zero database writes.

## CI

Web Launch CI now verifies:

1. isolated E2E harness fail-closed behavior;
2. connected-project rejection;
3. production-context rejection;
4. valid isolated-test environment shape;
5. Account Money CSV parsing;
6. CLP integer-peso enforcement;
7. non-CLP rejection;
8. zero-mutation dry-run output.

## Release impact

This does **not** change the activation status. Mara remains `NO_GO` for payment activation.

The remaining release-changing blockers are external and must be proven in an isolated environment:

- migration history reconciled;
- isolated non-production Supabase database/branch;
- reviewed drafts promoted to migrations there;
- real Mercado Pago sandbox credentials;
- real provider E2E proof for capture/refund/chargeback/product reversal;
- completed Account Money report reconciled with zero unexplained critical findings;
- Supabase security/performance advisors clean;
- explicit founder authorization before any production activation.

## Explicit non-actions

- no merge;
- no Supabase branch/project created;
- no database DDL applied;
- no migration repair;
- no provider credentials stored;
- no production payment activation;
- no real payment/refund/chargeback/payout executed.
