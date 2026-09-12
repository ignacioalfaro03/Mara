# MARA — Mercado Pago Split Adapter Contract

Status: **DESIGN ONLY / NON-EXECUTABLE**  
Authority: `docs/foundation/MARA_FOUNDATIONAL_THESIS.md`  
Payment architecture: `docs/architecture/PAYMENTS_LEDGER.md`

This document defines the implementation contract for Mara's current primary Chile MVP payment candidate. It does not authorize credentials, production payments, seller onboarding, schema activation or payouts.

## Why this adapter exists

Mara's Creator Revenue OS needs a marketplace-style payment rail where:

- a creator authorizes Mara to sell on their behalf;
- the buyer pays a creator offer;
- Mara can collect an explicit platform/application fee;
- provider truth remains authoritative for payment state;
- every provider event is idempotently reconciled into Mara's purchase + financial ledger model.

Current official Mercado Pago Chile documentation for Split Payments 1:1 describes seller OAuth authorization and marketplace-fee splitting for Chile. Provider details must be revalidated immediately before implementation because APIs and commercial eligibility can change.

## Non-negotiable boundary

Do not add `mercado_pago_split` to `PaymentRuntime` until all activation gates in `PAYMENTS_LEDGER.md` are satisfied and the founder explicitly authorizes real payments.

Until then:

- `signed_test` remains the only executable provider;
- real credentials must not be added to repository files;
- no access/refresh token is persisted;
- no production webhook endpoint is enabled;
- no payment-ledger migration is applied.

## Adapter surface

Future provider adapters should implement an internal contract equivalent to:

```ts
interface CreatorPaymentProvider {
  createSellerAuthorization(input: SellerAuthorizationInput): Promise<SellerAuthorizationResult>;
  exchangeAuthorizationCode(input: AuthorizationCodeInput): Promise<ProviderAccountCredentialResult>;
  refreshSellerCredential(input: RefreshCredentialInput): Promise<ProviderAccountCredentialResult>;
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedProviderEvent>;
  fetchPayment(input: FetchPaymentInput): Promise<ProviderPaymentSnapshot>;
  refundPayment(input: RefundPaymentInput): Promise<ProviderRefundSnapshot>;
}
```

Mara domain code should depend on this contract, not directly on Mercado Pago response shapes.

## Seller onboarding / OAuth

Expected flow:

```text
Creator chooses Connect payments
↓
Mara creates OAuth state + PKCE verifier/challenge
↓
Creator is redirected to Mercado Pago authorization
↓
Provider redirects to Mara callback with authorization code
↓
Mara validates state
↓
Server exchanges code for seller credential
↓
Provider seller/account identity is fetched/validated
↓
Mara stores creator ↔ provider-account linkage
↓
Creator becomes payment-capable only after required provider/KYC state is valid
```

### Security requirements

- OAuth `state` must be unpredictable, single-use and expire quickly.
- Use PKCE when supported/recommended by the provider.
- Authorization codes are server-side only.
- Access tokens and refresh tokens are never returned to browser code.
- Tokens are never stored in `creator_payment_accounts.metadata`.
- Token storage must use a dedicated encrypted/server-only secret design before implementation.
- A creator can only connect or disconnect their own payment account.
- Provider seller identity must be unique and cannot be silently reassigned between Mara creators.
- Refresh operations must be concurrency-safe to avoid token races.

## Checkout mapping

Future checkout creation receives only Mara-authoritative commercial values:

- `checkout_intent_id`
- `creator_id`
- `offer_id`
- buyer identity
- amount in minor units
- currency
- creator provider account
- frozen platform fee for this transaction
- local success/failure/pending return URLs

Never accept from the browser:

- authoritative amount;
- platform fee;
- creator earning;
- seller access token;
- provider account ID;
- payment status.

The provider request should carry a stable Mara reference such as the checkout-intent UUID in the appropriate external-reference field so reconciliation can map provider truth back to one Mara checkout intent.

### Fee snapshot

The platform fee must be frozen server-side at checkout creation and persisted as transaction truth. A later pricing/take-rate change must never rewrite the economics of an already-created transaction.

## Webhook contract

Expected provider flow:

