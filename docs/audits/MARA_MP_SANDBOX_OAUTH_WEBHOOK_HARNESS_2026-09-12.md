# MARA — Mercado Pago Sandbox OAuth + Webhook Harness Audit

Date: 2026-09-12  
Execution line: `execution/mara-mp-sandbox-oauth-webhook-harness-v1`  
Parent: `execution/mara-mp-sandbox-vault-runtime-v1` / PR #69

## Executive outcome

Mara now has the application-side harness required to move from static Mercado Pago sandbox primitives to an executable, server-controlled OAuth + webhook flow once an isolated non-production Supabase database and sandbox credentials exist.

This line does **not** activate real payments, does **not** mutate the connected production database and does **not** materialize provider payments into Mara's financial ledger.

## Added

### Transactional OAuth draft

`web/supabase/drafts/mara_mp_sandbox_oauth_rpc_v1.sql`

The draft provides service-only RPCs for:

- beginning an OAuth session;
- storing only SHA-256 state hash;
- placing the PKCE verifier in Supabase Vault;
- atomically consuming a pending, unexpired OAuth session;
- deleting the temporary PKCE Vault secret after consume;
- binding an opaque provider credential reference to the creator payment account.

Browser roles receive no execute grant.

### OAuth runtime coordinator

`web/lib/commerce/mercado-pago-sandbox-oauth-runtime.ts`

Behavior:

- cryptographically random OAuth state;
- PKCE S256 challenge;
- ten-minute bounded session lifetime;
- server-side state hash persistence;
- provider authorization URL construction;
- callback exchange through the existing sandbox client;
- credential persistence through the Vault adapter;
- payment-account binding after successful OAuth;
- creation/reuse of a random webhook binding id;
- notification URL construction containing only the opaque webhook binding.

### Creator connect endpoint

`POST /api/creator/payments/mercado-pago-sandbox/connect`

Requires:

- sandbox runtime enabled;
- non-production deployment;
- server-side Supabase configuration;
- authenticated user;
- existing creator record.

It returns only the provider authorization URL and expiry. It never returns client secret, webhook secret, access token, refresh token, PKCE verifier or Vault reference.

### OAuth callback endpoint

`GET /api/creator/payments/mercado-pago-sandbox/callback`

The callback:

- requires the sandbox runtime;
- consumes server-authoritative state;
- exchanges the authorization code server-side;
- persists credentials through Vault;
- redirects to creator UI with a bounded status code only.

No provider credential is written to query params, cookies or browser-visible JSON.

### Opaque webhook binding draft

`web/supabase/drafts/mara_mp_sandbox_webhook_binding_v1.sql`

Adds a private random UUID binding between:

`binding_id → creator → provider account → opaque credential reference`

The Mercado Pago notification URL therefore requires only:

`mara_account=<random binding UUID>`

and never exposes creator id, provider account id, raw credentials or Vault secret id.

Service-only RPCs resolve the binding and read the server-authoritative checkout expectation.

### Webhook store + route

`web/lib/commerce/mercado-pago-sandbox-webhook-store.ts`

`POST /api/commerce/webhooks/mercado-pago-sandbox`

The route executes:

`RAW WEBHOOK → HMAC SIGNATURE VERIFY → OPAQUE BINDING RESOLVE → PROVIDER RE-FETCH → CHECKOUT EXPECTATION → ACCEPTANCE/HOLD DECISION`

It explicitly returns:

`materialized: false`

because financial materialization remains a later release gate.

A provider webhook alone can never mark a purchase as fulfilled.

## Security boundaries

The harness preserves these invariants:

- Mercado Pago sandbox remains blocked in production;
- no `NEXT_PUBLIC_*` payment secrets;
- no token logging;
- no raw provider credential product columns;
- no browser execution of payment RPCs;
- OAuth state is not stored in plaintext;
- PKCE verifier is temporary and Vault-backed;
- callback sessions are single-use;
- webhook signature is verified before provider re-fetch;
- provider result is checked against frozen checkout expectation;
- webhook route performs no ledger/purchase materialization.

## Environment reality check

Read-only Supabase inspection on 2026-09-12 shows:

- connected project: `Mara_vera` / `hctykprkwenhatbjxkpb`;
- development branches: **none**;
- connected project must remain untouched by these drafts.

Therefore the first environment where this harness may be activated must be a separately authorized non-production Supabase branch/project.

## Next gate

`NON-PROD SUPABASE → APPLY REVIEWED PAYMENT/Vault/OAUTH/BINDING DRAFTS → CONFIGURE MP SANDBOX CREDENTIALS → CREATOR OAUTH → TEST CHECKOUT → SIGNED WEBHOOK → PROVIDER RE-FETCH → ACCEPTANCE/HOLD PROOF → MATERIALIZER`.

Until the materializer and reconciliation stack are proven, Mara remains:

**PAYMENT HARNESS READY / REAL-MONEY GO-LIVE NOT AUTHORIZED.**
