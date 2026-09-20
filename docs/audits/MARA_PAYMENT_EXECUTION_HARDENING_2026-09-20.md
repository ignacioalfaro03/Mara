# Payment Execution Hardening — 2026-09-20

## Implemented
- Canonical creator purchase -> deterministic sale journal posting.
- Explicit creator/global economics policy lookup; creator sales fail closed if no effective policy exists.
- Policy snapshot frozen on each sale transaction.
- Gross allocation to platform revenue, creator pending and optional held reserve.
- Idempotent pending -> available release batch with `FOR UPDATE SKIP LOCKED`.
- Payout request serialization per creator/currency with immediate available -> payout-reserved journal movement.
- Recovery-aware payout ceiling.
- Audited partial/full refund RPC with cumulative captured-amount ceiling and idempotent provider refund IDs.
- Legacy full-refund RPC routed through the audited refund path.
- Refund-before-release protection and append-only creator recovery representation after release.
- Creator finance summary extended with recovery balance.
- Service-role-only Mara finance control tower view.

## Preserved
`commerce_checkout_intents`, `commerce_purchases`, `commerce_webhook_events`, entitlements and existing fulfillment remain canonical. No second purchase system was introduced.

## Deliberately not fabricated
- live provider adapter;
- real processor fees/tax postings;
- KYC approval;
- payout rail execution;
- dispute provider lifecycle;
- provider reconciliation ingestion;
- production/staging migration application.

## Next P0
Run these migrations against an isolated/local Postgres/Supabase test database and add pgTAP integration tests for concurrency and journal arithmetic before any staging application. Then select/validate a live provider from official eligibility terms.
