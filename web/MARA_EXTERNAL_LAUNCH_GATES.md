# MARA EXTERNAL LAUNCH GATES

Status: due-diligence and approval checklist only. This document does not authorize paid services, real payments, production migration, or provider activation.

## Purpose

Mara must not discover critical provider incompatibility after launch.

Before real-money Alpha, independently clear three external gates:

1. PAYMENT PROCESSOR
2. COMMERCIAL HOSTING
3. CONVERSATIONAL INFERENCE

A provider is not considered approved because its website looks compatible. The intended adult/AI use must be supported by the provider's current terms and, where ambiguity exists, confirmed in writing.

## Gate A — Payment processor

### Business description to disclose consistently

Use a truthful description equivalent to:

> Mara Vera is an adults-only digital entertainment platform built around an original fictional AI-generated adult virtual character. Users may purchase prepaid conversational usage and guaranteed digital products such as images, audio, video, story access and adult roleplay experiences. The product can contain lawful explicit adult content. We prohibit minors/CSAM, non-consensual intimate content, real-person sexual deepfakes and illegal material.

Do not sanitize or misclassify the business to obtain approval.

### Questions that require explicit answers

- Is this exact business category permitted?
- Are fictional AI-generated adult characters permitted?
- Is explicit adult digital content permitted?
- Is conversational adult roleplay permitted?
- Are one-time digital products permitted?
- Are prepaid usage packs permitted?
- Are recurring subscriptions permitted if introduced later?
- Are community-funded physical/digital goals such as Caprichos permitted?
- How must Caprichos be classified: sale, contribution, crowdfunding, tip, other?
- Are partial/community contributions toward a physical asset allowed?
- Required merchant entity/jurisdiction?
- Required age-verification controls?
- Required content moderation/recordkeeping?
- Required refund policy?
- Chargeback reserve?
- Rolling reserve?
- Setup/application/network registration fees?
- Per-transaction fee?
- Currency support?
- CLP support?
- International cards?
- Payout schedule?
- Minimum payout?
- Webhook signing mechanism?
- Sandbox/test mode?
- Idempotency/replay guidance?
- Dispute API/reporting?
- Prohibited content categories beyond applicable law?

### Approval evidence

Store internally:

- provider name;
- date;
- policy version/URL;
- written sales/compliance confirmation if obtained;
- quoted fees;
- reserve terms;
- settlement terms;
- merchant category/classification;
- approved product scope;
- explicitly excluded product scope;
- reviewer/owner;
- go/no-go decision.

Never put credentials or sensitive underwriting material into a public repo.

### Payment launch gate

PASS only when:

- intended product scope is approved;
- fees/reserves are known;
- sandbox exists or an equivalent safe proof path is agreed;
- webhook/payment truth can integrate with server-authoritative entitlements;
- refund/chargeback rules are known;
- founder explicitly accepts commercial terms.

## Gate B — Commercial hosting

### Required disclosure

Ask whether the standard service supports:

- commercial use;
- lawful adult/explicit content;
- AI-generated fictional adult media;
- adult conversational web application;
- authenticated/private adult media;
- payment integration;
- object/media delivery architecture;
- normal application logs/analytics.

### Questions

- Is lawful explicit adult content permitted?
- Does the answer differ by product/plan?
- Is pre-approval required?
- Are adult sites subject to special bandwidth/storage restrictions?
- Are there abuse-report response requirements beyond normal AUP?
- Is AI-generated adult content treated differently?
- Are there regions where the content cannot be hosted/served?
- Is encrypted/private adult media permitted?
- Are there restrictions on reverse proxies/CDNs/object storage?
- What notice is provided before suspension for a disputed AUP classification?

### Architecture acceptance criteria

A candidate stack must allow:

- Next.js/web API or equivalent container deployment;
- TLS;
- environment secrets;
- health checks;
- controlled deploy/rollback;
- no forced 24/7 GPU;
- separate media storage if required;
- cost ceiling suitable for a tiny Alpha.

Do not migrate merely to appear launch-ready.

PASS when the intended commercial/adult use is contractually supportable and the minimum expected monthly fixed cost is acceptable to founder.

## Gate C — Conversational inference

