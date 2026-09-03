# Mara Vera — Payment Readiness Architecture

## Status

Pre-activation architecture for Mara Vera's first real commercial transaction.

This document does **not** authorize a payment provider, merchant application, company formation, production checkout, deployment, real charge, subscription or recurring expense.

The goal is to make the first authorized payment experiment operationally boring: known product, known price hypothesis, known unit economics, known compliance package and a processor that has explicitly accepted the actual business model.

## Core principle

> **Do not choose the processor first. Choose the product + jurisdiction + entity + content scope first, then obtain explicit processor acceptance.**

Adult/AI payment support is not interchangeable with generic ecommerce support.

## Current 2026 provider reality

### Stripe — NOT a candidate for Mara's intended adult scope

Stripe's current restricted-business policy explicitly prohibits adult content/services including pornography, pay-per-view, adult live chat and mature-audience content designed for sexual gratification. It also explicitly includes AI-generated content that meets those criteria.

Therefore:
- do not build Mara's adult commercial architecture around Stripe;
- do not attempt to disguise the business category;
- do not create a non-adult account and later switch scope;
- a future separate mainstream/non-adult product would require its own independent assessment.

Official source reviewed 2026-09-02:
- https://stripe.com/legal/restricted-businesses

### CCBill — adult-capable, but Chile entity fit is currently a blocker/unknown

CCBill publicly supports adult business models and high-risk processing.

However, its published Visa/Mastercard merchant-processing documentation currently requires business/legal presence in designated regions. The published country list includes the US, Canada and participating European jurisdictions and does **not** list Chile.

Implication:
- CCBill is a legitimate adult-industry benchmark;
- do not assume a Chile-incorporated Mara entity can onboard directly;
- do not create a foreign entity solely to fit CCBill without separate legal/tax/business analysis;
- obtain written eligibility confirmation before treating CCBill as actionable.

Official sources reviewed 2026-09-02:
- https://ccbill.com/industries/adult-business
- https://ccbill.com/doc/visa-and-mastercard-payment-processing-faqs
- https://ccbill.com/merchants

### Segpay — priority due-diligence candidate

Segpay publicly positions itself as a global payment facilitator for adult/high-risk merchants and subscription/content providers.

Its published onboarding process includes:
- merchant contract;
- KYC package;
- website review;
- payment disclosures;
- terms and conditions;
- privacy policy;
- age verification;
- customer service links;
- bank approval;
- integration/kickoff before go-live.

Segpay's merchant application also asks for country of incorporation, but public material reviewed here does not prove that a Chile-incorporated Mara entity will be accepted for this exact AI-adult model.

Implication:
- treat Segpay as a serious candidate;
- obtain explicit written confirmation covering Chile/entity eligibility, AI-generated adult content, interactive experiences, one-time PPV, custom experiences and future subscriptions;
- no integration work before that commercial/compliance confirmation.

Official sources reviewed 2026-09-02:
- https://segpay.com/verticals/high-risk/
- https://segpay.com/solutions/merchant-services/
- https://segpay.com/contact-us/

### Centrobill — secondary priority due-diligence candidate

Centrobill publicly markets adult/high-risk payment processing, global acquiring and LATAM coverage.

Public material describes:
- adult entertainment support;
- LATAM/global acceptance positioning;
- subscription management;
- one-click payments;
- fraud/chargeback tooling;
- multi-currency;
- acquiring relationships.

This is useful evidence of category fit but **not approval for Mara**.

Implication:
- request a merchant eligibility review for a Chile-based AI adult entertainment business;
- verify acquiring entity, settlement country/currency, reserves, adult MCC/card-brand registrations, AI content rules, custom/interactive content support and actual fee schedule;
- do not rely on marketing-page fee claims as Mara's contracted economics.

Official sources reviewed 2026-09-02:
- https://2026.centrobill.com/high-risk-payment-processing/adult-entertainment/
- https://2026.centrobill.com/high-risk-payment-processing/

## Provider shortlist state

| Provider | Adult category | AI adult explicitly verified | Chile entity verified | Current Mara status |
|---|---|---|---|---|
| Stripe | No | Explicitly prohibited when adult | N/A | EXCLUDE for adult scope |
| CCBill | Yes | Needs written confirmation for Mara model | Published direct list does not include Chile | HOLD / structural fit issue |
| Segpay | Yes | Needs written confirmation | Needs written confirmation | DUE DILIGENCE #1 |
| Centrobill | Yes | Needs written confirmation | LATAM marketed; specific Chile merchant eligibility unverified | DUE DILIGENCE #2 |

No row above equals provider approval.

## First provider outreach package

Do not approach a processor with “we are building an AI girlfriend”.

Provide an accurate merchant package:

### Company / operator
- legal entity or intended operating entity;
- country of incorporation;
- business bank country;
- beneficial owners/KYC readiness;
- target settlement currencies.

### Product description

Use clear language such as:

> Mara Vera is a clearly disclosed synthetic adult entertainment character delivered through a first-party web product. Adults can purchase transparently scoped digital experiences such as contextual story continuations, original synthetic voice/media and bounded personalized experiences. No real-person impersonation, minors, non-consensual content, prostitution/escort services or hidden charges are permitted.

Do not sanitize away the adult nature of the business.

### Commercial model to ask about explicitly
- one-time digital unlocks / PPV;
- original AI-generated adult text/image/audio/video;
- interactive adult chat/experience;
- personalized/custom synthetic content;
- voice experiences;
- bundles;
- recurring membership — future, not launch assumption;
- stored-card / one-click follow-up purchases;
- refunds;
- cross-border customer acceptance.

