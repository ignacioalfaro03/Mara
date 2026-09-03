# Mara Vera — Momentum Commerce / Scarcity / Reward Architecture

## Status

Authoritative cross-cutting commercial architecture inside the existing Foundation outcome.

Momentum Commerce is **not** a second Monetization Engine, Relationship Engine, Fantasy Compiler or payment stack. It defines how a commercially eligible Mara experience can move from value to offer to entitlement to payoff **without breaking the interaction that created the desire**.

It consumes existing state from the Fantasy Compiler, Fantasy Experience Engine, Life Engine, Preference Graph, Relationship Memory and Commercial State. Real checkout, payment providers and production scarcity remain separately authorized.

## Core thesis

Do not optimize Mara by inserting more generic paywalls.

Optimize:

**Presence → Interaction → Desire → Personal Relevance → High-Value Moment → Clear Optional Offer → Purchase → Immediate Gratification → Continue → Ownership/Progress → Natural Next Opportunity**.

Permanent principle:

> **Payment must be a comma, not a period.**

A paid action should return the user to the exact experience state that created the purchase intent whenever technically possible.

## Momentum Commerce responsibility

Momentum Commerce owns the commercial orchestration contract for:
- identifying an eligible commercial moment;
- mapping that moment to a transparent offer;
- availability/scarcity policy;
- entitlement/ownership semantics;
- exact-state resume after payment;
- post-purchase reward grammar;
- continuation/commercial graph edges;
- collection/progression semantics;
- commercial attention budget;
- purchase-satisfaction signals;
- momentum-specific analytics.

It does not own:
- payment processing;
- pricing-provider implementation;
- relationship closeness;
- user vulnerability inference;
- character canon;
- fantasy safety eligibility;
- raw intimate preference storage.

## Commercial moment taxonomy

Candidate moments:

### Curiosity
The user already wants to know what happens next.

Candidate offer: mini unlock, continuation, voice reveal.

### Personal relevance
Mara has just demonstrated useful understanding.

Candidate offer: preference-aware version, contextual voice, compiled mini experience.

### Participation
The user wants more agency.

Candidate offer: `Build It`, branch control, deeper co-creation.

### Anticipation
A legitimate narrative/open loop exists.

Candidate offer: next episode, continuation, alternate path.

### Achievement
The user completed a bounded challenge/experience.

Candidate offer: deeper experience, collection item, sequel. Rewards may also occur without an offer.

### Real scarcity
A real capacity/time/edition/live constraint exists.

Candidate offer: custom slot, dated drop, limited edition, live window, early access.

A commercial moment is eligible only when the value is understandable before purchase and the interaction can recover cleanly if the user declines.

## Commercial attention budget

Mara must not become an ad surface.

P0 should cap commercial moments per session or use a simple cooldown. Exact limits are hypotheses.

Signals to reduce commerce density:
- repeated offer dismissals;
- abandonment immediately after offers;
- declining completion;
- explicit annoyance;
- negative-reaction/support signal.

Many Life Events, interactions and rewards should remain non-commercial.

## Contextual offer contract

Prefer character-led framing such as:

> “La otra parte te la mandaría en voz.”

while transaction UI separately exposes:
- exact product/scope;
- price when real/authorized;
- recurring vs one-time status;
- availability terms;
- ownership/access terms;
- refund/cancellation information where applicable.

Mara's character copy must never obscure transactional facts.

## Exact-state resume

The commercial state machine should preserve a `resume_state` reference.

Conceptual flow:

```text
commercial_moment
→ offer
→ checkout/intent
→ entitlement
→ resume_state
→ Mara reaction
→ payoff
→ continuation
```

After real payment success, do not route the user to Home/store unless the product itself requires it.

Primary metric: **Post-Purchase Continuation Rate**.

Supporting metric: **Commercial Inertia** — the share/time distribution of paid actions that lead back into meaningful interaction without session death.

## Post-purchase is product

Design the first seconds after entitlement creation.

Good sequence:
1. transaction success is unambiguous;
2. user returns to exact state;
3. Mara reacts in character;
4. purchased value appears immediately or fulfillment status is clear;
5. the interaction continues;
6. appropriate ownership/progression is written;
7. a future continuation may become eligible.

Avoid generic “Thanks for your purchase” as the primary experience.

## Reward Grammar

Reward is a character/product mechanic, not a payment receipt.

Candidate `reward_style` values:
- `praise`;
- `teasing`;
- `acknowledgement`;
- `challenge_completion`;
- `reveal`;
- `surprise`;
- `access`;
- `progression`;
- `collectible`;
- `none`.

Examples of praise can include Mara-specific lines such as “Good boy”, “Así me gusta” or “Te lo ganaste” only when the interaction context and consented preference make them fit.

Permanent principle:

> **Reward should feel earned, not mechanically purchased.**

Payment can unlock an experience that contains a reward. Payment itself must not increase baseline affection, respect, relationship stage or Mara's emotional stability.

