# Financial Invariants

These are launch-critical, not dashboard metrics.

1. **Balanced journal:** each posted transaction has non-zero debits and `SUM(debit)=SUM(credit)`.
2. **Webhook exactly-once effect:** `(provider, provider_event_id)` is unique.
3. **Payment exactly-once truth:** `(provider, provider_payment_id)` is unique in purchases.
4. **Checkout idempotency:** `(user_id, client_request_id)` is unique.
5. **Refund ceiling:** cumulative successful refunds must never exceed captured purchase amount. The live refund RPC must enforce this before partial refunds are activated.
6. **Payout ceiling:** requested payout cannot exceed ledger-derived `creator_available`.
7. **Payout idempotency:** `idempotency_key` is unique and provider payout IDs are unique when present.
8. **No browser money mutation:** anon/authenticated have no INSERT/UPDATE/DELETE grants on financial truth tables.
9. **Entitlement separation:** access derives from confirmed purchase truth; a journal entry alone never grants access.
10. **Production fail-closed:** signed-test cannot become a general production provider.

## Remaining before real money
Partial-refund posting, dispute webhook adapters, provider fee truth, pending->available release worker, actual payout adapter and provider reconciliation ingestion are intentionally not fabricated before provider selection/eligibility.

11. Creator sale posting requires an explicit effective economics policy and freezes its terms.
12. Pending release uses deterministic event keys and SKIP LOCKED so retries cannot release a sale twice.
13. Payout requests acquire a creator/currency transaction lock and reserve available funds immediately.
14. Refunds are append-only reversals and cumulative successful refunds cannot exceed captured amount.