### Compliance package
- 18+ positioning;
- launch-market age-assurance method;
- AI disclosure;
- terms;
- privacy;
- refund policy;
- cancellation rules if recurring billing is later added;
- contact/customer-support path;
- abuse/reporting path;
- content prohibited list;
- custom-content rejection rules;
- rights statement for Mara visual/voice assets;
- data retention/deletion policy;
- charge descriptor proposal.

## Questions that require written provider answers

Before provider activation obtain answers to:

1. Do you accept a merchant incorporated in the intended Mara jurisdiction?
2. Do you accept AI-generated adult content designed for sexual entertainment?
3. Do you accept interactive adult relationship/chat experiences?
4. Are one-time PPV digital experiences accepted?
5. Is original synthetic voice/video accepted?
6. Is bounded personalized/custom adult AI content accepted?
7. Are subscriptions accepted if introduced later?
8. What age-verification/age-assurance controls are required by market?
9. What content categories are specifically prohibited beyond Mara's own red lines?
10. What Visa/Mastercard high-risk registration requirements/fees apply?
11. What reserves/holdbacks apply?
12. What transaction, decline, refund and chargeback fees apply?
13. What rolling-reserve duration/release terms apply?
14. What merchant descriptor appears to customers?
15. What refund/cancellation requirements apply?
16. What countries can Mara sell into?
17. What countries cannot Mara sell into?
18. Is stored-card/one-click repeat purchase available?
19. Can successful checkout return to Mara's exact experience state?
20. What events/webhooks are available for entitlement, refund, chargeback and subscription state?

## First-payment product gate

Do not activate payments until one product is frozen.

Candidate currently under test:

### Contextual Continuation

Current P0 fixture:
- source: `gym_late_voice_01`;
- offer: `gym_continue_01`;
- one-time purchase;
- exact-state continuation;
- optional reward/payoff layer depending validated treatment;
- ownership/history layer only if validated;
- no recurring billing.

The final first paid SKU must define:
- exact scope;
- modality;
- length/duration;
- personalization depth;
- ownership/access terms;
- fulfillment timing;
- revision/refund rules;
- price;
- provider eligibility;
- contribution-margin floor.

## Voice dependency

Voice is strategically attractive but must not silently block first revenue.

Decision gate:
- if canonical commercial Mara voice is ready, commercially licensed and economical → include/test voice;
- if not → first paid SKU can remain a compiled text/mixed continuation while voice remains a separate premium-intent test;
- do not publish low-quality browser TTS as paid Mara voice.

## Payment architecture contract

Future real flow:

**Mara experience → contextual offer → transparent price/scope → processor-hosted or approved checkout → verified success webhook/return → entitlement write → exact-state resume → Mara payoff → continuation → Commercial Memory**.

Failure/cancel flow:

**checkout cancelled/declined → no entitlement → no relational penalty → exact safe return → user can continue baseline Mara experience**.

Payment result can change commercial entitlement.
It cannot change relationship affection/tone.

## Unit-economics gate

Before selecting a launch price calculate:

**Contribution Margin = net collected revenue − processor variable fees − generation cost − human QC/review − support/refund cost − delivery/storage variable cost − expected fraud/chargeback cost**.

Also model separately:
- processor setup/card-brand registration fees;
- rolling reserve / cash-flow lockup;
- payout delay;
- fixed recurring costs;
- tax/VAT/GST obligations where applicable.

A price that converts but cannot support healthy contribution margin is not a winner.

Early target should be evaluated as a range rather than a fake precise threshold. P0 may use a **65% contribution-margin design target** for capacity planning, then revise using actual processor quotes and real fulfillment costs.

## Cash-flow risk is not the same as margin

High-risk processing may create:
- rolling reserves;
- delayed settlement;
- card-brand registration fees;
- higher refunds/chargebacks;
- processor-specific account reserves.

Therefore track:
- gross margin;
- contribution margin;
- cash available after reserve;
- reserve balance;
- payout delay;
- chargeback exposure.

Do not scale paid acquisition against gross revenue while cash is trapped in reserves.

## First real-payment acceptance gate

All must be true:

- A/B/C commercial treatment selected from evidence;
- WTP candidate price selected from evidence;
- first paid SKU scope frozen;
- canonical fulfillment workflow works;
- processor explicitly accepts entity + adult AI model + product types;
- launch jurisdictions defined;
- age-assurance approach approved;
- legal/privacy/refund/support copy complete;
- payment descriptor known;
- unit economics modeled with actual contracted provider fees;
- refund/chargeback handling tested;
- checkout cancel/decline has no relational penalty;
- successful checkout can resume experience state;
- founder separately authorizes provider activation;
- founder separately authorizes real payments;
- founder separately authorizes deployment/production.

## Non-goals now

Do not:
- submit merchant applications yet unless separately authorized;
- form an overseas company simply to access a processor;
- implement processor SDKs;
- store cards ourselves;
- activate recurring billing;
- activate crypto as a policy workaround;
- route adult charges through a processor that has not accepted the category;
- hide Mara's adult or AI nature during underwriting.

## Decision principle

> **The winning processor is the one that explicitly accepts the real Mara business, works with the real operating entity, preserves Momentum Commerce, and leaves healthy economics after fees/reserves — not the processor with the easiest API.**
