# Mara Payment Non-Production Activation Preflight — 2026-09-12

## Purpose

Create a fail-closed, mutation-free preflight for the next real payment-readiness step without provisioning infrastructure or touching the currently connected Supabase project.

## What the preflight validates

- activation manifest remains `NO_GO`;
- only `isolated-non-production-only` execution is permitted;
- production activation and connected-project mutation remain disabled;
- explicit isolated non-production acknowledgement is present;
- `VERCEL_ENV=production` is blocked;
- ordinary `NODE_ENV=production` is blocked;
- an isolated Supabase URL is present;
- the currently connected project identifier `hctykprkwenhatbjxkpb` / `mara_vera` is blocked;
- required environment variable names exist for isolated Supabase and Mercado Pago sandbox wiring;
- external proof blockers remain visible and fail the preflight until they are actually proven.

## Secret handling

The script checks only presence of required environment variable names. It never prints secret values. Its structured output explicitly reports `secretsEchoed: false` and contains no mutation path.

## Required environment names

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADO_PAGO_CLIENT_ID`
- `MERCADO_PAGO_CLIENT_SECRET`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `MERCADO_PAGO_OAUTH_REDIRECT_URI`
- `MERCADO_PAGO_WEBHOOK_BASE_URL`

Execution additionally requires:

- `MARA_ISOLATED_NONPROD=true`
- `MARA_PAYMENT_ACTIVATION_PREFLIGHT=I_UNDERSTAND_ISOLATED_NONPROD_ONLY`

## Current expected result

The preflight must currently fail closed because the activation manifest still contains unresolved external blockers, including:

- migration history reconciliation;
- authorized isolated non-production database;
- reviewed draft-to-migration promotion;
- Mercado Pago sandbox credentials;
- provider E2E capture/refund/chargeback proof;
- settlement report reconciliation;
- Supabase security/performance advisor proof.

This is intentional. A green CI result means the **preflight contract behaves correctly**, not that payment activation is authorized.

## Explicit non-actions

This change does not:

- create a Supabase project or branch;
- apply DDL;
- repair migration history;
- promote draft SQL into applied migrations;
- store or rotate credentials;
- create a payment;
- issue a refund or chargeback;
- import provider settlement evidence;
- activate production payments;
- authorize a merge.

## Release boundary

The next release-changing step remains external and explicit: authorize/provision an isolated non-production Supabase environment, reconcile its baseline, wire real Mercado Pago sandbox credentials, and execute the already-defined proof sequence there. Production remains blocked separately behind founder authorization.
