# Mara Payments Architecture

## Source of truth
`commerce_purchases` remains canonical payment/purchase truth. The financial journal is a subledger for allocation, liabilities and reconciliation; it must never create a purchase by itself.

## Flow
`offer -> checkout_intent -> provider -> verified webhook -> fulfill_mara_commerce_checkout -> purchase/entitlement -> financial transaction -> creator liability -> payout eligibility -> payout -> reconciliation`.

Production remains fail-closed: repository runtime supports only `disabled` and isolated `signed_test`. A live provider requires written eligibility for the actual Mara business model, enabled content/product families, Chile and marketplace payouts.

## Trust boundaries
Browser clients may read only their allowed commercial/creator projections. They cannot create payment truth, journal entries, refunds, disputes, reconciliation records or payout state. Those mutations are service-role operations.

## Money
All amounts are integer minor units plus ISO-style three-letter currency. No floating-point money.
