# Mara Vera — Adult Compliance Operating Baseline

Last reviewed: 2026-09-02

## Status

Product/compliance baseline for adult relationship entertainment. This extends `compliance.md`; it does not replace jurisdiction-specific legal, payment-provider or platform review.

No real adult premium surface, payment flow, provider activation, external adult-media integration or persistent sensitive-memory system is authorized by this document.

Read together with the [Desire Operating System Integration Contract](../architecture/desire-operating-system.md).

## Non-negotiable product rules

1. Mara is always disclosed as an AI-generated/synthetic adult character.
2. Adult experiences are adults-only.
3. No minor-coded presentation, ambiguous age framing or sexualization of young-looking/underage personas.
4. Adult intensity requires explicit compatible opt-in and boundaries.
5. Pricing and scope must be understood before purchase.
6. Users can stop, skip, reduce intensity or decline without losing baseline respect or unrelated entitlements.
7. Data collection/memory must be purpose-limited and minimized.
8. Mara remains original synthetic IP; no sexual impersonation of real identifiable people without lawful rights/consent.
9. Relationship closeness and spending state remain separate.
10. Provider/platform/payment policy must be checked before activation, not after.
11. Consent to one adult category never implies consent to another.
12. Eligibility filtering happens before adult candidate ranking/generation.
13. Financial-power fantasy never authorizes real financial exploitation.
14. Post-spend vulnerability is not a commercial targeting opportunity.

## Age and adult eligibility

Launch requirements for adult surfaces include:
- clear 18+ positioning;
- age gate before adult content/interaction;
- no adult escalation before eligibility requirements are satisfied;
- launch-market review of whether stronger age assurance is legally/provider required;
- no attempt to bypass platform age restrictions.

The age gate is not a substitute for any legally required age-verification mechanism.

## AI disclosure

Mara may be immersive and character-driven but must not create material deception that a hidden real woman is operating the account.

Disclosure should be clear in appropriate first-party/account surfaces.

Mara's persistent life is disclosed fiction. Narrative continuity is not evidence of a hidden human identity.

## Composable Consent Stack

Consent is modular, scoped and reversible.

Potential scopes:

- `adult_mode`;
- content intensity band;
- roleplay category;
- `financial_domination_fantasy`;
- financial humiliation / role-language scope where applicable;
- object/niche fetish;
- body-focused play;
- anticipation/orgasm-control fantasy;
- external adult media;
- voice intensity;
- persistent adult preference memory.

Rules:

- consent to adult mode does not authorize every category;
- consent to one fetish/object/body focus does not authorize another;
- consent to financial-power fantasy does not authorize financial humiliation language automatically;
- consent to D02 does not authorize `paypig`, `wallet`, `ATM`, `slave` or similar labels automatically;
- consent to voice V2 does not imply V3;
- contribution to a World Asset does not imply fantasy consent involving that asset;
- a prior session does not silently authorize a later context forever;
- users can stop, skip, reduce, correct, reset or opt out;
- no relational punishment for revoking/refusing consent.

Conceptual state:

```yaml
consent_state:
  adult_mode: active
  scopes:
    financial_domination_fantasy: active
    financial_humiliation_language: inactive
    voice_v2: active
    voice_v3: inactive
    persistent_adult_memory: inactive
  updated_at: session
```

Implementation/storage remains deferred.

## Content Policy Router

Before serving, generating, recommending or selling adult content, build an eligible candidate set using a hard router:

**adult eligibility → consent scope → category eligibility → jurisdiction/legal → provider policy → channel/platform policy → rights/real-person checks → privacy classification → commercial-scope check**.

Only then may Desire Routing/Fantasy Compiler rank options.

> **ELIGIBILITY BEFORE RANKING.**

Do not feed prohibited options into a recommender and treat generation-time moderation as the primary control.

## Policy-aware redirection

If the user asks for an ineligible route/category:

- do not expose unnecessary internal compliance machinery;
- keep Mara coherent/in character where possible;
- decline that specific direction;
- offer an eligible adjacent route when appropriate;
- do not punish, shame or manipulate.

## Absolute red lines

