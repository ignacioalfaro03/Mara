# Payments hardening implementation plan

## Existing system preserved
- `commerce_checkout_intents` already owns checkout idempotency.
- `commerce_purchases` is the canonical purchase/payment truth; do not create a second purchase ledger.
- `commerce_webhook_events` already deduplicates provider events.
- `fulfill_mara_commerce_checkout` is service-role-only and atomically grants purchase truth/entitlement/contribution.
- Creator scope is projected onto purchases from the canonical offer.
- Runtime is intentionally `disabled | signed_test`; production payment activation remains fail-closed until provider eligibility is documented.

## Gap closed by this branch
Add a financial subledger beside purchase truth, not a replacement for it: immutable balanced journal entries, creator economics policy snapshots, creator payable states, refunds/disputes adjustments, payout batches/items, reconciliation records, and creator/admin read models. All mutation remains service-role-only.

## External launch gate
No live provider or payout rail is activated here. Actual provider eligibility for Mara's enabled product/content categories, Chile, marketplace payouts, KYC/tax/refund obligations remains `LEGAL/PROVIDER VALIDATION REQUIRED`.
