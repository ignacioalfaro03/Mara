# Mara isolated payment E2E harness — 2026-09-12

## Objective

Prepare the next payment activation step without mutating production, the currently connected Supabase project, migration history, or real provider state.

## What changed

- Added `web/scripts/payment-isolated-e2e-harness.mjs`.
- Default behavior is dry-run only.
- `--execute` remains non-mutating and only validates environment safety.
- Execution is blocked unless:
  - `MARA_E2E_ENV=isolated-nonprod`
  - `MARA_E2E_CONFIRM=RUN_ISOLATED_SANDBOX`
  - `SUPABASE_PROJECT_REF` is present and is not the currently connected project ref `hctykprkwenhatbjxkpb`
  - `VERCEL_ENV` is not `production`
  - `NODE_ENV` is not `production`
- The harness reads `payment-activation-manifest.json` and refuses to proceed if the manifest is not still `NO_GO` or if production activation/mutation flags are relaxed.
- The harness surfaces the canonical activation order, required proof sequence, unresolved blocker count and forbidden-before-GO actions.
- Added a contract that proves dry-run succeeds, connected-project execution fails closed, production execution fails closed, and an isolated test marker passes only to the non-mutating scaffold boundary.
- Wired the contract into Web Launch CI.

## Deliberate non-actions

This change does not:

- create a Supabase branch/project;
- incur Supabase branch cost;
- run `supabase db push`;
- repair migration history;
- convert payment drafts into applied migrations;
- configure Mercado Pago credentials;
- send provider API mutations;
- create payments, refunds, disputes or chargebacks;
- import provider reports;
- activate payouts;
- touch production;
- merge any pull request.

## Remaining release-changing blockers

The next material step still requires an explicitly authorized isolated non-production Supabase environment. Only after that exists should the reviewed draft SQL be converted/applied there, advisors run, sandbox credentials configured, and the provider E2E proof sequence executed.
