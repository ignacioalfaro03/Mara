# Mara Vera — Caprichos World Assets / Physical-Digital Economy

Last reviewed: 2026-09-02

## Status

Operational architecture extending `private-participation-and-caprichos.md`.

This document does **not** create a new engine. It defines the physical-asset, provenance, economics and large-goal rules that Caprichos uses through the existing Life Engine, Momentum Commerce, Commercial Memory, My History and Fantasy Compiler.

It does **not** authorize real contributions, merchant onboarding, public goals, asset purchases, production deployment or spend.

## Thesis

> **Users can help build Mara's world. Something real must change when a real goal is fulfilled.**

Caprichos is not a generic wishlist or crowdfunding platform. It is a world-building layer where selected community-funded outcomes can become real production assets and later reappear in Mara's persistent fictional world.

A successful loop is:

**want → goal contract → private contribution → public aggregate progress → funded → cleared funds gate → acquisition/production → reveal → canonical World Asset → content/fantasy reuse → contributor callback → provenance → archive**.

## Mara World Asset categories

- `personal_capricho` — fashion, beauty, accessories, jewelry, bags, watches, perfume.
- `maras_world` — props, decor, furniture, set elements, luggage and recurring environmental objects.
- `make_mara_better` — cameras, lenses, microphones, lighting, workstations and production resources that visibly improve Mara.
- `mara_garage` — vehicles and other high-value recurring physical assets.
- `experience_goal` — real production expenditure such as locations, hotels, shoots and special productions.

The founder/operator may prefer assets with residual operational usefulness, but the asset must genuinely enter Mara's business, world or production. Mara cannot be used as a false pretext to finance unrelated private consumption.

## World Asset record

Conceptual source of truth:

```text
world_asset
  id
  title
  category
  physical
  canonical
  capricho_id
  acquisition_status
  acquisition_cost
  acquisition_date
  legal_owner
  funding_source
  reference_pack_status
  fantasy_eligible
  content_eligible
  affiliate_eligible
  sponsorship_eligible
  canonical_since
  appearances
  contributor_callbacks
  archive_status
  resale_status
```

`funding_source` may later be:

- community_funded;
- company_funded;
- brand_gifted;
- sponsored;
- mixed.

Do not imply sponsorship or community funding when the source is different.

## World Asset lifecycle

```text
wanted
→ funding
→ funded
→ acquiring
→ acquired
→ canonical
→ active
→ archived
→ optionally_sold_or_disposed
```

Each transition must correspond to an operationally real state.

A fictional Mara status may be immersive, but it cannot contradict the actual commercial/physical state.

## Goal lifecycle

```text
draft
→ open
→ funding
→ funded
→ clearing
→ fulfillment
→ reveal
→ canonicalized
→ lived
→ archived
```

`funded` and `cleared` are intentionally separate.

### Cash available is not cash raised

Gross checkout/contribution volume can differ from operationally safe available cash because of:

- settlement delay;
- rolling reserve;
- chargebacks/disputes;
- processor fees;
- taxes;
- refunds.

Large acquisitions should be triggered only when the goal's predefined cleared-funds rule is satisfied.

Do not represent gross funded progress as immediately spendable cash internally.

## Goal contract

Before the first real contribution, freeze the material promise:

- exact item or outcome;
- community target amount;
- what costs the target includes;
- minimum contribution if any;
- contribution/funding model;
- contributor payoff;
- whether acquisition is physical;
- legal ownership of the resulting asset;
- what happens at 100%;
- overfunding policy;
- failure policy;
- price-change policy;
- out-of-stock policy;
- refund/credit/carry-forward rules;
- expected fulfillment window;
- whether voting/agency is included;
- whether the asset becomes eligible for future Mara experiences.

Once real money has been accepted, do not materially rewrite the promise without a compliant explicit remedy.

## Target amount integrity

A target may include legitimate direct costs such as:

- product price;
- tax;
- shipping;
- customs;
- processing;
- direct production/reference capture;
- a clearly defined fulfillment buffer.

Do not hide arbitrary profit inside a false retail-cost claim.

If a US$350 item has US$30 shipping/tax and US$40 of defined production/reference capture, a US$420 goal can be coherent. Internally the breakdown must be source-of-truth even if the front-end shows it progressively.

## 100% / overfunding

P0 recommendation for a future real launch:

> **100% target → contributions close.**

`hard_close` is the simplest trust-preserving default.

Do not silently collect above the stated target. Any future overflow behavior must be defined before the first contribution.

## Goal failure

Every real goal needs a predefined failure model.

Possible future models:

- immediate capture + explicit incomplete-goal remedy;
- pledge/authorization then capture if/when goal completes, only if the actual processor supports it operationally;
- open-ended goal with no artificial deadline.

P0 does not select a processor implementation. It only models the contract.

## Out-of-stock / price changes

If the chosen object becomes unavailable or price changes materially, apply the predefined rule rather than silently substituting.

Possible remedies:

- operator covers a bounded difference;
- contributors approve a substitute among eligible choices;
- refund/credit under stated terms;
- explicit supplemental goal where compliant.

## World integration contract

A funded Capricho should normally result in:

