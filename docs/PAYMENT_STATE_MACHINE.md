# Payment State Machine

Checkout: `pending -> completed | provider_failed | expired | canceled`.
Purchase truth: `succeeded -> refunded` in the existing kernel. The hardening layer adds explicit refund/dispute records rather than overloading checkout state.

Only verified server/provider evidence can complete payment. Client assertions such as `paid=true`, amount or currency are never authoritative.

Webhook processing must be signature-verified and deduplicated by `(provider, provider_event_id)`. Provider payment identifiers are unique in purchase truth.
