# Mara Commerce Architecture

Status: canonical commerce backbone already existed before Product Realization and is reused, not replaced.

## Universal commercial abstraction

Mara uses `commerce_offers → commerce_checkout_intents → commerce_purchases → commerce_entitlements / fulfillment`. Creator requests and future products are adapters into this backbone rather than separate payment systems.

`commerce_offers` remains the price source of truth. Content with `paid_unlock` references an offer. Request acceptance creates a creator-scoped fixed offer with manual fulfillment metadata. Browser-submitted prices are not accepted as payment truth.

## Checkout integrity

`/api/commerce/checkout` verifies authenticated user, active offer, server-derived amount, currency/provider match and client request idempotency. Creator-scoped offers are guarded from live payment providers until an explicit release decision; current proof uses `signed_test` only.

Webhook fulfillment verifies the provider signature and payload, then calls the existing database fulfillment/refund RPCs. Request-linked offers carry a request id in offer metadata so successful/refunded purchases can update the request lifecycle without creating a second money ledger.

## Entitlement and delivery

Digital access is persisted in `commerce_entitlements`. Existing premium delivery checks entitlement server-side before reading a private Supabase Storage object. Private files are not made public merely because UI needs a preview.

Manual creator fulfillment remains supported through the existing creator fulfillment RPC. Personalized requests reuse it after a succeeded purchase.

## Membership readiness

The branch versions `creator_membership_tiers` and `creator_memberships`, but does not pretend recurring billing exists. Membership UI remains behind `MARA_MEMBERSHIPS_SYSTEM_ENABLED`; real recurring provider behavior must be implemented and validated before activation.

## Economics still pending

A full configurable split ledger for processor fee, tax, platform fee, creator share, payout availability and payout settlement is not yet active. Existing purchases retain creator/world attribution. Real payouts remain OFF.

## Release boundary

No new Product Realization migration has been applied to canonical production, and no live payment provider was enabled by this branch.