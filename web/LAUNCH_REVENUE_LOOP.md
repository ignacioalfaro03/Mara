# Mara Vera — Launch Revenue Loop

Status: product commerce layer implemented; real payment activation pending provider approval.

## Contract

The launch loop is:

`landing -> age gate -> enter Mara -> first experience -> preference -> account memory -> fixed unlock or Capricho contribution -> server-confirmed payment -> Supabase entitlement/contribution -> return with memory`.

Payment success is never accepted from a browser query string. The browser can request a checkout intent, but only a signed server-side provider event can create a purchase, entitlement or contribution.

## Supabase

Apply `supabase/migrations/20260903_launch_revenue_loop.sql` only to the dedicated Mara Supabase project.

Tables:

- `commerce_offers` public active offer facts.
- `commerce_goals` public Capricho goal facts and confirmed aggregate progress.
- `commerce_checkout_intents` private user checkout attempts.
- `commerce_purchases` private payment truth.
- `commerce_entitlements` private unlock state.
- `commerce_contributions` private Capricho participation.
- `commerce_webhook_events` private idempotency/replay ledger.

RLS is enabled on every commerce table. Anonymous/authenticated clients can read only active public offers/goals. Authenticated users can read only their own checkout intents, purchases, entitlements and contributions. Browser roles cannot insert payment truth.

Service-role-only functions:

- `fulfill_mara_commerce_checkout(...)`
- `refund_mara_commerce_purchase(...)`

## Runtime

Required for public identity/memory:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Required for server commerce:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

Optional non-production QA provider:

```bash
MARA_PAYMENT_PROVIDER=signed_test
MARA_PAYMENT_WEBHOOK_SECRET=<random 24+ chars>
```

`signed_test` is disabled when `VERCEL_ENV=production`. It exists only to verify checkout intent, webhook signature, idempotency, fulfillment and Supabase persistence without charging money.

## Endpoints

- `GET /api/commerce/launch` returns public offers, Capricho progress and provider status.
- `GET /api/commerce/me` returns the authenticated user's own purchases, entitlements and contributions.
- `POST /api/commerce/checkout` requires an authenticated account and an active configured provider.
- `POST /api/commerce/webhooks/signed-test` verifies HMAC before fulfillment in non-production.
- `GET|POST /api/commerce/test-checkout` is the signed-test hosted checkout shim for QA only.

## Provider Boundary

Do not activate Stripe or PayPal for Mara's intended adult/sensual AI scope under current published policies. Segpay and CCBill remain due-diligence candidates because they publish adult/high-risk support, but Mara still needs explicit merchant/entity/product approval, sandbox credentials, webhook signing material, reserve/fee terms and compliance requirements before any real hosted payment can be proven.

## Current Product Offers

- Fixed unlock: `private_after_scene_note_v1`, `US$4.99`, one-time private continuation.
- Capricho: `black_bag_capricho_01`, custom contribution toward goal `black_bag_01`, target `US$420.00`, private participation by default.

Payment buys concrete experience value only. It does not buy affection, emotional priority or personality changes.

## Variable-cost consumption boundary

`MARA_UNIT_ECONOMICS_MANDATE.md` is authoritative for any future open-ended LLM, voice, media-generation or other materially metered capability.

Permanent rule:

> **NO USER GETS UNBOUNDED VARIABLE COST AT MARA'S EXPENSE.**

Commercial implications:

- free usage must have a hard allowance/cost ceiling;
- Plus/subscription must include a defined usage allowance rather than economically unlimited compute;
- a user who already paid for Plus or previous unlocks may still require a prepaid top-up once incremental variable consumption exceeds the stated included allowance;
- exhaustion must lead to top-up, allowance renewal wait or a bounded fallback/stop before cost becomes uncapped;
- no retroactive surprise overage billing;
- no plan may be activated until its full allowed included consumption is modeled against real provider/payment/refund-reserve costs and the configured contribution-margin floor;
- all materially expensive operations require server-authoritative metering, preflight budget authorization, postflight settlement and global/per-user circuit breakers.

Existing purchased entitlements remain authoritative. Consumption limits cannot silently erase a concrete unlock the user already bought.

The economic trigger must be usage/cost based. Do not raise price or increase purchase pressure from inferred loneliness, distress, dependency or arousal.

Open-ended chat/voice is therefore not production-ready merely because a model/provider can respond. It is production-ready only when the metering, allowance, credit/top-up and spend-kill-switch contract is also in place.
