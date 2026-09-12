# MARA — Mercado Pago Test Integration Runbook

Status: **TEST ONLY / NO REAL MONEY**  
Scope: Chile MVP payment proof for Creator Revenue OS  
Production activation: **FORBIDDEN by current founder boundary**

## Objective

Prove the future Mara payment path using Mercado Pago test accounts and test credentials without changing the production payment runtime.

Target proof:

`CREATOR TEST SELLER → OAUTH → CHECKOUT INTENT → CHECKOUT PRO TEST PREFERENCE → TEST BUYER → SIGNED WEBHOOK → PROVIDER RE-FETCH → LEDGER RECONCILIATION → PURCHASE`

The current repo intentionally stops before credential/network execution. `web/lib/commerce/mercado-pago-test.ts` contains deterministic test primitives only and is not wired into `getPaymentRuntime()`.

## Why Checkout Pro first

For the first Chile proof, use **Checkout Pro** rather than embedded Checkout API:

- redirect keeps PCI/payment UI outside Mara;
- Split Payments 1:1 supports Checkout Pro;
- the marketplace fee is expressed as `marketplace_fee` when creating `/checkout/preferences`;
- the request must use the seller OAuth access token;
- the integrator public key remains a frontend concern only when required by the chosen checkout experience.

Mara should validate money movement and reconciliation before optimizing checkout UX.

## External setup required in Mercado Pago

These steps require founder/operator access to Mercado Pago Developers. They cannot be completed from repository code alone.

1. Create/select the Mara application in **Tus integraciones**.
2. Create/identify Chile test accounts for the marketplace flow:
   - Integrator;
   - Seller;
   - Buyer.
3. Complete the seller authorization using OAuth in test context.
4. Keep all test credentials outside GitHub.
5. Configure a test webhook URL and obtain its webhook secret.
6. Never paste production credentials into local test fixtures, CI variables, PR comments or repository files.

Mercado Pago currently documents test accounts as the supported way to exercise marketplace integrations and allows multiple test users for seller/buyer/integrator roles.

## Repository boundary

Current executable product runtime remains:

`MARA_PAYMENT_PROVIDER=signed_test`

Do **not** add `mercado_pago`, `mercado_pago_split`, `checkout_pro` or equivalent to `getPaymentRuntime()` during sandbox preparation.

The test primitives may prepare:

- OAuth authorization URL with state + PKCE;
- Checkout Pro preference payload;
- documented API endpoints;
- webhook signature verification;
- provider payment normalization.

They may not:

- read credentials from environment;
- perform network requests;
- persist OAuth tokens;
- create purchases;
- post ledger entries;
- change entitlements;
- enable payouts.

Those responsibilities belong to the future server-only adapter after credential storage and test infrastructure are explicitly approved.

## Test checkout contract

A future test preference must use values frozen by Mara before redirect:

- `checkoutIntentId` → Mercado Pago `external_reference`;
- server-authoritative offer amount;
- checkout-intent currency;
- frozen `platform_fee_minor` → Checkout Pro `marketplace_fee`;
- creator seller account snapshot;
- success/pending/failure return URLs;
- webhook notification URL.

The browser must never supply the authoritative sale amount or Mara fee.

## Webhook authenticity

For each received Mercado Pago webhook:

1. read `x-signature`;
2. extract `ts` and `v1`;
3. read `x-request-id`;
4. read the payment `data.id` and normalize it to lower-case for the manifest;
5. construct the documented manifest from available values;
6. calculate HMAC-SHA256 with the application webhook secret;
7. compare the digest in constant time;
8. reject unauthenticated notifications;
9. after successful signature verification, fetch the payment from Mercado Pago using the seller credential;
10. provider API truth, not webhook body claims, decides financial state.

The current primitive implements steps 1–7 only. It deliberately does not mutate Mara state.

## Provider re-fetch checks

Before a future adapter materializes a successful payment, it must reconcile all of these against Mara's frozen checkout intent:

- provider payment ID is unique/idempotent;
- `external_reference == checkout_intent.id`;
- amount equals checkout `amount_minor`;
- currency matches;
- seller/provider account matches the creator snapshot;
- platform fee matches the frozen fee model where provider data exposes it;
- status maps deterministically;
- refund amount never exceeds captured amount.

Any mismatch fails closed and enters reconciliation. It must not create a purchase optimistically.

## Test scenarios required before live-payment review

1. approved first delivery;
2. pending payment;
3. rejected/cancelled payment;
4. duplicate webhook delivery;
5. same checkout request retried;
6. tampered webhook signature;
7. wrong amount;
8. wrong currency;
9. wrong external reference;
10. wrong seller account;
11. partial refund;
12. full refund;
13. refund when seller balance is insufficient;
14. delayed/out-of-order webhook events;
15. provider API temporarily unavailable;
16. buyer closes browser before returning to Mara.

A successful redirect is never payment truth.

## Refund operating risk

Mercado Pago documents that in Split Payments 1:1 refunds are apportioned between seller and marketplace, and that a full refund can be constrained when the seller does not have sufficient balance. This is an operating/reconciliation requirement Mara must surface rather than hide.

## Exit gate: PAYMENT TEST READY

Mara may be called **PAYMENT TEST READY** only when all are true:

- test application exists;
- test integrator/seller/buyer identities exist;
- OAuth test flow is proven;
- test credentials are stored server-side outside source control;
- Checkout Pro preference can be created with seller OAuth token;
- a test buyer can complete a test payment;
- webhook signature verification passes/fails correctly;
- provider payment re-fetch is authoritative;
- duplicate delivery converges idempotently;
- ledger draft has a reviewed preview migration in an isolated DB;
- approved/refund scenarios reconcile to zero unexplained difference;
- no real payment provider is enabled in production.

Passing this gate still does **not** authorize production payments.

## Current verdict

**SANDBOX CODE PREPARED, EXTERNAL TEST CREDENTIALS NOT YET CONNECTED.**

The next external dependency is creation/selection of the Mara Mercado Pago application and Chile marketplace test users/credentials. Until those exist, repository work can validate contracts but cannot honestly claim an end-to-end Mercado Pago test payment.