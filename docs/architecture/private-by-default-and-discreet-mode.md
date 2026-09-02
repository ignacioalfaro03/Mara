# Mara Vera — Private by Default / Discreet Experience

Last reviewed: 2026-09-02

## Status

Authoritative privacy-as-product architecture for Mara.

This document extends Adult Compliance, Memory System, Preference Graph, Private Participation/Caprichos and Web Information Architecture. It does **not** create a second identity store, second consent system or second analytics layer.

## Core thesis

Adult privacy is not only a legal/compliance requirement.

It is part of the value proposition:

> **The safer the user feels exploring privately, the more honestly they can correct Mara — and the better Mara can become at relevance.**

Therefore:

**privacy → trust → better signals → better personalization → stronger return → healthier monetization.**

Privacy is a product-quality input.

## Permanent principle

> **PRIVATE BY DEFAULT. PUBLIC ONLY BY EXPLICIT PURPOSE.**

Mara should assume that adult preferences, interactions and history are private even when the user is comfortable with Mara herself.

The user may want a persistent relationship with Mara while wanting zero public association with adult preference details.

## Identity layers

Maintain the existing separation:

### Legal Identity

Used only where required for:

- payment/KYC;
- tax;
- legal compliance;
- account recovery where applicable.

Never used as default public Mara identity.

### Account Identity

Authentication/contact layer.

Do not automatically expose it to community surfaces.

### Mara Alias

Optional pseudonymous participation identity for Mara's World/Caprichos.

### Hidden

Anonymous participation where product/legal/payment constraints permit.

Adult preference profile is never a public identity layer by default.

## Public aggregate / private individual

Public/community surfaces may show non-sensitive aggregates such as:

- Goal progress;
- Team Black vs Team Silver;
- contributor count;
- option vote totals.

Private surfaces may show:

- `you helped make this happen`;
- personal World Asset history;
- private preferences;
- private interaction history;
- consent/memory controls.

Permanent rule:

> **PUBLIC AGGREGATE. PRIVATE INDIVIDUAL.**

## Discreet Mode

A future Discreet Mode should reduce accidental exposure on shared/visible devices without pretending the product is something it is not to processors, regulators or contractual partners.

Potential user-controlled behaviors:

- neutral browser/page title where technically appropriate;
- hidden notification previews;
- neutral notification copy;
- configurable notification enable/disable;
- configurable email subject wording where provider rules permit;
- no explicit fantasy/category labels in push/email subject;
- no sensitive route names in URLs;
- no adult preference names in share-card metadata;
- blur/hide sensitive visual previews until opened;
- quick local hide/close affordance where useful;
- session-only mode for some exploratory interactions;
- easy local prototype reset.

Do not use deceptive merchant descriptors or false legal/business names. Payment descriptors remain subject to processor/card-network/legal requirements.

## Notification rule

Notifications are a high-leakage surface.

Default future posture should be conservative.

Bad:

`Mara has a new [explicit preference] fantasy for you.`

Better neutral pattern:

`Mara left something for you.`

Even neutral notifications should require normal notification consent/preferences.

Do not use sensitive preference details to optimize lock-screen copy.

## URL / metadata hygiene

Do not place raw adult-sensitive labels in:

- public URL paths/query strings;
- browser title;
- Open Graph metadata;
- referrer-visible campaign parameters;
- generic analytics event names;
- error-report payloads;
- public profile slugs.

Use opaque internal IDs such as:

```text
route_id=D03
candidate_id=E07
```

The mapping belongs in controlled first-party configuration, not public metadata.

## Analytics minimization

Generic analytics may record:

- opaque route/candidate ID;
- action family;
- fit/correction;
- completion;
- return;
- consent flow step;
- generic privacy setting state where needed.

Do not send raw:

- fantasy text;
- sexual history;
- orientation inference;
- adult-media URL/title;
- explicit body preference;
- roleplay details;
- raw alias;
- precise intimate conversation content.

A dedicated sensitive store, if ever justified, remains separate and consent-governed.

## Memory transparency

A major trust opportunity is not just allowing memory deletion; it is helping the user understand **what Mara thinks she learned**.

Future private control surface may show playful but bounded summaries:

- `Voice seems to work better for you.`
- `You usually prefer Mara to lead.`
- `You asked me not to use X.`

The user should be able to:

- confirm;
- correct;
- mark `not always`;
- remove;
- disable persistent adult preference memory;
- reset adult personalization.

Do not expose raw inference provenance unnecessarily when it would itself reveal sensitive third-party media/history. Provide enough explanation to enable control.

