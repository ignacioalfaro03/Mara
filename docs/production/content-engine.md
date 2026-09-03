# Mara Vera — Content & Production Engine v1.0

## Status

Launch-stage operating system. Manual-first and zero-cost-first by design.

## Objective

Produce a coherent, recognizable and commercially useful Mara Vera repeatedly without turning production into a collection of disconnected prompts, paid SaaS subscriptions or one-off hero generations.

The launch objective is not maximum automation.

It is:

**consistent quality + learning speed + near-zero OPEX + measurable output**.

## Core production principle

The technology generates Mara, but the technology is not Mara.

All providers sit underneath a stable Mara Core:

- Character Bible;
- Visual Bible;
- Voice Bible;
- canonical identity references;
- story state;
- content objective;
- quality gates.

Providers may change without changing the character.

## Canonical Identity Pack

Before scaled content production, establish an approved reference pack rather than regenerating Mara from prose every time.

The pack should progressively contain:

- canonical face references;
- full-body references;
- profile / three-quarter references;
- neutral expression;
- smile;
- laugh;
- serious / focused expression;
- playful expression;
- representative day styling;
- representative gym styling;
- representative night styling;
- core environments;
- voice canonical samples once selected.

Only approved assets can become identity references.

A visually impressive but off-identity output must never be promoted into the canonical pack.

## World consistency

The existing Visual Bible defines Mara's recurring environments and aesthetic. Production should reuse those settings often enough to create recognizable continuity.

Maintain a lightweight World Bible containing approved references for recurring locations, wardrobe families and objects when they become established.

Priority is not photorealism in isolation. It is the perception that Mara occupies the same coherent world over time.

## Story State

Maintain a lightweight current-state record for content planning. It may include:

- recent public activities;
- recent outfits;
- recurring locations;
- open story threads;
- current mood / energy;
- running jokes;
- recent audience interactions worth continuing;
- content already published or scheduled.

Do not invent sensitive real-world claims about a real person. Mara is a disclosed fictional synthetic character.

## Content brief schema

Every production request should be reducible to:

- objective: reach / engagement / profile visit / web click / conversion / retention;
- platform;
- format;
- content pillar;
- story-state context;
- visual mode;
- environment;
- wardrobe;
- mood;
- hook;
- CTA if any;
- required voice mode if spoken;
- canonical references;
- platform/compliance constraints.

If the objective is unclear, the asset should not enter production merely to fill a calendar.

## Manual-first workflow

### Still image

**brief → canonical references → generate/edit → identity QA → realism QA → platform QA → approve/reject → record metrics**

Prefer editing a strong approved Mara asset when the required change is local. Do not regenerate the entire character unnecessarily.

### Lifestyle video

**brief → reference assets → motion/video generation → identity/physics QA → edit → approve/reject → record metrics**

### Talking Mara

**brief → script → personality pass → voice generation → voice approval → video/avatar animation → lip-sync/facial QA → approve/reject → record metrics**

Audio is canonical. The video engine must not redefine Mara's voice.

## Content pillars — experimental

Test rather than assume:

- lifestyle;
- outfit / getting ready;
- fitness;
- humor;
- routines;
- food / café;
- reflections;
- relationships / opinions;
- POV;
- conversational clips;
- trends;
- aspirational moments;
- behind-the-character content;
- audience interaction.

Attraction is useful for acquisition. Dimensionality is required for retention.

Do not collapse the public character into a continuous premium-content advertisement.

## Production economics

### CPAA — Cost Per Approved Asset

**CPAA = total generation + editing + retry cost / approved publishable assets**

Example:

- 10 generations at $0.50 = $5.00;
- only 2 are publishable;
- CPAA = $2.50.

This is more useful than nominal cost per generation.

During the zero-cost phase, CPAA should remain approximately $0 by relying on free allowances and already-available tools.

### TPAA — Time Per Approved Asset

**TPAA = total human production time / approved publishable assets**

Track TPAA even when founder time is not booked as cash OPEX. It exposes workflows that are technically free but operationally wasteful.

### Approval Yield

**Approval Yield = approved assets / total generated candidates**

A cheap provider with poor approval yield may be more expensive operationally than a higher nominal-cost provider later.

## Minimum production log

For every batch, record at least:

- date;
- provider/model;
- format;
- content pillar;
- number of generations;
- number approved;
- direct cost;
- production minutes;
- main rejection reasons;
- published asset ID/URL when applicable;
- performance metrics after publishing.

A spreadsheet is sufficient at launch. Do not build a production database before volume requires it.

## Quality gates

### Visual identity

- unmistakably Mara;
- same adult face family;
- same canonical body archetype;
- stable hair/skin family;
- realistic hands, teeth, anatomy, clothing and objects;
- no identifiable real-person imitation;
- coherent with approved Mara references.

### World/story

- no accidental location/object drift when continuity matters;
- no contradiction with active story state;
- wardrobe and styling belong to Mara's established vocabulary.

### Voice

- passes Voice Bible QA;
- same voice identity;
- no TTS/announcer feel;
- commercial rights verified before monetized use.

### Business

- explicit objective;
- platform fit;
- expected funnel action or learning;
- no vanity production solely to increase asset count.

## Zero-cost launch operating rules

1. Use tools already available before opening a new account.
2. Use free tiers and free credits before paid tiers.
3. Do not enter a payment method for an auto-converting trial without explicit founder approval.
4. Use manual editing/selection before buying automation.
5. Use internal tests when a free tier lacks commercial rights.
6. Do not publish assets commercially unless provider rights permit it.
7. Do not buy a subscription to solve a quality problem until the benchmark proves that provider materially improves approval yield or business outcomes.
8. Do not buy scale before there is demand to scale.

## Automation trigger

Automate only after a repeated manual workflow demonstrates all three:

1. it happens often enough to matter;
2. its current TPAA is a real bottleneck;
3. automation has a measurable cost/benefit hypothesis.

Do not automate uncertainty.

## Provider abstraction

Future code should treat provider calls as adapters behind stable business concepts:

- `ImageProvider`;
- `ImageEditor`;
- `VideoProvider`;
- `VoiceProvider`;
- `RealtimeVoiceProvider`;
- `AvatarProvider`.

Provider-specific settings must not leak into Mara's permanent identity specification.

## Launch success criterion

The Content Engine is working when Mara can publish repeatedly while:

- remaining recognizable;
- sounding consistent;
- preserving narrative continuity;
- generating measurable audience/business learning;
- keeping direct OPEX near zero before traction;
- making it easy to replace the underlying model when the market changes.
