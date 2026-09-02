# Mara Vera — Desire Routing / Audience Segmentation Architecture

Last reviewed: 2026-09-02

## Status

Authoritative routing layer for adapting Mara's acquisition, presentation, Caprichos, Fantasy entry and interaction to different user desires **without creating multiple incompatible Maras or a second preference profile**.

This layer consumes filtered, consent-compatible signals from the existing Preference Graph, Desire Discovery, Context Builder and current-session choices. It then produces a temporary `surface_plan` for the current context.

It does not own durable memory, pricing, Relationship State or raw adult-sensitive data.

## Core thesis

> **ONE MARA. MANY DESIRE ROUTES.**

Mara's identity, taste, voice, life canon, boundaries and baseline personality remain coherent.

What adapts is how that same Mara is framed and which part of her world becomes most relevant first.

A user who strongly prefers consensual domination should not receive the same first page, Capricho ordering, fantasy entry or interaction cadence as a user who prefers authority roleplay, romance, taboo fiction, object-focused fetishes or world-building/collector participation.

The product should feel personally relevant before it feels like a catalog.

## Important distinction

Segmentation is not:

- `this person IS a findom user`;
- `this person IS submissive`;
- `this person IS lonely`;
- a psychological diagnosis;
- a vulnerability score;
- a reason to change equivalent-SKU pricing.

Segmentation is:

> **For this surface and moment, which eligible desire lane is most likely to make Mara feel relevant?**

A user can have several lanes with different confidence and context.

## Invariant Mara layer

Never segment away:

- Mara's canonical identity;
- adult age;
- core physical identity;
- voice identity;
- self-possession;
- taste;
- life canon;
- baseline respect;
- boundaries/consent;
- AI disclosure;
- legal/commercial truthfulness.

Mara does not become a different fictional person for each segment.

## Adaptive layer

The routing layer may adapt:

- acquisition creative;
- landing-page hero framing;
- visual crop / editorial direction;
- copy tone;
- CTA wording;
- first playable question;
- Fantasy family ranking;
- format ranking (voice/image/story/etc.);
- Mara interaction energy within canonical range;
- reward style where eligible;
- Capricho ordering;
- World Asset relevance;
- collection ordering;
- next-best experience;
- optional public-safe campaign destination.

Pricing remains governed by transparent SKU/cohort rules, not hidden individual vulnerability pricing.

## Desire lanes

The initial architecture should use a small set of reusable lanes rather than hundreds of fetish labels.

### 1. Control / Submission

Potential signals:
- Mara leads;
- commands/challenges;
- praise;
- selective/light-dominant energy;
- structured agency surrender where explicitly chosen.

Surface direction:
- stronger Mara POV;
- fewer explanatory words;
- decisive CTAs;
- voice-first opportunities;
- challenge/reward cadence.

### 2. Financial Domination Fantasy

This is a **consensual adult fantasy lane**, not permission to exploit real financial vulnerability.

Potential fantasy/product signals:
- luxury/status symbolism;
- controlled tribute-themed roleplay;
- selective, expensive-taste Mara framing;
- ritual, obedience and status themes;
- Caprichos with high symbolic relevance.

Commercial boundary:

> **THE FANTASY MAY BE FINDOM. THE PAYMENT SYSTEM MAY NOT BECOME FINANCIAL EXPLOITATION.**

Therefore:
- equivalent SKUs keep transparent cohort pricing;
- do not raise prices because a user appears submissive/aroused;
- do not infer debt tolerance;
- do not encourage borrowing;
- do not use actual payment refusal to withdraw affection;
- do not make relationship warmth proportional to spend;
- high-value contributions retain explicit confirmation/friction;
- real Caprichos still follow goal contracts and truthful fulfillment.

Mara can sell a defined findom-themed experience, voice, ritual, collection or fantasy when eligible. That is different from manipulating the user's real finances.

### 3. Authority / Power Roleplay

Examples:
- boss/employee;
- trainer/athlete;
- teacher-like authority only where all characters are clearly adults and provider rules permit;
- other adult professional/power contexts.

Surface direction:
- office/editorial visual cues;
- structured tasks;
- voice notes;
- performance/challenge language;
- authority-driven Fantasy entries.

### 4. Taboo / Forbidden Fiction

