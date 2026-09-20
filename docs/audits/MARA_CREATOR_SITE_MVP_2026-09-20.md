# MARA — CREATOR SITE LAUNCHABLE MVP AUDIT

Date: 2026-09-20
Parent authority: `MARA_FOUNDER_CONSTITUTION_V3.md`

## Initial diagnosis

The repository already had real creator, demand, commerce, fulfillment, RLS and history primitives. The largest launch gap was not another engine; it was the missing usable creator-owned surface and operating flow.

Before this pass:
- `/<creator>` existed conceptually but Creator Site management was minimal;
- creator storage still exposed World semantics in important paths;
- new sites were created active instead of draft-first;
- no canonical edit/preview/publish/share loop existed;
- handle reservation was not enforced by the canonical creation API;
- creator-specific branding/modules were not operational;
- demand-to-offer existed but commercial context was weak;
- launch CI did not have a Creator Site contract;
- production telemetry schema has a legacy closed database event allowlist that can reject newer product events.

## Implemented

- draft-first Creator Site creation;
- one primary Creator Site for new canonical onboarding;
- reserved-handle protection;
- server-side ownership checks for site editing;
- edit → preview → publish/unpublish → share flow;
- basic identity/branding: name, handle, bio, avatar, cover, accent, social links and primary CTA;
- configurable demand/offers/memory modules;
- canonical public Creator Site renderer separated from legacy `/world/<slug>` redirect;
- creator-specific canonical metadata, OpenGraph/Twitter metadata and structured data;
- mobile-first Home hardening;
- Creator OS site status/actions;
- WTP/demand context prefilled into demand → offer workflow;
- Creator Site telemetry events and copy-link instrumentation;
- fail-fast production smoke runner;
- Creator Site CI contract;
- legacy copy cleanup in history/QA comments.

## Reused

No new parallel commerce or demand architecture was created.

Reused:
- `creator_worlds` as compatibility storage;
- existing creator ownership RLS;
- demand requests/signals/aggregates;
- commerce offers/purchases;
- fulfillment RPC;
- account/history primitives;
- existing server-side telemetry endpoint.

## Legacy isolation

`creator_worlds`, `world_id`, and similar identifiers remain internal compatibility debt.

Public product language is Creator Site.

`/world/[slug]` is now a legacy redirect to `/<creator>`.

The legacy Mara Vera experiences remain isolated prototype/regression evidence and are not part of current acquisition/product positioning.

## PR #86

The useful parts of PR #86 were reimplemented against V3:
- mobile first-contact tightening;
- fail-fast smoke suite.

Its old CTA assumptions are obsolete under Creator Sites. Do not merge #86 into V3.

## Prepared but NOT applied

Two SQL files under `web/supabase/prepared/` are intentionally not migrations:

1. `20260920_creator_site_launch_hardening.sql`
   - reserved handles at DB layer;
   - Creator Site telemetry event persistence compatibility;
   - future coarse source attribution extension.

2. `20260920_creator_interest_v2.sql`
   - bounded business-fit fields for creator pilot selection.

These require explicit founder authorization and pre-apply review before production execution.

## Validation

- `git diff --check`: PASS
- Founder Thesis Contract: PASS
- Real App Wiring Contract: PASS
- Release Safety Contract: PASS
- Creator Site Contract: PASS
- TypeScript: PASS
- Next production build: PASS
- full Playwright/local production smoke suite: PASS

## Remaining real blockers

1. Production DB hardening/telemetry migration is prepared but not applied.
2. Creator Intake V2 persistence is prepared but not applied.
3. Real creator pilot supply is still unvalidated.
4. Real payment/payout provider compatibility remains an external gate.
5. Real creator media upload/storage UX is not implemented; MVP currently accepts safe external media URLs.
6. Real creator-specific traffic, demand conversion, fulfillment and repeat behavior still need live pilot evidence.

## Next bottleneck

The next bottleneck is no longer defining Mara or constructing another subsystem.

It is:

`REAL CREATOR → PUBLISH SITE → SHARE URL → REAL AUDIENCE → DEMAND/ACTION → OFFER → FULFILLMENT → RETURN`

Do not expand product scope before obtaining that evidence.