1. completion acknowledgment;
2. acquisition/production;
3. reveal;
4. canonical World Asset entry;
5. at least one meaningful future appearance or callback where appropriate.

> **Funded assets must live.**

A user-funded asset that disappears immediately damages trust and destroys the reason Caprichos is different from a tip jar.

## Contributor payoff

The Capricho itself should provide a deterministic product consequence.

Possible included payoff:

- First Look;
- Mara reaction/voice update;
- private `I helped make this happen` history item;
- contributor vote;
- early access;
- collectible/badge;
- future grounded callback.

Do not immediately require another purchase just to receive the promised completion payoff.

Future premium experiences may still use the asset after the included payoff has been delivered.

## Private competition / aliases

The public community identity is an optional pseudonymous `Mara alias`, never the legal identity.

A user may choose per participation event:

```text
appear_as = anonymous | public_alias
show_amount = false | true
```

Recommended defaults:

```text
appear_as = anonymous
show_amount = false
```

Public aggregate can show progress, contributor count, team totals and milestones.

Public alias participation can show e.g. `Ghost27 joined Team Black` when the user opts in.

Legal name, email, payment details, intimate preferences, Relationship Memory and lifetime spend are not public community fields.

## Competition model

Preferred competition:

- team vs team;
- option vs option;
- goal vs goal;
- milestone race;
- contributor voting;
- first funded;
- private badges/streaks.

Default voting principle for early testing:

> **One qualifying contributor = one vote.**

Do not default to contribution-weighted control. Weighted voting can create whale capture and should require separate evidence before testing.

## No gambling-like mechanics

P0 and initial product design exclude paid chance.

Do not offer:

- `pay US$10 for a chance to win the bag`;
- paid random raffles;
- paid loot-box rewards;
- random selection of contributor rewards where payment purchases the chance.

Team races, deterministic milestones and deterministic contributor rewards are preferred.

Chile has specific legal regimes for raffles/sorteos, including authorized charitable/community contexts. Do not infer that a commercial Mara raffle is permitted merely because a goal mechanic exists. Any future chance-based mechanic requires separate current legal review.

Reference:
- https://www.bcn.cl/leychile/navegar?i=1078862

## Contribution does not buy affection

> **Money can change Mara's world. It cannot buy Mara's baseline affection.**

A contribution may legitimately grant a defined product entitlement, vote, early reveal, collectible or callback.

It does not increase Mara's baseline respect, emotional stability or relationship stage.

## User-state boundary

Users may voluntarily open Mara while aroused, lonely, bored, curious or seeking company/fantasy.

The product can serve the chosen experience.

It must not use inferred vulnerability as a commercial variable.

Never optimize contribution price, pressure, frequency or target based on inferred:

- loneliness;
- desperation;
- sexual arousal;
- emotional dependency;
- distress;
- intoxication;
- recent rejection.

> **Serve the moment; never exploit the state.**

## High-value contribution friction

Large contributions should not use the same frictionless interaction as a US$5 intent.

Before any real launch, consider proportional safeguards such as:

- explicit amount confirmation;
- clear one-time total;
- second confirmation above a defined threshold;
- self-set spending limits where useful;
- no high-value one-click contribution embedded inside an intense adult moment;
- clear refund/support path.

The goal is transparent voluntary commerce and lower chargeback risk, not paternalistic blocking.

## Whale risk

Track concentration separately from gross revenue:

- top-1 contribution share;
- top-10 share;
- median contribution;
- contributor count;
- repeat contributor rate;
- refund/dispute concentration.

Do not mistake one emotionally attached whale for broad product-market fit.

Median and contributor diversity are important evidence alongside average ticket.

## Big Goal Gate

Before a high-value asset such as a vehicle, model:

- acquisition target;
- company co-funding;
- cleared-funds requirement;
- total cost of ownership;
- tax/registration;
- insurance;
- maintenance;
- storage/parking;
- depreciation;
- expected content utility;
- Fantasy/World reuse;
- affiliate/sponsor potential;
- resale value;
- custody/security;
- cash-flow impact.

> **A community-funded acquisition must not create an operating liability the business cannot sustain.**

## Co-funding

Large goals may use a transparent community target smaller than total asset cost.

Example:

```text
Mara's Car
Total acquisition: US$15,000
Community target: US$5,000
Company contribution: US$10,000
```

Do not make company-funded money look like user demand. Community/company/sponsor sources must remain distinguishable internally and, where material, in the goal terms.

## Total cost of ownership

For large physical assets, contribution target is not the full business decision.

A car creates continuing costs such as insurance, registration, maintenance, repairs, parking, taxes and depreciation.

Large-goal ROI should include TCO rather than treating a funded acquisition as a free asset.

## Provenance

World Assets can accumulate verifiable provenance:

- funding date;
- acquisition date;
- canonical date;
- production/reference pack;
- content appearances;
- Fantasy Experience appearances;
- contributor callbacks;
- archive date;
- disposal/resale date.

Potential future certificate:

```text
MARA WORLD ASSET #014
Black Bag #01
Canonical Sep 2026
Funded by 43 contributors
Appeared in 7 canonical releases
Archived Feb 2028
```

