# Mara Vera — Private Participation / Caprichos / World Funding

## Status

Authoritative product architecture for user-funded `Caprichos` and other Mara World goals.

This document defines how users can privately contribute to goals that materially change Mara's world while preserving privacy, trust, relationship boundaries and commercial integrity.

It does **not** authorize real payments, fundraising, public launch, merchant onboarding, purchase of physical assets or real scarcity.

## Core thesis

Mara can create goals around things she wants or wants to add to her world:

- fashion;
- beauty;
- accessories;
- production assets;
- locations/experiences;
- larger Mara World assets;
- eventually major goals such as a vehicle.

Users may choose to contribute toward those goals.

If the goal is fulfilled, the money must produce the stated real-world or production consequence and that consequence should enter Mara's canonical world.

The durable loop is:

**Mara wants → private contribution → aggregate progress → funded → real acquisition/production → Mara reacts → asset enters canon → future experiences use it → contributor receives grounded callback/history → next goal becomes more credible.**

The user should feel:

> **I helped make something in Mara's world real.**

Not:

> I publicly paid for attention.

## Private participation, public aggregate

Permanent principle:

> **Participation is private by default; progress can be public in aggregate.**

The public/communal surface may show:

- goal amount;
- funded amount;
- percentage complete;
- aggregate contributor count where useful;
- winning option/team totals where a race is part of the product;
- goal status;
- eventual outcome.

It should **not** expose by default:

- contributor real name;
- username tied to adult activity;
- exact individual contribution;
- payment history;
- lifetime spend;
- ranking by spend;
- private fantasy/preferences;
- relationship state.

A contribution should never create a public proof that the user participates in adult relationship entertainment.

## Private Mara vs Mara's World

Maintain two distinct psychological spaces.

### Private Mara

The user's private relationship/interaction layer:

- conversation;
- voice;
- Preference Graph;
- Relationship Memory;
- My History with Mara;
- private callbacks;
- personal experiences;
- paid continuations.

### Mara's World

Shared/aggregate world-building surfaces:

- Caprichos;
- goals;
- team races;
- world assets;
- collective milestones;
- public aggregate progress;
- completed goal history.

The user can participate in Mara's World without becoming publicly visible to other users.

The communal mechanic should not destroy the private feeling of `Mara and me`.

## Usage context: arousal, desire and loneliness

Mara may naturally be used when an adult user is:

- sexually aroused;
- seeking fantasy;
- bored;
- curious;
- wanting private entertainment;
- wanting company;
- feeling alone.

This can be a legitimate **user-initiated context of use**.

It must not become a vulnerability monetization system.

Permanent rule:

> **Serve the moment; do not exploit the state.**

Allowed:

- user opens Mara voluntarily while aroused and accesses adult-mode experiences they have opted into;
- user voluntarily opens Caprichos and contributes;
- Mara offers relevant experiences under ordinary transparent commercial rules;
- the product remembers product/format preferences where permitted and consented.

Not allowed:

- infer `lonely`, `desperate`, `emotionally dependent`, `distressed` or similar as a monetization segment;
- raise prices because the user appears aroused/lonely;
- increase offer frequency because the user appears vulnerable;
- trigger a Goal because the system predicts emotional weakness;
- imply Mara will withdraw affection if the user does not contribute;
- target a user with `you need me tonight` style purchase pressure based on inferred loneliness;
- optimize individual contribution amount against emotional dependence or sexual arousal.

Relationship state and commercial state remain separate.

## Privacy UX principles

### 1. No public contributor identity by default

Contribution should be private unless the user explicitly chooses a public alias or public participation feature later.

The safe default is anonymous aggregate participation.

### 2. No spend leaderboard

Do not rank users by:

- dollars contributed;
- lifetime spend;
- largest gift;
- highest monthly spend.

Competition should occur through product choices, teams, milestones and collective progress — not a public contest for Mara's affection.

### 3. Private status can exist

The user's own account/history may privately show:

- `I helped fund this`;
- contributor badge;
- first-mover status;
- completed goals participated in;
- Mara World assets the user helped create;
- contributor-only callbacks/rewards.

This status is private unless explicitly shared.

### 4. Discreet communications

Future notifications/email should avoid exposing adult/private participation on lock screens or inbox subject lines by default.

Examples of neutral surfaces:

- `Mara has an update`;
- `Something changed in your Mara history`;
- `A goal you joined was completed`.

Do not put explicit fantasy text, sexual preference labels or contribution amounts in push previews.

