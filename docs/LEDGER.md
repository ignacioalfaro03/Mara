# Financial Ledger

Mara uses balanced journal transactions. Each economic event has one unique `event_key`; retries must resolve to the same event rather than post twice.

Accounts: processor clearing, platform revenue, creator pending/available/held/paid, refunds, chargebacks, processor fees and tax payable. Creator balances are projections from entries, not mutable counters.

Launch-critical invariants:
- total debits equal total credits for every posted transaction;
- one provider event produces at most one economic effect;
- creator available cannot be created from an unconfirmed purchase;
- refunds never exceed captured money;
- payout requests never exceed creator available balance;
- payout idempotency keys are unique;
- browser roles have no journal mutation privileges.