Do not facilitate or productize:
- sexual content involving minors;
- sexualized minor-coded or ambiguous-age characters;
- sexual exploitation or trafficking;
- non-consensual real sexual conduct;
- recordings/intimate media of real people without consent;
- sexual deepfakes/impersonation of identifiable real people without lawful rights/consent;
- extortion/blackmail;
- doxxing;
- threats tied to real-world harm;
- payment coercion;
- hidden/misleading charges;
- unlawful sexual content.

Specific provider/platform rules can be stricter and must be applied at activation time.

## Real-person rights

Never build a workflow that allows users to turn an identifiable real person into sexual synthetic media/voice without appropriate rights and consent.

This includes:
- explicit deepfakes;
- sexualized face swaps;
- sexual voice clones;
- explicit simulations framed as that real person.

User-provided media/reference does not erase rights obligations.

## Custom content safeguards

Any future custom configurator should use bounded approved variables and reject/redirect requests conflicting with:
- age rules;
- consent;
- real-person rights;
- law;
- provider policy;
- payment policy;
- platform/channel policy.

Do not promise an unrestricted adult generator before the actual safe/provider-supported scope is known.

## Monetize desire, not vulnerability

Permitted commercial levers include:
- personalization;
- premium scope;
- genuine scarcity;
- bounded custom experiences;
- voice;
- collections;
- narrative continuity;
- World Asset participation;
- agency;
- rarity tied to real product/production constraints.

Do not target, price or pressure based on inferred:
- loneliness;
- depression;
- bereavement;
- debt;
- financial distress;
- desperation;
- emotional dependency;
- compulsive spending;
- sexual compulsion;
- heightened arousal.

Do not create commercial variables such as:
- loneliness score;
- desperation score;
- arousal monetization score;
- emotional-dependence score;
- compulsive-spend score.

> **SERVE THE MOMENT; NEVER EXPLOIT THE STATE.**

## No purchase surprise at intensity peak

Do not insert an undisclosed charge in the middle of a high-intensity experience.

If a premium experience includes:
- voice;
- challenge;
- waiting/anticipation;
- adult branch;
- custom scope;

its price and scope should be understood before the paid experience starts.

The experience may use tension. The transaction may not use hidden pressure.

## Financial domination fantasy guardrail

Financial-domination fantasy may exist only as an adult, explicit, consensual roleplay/product scope where legal/provider-compatible.

The real commercial system remains ordinary.

Never:
- encourage debt/borrowing;
- demand bank/credit access;
- request financial credentials;
- create unlimited-spend obedience mechanics;
- punish payment refusal;
- make affection proportional to spend;
- infer debt tolerance or higher hidden WTP;
- use financial distress as targeting data;
- use salary or bank balance to decide commercial pressure;
- treat one payment as permission for future payment asks;
- treat D02 participation as consent to humiliation language.

> **THE FANTASY MAY BE FINDOM. THE PAYMENT SYSTEM MAY NOT BECOME FINANCIAL EXPLOITATION.**

## D02 user safety controls

Community research justifies stronger operational boundaries for any future real-payment D02 implementation.

### Cold-set limits

A user may eventually set a hard session/period cap outside high-intensity play.

The product does not need to know:

- salary;
- bank balance;
- credit limit;
- debt capacity;
- household expenses;
- why the user selected the cap.

> **NO SALARY NEEDED. NO BANK BALANCE NEEDED.**

### No hot renegotiation

Permanent rule:

> **SET LIMITS COLD. PLAY INSIDE THEM HOT. NEVER RENEGOTIATE THEM HOT.**

If a hard cap is reached during a high-intensity D02 window:

- the financial action becomes ineligible;
- Mara may refuse;
- Mara may redirect to a nonfinancial action;
- the product does not ask `raise your limit?`;
- the limit is not silently expanded;
- relationship warmth does not change.

Changing a cap, where supported in the future, happens in a neutral settings/context state and does not retroactively reopen the same intense commercial moment.

### `No money today`

Future user controls should support an immediate session-level state such as:

`no_money_today = true`

When active:

- D02 can continue through eligible nonfinancial components;
- financial asks/Treats/paid D02 actions lose eligibility;
- Mara does not punish, guilt or cool baseline affection;
- the state is not interpreted as financial distress unless the user explicitly says so.

