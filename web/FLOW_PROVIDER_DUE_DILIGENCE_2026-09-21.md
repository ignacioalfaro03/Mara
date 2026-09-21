# Flow provider due diligence — 2026-09-21

## Current decision
Flow is the leading Chile-first provider candidate for Mara's next sandbox adapter, but it is **not production-approved inside Mara yet**.

## Official evidence reviewed
- Flow API exposes payments, refunds, settlements and associated merchants.
- Flow provides a dedicated sandbox and recommends testing there first.
- Every API request parameter set is signed with HMAC-SHA256 over alphabetically ordered key/value concatenation.
- Payment confirmation is asynchronous: Flow POSTs a token to the merchant confirmation URL; the merchant must call payment/getStatus to obtain authoritative payment state.
- Flow's current general terms explicitly discuss adult-content subscriptions/streaming while excluding illegal sexual content and other prohibited categories. Restricted/high-risk activities require pre-approval through Flow compliance.
- Flow can suspend services or retain funds when required for compliance.
- Chargebacks may be deducted from future transfers.

## Mara boundary
No production credential, charge or payout is authorized by this document.

Before production:
1. Send Flow compliance Mara's exact URL and business description.
2. Obtain explicit written approval for the actual creator/content categories Mara will permit.
3. Confirm whether associated merchants can represent individual creators under Mara's marketplace model and how settlement/KYC works.
4. Obtain sandbox credentials and execute end-to-end checkout -> callback token -> signed getStatus -> Mara webhook inbox -> purchase -> ledger -> entitlement.
5. Confirm refund, chargeback, reserve, settlement and merchant-offboarding behavior.
6. Keep prohibited content enforced independently of provider acceptance.

## Adapter contract now in repository
`lib/commerce/providers/flow.ts` implements the provider boundary only:
- sandbox/production base URLs;
- official parameter signing algorithm;
- payment/create parameter construction;
- payment/getStatus signed lookup;
- normalized authoritative payment state.

It is deliberately not wired into production checkout configuration yet. This prevents an unapproved provider from becoming live merely because credentials appear in an environment.

