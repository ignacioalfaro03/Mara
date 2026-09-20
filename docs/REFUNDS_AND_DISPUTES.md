# Refunds and Disputes

Refunds are append-only economic reversals. `record_mara_commerce_refund` validates currency and cumulative refund ceiling before recording a provider refund. The legacy full-refund RPC now routes through the same audited path.

A refund reverses the proportional platform share and records the creator share as `creator_recovery`. This deliberately preserves the fact that Mara may need to recover creator funds after availability/payout rather than rewriting historical sale entries. Operational netting/collection policy remains a launch decision.

Dispute records exist but provider-specific hold/win/loss posting remains blocked on selecting an eligible live provider and mapping its authoritative dispute lifecycle.
