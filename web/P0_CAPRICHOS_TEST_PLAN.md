# Mara Vera — P0 Caprichos Test Plan

## Purpose

Validate whether `Caprichos` feels like **participating in Mara's evolving world** rather than tipping, begging, a generic wishlist or public adult-profile exposure.

P0 is zero-payment and DEV-only.

No real contribution, pledge, crowdfunding, merchant processing, physical acquisition, public launch, raffle or fractional ownership is active.

## Canonical route

Use:

`/experience/caprichos-lab`

The lab contains three controlled examples:

1. `black_bag_01` — small personal Capricho / fashion World Asset.
2. `camera_01` — `Make Mara Better` production asset.
3. `car_01` — Big Goal / Mara Garage concept with company co-funding and a Black vs Silver team race.

All visible progress is explicitly labeled prototype data / not real money.

## Four hypotheses

Test these independently where possible.

### H1 — World-building desire

Does the user want to help make a concrete Mara World outcome happen?

Signal:
- `contribution_intent`;
- qualitative explanation is about the outcome/world, not pity or financial rescue.

### H2 — Private competition / agency

Does team/vote participation add energy without making the user feel publicly exposed?

Signals:
- `team_selected`;
- `vote_cast`;
- user cares which option wins;
- user understands one tester/contributor = one vote in P0.

### H3 — Privacy / alias fit

Does `anonymous` or a pseudonymous Mara alias make participation feel safe enough?

Signals:
- `alias_visibility_selected`;
- `amount_visibility_selected`;
- user can explain what other users would and would not see.

The alias itself is deliberately not copied into the generic P0 analytics log.

### H4 — Consequence / continuity

Does the user care that a completed Goal becomes a canonical World Asset and later reappears?

Signals:
- `goal_completion_simulated`;
- `world_asset_reveal_viewed`;
- `contributor_history_viewed`;
- user values `Tú tuviste algo que ver con esto` because it refers to a real participation event.

## Core rule — intent is not money

Clicking `I would contribute`:

- does not move the public progress counter;
- does not create revenue;
- does not create entitlement;
- does not count as a payment or pledge;
- only records stated contribution intent.

The prototype aggregate counter is fixture data and remains unchanged.

This prevents the P0 from training a false mental model where stated willingness becomes funded progress.

## Privacy test

Ask the tester to explain the model after using it.

Desired answer should approximate:

> `Other people can see the Goal/progress/team. They do not have to know who I am. I can participate anonymously or use an alias. My legal/payment identity is not my public Mara identity.`

Failure signals:
- assumes real name will appear;
- thinks other users can see private Mara conversations/preferences;
- thinks lifetime spend is public;
- believes alias must be tied to social accounts;
- fears friends/contact-book discovery.

## Alias test

Test both:

- anonymous default;
- optional alias such as `Ghost27`.

Questions:
1. Would you use an alias here?
2. Would you ever want your amount public?
3. Would you want the same alias across multiple Goals?
4. Would badges such as `Garage Crew` be useful if they remain private/pseudonymous?

Do not ask for a real identity.

## Goal comparison

### Black Bag

Tests:
- simple desire;
- comprehensible physical consequence;
- Fantasy/content reuse;
- low cognitive load.

Ask:
- does this feel like Mara wanting something or like the company asking for money?
- does future reuse make contributing more valuable?

### Camera

Tests:
- whether users accept an operational asset as a Mara Goal;
- `Make Mara Better` value;
- visible product improvement.

Ask:
- would you contribute to improve Mara's production, or only to personal Caprichos?
- what proof of improvement would you expect?

### Car

Tests concept only:
- large-goal credibility;
- co-funding comprehension;
- Team Black vs Team Silver;
- privacy under more competitive framing.

Do not use P0 response as evidence that a real car Goal is ready.

Ask:
- does community target + company co-funding feel clearer than asking the community to fund everything?
- would you revisit to see which team is winning?
- at what size does the Goal begin to feel ridiculous/untrustworthy without a fulfillment history?

## Completion simulation

`Simulate 100% → World Asset (DEV)` is a separate test from contribution intent.

It represents:

**funding closes → cleared-funds gate → acquisition/production → reveal → World Asset becomes canonical**.

The simulation does not imply that money exists or that an item was bought.

After completion, test whether the contributor-specific callback adds value:

> `Tú tuviste algo que ver con esto.`

It should feel grounded because participation actually happened in the P0 session.

## World Asset test

Users should understand that a future real asset can become reusable across:

- Life Engine callbacks;
- images/video;
- Fantasy Compiler;
- stories;
- My History;
- future Drops.

The key perceived value is causal continuity:

> `we helped make it happen → it became real → Mara uses it later`.

## Competition guardrail test

Test whether the team race is motivating without requiring a spend leaderboard.

Desired:
- wants Team Black/Silver to win;
- may want to share the Goal;
- does not need to know top spender identities.

Reject mechanics that only become compelling when:
- spending rank buys Mara affection;
- users fear being replaced;
- amount visibility becomes mandatory;
- paid random rewards are introduced.

## No-gambling boundary

P0 has no paid random reward.

Do not test:
- contribute for a chance to win an asset;
- raffle tickets;
- loot-box rewards;
- random contributor prize selection tied to payment.

Any future chance-based mechanic requires separate legal review.

## Big Goal / TCO interview

For advanced testers, explain that a real car also has insurance, maintenance, registration, depreciation and other operating costs.

Question:

> Does knowing Mara/company must be able to maintain the asset increase trust, reduce excitement or not matter?

The goal is to understand credibility, not to ask users to finance operating liabilities.

## Suggested first sample

Start qualitative:

- 5–8 adult testers total;
- each sees all three Goal categories in the same session;
- rotate starting Goal to reduce order bias;
- observe the first Goal that causes spontaneous `I would contribute` intent.

Then, if useful, test larger directional samples with one Goal per tester.

Do not call conversion rates from tiny P0 samples.

## Safe analytics

P0 may record:

- `capricho_viewed`;
- `goal_progress_viewed`;
- `contribution_amount_selected`;
- `alias_visibility_selected`;
- `amount_visibility_selected`;
- `team_selected`;
- `vote_cast`;
- `contribution_intent`;
- `goal_completion_simulated`;
- `world_asset_reveal_viewed`;
- `contributor_history_viewed`;
- `goal_share_intent`.

Do not add:
- raw alias to generic analytics;
- legal identity;
- conversation;
- sexual preferences;
- arousal/loneliness state;
- payment details.

## Decision framework

### Keep

Continue Caprichos if users:
- understand the physical/digital consequence;
- value private participation;
- care about seeing the asset return later;
- show real interest in at least one category;
- find teams/votes energizing without needing public spend rank.

### Iterate

If users like the concept but see it as begging/wishlist:
- change Life Engine setup;
- reduce commercial frequency;
- improve asset consequence/provenance;
- clarify contributor payoff.

If privacy is unclear:
- fix identity UX before any real-payment work.

### Kill / defer mechanic

Do not advance mechanics that require:
- fake progress;
- fake scarcity;
- public real identity;
- public lifetime spend;
- purchased affection;
- vulnerability targeting;
- paid chance/random prize;
- misleading physical claims.

## P0 success

P0 succeeds if the user can truthfully feel:

> **`Yo ayudé a que eso existiera, nadie tiene por qué saber quién soy, y ahora quiero ver qué hace Mara con eso.`**

That is the bridge from Capricho to retention, shared history and future World Asset value.