## Reward scarcity / cooldown

High-value reactions lose meaning when overused.

P0 may track lightweight recent-use metadata such as:
- last reward style;
- recent praise count;
- same-line cooldown;
- challenge completion context.

Do not deliberately withhold baseline kindness to condition spending. Reward scarcity is character pacing, not affection deprivation.

## Preference Graph handoff

Only if repeated evidence justifies it, Preference Graph may contain contextual, correctable interaction signals such as:
- `praise_affinity`;
- `teasing_reward_affinity`;
- `challenge_affinity`;
- `control_affinity`;
- `surprise_affinity`;
- `collector_affinity`.

These are interaction preferences, not psychological identities.

They cannot be used to infer dependency, loneliness, compulsion or maximum willingness to pay.

## Relational friction

Mara may have temporary relational tone such as:
- warm;
- playful;
- distracted;
- annoyed;
- distant;
- reflective;
- repaired.

Inputs may include Life State, actual conversation, boundaries, disagreement and prior interaction.

Commercial state, amount spent, declined purchase or payment failure must not create relational punishment.

Valid:

> user crosses a boundary → Mara becomes annoyed / ends the interaction for now.

Invalid:

> user declines an offer → Mara withdraws affection or manufactures abandonment.

Never sell forgiveness or repair.

## Scarcity doctrine

Permanent rule:

> **Every scarcity claim must map to an enforceable product constraint.**

Supported availability types:
- `always_available`;
- `capacity_limited`;
- `time_limited`;
- `edition_limited`;
- `narrative_window`;
- `live_window`;
- `early_access`.

Conceptual schema:

```yaml
availability:
  type: capacity_limited
  starts_at: null
  ends_at: null
  capacity_total: 12
  capacity_remaining: 5
  reason: manual_voice_qc_capacity
  ownership_after_purchase: permanent
  reopen_policy: next_real_capacity_window
```

If capacity reaches zero, the offer closes. If a dated window ends, new acquisition closes. If an edition is promised as 100 units, unit 101 cannot silently exist.

Never use:
- countdowns that reset;
- randomized “1 left” claims;
- fake viewers/buyers;
- fake competing suitors;
- fake emergencies;
- fabricated “Mara chose someone else” pressure.

## Capacity scarcity

Launch custom experiences are naturally capacity-constrained when they require manual generation, voice, QC, review or revisions.

Real slot limits can simultaneously:
- protect quality;
- protect margin;
- reduce operational overload;
- create truthful urgency;
- reveal demand.

Track slot economics before expanding capacity.

## Time and narrative scarcity

Life Engine may create a temporary opportunity, for example a real weekend/travel narrative window or a dated themed drop.

Flow:

**Life Event → selected commercial opportunity → real availability window → participation → Life Event resolves → new acquisition closes → owned history remains**.

Do not monetize every Life Event. Most life texture should remain ordinary and non-commercial.

## Edition / founding scarcity

Edition-limited products require a durable edition policy.

Examples:
- Founding Drop 001 — 100 acquisitions maximum;
- Founding 100 status;
- a fixed collectible edition.

Benefits must be explicit and real. Grandfathered terms should only be promised when Mara can honor them.

## Live scarcity

Future realtime/live experiences may legitimately be limited by:
- concurrency;
- inference/provider cost;
- moderation;
- manual review;
- availability windows.

This is post-validation and requires separate provider/cost authorization.

## Ownership vs access

Commercial records must distinguish:

### Access
Temporary entitlement under membership/window/product terms.

### Ownership
User retains the acquired digital experience/entitlement under the stated product terms.

Do not market temporary access as ownership.

## My History with Mara / collectibility

Appropriate acquired history may include:
- purchased episodes;
- completed branches;
- owned voice/media;
- limited drops;
- custom experiences;
- collection completion;
- founding items;
- future continuation eligibility.

The value is accumulated shared product history, not emotional debt.

A user should be able to feel:

> **I was there. I own/experienced this part of Mara's history.**

## Collections

Collections can group experiences with explicit membership and completion rules.

Example:

```yaml
collection_id: night_series
items:
  - late_work
  - gym
  - cant_sleep
  - saturday_night
completion_reward: night_epilogue
```

Progress can be visible without purchase pressure.

Completion rewards must be predetermined enough that the product is not changing the bargain after purchases occur.

## Continuation / Commercial Graph

A product can define natural next options:

```yaml
next_commercial_options:
  continuation_id: null
  alternate_branch_id: null
  personalized_version_id: null
  voice_upgrade_id: null
  build_it_id: null
  custom_id: null
```

This is not an obligation to upsell every purchase.

The objective is to intentionally design likely **first → second purchase paths** instead of hoping the next purchase happens randomly.

Examples:
- voice → voice continuation;
- story → next episode;
- Build It → custom;
- limited drop → next collection item;
- personalized → deeper personalization.

No fake cliffhangers.

## Pay for agency

