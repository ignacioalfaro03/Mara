# Mara Vera — Payment Provider Market Map

Status: market/due-diligence map. No provider below is approved, contracted or integrated.

## Decision principle

Mara must not choose a processor only because it says "adult friendly" or "global".

A launch processor must pass **all** of these gates in writing:

1. merchant legal-entity / domicile eligibility;
2. exact adult/sensual AI product acceptance;
3. card/acquirer acceptance for the intended content model;
4. one-time digital unlock support;
5. contribution/variable-amount payment support if Capricho ships through that rail;
6. age/content compliance requirements that Mara can actually satisfy;
7. API or hosted-checkout fit;
8. signed/replay-safe webhook contract;
9. refund/chargeback lifecycle support;
10. reserve, effective take rate and payout terms that make sense for a pre-revenue launch.

"Users can pay from Chile" is not the same as "a Chilean merchant can be onboarded". Merchant domicile and consumer coverage must be verified separately.

## Current candidate map

| Candidate | Adult support | Adult AI support | Published merchant geography signal | Integration signal | Current Mara posture |
|---|---|---|---|---|---|
| Segpay | Yes | Explicit adult-AI guidance | Adult checklist says US/EU/UK + same-country director/material presence | Established hosted processing/integration | Conditional only if merchant entity qualifies |
| CCBill | Yes | Needs exact AI underwriting confirmation | Visa/Mastercard merchant presence limited to published US/Canada/European regions; Chile not listed | Established APIs/webhooks | Conditional only if merchant entity qualifies |
| Verotel | Explicit adult/high-risk | Not explicitly confirmed for generative adult AI | Pricing page states accepted merchants: worldwide | FlexPay/API and one-click/purchase tooling | High-priority domicile fallback; ask AI question before any build |
| MobiusPay | Yes | Explicit Adult AI / NSFW AI offering | Claims global processing across 190+ countries, but merchant-domicile eligibility is not sufficiently explicit | Merchant-account + developer integration positioning | High-priority underwriting lead; domicile and acquirer must be proven in writing |
| PayCX | High-risk/adult | Publishes an Adult AI case study | Adult-AI case describes an individual merchant and cross-border model, but country eligibility/pricing are opaque | Structured high-risk payment solution | Secondary lead; require strong corporate/acquirer verification before trusting it |
| Pandablue | Adult creator/platform focus | AI acceptance not explicit | Strong LATAM positioning; public platform page highlights Brazil, Colombia and Mexico, not Chile | API/payins/payouts/platform tooling | LATAM discovery lead, not yet a Mara processor candidate |

## Candidate notes

### Segpay

Strengths:

- mature adult-industry specialization;
- explicit 2025 guidance for Adult AI underwriting;
- strongly prefers bounded/closed-loop AI behavior;
- warns against free-text generation and AI user uploads;
- useful compliance benchmark even if Mara cannot use Segpay commercially.

Current blocker:

- published adult checklist says the merchant business should be registered in the US, EU or UK, have a director in the same country and demonstrate material presence.

Mara action:

- do not integrate until merchant domicile is known eligible and exact product acceptance is written.

### CCBill

Strengths:

- established adult/high-risk processor;
- mature billing/webhook infrastructure;
- useful benchmark for adult payment operations.

Current blocker:

- published Visa/Mastercard merchant requirements call for business/legal presence in a designated region; the published list covers the US, Canada and participating European countries and does not list Chile.

Mara action:

- treat as conditional, not default.

### Verotel

Strengths:

- long-standing high-risk/adult IPSP;
- public site explicitly says adult is supported;
- current public pricing page says `Accepted merchants: Worldwide` for Basic and Premium;
- supports digital-content businesses, global cards, multiple currencies and FlexPay/API tooling.

Commercial caution:

- public Premium pricing is high relative to mainstream processors and includes a rolling reserve; Basic also carries adult/high-risk economics. Re-check current quote rather than modeling from public list prices alone.

Unknown that must be answered:

- whether Mara's exact fictional adult AI / bounded interactive character scope is currently accepted by its acquiring/card-brand path.

Mara action:

- put Verotel in the first outreach batch if Mara will use a merchant entity that Segpay/CCBill cannot board.

### MobiusPay

Strengths:

- explicitly markets processing for AI companion apps, NSFW generators, voice/avatar products and adult creator platforms;
- claims support for subscriptions, tokens/credits and usage-based billing;
- claims processing across 190+ countries and 120+ currencies;
- describes specialist adult/AI underwriting and chargeback tooling.

