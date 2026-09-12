# MARA — Mercado Pago Sandbox Payment Materialization Audit

Date: 2026-09-12  
Execution line: `execution/mara-mp-sandbox-payment-materialization-v1`  
Parent: `execution/mara-mp-sandbox-oauth-webhook-harness-v1` / PR #70

## Executive outcome

Mara now has the application-side bridge from an authenticated, provider-refetched and server-accepted Mercado Pago sandbox payment into the existing financial capture materializer draft.

The sequence is deliberately:

`WEBHOOK → HMAC VERIFY → OPAQUE ACCOUNT BINDING → PROVIDER RE-FETCH → FROZEN CHECKOUT VALIDATION → ACCEPTANCE → FINANCIAL MATERIALIZATION`

and **not**:

`WEBHOOK → PURCHASE/FULFILLMENT`.

This line does not activate production payments, does not apply financial migrations and does not fulfill product access.

## Existing financial primitive reused

The repo already contained:

`web/supabase/drafts/mara_payment_capture_materialization_v1.sql`

It was retained rather than duplicated. The RPC:

- locks and reloads the checkout intent;
- joins the owning creator from the offer;
- re-validates provider, provider account, amount and currency;
- requires the frozen platform fee snapshot;
- enforces provider payment idempotency;
- inserts one `commerce_payments` record for a successful capture;
- writes balanced payment-capture ledger entries;
- writes a separate balanced processor-fee journal when applicable;
- calls the ledger balance assertion before returning;
- grants execution only to service role;
- creates no purchase, entitlement, payout or refund.

The financial SQL remains under `supabase/drafts` and is not applied.

## New provider evidence handoff

`web/lib/commerce/mercado-pago-sandbox-webhook.ts`

The webhook acceptance result now carries the authenticated provider payment snapshot internally.

This matters because the materializer receives the **same provider-refetched evidence used for acceptance**, rather than trusting browser values or issuing a disconnected financial write from raw webhook payload fields.

The HTTP response still exposes only bounded identifiers/disposition; no credentials are surfaced.

## New materialization coordinator

`web/lib/commerce/mercado-pago-sandbox-materialization.ts`

Hard gates:

1. `VERCEL_ENV=production` → blocked;
2. `MARA_MP_SANDBOX_MATERIALIZATION_ENABLED` must equal `true`;
3. `MARA_MP_SANDBOX_PROCESSOR_FEE_BEARER` must be explicitly `creator` or `platform`;
4. webhook disposition must equal `materialize_succeeded`;
5. checkout/payment identities must exist;
6. provider snapshot must be `succeeded`;
7. provider event identity must exist;
8. provider processor-fee truth must be present and valid.

Only then may the coordinator invoke:

`materialize_mara_payment_capture_v1`.

### Why processor-fee bearer is explicit

The current architecture does not yet make a founder-approved commercial decision about whether Mercado Pago processing cost is economically borne by Mara or the creator.

The implementation therefore refuses to guess. Missing policy produces a fail-closed state rather than silently changing creator earnings or Mara margin.

## Webhook route behavior

`POST /api/commerce/webhooks/mercado-pago-sandbox`

When sandbox materialization is disabled, the route continues to prove webhook authenticity and acceptance without writing financial state.

When explicitly enabled in non-production, only `materialize_succeeded` can call the capture RPC.

The route always returns:

`fulfilled: false`

because purchase/entitlement fulfillment remains a separate canonical gate after financial materialization.

If an enabled financial materialization throws, the route returns HTTP 503 so provider retry can converge through the idempotent payment/materializer contract rather than falsely acknowledging a failed financial write.

## CI control

Added:

`web/scripts/mercado-pago-sandbox-materialization-contract.mjs`

and npm command:

`npm run mercado-pago-sandbox-materialization:contract`

CI verifies:

- production block;
- explicit materialization flag;
- explicit fee-bearer policy;
- accepted/succeeded provider evidence requirement;
- provider event requirement;
- service-only materializer SQL;
- frozen checkout economics;
- payment idempotency;
- balanced ledger assertion;
- append-only ledger triggers;
- no purchase/entitlement fulfillment from the webhook route;
- ledger/materializer remain drafts, not migrations.

## Still deliberately not done

- no production provider activation;
- no Supabase DDL;
- no financial migration activation;
- no real Mercado Pago credentials;
- no real transaction;
- no creator payout;
- no purchase fulfillment from provider webhook;
- no reconciliation execution;
- no refund/chargeback execution;
- no merge.

## Next gate

The next financial control-plane step is:

`CAPTURE MATERIALIZED → PURCHASE/FULFILLMENT LINK → REFUND/CHARGEBACK REVERSALS → RECONCILIATION REPORT → NON-PROD END-TO-END PROOF → PAYMENT GO/NO-GO`.

Mara remains:

**SANDBOX FINANCIAL PATH PREPARED / REAL-MONEY RELEASE NOT AUTHORIZED.**