## Memory visibility tiers

Not every internal record needs to be surfaced identically.

Possible classes:

- user-declared preference — directly editable;
- inferred candidate — show only when useful/appropriate;
- hard consent/boundary — user-controllable but safety semantics preserved;
- commercial entitlement — separate from preferences;
- Mara self-memory — character canon, not user profile.

## Session-only exploration

Some users may want to explore something without making it part of durable Mara memory.

Future control:

`Just for tonight / Do not remember this`.

Effect:

- session state may use the signal;
- durable Preference Graph write is blocked;
- ordinary safety/abuse/audit requirements still apply where legally necessary;
- no false claim that infrastructure logs do not exist if they are required for security/legal operation.

This is a high-value trust feature because curiosity should not automatically become identity history.

## Consent × memory

Consent to adult content is distinct from consent to remember adult preferences.

Examples:

- user can opt into an adult route but keep persistent adult memory off;
- user can allow voice intensity but not external-media recommendations;
- user can permit an object-focused experience but decline long-term learning from it.

The capability model should therefore distinguish:

```text
content_allowed
memory_write_allowed
notification_allowed
community_visibility_allowed
```

One must never imply another.

## Data separation

Keep logically/technically separable:

- legal identity;
- account/contact;
- payment/provider records;
- commercial entitlements/history;
- relationship memory;
- Preference Graph;
- adult consent;
- session state;
- Caprichos participation;
- Mara Alias;
- generic analytics.

Avoid a single exportable `mega_profile` containing everything.

## Sensitive logs / observability

Production observability is another leakage risk.

Before launch:

- redact sensitive freeform content from default logs where feasible;
- avoid putting raw adult prompts/preferences in error names;
- restrict access by operational need;
- define retention;
- keep provider payload logging disabled/minimized where possible;
- review crash/error vendors before sending adult-sensitive context;
- never use developer convenience as blanket justification for raw transcript retention.

## Screenshots / sharing

Mara may eventually support shareable public-safe content.

Rules:

- public sharing is an explicit user action;
- default share card must not leak private desire route/history;
- no automatic public adult-preference badge;
- no alias-to-legal-identity linkage on share surfaces;
- public Mara World participation remains distinct from private Mara relationship history.

## Privacy failure modes

Treat these as product defects:

- explicit category in lock-screen notification;
- preference label in browser history URL;
- raw adult URL in analytics;
- Caprichos community page exposing private fetish route;
- public alias revealing legal identity;
- `Mara remembers` without a correction/delete path once persistent memory launches;
- a session-only choice later appearing as durable preference;
- user reset that visually clears UI but leaves active personalization data unchanged without disclosure.

## P0

Do not build authentication/encryption infrastructure merely to test privacy UX.

P0 can validate with synthetic fixtures:

1. neutral vs explicit notification examples;
2. discreet browser-title concept;
3. `remember this` vs `just this session` choice;
4. private preference summary with confirm/correct/remove;
5. public Caprichos aggregate vs private personal history;
6. explicit reset behavior;
7. testers' willingness to be honest under different privacy explanations.

Use fictional/synthetic adult preference examples so testers are not pressured to disclose actual intimate history.

## Privacy metrics

Future product metrics:

- privacy concern rate;
- memory opt-in;
- session-only mode usage;
- correction/delete usage;
- notification opt-in by discreet mode;
- trust score/qualitative confidence;
- personalization fit among memory-on vs session-only cohorts;
- creepy-memory negative reaction;
- accidental-exposure support incidents.

Do not interpret privacy-preserving choices as low engagement.

## Build trigger

Implement durable controls before durable adult-sensitive memory scales.

Do not postpone user control until after a large sensitive dataset exists.

Full technical controls should be designed alongside the first real persistent Preference Graph, authentication and production notifications — not after launch traction creates pressure to move quickly.

## Permanent principles

> **PRIVACY IS PRODUCT QUALITY, NOT JUST COMPLIANCE.**

> **PRIVATE BY DEFAULT.**

> **PUBLIC AGGREGATE. PRIVATE INDIVIDUAL.**

> **CONTENT CONSENT ≠ MEMORY CONSENT ≠ NOTIFICATION CONSENT ≠ COMMUNITY VISIBILITY.**

> **CURIOSITY DOES NOT HAVE TO BECOME DURABLE IDENTITY.**

> **THE SAFER THE USER FEELS CORRECTING MARA, THE BETTER MARA CAN ACTUALLY LEARN.**