```text
Provider sends payment notification
↓
Mara validates notification authenticity/signature
↓
Mara extracts provider payment/event identity
↓
Mara deduplicates event
↓
Mara fetches payment directly from provider API
↓
Provider API snapshot becomes authoritative truth
↓
Mara validates seller + amount + currency + external reference
↓
Atomic domain write:
  Payment
  Purchase/Refund state
  Entitlement/Fulfillment state
  Ledger transaction + balanced entries
↓
Event marked processed
```

Do not trust payment state, amount or seller solely from webhook request body/query parameters. After authenticity validation, fetch authoritative payment state from the provider API before financial mutation.

## Webhook authenticity

Current Mercado Pago documentation describes `x-signature` validation using an HMAC SHA-256 secret and notification data. Implement it only from the provider's current documentation at coding time; do not copy the existing `signed_test` signature format and assume equivalence.

Required invariants:

- fail closed on missing/malformed signature;
- constant-time comparison where applicable;
- validate request/event identity format;
- deduplicate provider event/payment state transitions;
- log only non-secret diagnostics;
- never log access tokens, refresh tokens or raw authorization credentials.

## Payment truth validation

Before a `succeeded` provider payment becomes a Mara purchase, require:

1. Mara checkout intent exists;
2. provider external reference maps to that intent;
3. checkout intent is for the same offer;
4. seller/provider account matches the creator's connected account;
5. amount equals the server-authoritative intent amount;
6. currency equals the intent currency;
7. provider payment status is accepted/succeeded under current provider semantics;
8. payment has not already materialized under another purchase;
9. provider payment identity is unique;
10. financial journal can be written atomically and balances.

Any mismatch is an operational alert, not a best-effort success.

## Refunds

Refund flow must preserve original transaction history:

```text
Original payment remains
Original purchase remains
↓
Provider refund identity is recorded
↓
Refund object is appended
↓
Purchase/entitlement state reflects refund policy
↓
New ledger transaction reverses relevant economics
```

Support partial refunds in the financial model even if the first product UX only exposes full refunds.

## Reconciliation

Provider adapter is incomplete until Mara can run a reconciliation process that compares provider truth with Mara truth.

Required report buckets:

- provider success with no Mara payment;
- Mara success absent/mismatched at provider;
- amount mismatch;
- currency mismatch;
- creator/seller mismatch;
- unknown external reference;
- provider refund absent from Mara;
- Mara refund absent from provider;
- duplicate provider identities;
- unbalanced journal;
- payout/account restriction requiring creator action.

## Creator payment UX

Creator OS should eventually expose a simple state machine, not provider internals:

- `Payments not connected`
- `Finish payment verification`
- `Payments ready`
- `Payments restricted — action required`

Do not promise withdrawable balance until payout/provider truth is integrated.

## Environment contract — future, not active

Names below are design placeholders, not current runtime requirements:

```text
MARA_PAYMENT_PROVIDER=mercado_pago_split
MARA_MP_CLIENT_ID=<server/config>
MARA_MP_CLIENT_SECRET=<server secret>
MARA_MP_REDIRECT_URI=<canonical callback>
MARA_MP_WEBHOOK_SECRET=<server secret>
```

Seller access/refresh tokens must not be represented as shared environment variables because they are creator-specific credentials.

## Activation checklist

Before changing `PaymentRuntime`:

- [ ] Mercado Pago marketplace application exists and is eligible for intended Chile flow.
- [ ] OAuth callback domain is approved/canonical.
- [ ] OAuth state + PKCE implementation has tests.
- [ ] encrypted creator token storage design exists.
- [ ] seller account/KYC state is mapped to Mara.
- [ ] checkout adapter uses server-authoritative amount/fee.
- [ ] webhook verification uses current provider docs.
- [ ] webhook performs provider API re-fetch before mutation.
- [ ] payment ledger is activated on non-production first.
- [ ] payment/refund journal tests balance.
- [ ] duplicate/out-of-order webhook tests pass.
- [ ] reconciliation report exists.
- [ ] refund/chargeback operating policy exists.
- [ ] production compliance/legal/tax review is completed.
- [ ] founder explicitly authorizes real payment activation.

Until every required launch gate is satisfied, this document remains architecture only.