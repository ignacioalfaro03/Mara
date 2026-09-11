# Mara Product Realization Architecture

Status: implemented on `codex/full-product-realization-v1`; not merged; new schema remains versioned-only until an explicit database/release activation.

## Product boundary

Mara is the commercial operating system between creator and customer. The application is split into three surfaces: consumer app, Creator OS, and future internal Operations/Admin. Consumer UX hides CRM, WTP and orchestration language; Creator OS exposes business conclusions rather than technical internals.

Canonical commercial loop:

`creator → audience → relationship → customer understanding → offer → payment → delivery → learning → next best offer → repurchase`

## Canonical entities reused

The branch keeps `creators`, `creator_worlds`, `commerce_offers`, `commerce_checkout_intents`, `commerce_purchases`, `commerce_entitlements`, `creator_customer_relationships`, `demand_requests`, `demand_signals`, preferences, activity history, and launch telemetry as the existing backbone. It does not create a parallel checkout or entitlement system.

New versioned entities add the missing product surfaces: `creator_follows`, `creator_content`, `creator_content_media`, `creator_customer_private_context`, `creator_customer_notes`, `creator_threads`, `creator_messages`, `creator_requests`, `creator_membership_tiers`, and `creator_memberships`.

## Route audit

Consumer-facing canonical direction:

- `/` — REWORKED: lightweight public entry.
- `/app` — NEW: consumer home.
- `/app/discover` — NEW: creator discovery.
- `/app/people/[slug]` — NEW: creator profile.
- `/app/messages` and `/app/messages/[slug]` — NEW: relationship messaging surface.
- `/app/me` — NEW: purchases, requests, membership readiness and account continuity.
- `/shop` and `/shop/[slug]` — PRESERVED for compatibility/offer detail, but no longer a primary global tab.
- `/make-it-happen` — PRESERVED as differentiated demand capability; hidden from primary consumer navigation.
- `/world/[slug]` — PRESERVED as existing World route; consumer profile is the simpler entry surface.
- `/experience` — PRESERVED for Mara Vera / Creator Zero.
- `/creator` — REWORKED into Creator OS.
- `/creators` — PRESERVED for creator acquisition.
- development labs — PRESERVED but must remain 404 outside development.

## Capability activation

New persistence-dependent surfaces are gated by server environment flags: follow, content, messaging, requests and memberships. A capability must remain off until its migration is applied and validated in the target environment. This avoids UI that claims functionality whose database contract is absent.

## Security model

Browser roles never own price, entitlement, sender identity or request payment state. Checkout validates active offers and price on the server. Messaging derives sender identity server-side. Request acceptance creates/reuses the existing commerce offer abstraction. Paid/private media remains server-mediated. Creator-private Debilidad and notes are creator-scoped under RLS and never customer-visible.

## Current release boundary

No new migration in this branch has been applied to canonical production. Real payment providers and creator payouts remain off. `signed_test` remains controlled proof-only. `main` and canonical production are unchanged by this work until explicit founder authorization.