Adult fictional taboo themes may exist only when all depicted/roleplayed participants are unambiguously adults, consent rules are satisfied and the actual provider/payment/content policy permits the specific category.

This may include fictional forbidden-relationship framing or adult family-roleplay themes where lawful/provider-permitted.

Do not use minors, age ambiguity, real relatives, non-consensual real-person scenarios or provider-prohibited categories.

Surface direction should remain discreet; sensitive labels should not leak into URLs, notifications, analytics or public profile surfaces.

### 5. Romance / Intimacy / Continuity

Potential signals:
- voice;
- callbacks;
- slow build;
- affection;
- daily-life continuity;
- emotional/narrative relevance.

This lane should monetize richer experiences/continuity without dependency pressure.

### 6. Tease / Voyeur / Visual Tension

Potential signals:
- visual reveal pacing;
- anticipation;
- outfit/lifestyle moments;
- partial reveal;
- story/photo sequence.

### 7. Object / Fetish Focus

Examples may include:
- feet;
- footwear;
- perfume/sensory focus;
- lingerie/object focus;
- consensual pee-play or other eligible niche adult interests.

These are opt-in adult-sensitive preferences and should be routed conservatively.

World Asset Fantasy Affordances are particularly important here: an object can become an active part of an eligible fantasy rather than mere decoration.

### 8. World Builder / Collector

Potential signals:
- Caprichos;
- completion;
- badges;
- provenance;
- collections;
- voting;
- helping shape Mara's world.

Surface direction:
- goals/progress/history;
- World Asset reveals;
- contributor callbacks;
- Archive/provenance.

## Multi-lane model

Never force a user into one permanent segment.

A temporary routing projection can be:

```yaml
desire_route:
  primary: authority_power
  secondary:
    - voice
    - world_builder
  explore:
    - control_submission
  confidence: medium
  context: private_evening
```

Another moment may produce a different route.

## Signal hierarchy

Use, in order:

1. explicit current-session choice;
2. explicit Preference Graph confirmation;
3. repeated recent behavior;
4. contextual inferred fit;
5. bounded exploration.

Never let one click permanently define a segment.

## First-session discovery

Do not begin with a clinical fetish questionnaire.

Use playful, low-friction choices that reveal intent indirectly but transparently enough for correction.

Example structure:

> What sounds more like your kind of trouble tonight?

- `I want Mara to take control.`
- `Give me a situation that feels forbidden.`
- `I want something that feels personal.`

Then progressively refine.

Users can always choose `Surprise me` or correct Mara.

## Surface Plan

The router should output a temporary plan rather than mutate the whole product.

Conceptual shape:

```yaml
surface_plan:
  lane: authority_power
  hero_tone: controlled
  visual_direction: office_editorial
  primary_cta: enter_scenario
  first_experience_family: authority_roleplay
  preferred_format: voice
  capricho_order:
    - black_bag_01
    - car_01
  reward_style: challenge
```

This object is ephemeral and derived.

## Landing-page personalization

### Anonymous / unknown visitor

Use broad Mara brand positioning.

Do not guess sensitive sexual interests from external ad-tech data.

### Known consented user

After Mara has enough first-party evidence, the returning experience may reorder:
- hero module;
- featured experience;
- Capricho;
- voice/story emphasis;
- collections.

Do not put sensitive lane names in:
- browser title;
- push notification;
- email subject;
- share-card metadata;
- public URL slug;
- generic analytics event names.

Use opaque internal route IDs where needed.

## Acquisition routing

Different acquisition creatives may legitimately emphasize different Mara strengths, but all must resolve back to the same canonical Mara.

Examples:
- control-focused creative → control-oriented first experience;
- luxury/status creative → eligible financial-domination fantasy entry;
- office creative → authority roleplay entry;
- intimacy/voice creative → continuity/voice entry;
- Caprichos creative → World Builder entry.

Do not create fake identities or contradictory backstories for each campaign.

## Caprichos segmentation

Caprichos should be ranked by desire relevance, not shown identically to everyone.

Examples:

- luxury/status / findom-fantasy affinity → fashion, jewelry, car or premium World Assets may rank higher;
- object/fetish affinity → eligible fashion/accessory World Assets with relevant Fantasy Affordances may rank higher;
- World Builder affinity → provenance, completion and community consequence rank higher;
- authority lane → assets usable in office/power scenarios may rank higher;
- intimacy lane → assets with stronger shared-history/callback value may rank higher.

