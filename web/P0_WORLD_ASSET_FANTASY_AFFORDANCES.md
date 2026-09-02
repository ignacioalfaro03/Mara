# P0 World Asset Fantasy Affordances

## Purpose

Validate the product idea that a canonical Capricho / World Asset can become an **active fantasy object**, not merely a decorative callback.

No real asset purchase, adult content generation, payment or production deployment is authorized by this document.

## Core distinction

Three separate signals must not be conflated:

1. **Asset exists** — e.g. `black_bag_01` became canonical.
2. **User contributed** — the user has grounded shared history around that asset.
3. **Adult/niche affordance is eligible** — Preference Graph + adult consent supports a specific use.

A user contributing to a bag does not imply consent to sexual/fetish object-play.

## P0 metadata

`CaprichoDefinition.fantasyAffordances` may describe:

- `mainstream` affordances;
- `adult_opt_in` affordances;
- `niche_opt_in` affordances;
- cadence: common / occasional / rare;
- required consent tags;
- contributor-callback eligibility.

## Canonical examples

### Black Bag

- `bag_outfit_date` — mainstream / common.
- `bag_possession_tease` — adult opt-in / occasional.
- `bag_pee_play` — niche opt-in / rare / requires `adult_mode` + `pee_play`.

The niche example exists to prove the architecture can compose a highly specific object-based fantasy later. It is not surfaced by default and is not inferred from contribution.

### Mara Garage Car

- `car_night_drive` — mainstream / common.
- `car_backseat_context` — adult opt-in / occasional.

## P0 rules

- Do not generate/display explicit niche content in the Caprichos lab.
- Do not put raw fetish labels in generic analytics.
- Do not infer niche preference from a contribution.
- `Surprise Me` cannot bypass consent tags.
- Specific niche affordances should generally be rare to preserve novelty.
- The same World Asset should retain multiple possible narrative meanings.

## Future compiler contract

Conceptual:

```text
canonical World Asset
+ eligible asset affordance
+ Preference Graph slice
+ Life/Relationship context
+ Fantasy Compiler
→ composed experience
```

If the user also contributed, the experience may add a grounded callback such as:

> `You had something to do with this existing.`

The contribution affects shared history, not consent or sexual intensity.
