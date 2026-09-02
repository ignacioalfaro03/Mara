# Mara Vera — Relationship Engine (Post-Validation Architecture)

## Status

Future architecture only. Do not fully implement before commercial validation.

## Purpose

Create continuity so a returning user interacts with the same coherent Mara Vera, while storing only useful, permitted and consented information.

## Candidate lifecycle states

- visitor
- curious
- subscriber
- first_spender
- repeat_spender
- fan
- high_value
- dormant
- reactivated

Lifecycle state may influence tone, timing, recommendations, offer relevance and continuity. It must not be used to intensify pressure on financially or emotionally vulnerable users.

## Explicit preference memory

Potential fields:
- preferred tone;
- explicit interests;
- preferred content themes;
- purchased experiences;
- expressed boundaries;
- consented intensity preferences;
- useful prior interaction markers.

## Data separation

Keep separate stores/controls for:
- relationship preferences;
- raw transcripts;
- identity/account data;
- payment/provider data;
- sensitive data.

Default toward not storing sensitive data.

## Core interfaces

Future services should be replaceable behind abstractions:
- `IdentityProvider`
- `PaymentProvider`
- `MemoryStore`
- `AnalyticsSink`
- `ContentCatalog`
- `RelationshipStateService`
- `ConsentService`

## Guardrails

- explicit consent for persistent personalization;
- inspect/edit/delete preferences where applicable;
- no hidden vulnerability scoring;
- no debt/financial-distress targeting;
- no unbounded transcript retention by default;
- auditability of consent-dependent behavior.

## Build trigger

Invest materially only after the launch funnel demonstrates paying demand and meaningful repeat spend. The Relationship Engine is intended to strengthen retention and defensibility after validation, not manufacture product-market fit before it exists.
