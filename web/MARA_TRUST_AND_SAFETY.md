# Mara Trust and Safety

Status: foundational controls exist; full internal moderation product is not yet implemented.

## Existing protection retained

The product keeps the 18+ age gate, authentication, creator-scoped RLS, private premium storage delivery, release-safety contracts, proof-only payment provider boundary, and non-production lab blocking. Product Realization does not weaken any of them.

## Request safety

Consumer creator requests pass through a server-side request policy before persistence. The current product does not intentionally support unlawful sexual services, coercion, trafficking, or unsafe encounter facilitation. Real-world experience architecture must receive stronger verification/location/refund/incident controls before activation.

## Messaging safety

Messages are participant-scoped under RLS. Sender identity is derived server-side. The current API has a basic rate guard. Fake typing or synthetic creator messages are not generated to simulate activity.

## Privacy

Creator-private legal identity is not exposed by the consumer creator profile model. Public identity comes from the creator World/persona. Creator CRM Debilidad and notes are creator-private. Demand continues to respect existing individual privacy modes and aggregate creator opportunities.

## Paid media

Private/paid storage objects are not exposed through unrestricted permanent public URLs. Existing delivery checks a persisted entitlement before fetching private storage server-side.

## Admin gap

A dedicated Operations/Admin interface for reports, blocks, disputes, content removal, creator suspension, transaction review and moderation audit is still a gap. These capabilities must not be represented as complete until their persistence, permissions and audit log exist.

## Release rule

No incomplete trust capability is activated merely to make a demo look finished. New persistence-dependent features remain behind environment flags until schema and access boundaries are validated in the target environment.