Unknown that must be answered:

- whether "190+ countries" describes consumer acceptance, merchant onboarding, acquiring reach, or a mix;
- whether the actual Mara merchant domicile can be onboarded directly;
- which acquiring bank/payment facilitator would contract the account;
- reserves, setup/minimums, settlement and card-brand registration costs.

Mara action:

- high-priority sales/underwriting inquiry, but no integration before named acquiring route and written product approval.

### PayCX

Strengths:

- publishes a specific 2025 Adult AI case study involving a regulated/high-risk cross-border merchant;
- describes case-by-case adult-AI underwriting rather than pretending approval is automatic.

Unknown/risk:

- public evidence is materially thinner than Segpay/CCBill/Verotel;
- merchant-country matrix, pricing, reserve structure and acquiring-bank identity are not sufficiently transparent from the public material reviewed.

Mara action:

- discovery only. Require legal entity, acquiring route, PCI/compliance posture, settlement provenance and full commercial quote before shortlisting.

### Pandablue

Strengths:

- explicitly built for adult creators, studios and platforms;
- strong LATAM payment/payout positioning;
- offers API and platform payins/payouts.

Unknown:

- adult AI acceptance;
- Chile merchant onboarding;
- Chile local pay-in availability (public LATAM platform page currently highlights Brazil, Colombia and Mexico).

Mara action:

- useful LATAM conversation, but not an implementation target yet.

## First outreach batch

The first commercial discovery batch should not require engineering work.

Ask in parallel:

1. **Verotel** — Can you onboard the actual merchant domicile, and do you explicitly accept Mara's bounded adult AI virtual-character scope?
2. **MobiusPay** — Does the actual merchant domicile qualify, through which named acquiring route, and is Mara's exact closed-loop scope approved?
3. **Segpay** — Only if the entity/material-presence requirement can be met or Segpay confirms another eligible structure.
4. **CCBill** — Only if the merchant entity is inside a supported region or CCBill confirms another route.
5. **PayCX / Pandablue** — secondary discovery to widen optionality, not preferred implementation targets yet.

## Underwriting payload to keep identical across providers

Never change the story to fit a provider. Send the same facts:

- fictional adult virtual character;
- 18+ product;
- curated visual library at launch;
- bounded/scripted branching interactions;
- no open user image/video uploads at launch;
- no open-ended visual generation at launch;
- optional account continuity and low-sensitivity memory;
- one-time USD 4.99 digital unlock;
- optional variable-amount Capricho contribution toward a disclosed in-world goal;
- server-side payment truth only;
- signed webhook fulfillment;
- refund/chargeback support required;
- no sale of affection, emotional priority or guaranteed personal access.

The processor must confirm the **actual** product, not a sanitized general-audience description.

## Engineering freeze rule

Until a candidate passes merchant-domicile + exact-product underwriting in writing:

- no provider-specific checkout adapter;
- no provider-specific database schema;
- no production credential storage;
- no production payment button;
- no irreversible dependency on one acquirer.

The existing provider-agnostic checkout intent + signed server fulfillment contract remains the technical source of truth.

## Sources reviewed

- Segpay Adult Content Website Checklist: https://segpay.com/wp-content/uploads/2024/12/Adult_Content_Website_Checklist.pdf
- Segpay Adult AI approval roadmap: https://segpay.com/blog/your-roadmap-for-adult-ai-site-approval/
- Segpay UGC requirements: https://gethelp.segpay.com/docs/Content/ComplianceDocs/UserGeneratedContent.htm
- CCBill supported Visa/Mastercard merchant regions: https://ccbill.com/doc/list-of-countries-for-visa-and-mastercard-processing
- CCBill merchant eligibility: https://ccbill.com/merchants
- Verotel: https://www.verotel.com/en/index.html
- Verotel pricing/merchant coverage: https://www.verotel.com/en/pricechart.html
- MobiusPay Adult AI / NSFW AI: https://mobiuspay.com/industries/adult-ai-nsfw-ai-payment-processing
- MobiusPay adult merchant accounts: https://mobiuspay.com/industries/adult-merchant-account
- PayCX Adult AI case study: https://www.paycx.org/case-studies/adult-ai
- Pandablue adult platforms: https://www.pandablue.com/es/plataformas
