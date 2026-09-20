# Reconciliation

Reconciliation compares provider objects to Mara truth for payments, refunds and payouts. Records classify `matched`, `mismatch`, `missing_internal`, `missing_provider` and `requires_review`.

No provider feed is fabricated. Once a live provider is approved, ingestion must use provider-authoritative IDs, amount/currency and status, then compare against purchase/refund/payout truth. Exceptions belong in the finance control tower and must not silently mutate the ledger.