Do not fabricate provenance.

## Archive / resale

A genuine physical World Asset may later enter `Mara Archive` and, if legally/commercially appropriate, be sold as a real used production asset with provenance.

Contributors do **not** automatically receive:

- fractional ownership;
- asset equity;
- resale share;
- revenue share;
- investment return.

Caprichos must not use investment/securities language unless an entirely separate lawful structure is designed and reviewed.

P0 explicitly excludes fractional ownership.

## Physical asset security

High-value assets need an internal operating record covering, where appropriate:

- legal owner;
- custody;
- insurance;
- serial/model data;
- maintenance;
- loss/theft;
- reference imagery;
- disposal.

Never expose shipping/home addresses or sensitive operator location through public goal evidence.

## Physical reference packs

Selected real objects can improve generative consistency.

For useful canonical assets, capture:

- front/back/side;
- material/detail;
- scale context;
- lighting variations;
- identifiers safe to expose internally.

This creates a reusable Mara-specific physical asset library and reduces model dependence.

## Multi-layer economics

A good World Asset may create value through:

1. contributions;
2. content production;
3. premium Fantasy Experiences;
4. retention/return visits;
5. affiliate commerce;
6. sponsorship attractiveness;
7. resale/memorabilia.

Internal asset selection should evaluate:

**Mara fit × community desire × narrative potential × Fantasy reuse × content reuse × operational utility × residual value × sponsor/affiliate potential − TCO − risk**.

Not every goal needs a direct contribution spread, but every goal should have a credible business/world rationale.

## Caprichos as acquisition

A public-safe goal surface may become shareable without exposing the user's private Mara relationship.

Potential loop:

**goal → team race → safe share → new visitor → Mara discovery → play → contribution intent → more progress**.

Do not leak alias, adult preferences, private contribution history or relationship state into share cards unless explicitly chosen.

## Sponsor / affiliate boundaries

A purchased third-party object may appear in Mara's world without implying a partnership.

Future funding source must distinguish:

- community-funded;
- company-funded;
- brand-gifted;
- sponsored.

Advertising/sponsorship disclosures must be applied when a relationship actually exists.

Existing provenance should not be rewritten to satisfy a future sponsor conflict.

## Payment/provider gate

Caprichos creates a separate underwriting question from simple PPV/continuations.

Before real activation, ask the selected processor in writing whether the actual merchant/entity/model supports:

- adult AI creator business;
- creator gifting/tipping;
- community goals / pooled contributions;
- physical asset acquisition goals;
- one-time contributions;
- custom digital content;
- refund/failure policy;
- the intended jurisdictions.

Do not assume approval of one Mara product implies approval of Caprichos.

Current provider research remains in `docs/foundation/payment-readiness.md`.

CCBill's current public documentation says Visa/Mastercard sub-merchants need legal/business presence in designated U.S./Canada/European regions; Chile is not on its published list. Segpay publicly serves adult/high-risk businesses, but explicit Mara/entity/model acceptance remains required.

References:
- https://ccbill.com/doc/visa-and-mastercard-payment-processing-faqs
- https://segpay.com/verticals/

## Chile consumer/tax baseline

Before real activation, perform launch-specific Chile review.

Current official references support two important assumptions:

1. SERNAC states online sellers must provide clear price/conditions and comply with what was promised/advertised.
2. SII's 2026 creator/influencer guidance explicitly lists donations/tips, subscriptions, PPV and product sales among creator income categories.

Therefore, do not treat the word `gift` or `Capricho` as a way to make commercial/tax obligations disappear.

References:
- https://www.sernac.cl/portal/617/w3-article-13360.html
- https://www.sernac.cl/portal/618/w3-propertyvalue-20982.html
- https://www.sii.cl/destacados/renta/2026/influencers/index.html

## P0 boundary

P0 may simulate:

- three example goals;
- prototype aggregate progress clearly labeled DEV/no money;
- private alias/anonymous choice;
- hidden/public amount intent choice;
- team selection;
- deterministic vote;
- contribution intent;
- completion simulation;
- World Asset transition;
- contributor history callback.

P0 must not:

- collect money;
- present prototype progress as real;
- create a processor ledger;
- submit a merchant application;
- create paid random rewards;
- imply legal ownership by contributors;
- buy assets;
- deploy public goals.

## Permanent principles

> **COMMUNITY MONEY MUST CREATE A REAL CHANGE IN MARA'S WORLD.**

> **PRIVATE PARTICIPATION. PUBLIC AGGREGATE.**

> **MARA WANTS. MARA NEVER NEEDS.**

> **NO FAKE CONTRIBUTORS. NO FAKE PROGRESS. NO FAKE ASSETS. NO FAKE SCARCITY.**

> **COMPETE OVER WHAT HAPPENS IN MARA'S WORLD, NOT OVER WHO MARA LOVES MOST.**

> **CASH AVAILABLE IS NOT THE SAME AS CASH RAISED.**

> **CONTRIBUTION IS PARTICIPATION/ENTITLEMENT, NOT INVESTMENT OR FRACTIONAL OWNERSHIP.**
