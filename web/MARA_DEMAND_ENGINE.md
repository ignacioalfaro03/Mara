# Mara Demand Engine

Status: existing demand infrastructure is preserved. Product Realization changes how it is exposed, not its strategic importance.

## Existing model

Mara already has `demand_requests`, `demand_signals`, `demand_request_metrics` and the privacy-safe `creator_demand_opportunities` view. Signals distinguish WANT, PLEDGE and COMMIT and may carry willingness-to-pay where allowed. The creator opportunity view aggregates counts, WTP totals, verified demand GMV and progress without requiring raw private participant identity.

## Consumer language

The consumer should not see “Demand Engine”, propensity scoring or internal WTP terminology in primary navigation. Existing demand interactions are translated into simple language such as `Me interesa`, `Yo pagaría…`, and `Hay más personas interesadas`.

`/make-it-happen` remains a differentiated product surface but is no longer a primary global consumer tab in the mobile shell.

## Creator use

Creator OS surfaces the strongest opportunity as a business conclusion: what people want, how much verified interest exists, and whether it is worth converting to an offer. A creator can convert a selected demand request into a normal `commerce_offer`; the resulting transaction uses the same checkout and fulfillment backbone as any other offer.

## Privacy

Individual demand identity remains protected by existing RLS/private helper functions. Creator visibility of individual signals is limited by privacy mode. Aggregate opportunities are the preferred creator-facing object.

## Events/experiences

Demand may eventually become a lawful real-world experience or event, but events are downstream fulfillment, not the product center. Host/operator infrastructure remains deferred until core creator offer → purchase → CRM economics are proven.