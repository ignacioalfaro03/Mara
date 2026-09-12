# MARA — Mercado Pago Sandbox Vault Runtime Audit

Date: 2026-09-12  
Execution line: `execution/mara-mp-sandbox-vault-runtime-v1`  
Parent: `execution/mara-db-reconciliation-payment-readiness-v1` / PR #68

## Executive outcome

Mara now has a **real server-side execution boundary** for future Mercado Pago sandbox testing without making Mercado Pago executable in production and without storing raw provider credentials in product tables.

This is infrastructure preparation only. It does **not** make Mara payment-ready and it does **not** activate payments.

## Added

### Supabase Vault bridge — draft only

`web/supabase/drafts/mara_mp_sandbox_vault_bridge_v1.sql`

Design:

- Supabase Vault stores encrypted OAuth credential bundles;
- a private registry binds an opaque Vault secret UUID to creator + provider account;
- service-only RPCs implement put/read/replace;
- browser roles receive no function execution grant;
- raw access/refresh tokens are not added to any public product table;
- the SQL remains under `supabase/drafts`, not migrations.

This follows current Supabase guidance to use Vault for database-managed secrets rather than deprecated pgsodium application patterns.

### Server-side Vault adapter

`web/lib/commerce/supabase-mercado-pago-sandbox-vault.ts`

Implements the existing `MercadoPagoSandboxCredentialVault` contract using the service-side Supabase boundary.

Protections:

- opaque UUID references only;
- exact credential-object shape validation;
- no response-body logging;
- no token-bearing errors;
- no `NEXT_PUBLIC_*` payment secret surface;
- `no-store` and redirect blocking on RPC calls.

### Fail-closed sandbox runtime

`web/lib/commerce/mercado-pago-sandbox-runtime.ts`

The runtime:

- is hard-disabled when `VERCEL_ENV=production`;
- requires `MARA_MP_SANDBOX_ENABLED=true` outside production;
- requires complete server-side Supabase config;
- requires Mercado Pago sandbox client ID, client secret and webhook secret;
- requires HTTPS OAuth/webhook URLs;
- only allows outbound provider traffic to `https://api.mercadopago.com`;
- rejects URL credentials and HTTP redirects.

### CI contract

`web/scripts/mercado-pago-sandbox-runtime-contract.mjs`

The contract ensures the runtime remains production-blocked, Vault remains draft-only, browser grants remain revoked and the server adapter cannot silently drift toward public secrets or secret-bearing logs.

## Read-only compatibility proof

The connected Supabase project was inspected without DDL or secret mutation.

Confirmed:

- extension `supabase_vault` is installed in schema `vault`;
- `vault.create_secret(new_secret text, new_name text default null, new_description text default '', new_key_id uuid default null)` returns `uuid`;
- `vault.update_secret(secret_id uuid, new_secret text default null, new_name text default null, new_description text default null, new_key_id uuid default null)` returns `void`;
- the draft's three-argument `create_secret` call and four-argument `update_secret` call are compatible with the installed function signatures and defaults.

No Vault secret was created or modified during this proof.

## CI evidence

Web Launch CI run #523 on head `7dbb5355ccbe86068f2454fd7342062cbd38708e` completed successfully.

Verified green in the same run:

- migration-drift contract;
- payment-readiness contracts;
- Mercado Pago test-only boundary;
- Mercado Pago sandbox runtime boundary;
- second-purchase engine;
- creator monetization engine;
- DEV-lab production boundary;
- TypeScript typecheck;
- Next.js production build;
- Revenue OS production mobile smoke.

## Deliberately not done

- no Supabase DDL;
- no Vault secret created in the connected project;
- no migration repair;
- no payment-ledger activation;
- no OAuth route activation;
- no webhook route activation;
- no Mercado Pago credentials added;
- no Vercel environment mutation;
- no real payment;
- no payout;
- no production deployment;
- no merge.

## Next executable gate

The next safe technical outcome is:

`ISOLATED NON-PROD DATABASE → APPLY REVIEWED VAULT + PAYMENT DRAFTS → SANDBOX CREATOR OAUTH → CHECKOUT PREFERENCE → SIGNED WEBHOOK → PROVIDER RE-FETCH → ACCEPTANCE/HOLD → PAYMENT MATERIALIZATION → RECONCILIATION`

The connected production database must remain untouched until explicit founder authorization and migration-history reconciliation.
