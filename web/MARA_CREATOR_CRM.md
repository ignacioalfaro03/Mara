# Mara Creator CRM

Status: existing customer-summary/NBA spine reused and extended with versioned creator-private context and notes.

## Existing intelligence reused

`creator_customer_relationships` is the relationship spine. `creator_customer_summary` derives creator-scoped purchase count, GMV, first/last purchase, fulfillment and lifecycle stage. `creator_next_best_actions` produces deterministic action/reason/priority/evidence from observable behavior. Demand and declared preferences remain separate data sources.

## Customer page

`/creator/customers/[userId]` reads only data that belongs to the authenticated creator relationship. It shows spend, purchases, relationship timing, visible preferences, permissible demand context and current recommended action.

## Debilidad

Product Realization adds `creator_customer_private_context.weakness_note` as the founder-defined creator-private Debilidad field. It is creator-authored, never public and never exposed to the customer. This is deliberately different from a user's own `user_declared_preferences` weakness value, which remains user-controlled and may only be creator-visible when the user chose that scope/visibility.

## Notes

`creator_customer_notes` provides a creator-private chronological note stream. Writes require the authenticated creator to own the creator id and to have an existing relationship with the customer. Notes are not shared across creators.

## Relationship creation

New real interactions feed the CRM. Starting a creator thread, sending a message and submitting a request touch the creator/customer relationship. Purchases already feed the relationship through existing database automation.

## Commercial metrics

The current deterministic layer already supports purchase count, creator GMV, last purchase, fulfillment and lifecycle. AOV is derivable in UI from purchase count/GMV. Future 30d/90d revenue and richer engagement metrics should be added only after enough real events exist.

## Guardrails

Mara does not label customers with degrading or vulnerability-seeking terms. Recommendations are evidence-based and must not use sensitive personal characteristics or creator notes as permission for coercive selling.