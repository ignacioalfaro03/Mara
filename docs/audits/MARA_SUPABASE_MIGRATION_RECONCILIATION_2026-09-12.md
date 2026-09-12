# MARA — Supabase Migration Reconciliation Audit

Date: 2026-09-12  
Execution line: `execution/mara-db-reconciliation-payment-readiness-v1`  
Parent: `strategy/mara-revenue-os-foundation-v1` / PR #67  
Connected project reviewed read-only: `Mara_vera` (`hctykprkwenhatbjxkpb`)

## Executive verdict

**The new Mara Revenue OS schema is materially present in the connected database, but migration history is not authoritative enough to permit `supabase db push`.**

This is a control-plane problem, not a reason to rebuild the product.

Current posture:

- product realization tables are present remotely;
- messaging / requests / memberships are present remotely;
- auction tables are present remotely;
- creator-interest intake is present remotely;
- the private premium storage bucket is **not** present remotely;
- `supabase_migrations.schema_migrations` contains 20 rows and stops at 2026-09-08;
- multiple repository migration filenames use timestamps different from the versions recorded remotely;
- several schema changes that are visibly materialized have no corresponding remote migration-history row;
- production migration-history repair is **not authorized** by this execution line.

Therefore:

> **DO NOT RUN `supabase db push` OR BLIND `migration repair` AGAINST THE CONNECTED PROJECT.**

## Read-only evidence captured

### Remote migration history

The connected database reports 20 migrations, ending with:

- `20260908153434_mara_creator_manual_fulfillment_contract`
- `20260908155015_mara_demand_metrics_delete_cascade_guard`

No 2026-09-10 or 2026-09-12 migration-history rows are registered.

### Materialized schema newer than migration history

The live schema nevertheless contains, among others:

- `creator_follows`
- `creator_content`
- `creator_content_media`
- `creator_customer_private_context`
- `creator_customer_notes`
- `creator_threads`
- `creator_messages`
- `creator_requests`
- `creator_membership_tiers`
- `creator_memberships`
- `creator_auctions`
- `creator_auction_bids`

Relevant RLS policies are also present, including participant/owner policies on Product Realization tables and browser-deny policies on auctions.

This proves that at least part of the newer schema was materialized outside the canonical migration-history sequence.

### Creator-interest migration

`public.creator_interest` exists with the expected bounded intake columns:

`id, email, exposure_level, product_interests, audience_size, current_creator_status, source, status, consented_at, created_at, updated_at`

Its browser-deny boundary is also present, but there is no matching migration-history row.

### Premium storage migration

Repository migration:

`20260908020500_private_premium_storage.sql`

Expected bucket:

`mara-premium`

Read-only check result:

**bucket absent**.

This migration must remain classified as **not applied**. It must not be falsely marked as applied during history reconciliation.

## Repository ↔ remote classification

The machine-readable source of truth for this audit is:

`web/supabase/migration-reconciliation.snapshot.json`

Each repository migration is explicitly classified as one of:

- `remote_history_exact`
- `remote_history_alias`
- `schema_present_history_missing`
- `not_applied`

The snapshot intentionally does not claim that production mutation is authorized.

## New CI control

Added:

`web/scripts/supabase-migration-drift-contract.mjs`

and npm command:

`npm run supabase-migration-drift:contract`

Web Launch CI now executes the contract before payment-readiness checks.

The contract protects against:

- repository migrations silently appearing without a reconciliation classification;
- remote-history rows in the snapshot losing their repository mapping;
- duplicate remote versions;
- schema-present/history-missing entries being accidentally represented as normal applied migrations;
- the snapshot implying founder authorization for production mutation.

The contract is a **drift guard**, not a fake readiness pass. It explicitly reports whether `db push` is safe.

## Controlled repair sequence — NOT EXECUTED

A future authorized repair should follow this order:

1. freeze the exact repository SHA and remote history snapshot;
2. use Supabase CLI `migration list` against the linked project;
3. normalize legacy repository filenames to the already-recorded remote migration versions where content equivalence is proven;
4. prove the SQL/schema equivalence of every `schema_present_history_missing` migration;
5. keep genuinely unapplied migrations, especially `mara-premium`, unapplied;
6. only then use `supabase migration repair --status applied <version>` for schema changes that are demonstrably already materialized;
7. run migration list again and require local/remote agreement;
8. run database advisors and the full application CI/E2E suite;
9. only after a non-production migration rehearsal should payment-ledger and paid-session drafts be promoted into versioned migrations.

No step above authorizes production money, payouts, production provider activation, RLS weakening, destructive migration, or merge.

## Business implication

The Revenue OS implementation is materially further ahead than the migration history suggests. The correct next move is not more feature accumulation. It is to convert the existing working product into a controlled financial release path:

`MIGRATION CONTROL → NON-PROD DB REHEARSAL → REAL MERCADO PAGO SANDBOX → WEBHOOK ACCEPTANCE → LEDGER MATERIALIZATION → RECONCILIATION → REFUND/CHARGEBACK OPS → PAYMENT GO/NO-GO`

Until that chain is proven, the product remains:

**COMMERCE READY IN SIGNED-TEST / NOT PAYMENT READY FOR REAL MONEY.**