### Provider/product requirement

Mara needs a provider path that can support the intended lawful adult conversational category without silently invalidating the product at runtime.

Prefer provider-neutral architecture.

Questions:

- Can the model/provider support lawful adults-only sexual roleplay?
- What content categories are prohibited?
- Are there additional hosted-inference policy restrictions beyond model license?
- Is self-hosting permitted by model license?
- Commercial-use license?
- Required attribution?
- Structured JSON/function-call quality?
- Spanish/English quality?
- Context window?
- Pricing model?
- Scale-to-zero/serverless availability?
- Cold-start latency?
- Usage reporting?
- Maximum output controls?
- Rate limits?
- Data retention?
- Training on prompts/outputs?
- Regional processing/storage?

### Economic benchmark

Do not activate paid inference until a benchmark produces:

- cost per 100 turns P50/P95;
- cost per session P50/P95;
- latency P50/P95;
- structured-action failure rate;
- contradiction/World-hallucination rate;
- Mara voice quality assessment.

### Inference launch gate

PASS only when:

- provider/use is compatible;
- commercial license is clear;
- quality is acceptable;
- P95 costs fit prepaid allowances;
- server can block calls before spend when allowance is insufficient;
- global kill switch is implemented.

## Gate D — Caprichos-specific external review

Caprichos may create obligations different from ordinary digital products.

Before real contribution collection determine:

- legal characterization in the launch market;
- tax treatment;
- whether target progress may include taxes/fees and how it is disclosed;
- refund rule if goal never completes;
- refund rule if price changes;
- treatment of excess funding;
- ownership of purchased physical asset;
- whether contributor receives any ownership interest (default should be no unless deliberately structured otherwise);
- consumer disclosure needed before contribution;
- processor approval for community-funded goals;
- whether high-value contributions trigger enhanced review.

Do not describe a Capricho as a donation if legally/commercially it is not one.

## Suggested provider outreach message — payments

Subject: Pre-approval request — adults-only AI virtual character digital entertainment

Body:

Hello,

We are preparing an adults-only digital entertainment platform built around an original fictional AI-generated adult virtual character. Customers may purchase prepaid conversational usage and guaranteed digital products such as images, audio, video, premium story access and consensual adult roleplay experiences. The platform may include lawful explicit adult content.

We prohibit minors/CSAM, non-consensual intimate content, real-person sexual deepfakes and illegal content. We want to describe the business accurately before integrating a processor.

Can you confirm whether this business model is eligible under your current merchant policies, and provide the applicable onboarding, reserve, fee, payout, age-verification and content-compliance requirements? We would also like to know whether community-funded product goals toward real assets would be permitted and how you classify them.

Thank you.

## Suggested provider outreach message — hosting

Subject: AUP confirmation — commercial adults-only AI virtual character platform

Body:

Hello,

We are evaluating hosting for a commercial adults-only virtual-character entertainment platform. All characters are original fictional adults. The product may host lawful explicit adult digital content and authenticated adult conversational experiences. We prohibit minors/CSAM, non-consensual intimate content, real-person sexual deepfakes and illegal material.

Before migrating any workload, could you confirm whether this use is allowed under your current standard commercial hosting terms/AUP, whether pre-approval is required and whether any plan-specific restrictions apply?

Thank you.

## Decision table

| Gate | State | Required evidence | Founder action |
|---|---|---|---|
| Payment | NOT CLEARED | Written/product-policy approval + fees/reserves | Accept/reject terms |
| Hosting | NOT CLEARED | AUP compatibility / written confirmation | Accept/reject cost |
| LLM inference | NOT CLEARED | Use compatibility + 200-conversation benchmark | Approve provider/cap |
| Caprichos | NOT CLEARED | Processor + legal/commercial classification | Approve real collection |

## Rule for conflicting provider answers

If sales says yes but written policy/compliance says no or is ambiguous:

NOT APPROVED.

If approval excludes an important Mara product category:

Do not quietly run it anyway. Either:

- disable that product for the provider;
- choose another provider;
- seek explicit approval.

## Permanent boundary

No external gate in this file authorizes spending or production activation.

Founder approval remains required for any real provider commitment, payment activation or production migration.