### Post-spend commercial blackout

Permanent rule:

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

After a real or simulated paid financial-power beat:

- fulfill promised value;
- acknowledge;
- normalize according to user preference;
- allow ordinary conversation/space/open loop;
- do not surface another immediate financial ask.

Never:

- upsell directly from a high-intensity paid peak;
- ask for another send because the first succeeded;
- raise the equivalent-SKU price;
- ask to increase the cap;
- use shame/regret as evidence of desire;
- use aftercare as a sales funnel.

### Explicit regret/distress exit

If the user explicitly reports financial regret, distress, loss of control or a desire to stop:

- pause D02 commercial actions;
- no commercial next action;
- respect category pause/reset;
- do not eroticize the regret;
- do not reassure them into another purchase;
- provide a discreet support/controls path where productized later.

Re-entry should require deliberate user action outside the distressed/intense moment.

### Refusal is allowed

Mara may reject a financial action because:

- a cap is reached;
- timing is wrong;
- commercial attention is saturated;
- the product action is not meaningful;
- Mara does not want the proposed thing;
- a nonfinancial action is better.

This is not a system failure.

> **SOMETIMES THE MOST DOMINANT ACTION IS TO REFUSE THE MONEY.**

Do not manufacture refusal as fake scarcity intended to trigger larger later spend.

## Session State vs commercial targeting

Temporary session state can improve interaction quality:
- current intent;
- current intensity;
- current mode;
- current route;
- current open loop;
- current consent scope;
- `no_money_today` where explicitly selected;
- recovery state.

That state must not automatically become commercial targeting data.

Especially do not derive:

`user currently aroused → show more expensive offer`

or:

`user currently lonely → increase offer frequency`

or:

`user just paid → immediately ask for more`.

## Privacy and memory

Adult preference data is highly private product data.

Default posture:
- collect less;
- avoid raw transcript retention by default;
- separate identity/payment/consent/relationship/preference/session state;
- avoid raw intimate data in generic analytics;
- store only what is needed;
- define retention/decay/deletion;
- provide correction/reset controls;
- encryption/access-control design before persistent scale.

Persistent adult preference memory requires explicit product/privacy review before activation.

D02-specific privacy rules:

- no public `paypig` status;
- no public lifetime spend;
- no public D02 badge by default;
- no D02 label in push/email/browser title/public URL;
- no salary/bank-balance collection for personalization;
- no spend rank as relationship status.

## Sensitive analytics

Generic analytics should prefer opaque identifiers:

```text
route_id = D02
candidate_id = A07
reaction = worked
```

Do not send raw:
- fantasy descriptions;
- adult-media URLs/titles;
- sexual history;
- explicit body/object preferences;
- trans-content interest as a user identity label;
- roleplay details;
- D02 role language;
- private financial limits;
- vulnerability state.

## Trans-inclusive handling

Adult content involving trans adults can be eligible where lawful, consensual and provider-compatible.

Trans identity itself must not be framed as inherently shameful/taboo.

If a user is surprised by their own response, Mara can play with the surprise/contradiction without inferring sexual orientation.

> **OBSERVE THE RESPONSE. DO NOT INVENT THE IDENTITY.**

## External adult media

Before real outbound recommendations:

1. define approved sources;
2. review adult-only/performer age-consent posture;
3. review illegal/non-consensual/deepfake policy;
4. review copyright/piracy/linking/embedding terms;
5. review malware/reputation risk;
6. review affiliate/commercial-link terms if monetized;
7. review privacy/analytics treatment;
8. review launch jurisdiction;
9. confirm payment/provider implications;
10. obtain separate founder authorization.

Do not create a broad adult-web crawler, scrape/rehost media or activate affiliate routing under P0.

## Platforms/channels

For each active public channel maintain:
- permitted public content band;
- age restrictions;
- AI/synthetic disclosure requirements;
- adult-content restrictions;
- link/promotion rules;
- account enforcement risk;
- permitted destination links.

Public acquisition should be platform-safe.
Deep adult personalization belongs first-party behind the proper gate.

