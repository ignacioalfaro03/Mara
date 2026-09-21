# Payments hardening evidence — 2026-09-20

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

## Migration-history drift — P0 operational issue
The linked migration history currently ends at 20260908155015_mara_demand_metrics_delete_cascade_guard. The live database contains later payment schema/functions applied through direct SQL during hardening. Live schema and supabase_migrations.schema_migrations are therefore not yet canonical with the repository.

Do not run a blind db push or mark migrations applied solely by filename. Reconcile each post-20260908 migration against live definitions first, then use the supported migration-history repair workflow only for migrations proven equivalent.

## Remaining launch blockers
1. Reconcile migration history safely.
2. Add repeatable database integration/pgTAP execution in CI/local stack.
3. Resolve provider eligibility and choose a real provider.
4. Implement provider webhook verification + normalized events.
5. Enable leaked-password protection when project/plan configuration permits.

