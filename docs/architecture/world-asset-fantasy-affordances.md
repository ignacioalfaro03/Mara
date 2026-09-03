# Mara Vera — World Asset Fantasy Affordances

Last reviewed: 2026-09-02

## Status

Extension of the existing Caprichos / World Asset / Fantasy Compiler architecture.

This is **not** a new engine. It defines how a canonical World Asset can become an active narrative/fantasy object rather than merely decorative background.

It does not authorize generation of any specific adult content, real payments, asset purchases or production deployment.

## Core thesis

> **A World Asset should be able to change what Mara can plausibly do in future experiences, not just what appears in the frame.**

A funded bag, perfume, dress, car, hotel room or other canonical asset can create new experience possibilities.

The valuable loop is:

**funded asset → canonical object → object-specific fantasy affordances → Preference Graph / consent eligibility → Fantasy Compiler composition → occasional future experience → grounded callback/history**.

This creates a stronger payoff than simply showing the object once after purchase.

## Fantasy affordance

A `fantasy_affordance` describes an action, context or narrative role that a World Asset can support.

Conceptual schema:

```text
fantasy_affordance
  id
  asset_id
  family
  intensity
  consent_tags
  eligible_contexts
  eligible_formats
  cadence
  repeat_window
  contributor_callback_eligible
  commercial_eligible
```

Suggested `intensity` values:

- `mainstream` — suitable for ordinary Mara experiences;
- `adult_opt_in` — adult-only and requires adult mode/consent;
- `niche_opt_in` — specific fetish/niche and must never be inferred from one interaction or shown by default.

Suggested cadence:

- `common`;
- `occasional`;
- `rare`.

Niche/object-play should generally be `rare` or `occasional` so an asset does not collapse into one repetitive fetish callback.

## Examples

### Black Bag

Possible affordances:

- outfit/date accessory — mainstream;
- possession/status tease — adult or mainstream depending on treatment;
- contributor callback — mainstream/private;
- messy-object play — adult opt-in;
- pee-play involving the bag — **niche opt-in only**.

The point is not to make the bag permanently synonymous with one fetish. The bag should remain a reusable canonical object with multiple possible meanings.

### Perfume

Possible affordances:

- sensory callback;
- getting-ready scene;
- date/night context;
- possession/scent association;
- contributor-specific memory callback.

### Car

Possible affordances:

- drive/night context;
- road-trip story;
- arrival/departure scene;
- backseat context where adult-mode eligibility permits;
- contributor/team callback.

### Hotel / location asset

Possible affordances:

- travel;
- arrival;
- room reveal;
- voice story;
- adult situational roleplay where consented.

## Consent and preference gating

World Asset eligibility does not override Preference Graph or Adult Compliance.

For any adult/niche affordance:

1. adult user only;
2. relevant adult mode / consent state;
3. Preference Graph signal must be explicit or sufficiently supported under existing confidence rules;
4. niche preference must remain correctable and decayable;
5. no single joke, purchase or contribution creates a durable fetish label;
6. rejected affordance must not be repeatedly resurfaced;
7. provider/payment/platform restrictions still apply.

Example:

A user helped fund `black_bag_01`.

This creates a grounded asset callback.

It does **not** imply the user wants pee-play.

Only if a separate consented Preference Graph signal supports that niche may Fantasy Compiler consider a pee-play affordance involving the bag.

## Asset contribution is not fetish consent

Permanent rule:

> **Funding an object never counts as consent to a sexual use of that object.**

Helping buy a bag means the user helped change Mara's world.

It does not mean:

- the user consents to every fetish involving bags;
- Mara should infer humiliation/degradation/object-play preferences;
- the system may surface niche content without a separate eligibility signal.

## Composition model

Fantasy Compiler may add a World Asset after ordinary eligibility filtering.

Conceptually:

```text
Base Scenario
+ Mara Personality
+ Preference Variables
+ Life Context
+ Relationship Callback
+ World Asset
+ Eligible Asset Affordance
+ Format
= Personalized Experience
```

Example:

```yaml
asset: black_bag_01
affordance: object_play_pee
intensity: niche_opt_in
consent_tags:
  - adult_mode
  - pee_play
cadence: rare
contributor_callback: eligible
```

The compiler should treat this as one possible composition among many, not as the default identity of the asset.

## Surprise and novelty

World Assets increase novelty because an object can return in a different role months later.

A strong experience can make the user think:

> `I helped make that object part of Mara's world, and now she is using it in a way I did not expect.`

Surprise remains bounded by consent.

`Surprise Me` may select among **eligible** affordances only; it cannot bypass niche consent because the user requested surprise.

## Contributor callbacks

If the user helped fund the asset, Fantasy Compiler may include a grounded contribution callback where appropriate.

Example structure:

```text
asset exists
+ user contributed
+ affordance eligible
→ contributor-aware experience
```

The callback should reference the real shared history, not financial leverage.

Good:

> `You had something to do with this existing.`

Bad:

> `You paid for it, so now you owe me / deserve more affection.`

## Commercial use

An asset-funded experience may later be premium if it provides new defined value.

But:

- contributors must first receive the Capricho payoff promised in the Goal contract;
- future premium reuse is separate value, not withholding the promised reveal;
- niche intensity must not be used to justify opportunistic vulnerability pricing;
- contribution amount must not increase sexual intensity automatically.

## Cadence / anti-repetition

A powerful niche callback becomes weak if repeated constantly.

Recommended rules:

- mainstream asset appearances can be frequent;
- adult object-play should be occasional;
- very specific fetish affordances should usually be rare;
- use repeat windows;
- track negative reaction/rejection;
- rotate meanings of the same object.

Example for Black Bag:

1. reveal;
2. outfit appearance;
3. date callback;
4. weeks later, eligible niche object-play;
5. later, ordinary appearance again.

This makes the object feel like part of Mara's life rather than a single-purpose fetish prop.

## Physical vs fictional action

The World Asset may physically exist while the fantasy action is synthetic/fictional.

Do not imply that a physical asset was actually used in a particular sexual/fetish act unless that real action was actually produced and can be truthfully represented.

The product may say the asset is a real canonical production object and separately deliver a fictional/generated Mara experience using it.

Do not fabricate physical provenance.

## Analytics boundary

Generic analytics may track coarse metadata such as:

- `world_asset_used`;
- `affordance_family` using non-sensitive experiment identifiers where necessary;
- completion/reaction.

Do not put raw fetish text or intimate preference values into generic analytics.

Sensitive eligibility belongs under the existing Preference Graph/privacy rules.

## Permanent principles

> **WORLD ASSETS ARE ACTIVE STORY/FANTASY OBJECTS, NOT JUST DECORATION.**

> **FUNDING AN ASSET IS NOT CONSENT TO A FETISH.**

> **NICHE OBJECT-PLAY IS OPT-IN, PREFERENCE-AWARE AND OCCASIONAL.**

> **SURPRISE MAY VARY THE EXPERIENCE; IT MAY NOT BYPASS CONSENT.**

> **THE SAME ASSET SHOULD SUPPORT MULTIPLE MEANINGS OVER TIME.**

> **A REAL PHYSICAL ASSET CAN ANCHOR A FICTIONAL FANTASY, BUT PHYSICAL PROVENANCE MUST REMAIN TRUE.**