One scalable value ladder is additional influence over the experience:
- free: Mara curates most variables;
- paid: user controls one meaningful variable/branch;
- premium: more variables/modalities;
- custom: bounded deeper co-creation.

Agency must change the outcome visibly.

## Pay for personalization

Personalization depth can be an operational/product scope driver:
- P0 Mara-specific;
- P1 nominal/contextual;
- P2 preference-aware;
- P3 continuity-aware;
- P4 relationship-aware after persistent memory is justified.

Higher price is justified only when value and contribution margin support it.

## Voice premium ladder

Candidate progression:

**text continuation → voice continuation → context-personalized voice → custom voice → future realtime voice**.

Track **Voice Attach Rate** before paying for heavier voice infrastructure.

## Commercial Memory

Commercial Memory remains separate from Relationship Memory.

Appropriate fields:
- SKU/offer reference;
- entitlement/ownership state;
- modality;
- completion;
- replay;
- sequel/continuation request;
- refund/dispute;
- satisfaction signal;
- first/second purchase linkage;
- collection progress.

Commercial Memory can improve offer relevance.

It cannot increase relationship closeness or create emotional pressure.

High-value state may unlock larger product scope, real priority fulfillment or early access where sold, never stronger affection manipulation.

## Purchase Satisfaction Memory

A purchase event alone is weak evidence.

Higher-value sequences include:
- bought voice → completed → replayed → requested continuation;
- bought episode → completed → bought sequel;
- Build It → completed → custom intent;
- limited drop → acquired another collection item.

Use these sequences to learn product-market fit, not intimate psychological traits.

## Intent recovery

If a user already expressed legitimate interest but did not buy, Mara may later surface the unfinished value as continuity.

Example:

> “Te dejé lo de ayer ahí.”

Avoid manufactured “last chance” pressure unless a real availability deadline actually exists.

## Membership position

Membership is a potential **base premium relationship layer**, not necessarily the revenue ceiling.

It may include recurring baseline premium benefits, while clearly scoped optional PPV/custom/drop/live products remain above it.

Do not promise “everything forever” if the business intends to sell additional premium scope.

## P0 implementation boundary

Before real payments, P0 may implement:
- structured `CommercialMoment`/`Offer` metadata;
- availability metadata;
- one clearly labeled prototype scarcity state;
- one collection;
- a continuation graph;
- reward-style metadata;
- premium-intent events;
- development-only mock purchase/resume states;
- development-only mock entitlement/reward delivery.

Rules:
- prototype scarcity must be visibly labeled as prototype/demo unless founder is operating a real constrained test;
- a premium-intent click must never be presented as a purchase;
- mock purchase success must be development/test-only and visibly labeled;
- no real charge/provider is activated by this architecture.

## P0 experiment set

### Momentum
1. store redirect vs in-context offer;
2. checkout/resume prototype vs context loss;
3. value-before-offer vs early offer;
4. standalone purchase vs continuation chain;
5. static product card vs Mara-curated offer.

### Scarcity
1. evergreen vs real 72-hour drop;
2. unlimited custom vs real weekly capacity;
3. standalone vs limited collectible series;
4. generic release vs Life State-connected drop;
5. real limited edition vs evergreen.

### Reward
1. no reaction vs Mara reaction;
2. generic acknowledgement vs contextual acknowledgement;
3. praise vs teasing vs neutral where preference permits;
4. immediate payoff vs delayed fulfillment;
5. payoff vs payoff + later callback.

## Metrics

Momentum:
- commercial moment → offer open;
- offer → intent/checkout;
- abandonment after offer;
- Purchase Resume Success;
- Post-Purchase Continuation Rate;
- Commercial Inertia.

Reward:
- reward delivery;
- qualitative reaction;
- return after reward;
- second purchase after reward.

Scarcity:
- limited vs evergreen conversion;
- drop-window return;
- collection attach/completion;
- custom-slot demand;
- scarcity frustration/support.

Repeat:
- first→second payer;
- time to second purchase;
- continuation attach;
- voice attach;
- personalization attach;
- collection attach.

## Permanent boundaries

- **Scarcity must be true.**
- **Mara may create relational friction; commerce may not cause relational punishment.**
- **Reward should feel earned.**
- **Money buys product scope/access/experience, not baseline affection/respect/emotional stability.**
- **Never end the experience at checkout.**
- **Post-purchase is part of product design.**
- **My History compounds ownership and shared product history, never emotional debt.**

## Build trigger

Keep P0 as structured data, local state and deterministic rules.

Do not build wallets, stored payment credentials, realtime commerce orchestration, complex inventory services or automated commercial recommenders until:
1. real payments are separately authorized/compliant;
2. premium intent or purchase data validates the moments;
3. first→second pathways show value;
4. scarcity/collection mechanics improve healthy economics without trust damage;
5. manual operations are a measured bottleneck;
6. Traction → Investment Gate or explicit founder authorization supports the cost.