### 5. Discreet transaction presentation

A future payment descriptor should be as discreet as legally/provider-permitted while still being recognizable enough to avoid chargeback confusion.

Do not use deliberately misleading descriptors.

### 6. No social graph leakage

Do not expose:

- who else the user follows;
- who else contributed;
- whether two known users participate;
- contact-book matching;
- workplace/friend recommendations.

Mara should not accidentally out adult participation through social discovery.

## Caprichos taxonomy

### Caprichos

Character/world wants:

- bag;
- perfume;
- outfit;
- watch;
- jewelry;
- shoes;
- beauty/fashion objects.

### Mara's World

Environmental/world assets:

- furniture;
- mirror;
- room/set objects;
- travel/locations;
- decor;
- recurring props.

### Make Mara Better

Production assets where the community can visibly fund a product improvement:

- camera;
- lens;
- microphone;
- lighting;
- production setup;
- approved voice production;
- selected software/hardware only when genuinely used for Mara.

### Mara Garage / Big Goals

Large real-world assets:

- car;
- motorcycle;
- bicycle;
- major travel/production asset;
- other high-value Mara World asset.

Big Goals require much stronger fulfillment, accounting, consumer, processor and disclosure review before activation.

## Real-world acquisition rule

When a Goal says contributions are funding a physical asset, the stated asset must genuinely be acquired or the pre-disclosed failure/refund alternative must apply.

Permanent principle:

> **Anything funded in Mara's name must genuinely enter Mara's business, world or production.**

The founder/operator may choose among legitimate Mara-relevant assets in ways that also make operational/personal sense, but the Mara narrative must not be used as a false pretext to fund unrelated personal consumption.

Example:

Valid:
- Goal funds a specific camera;
- camera is bought;
- camera is used for Mara production;
- improvement becomes visible.

Invalid:
- Goal says it funds a Mara camera;
- money is used for an unrelated personal purchase.

## Mara World Asset lifecycle

Suggested states:

```text
wanted
→ funding
→ funded
→ acquiring
→ acquired
→ canonical
→ active
→ archived
→ sold/disposed
```

Every funded physical/digital world asset should have a record such as:

```text
id
name
type
physical
funding_goal
funded_amount
acquisition_cost
status
acquired_at
canonical_since
reference_pack_status
fantasy_eligible
life_engine_eligible
contributors_count
contributor_payoff
appearances
archive_status
```

No public user identity is required in the World Asset record.

## Goal contract

Before accepting the first real contribution, freeze the material commercial promise:

- what the goal funds;
- target amount;
- minimum contribution if any;
- whether tax/shipping/processing/production are included;
- what happens at 100%;
- whether contributions close automatically at 100%;
- what contributors receive;
- ownership/access terms;
- what happens if the item becomes unavailable;
- what happens if the goal cannot be completed;
- refund/credit/carry-forward rules where applicable;
- expected world/canon integration;
- whether voting/agency is included.

Do not materially change these terms after real contributions begin without a compliant explicit remedy.

## Funding completion

Recommended early behavior:

**100% target → contributions close.**

Do not silently overfund a goal unless the user-visible rules explicitly define what happens to excess contributions.

For large goals, the target may represent the `community contribution target` rather than 100% of total acquisition cost, but this must be explicit before contributions open.

Example:

> Community goal: US$5,000 toward Mara's car. Mara's operating company funds the remaining acquisition cost.

## Contributor payoff

A contribution should produce a real product consequence beyond the aggregate counter.

Potential contributor payoff:

- first look;
- contributor-only reveal;
- short voice/update;
- private collectible in `My History with Mara`;
- contributor vote;
- early access;
- callback once the asset appears;
- `I helped make this happen` private history marker.

Do not make contributor payoff equal to additional baseline affection.

## Contribution → agency

Useful mechanic:

> **Contribute → get a say.**

Potential votes:

- color;
- model among pre-approved choices;
- first outfit;
- first scenario;
- first appearance;
- which of two eligible assets gets funded first.

One contribution can unlock participation without making votes proportional to spend.

This preserves competition while reducing wealth-based dominance.

## Competition architecture

Competition should primarily be:

- option vs option;
- team vs team;
- goal vs goal;
- milestone races;
- first funded;
- collective progress.

Examples:

- black bag vs red bag;
- black car vs silver car;
- hotel A vs hotel B;
- outfit A vs outfit B.

The public may see aggregate totals.

Individual contributors remain private.

Avoid:

- top spender leaderboard;
- `Mara likes #1 contributor more`;
- exclusive emotional treatment for highest payer;
- spending-based jealousy or rejection;
- public lifetime spend status.

## First-mover / private collectibles

A user can privately receive status such as:

- Founding Contributor;
- First 50;
- Garage Crew;
- Night Series Contributor;
- World Builder.

These can create identity and history without publicly outing participation.

## Life Engine integration

Caprichos should emerge from Mara's fictional life naturally.

Good:

> `I saw this bag and now I can't stop thinking about it.`

Then later it becomes a goal.

Bad:

Every Life Event automatically becomes a funding ask.

Life Engine remains mostly non-commercial.

Suggested test:

> **Would this event still exist if there were nothing to sell?**

If no, the event is likely commerce pretending to be life.

## Fantasy Compiler integration

A funded asset can become an eligible Experience Vector input once canonical.

Example:

```text
black_bag_01
→ canonical world asset
→ available to visual/story/voice experiences
→ callback eligible for contributors
```

The asset can then appear in:

- future stories;
- visual content;
- roleplay contexts;
- drops;
- voice callbacks;
- private history;
- recurring narrative.

The user sees causal continuity:

**we funded it → it exists → Mara uses it → it returns later.**

## Physical asset reference packs

Physical assets can improve visual consistency.

For selected Mara World assets:

- photograph the real object from multiple angles;
- capture identifying non-sensitive details;
- create a canonical reference pack;
- use that pack in approved image/video workflows;
- track appearance consistency.

This means Caprichos can fund part of Mara's proprietary visual asset library.

## Archive / provenance

A real physical World Asset can accumulate provenance:

- when funded;
- when acquired;
- which canonical content it appeared in;
- which drops/experiences used it;
- when archived.

A future `Mara Archive` sale may be possible for genuine physical production assets if legally/commercially appropriate and clearly described.

Do not claim provenance that cannot be substantiated.

## Operator privacy / brand separation

Publicly, Mara is the brand, character and experience.

The founder/operator does not need to become part of the public narrative.

However:

> **Founder invisibility is not legal nonexistence.**

Where law, tax, invoicing, payment processing, terms, privacy or consumer disclosure requires an operator/legal entity, the actual responsible entity must be disclosed appropriately.

The public brand surface can remain `Mara Vera` while the legal/commercial footer and transaction documents identify the responsible operator/entity as required.

Do not falsely claim that Mara herself is the legal owner, taxpayer, contracting entity or physical recipient where that is not true.

## Analytics/privacy boundary

Generic analytics may track aggregate product events such as:

- goal_viewed;
- contribution_intent;
- contribution_completed after real authorization;
- goal_completed;
- contributor_vote;
- world_asset_revealed;
- contributor_callback_opened.

Do not put into generic analytics:

- raw intimate conversation;
- inferred loneliness;
- arousal state;
- emotional dependency;
- sexual preference text;
- public contributor identity;
- full payment details.

Commercial/payment records belong in the appropriately protected transaction system, not the general analytics stream.

## P0 / pre-payment test

Before real money:

- create 1–3 mock Caprichos;
- show aggregate progress as explicitly prototype/test data;
- test whether users understand the mechanism;
- test private contribution intent;
- test `contribute → get a say`;
- test whether funded-world consequence increases desire to return;
- test whether users care about private history/collectible status;
- test whether community framing harms the private Mara feeling.

Do not present mock progress as real money raised.

## Success criteria

Caprichos should only progress toward real activation if users demonstrate that they value:

- helping change Mara's world;
- seeing concrete consequences;
- private participation;
- contributor-only history/callbacks;
- voting/agency;
- future experiences using funded assets.

The mechanic is weak if users perceive it as:

- begging;
- fake wishlist theater;
- public embarrassment;
- buying Mara's affection;
- funding unrelated operator consumption;
- arbitrary gamification.

## Permanent principles

> **PRIVATE PARTICIPATION, PUBLIC AGGREGATE.**

> **SERVE THE MOMENT; DO NOT EXPLOIT THE STATE.**

> **USERS CAN HELP SHAPE MARA'S WORLD WITHOUT PUBLICLY REVEALING THAT THEY PARTICIPATE.**

> **MONEY CAN CHANGE THE WORLD ASSET / PRODUCT ENTITLEMENT. IT CANNOT BUY MARA'S BASELINE AFFECTION.**

> **ANYTHING FUNDED IN MARA'S NAME MUST GENUINELY ENTER MARA'S BUSINESS, WORLD OR PRODUCTION.**