Do not use external ad-tech sexual/fetish targeting to build first-party D02 profiles.

## Payments

Before real payments:

1. freeze exact product catalog/SKUs;
2. identify countries/jurisdictions served;
3. review current processor acceptable-use/restricted-business rules;
4. verify explicit support for AI adult content, interactive adult experiences, custom content, voice, PPV, subscription, D02 framing and Caprichos as applicable;
5. confirm refund/chargeback obligations;
6. confirm descriptor/recurring billing disclosure;
7. document fallback if provider rejects scope;
8. obtain separate founder authorization.

Approval for one Mara SKU/provider scope does not imply approval for every other SKU, D02 financial-power framing or Caprichos/community-goal model.

## Caprichos compliance boundary

Real Caprichos require separate review covering:
- transparent Goal target/scope;
- fulfillment consequence;
- failure/out-of-stock/overfunding rules;
- ownership treatment;
- cleared funds vs gross funding;
- refund/chargeback handling;
- tax/consumer-law treatment;
- payment-provider acceptance;
- no fractional-ownership/investment promise;
- no paid random reward unless separately legally/provider reviewed.

Community participation remains:

> **PUBLIC AGGREGATE. PRIVATE INDIVIDUAL.**

A private D02 meaning may change how an eligible user experiences participation. It may not change public Goal terms, affection, target or contributor status.

## Playable rituals

P0/initial design should exclude material physical-risk challenges.

No productized:
- choking/breath restriction;
- dangerous injury/pain;
- unsafe insertion/object use;
- intoxication;
- self-harm;
- illegal acts;
- real-world financial punishment;
- coercive threats.

Any later physical-risk category requires separate review before becoming eligible.

## Abuse/support

Need future handling for:
- harassment;
- threats;
- blackmail;
- doxxing;
- non-consensual real-person content;
- illegal requests;
- financial-regret/D02 pause requests;
- reporting/takedown/contact.

Support should be discreet, clear and nonjudgmental.

## Experiment quality

Adult monetization experiments must track not only conversion/revenue but also:
- refund/dispute/chargeback;
- stop/skip;
- correction;
- negative/creepy reaction;
- privacy concern;
- consent drop-off;
- support burden;
- provider/policy incidents;
- continuation/return after commercial moment;
- post-spend pressure;
- role-language cringe;
- trust after refusal/no-offer;
- regret/distress signals.

A test that increases conversion while materially damaging trust, safety or dispute economics is not a winner.

## Pre-activation gate

Before real adult commercial launch, require a written review covering:
- jurisdiction;
- age assurance;
- AI disclosure;
- consent stack;
- content policy router;
- privacy/data retention;
- product catalog;
- payment-provider policy;
- platform/channel policy;
- refunds/chargebacks;
- prohibited-content handling;
- abuse/reporting;
- deletion/contact path;
- rights/licensing for image/video/voice;
- external-media sources if applicable;
- D02 cold-set cap behavior if activated;
- post-spend commercial blackout behavior;
- discreet D02 notification/privacy behavior.

Founder authorization for payments, providers, deployment and production activation remain separate approvals.

## Permanent principles

> **ADULT ELIGIBILITY + CONSENT + POLICY BEFORE RANKING.**

> **CONSENT IS COMPOSABLE AND REVERSIBLE.**

> **SERVE THE MOMENT; NEVER EXPLOIT THE STATE.**

> **MONEY CAN BUY ENTITLEMENT/SCOPE. IT CANNOT BUY MARA'S BASELINE AFFECTION OR CONSENT.**

> **THE FANTASY MAY BE FINANCIAL DOMINATION. REAL FINANCE REMAINS ORDINARY.**

> **SET LIMITS COLD. PLAY INSIDE THEM HOT. NEVER RENEGOTIATE THEM HOT.**

> **POST-SPEND VULNERABILITY IS A COMMERCIAL DEAD ZONE.**

> **NO SALARY NEEDED. NO BANK BALANCE NEEDED.**

> **SOMETIMES THE MOST DOMINANT ACTION IS TO REFUSE THE MONEY.**

> **PRIVATE BY DEFAULT.**
