# Payments hardening evidence â€” 2026-09-20

## Executed against linked Supabase
- Cumulative partial-refund rounding reconciles exactly on full refund.
- Refund and payout paths share creator/currency advisory locking.
- Payout transitions are service-role only.
- requested -> approved -> processing -> paid was executed inside a rollback transaction.
- failed/cancelled releases payout reserve.
- When recovery exists, cancellation absorbs recovery before returning the remainder to available balance.
- Reconciliation classifies matched, amount_mismatch, currency_mismatch, missing_internal, and missing_provider.

## Recovery cancellation proof
Test fixture: available 10,000 CLP, recovery 2,500 CLP, payout reservation 6,000 CLP.
After cancellation: creator_available = 7,500; creator_recovery = 0; creator_payout_reserved = 0.

## Security advisor
Intentional server-only tables remain RLS-enabled with no browser policies: commerce_disputes, commerce_financial_transactions, commerce_reconciliation_records, commerce_refunds.
Known warnings: complete_mara_creator_fulfillment remains authenticated-callable SECURITY DEFINER with internal ownership authorization; leaked-password protection remains disabled in project Auth configuration.

## Migration-history reconciliation â€” RESOLVED
Legacy migration filenames were renamed to the exact versions already recorded by the linked Supabase project. Payment-hardening versions 20260920203000 through 20260921012140 were repaired to applied only after their schema/functions had been exercised against the live database. The already-applied creator-interest and private-premium migrations were also recorded.

Verification: supabase migration list now shows Local = Remote for every migration, and supabase db push --dry-run reports Remote database is up to date.

A CI migration-history contract now rejects duplicate or malformed migration versions.

## Remaining launch blockers
1. Add repeatable database integration/pgTAP execution in CI/local stack.
2. Resolve provider eligibility and choose a real provider.
3. Implement provider webhook verification + normalized events.
4. Enable leaked-password protection when project/plan configuration permits.
