# Mara Release Readiness — Product Realization

Branch: `codex/full-product-realization-v1`
PR: #66
Status: DRAFT / NOT AUTHORIZED FOR MERGE OR PRODUCTION.

## Already proven on the branch

The initial PR build reached canonical asset integrity, dependency audit, release safety, real-app wiring, typecheck and production build successfully. Its first failure was an obsolete legacy smoke profile, not a compiler or product-build failure. A dedicated Product Realization smoke profile has since been added.

The branch includes a mobile-first consumer shell, real creator discovery from published Worlds, creator profile, follow/content/message/request/CRM persistence contracts, Creator OS operations, contextual commerce integration and truthful disabled states.

## Database activation boundary

The Product Realization migrations are repository-versioned only. They have NOT been applied to canonical Supabase production. Consequently `MARA_FOLLOW_SYSTEM_ENABLED`, `MARA_CONTENT_SYSTEM_ENABLED`, `MARA_MESSAGING_SYSTEM_ENABLED`, `MARA_REQUESTS_SYSTEM_ENABLED` and `MARA_MEMBERSHIPS_SYSTEM_ENABLED` must stay false on environments whose schema has not received and passed those migrations.

No paid/private content or creator-private CRM feature should be exposed before RLS and storage behavior are validated in the target environment.

## Payment boundary

Real payments remain OFF. Creator-scoped checkout preserves its live-payment authorization guard. `signed_test` remains proof-only. Creator payouts are not active.

## Required gates before Ready for Review

- Web Launch CI green on the final exact SHA.
- Product Realization security contract green.
- Responsive smoke green at 375×667, 390×844, 430×932, 768×1024 and 1440×900.
- Safe Vercel Preview READY on the exact SHA.
- Visual artifact review of consumer home, discover, messages and Tú on mobile and desktop.
- No new production migration, domain cutover, live payment provider or payout activation.

## Required gates before database activation

Use a non-production Supabase target first when authorized. Apply migrations in order, run RLS/security checks, verify cross-creator isolation, verify server-owned messaging/request writes, verify paid-content entitlement behavior, then enable capabilities only on that validated environment.

## Founder control

Do not merge to `main` until the founder explicitly writes exactly `mergea` in lowercase for this PR. Do not infer merge authorization from previous PRs or from requests to continue development.