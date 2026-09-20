# Creator Payouts

States: `requested -> approved -> processing -> paid`, with `failed`, `cancelled` and `reversed` terminal/exception paths.

A payout row is accounting/operational intent; it does not mean funds moved. Real provider execution remains disabled until provider/KYC/tax eligibility is validated. `request_mara_creator_payout` is service-role-only, idempotent and rejects requests above ledger-derived available balance.

Before live payout activation: validate creator identity/KYC requirements, Chile tax/accounting treatment, payout destination change controls, reserve/hold policy, provider callbacks, reconciliation and operational incident procedures.