Rules:
- the underlying Goal target and terms do not change by user lane;
- no fake scarcity per segment;
- no hidden higher target because a segment spends more;
- ranking may personalize; truth may not.

## Interaction segmentation

Same Mara, different eligible expression.

Control-preferring user:
- Mara leads more often;
- fewer permissionless over-explanations;
- more challenges/rewards within consent.

Authority-roleplay user:
- scenario framing and structured tasks rank higher.

Intimacy user:
- callbacks, voice and continuity rank higher.

Object/fetish user:
- eligible World Assets become active Fantasy objects more often.

World Builder user:
- Mara references goals, provenance and `you helped make this happen` moments more often.

## Commerce segmentation

Segment relevance may determine **which eligible product** is highlighted first.

Examples:
- voice lover → voice continuation;
- agency/control lover → branching/control experience;
- collector → collection/ownership surface;
- World Builder → Capricho contribution surface;
- findom-fantasy lane → defined consensual findom-themed experience/ritual SKU where permitted.

It must not determine a hidden individualized price for the same equivalent SKU.

## Findom-specific commercial firewall

Because financial domination intentionally eroticizes money/control, it requires a stronger separation between fantasy and real commercial pressure.

Maintain two records:

```text
fantasy_preference: financial_domination
```

and separately:

```text
commercial_state: ordinary transparent commerce
```

Never derive:

```text
financial_domination_preference → higher willingness_to_pay → personalized higher price/pressure
```

The fantasy can be intense. The commercial contract must remain clear.

## Privacy / sensitive segmentation

Sexual desire lanes are `adult_sensitive`.

Store only structured signals necessary for personalization.

Do not send raw lane labels to generic third-party analytics.

Do not expose them publicly.

Do not use them for ad retargeting without an explicit future privacy/legal review.

## Correction

Mara should make segmentation feel fluid.

Examples:
- `Eso no era lo tuyo. Cambio de dirección.`
- `Ok, esto sí te movió más.`

The user must be able to reject, correct or reset adult-sensitive routing.

## Segment × Surface Matrix

P0 should explicitly test that segmentation changes more than chat copy.

| Surface | What can adapt |
| --- | --- |
| Home/entry | hero framing, visual direction, CTA |
| First Living Experience | first choice set, Mara energy, scenario family |
| Fantasy Compiler | candidate eligibility/ranking |
| Voice | tone/cadence within canonical Mara |
| Caprichos | ordering, featured World Asset, payoff framing |
| Collections | ordering and emphasis |
| Commerce | eligible SKU highlighted first |
| My History | relevant callbacks |
| Return experience | next-best route |

## Metrics

Measure per lane/surface:
- entry → experience start;
- experience completion;
- Mara Guess Accuracy;
- correction/rejection;
- premium intent;
- contribution intent;
- post-offer continuation;
- return rate;
- second-purchase potential;
- negative/creepy reaction.

Revenue can be compared by lane, but do not optimize a sensitive lane solely for maximum extraction.

## P0 recommendation

Do not build a full personalization backend.

Create a deterministic DEV routing fixture with 4–5 representative lanes and show how the same Mara changes across:
1. hero/entry;
2. first experience;
3. featured Capricho;
4. interaction tone;
5. commercial surface.

The goal is to prove:

> **segmentation materially improves relevance without fracturing Mara's identity.**

## Permanent principles

> **ONE MARA. MANY DESIRE ROUTES.**

> **SEGMENT THE EXPERIENCE, NOT MARA'S CORE IDENTITY.**

> **ROUTE BY DESIRE; NEVER PRICE OR PRESSURE BY VULNERABILITY.**

> **SENSITIVE SEGMENTS ARE PRIVATE, CORRECTABLE AND CONTEXTUAL.**

> **CAPRICHOS MAY BE RANKED BY FIT; THEIR TRUE TERMS DO NOT CHANGE BY SEGMENT.**

> **THE FANTASY MAY BE FINANCIAL DOMINATION. THE REAL COMMERCE MUST REMAIN TRANSPARENT AND VOLUNTARY.**
