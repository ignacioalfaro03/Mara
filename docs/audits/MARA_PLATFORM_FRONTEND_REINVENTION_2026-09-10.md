# MARA — PLATFORM FRONTEND REINVENTION AUDIT

Date: 2026-09-10  
Branch: `design/platform-experience-reinvention-v1`  
Base: `0053e6254ade9c7b177acca89871e4fc29d04e5c`  
Authority: `MARA_FOUNDER_CONSTITUTION_V2.md`

## Why this branch exists

The shipped Creator Alpha proved the technical loop but the public frontend still reflected older product assumptions:

- Mara Vera visually and conceptually occupied too much of the platform entry point;
- global navigation was storefront-first (`Experiencias / Biblioteca / Probar`) rather than World/Demand/History-first;
- Creator Worlds looked like profile/dashboard containers;
- Demand existed in the backend but was visually secondary;
- `/shop` looked like a standalone catalogue instead of contextual Creator Zero access;
- `/creators` read like a pilot application rather than a business proposition;
- Mara Vera's character experience contained generic wholesome filler that weakened the intended adult character;
- OG/Twitter metadata still referenced the deprecated Mara V1 image.

## Strategic correction

The redesign follows the Constitution V2 mental model:

`MARA = CONNECTIVE PRODUCT LAYER`

`MARA VERA = CREATOR ZERO`

`WORLD = CREATOR CONTAINER`

`DEMAND = ECONOMIC SIGNAL`

`COMMERCE = CONTEXTUAL CLEAR TRANSACTION`

`MEMORY = CONSEQUENCE + RETURN`

Consumer navigation becomes:

- Para ti
- Haz que pase
- Actividad
- Creadoras

The old shop remains reachable for current commercial contracts but is removed from the primary global mental model.

## Surface → engine mapping

| Surface | Primary engine | Job |
| --- | --- | --- |
| Home / For You | World + Demand + Discovery | Show what Mara connects and give one obvious next action |
| Creator World | World + Demand + Commerce | Put identity, live demand, access and user consequence in one coherent container |
| Make It Happen | Demand | Let raw desire become a privacy-safe economic signal |
| Activity | Memory + Retention | Show the user's real trace and what changed |
| Creator OS | Demand + Commerce | Answer what the World wants, what to sell and what to do next |
| `/creators` | Identity + Privacy | Sell the creator business proposition: money + control + lower exposure |
| Creator Zero experience | Character / retention asset | Demonstrate one intense World without defining the whole company |
| Creator Zero shop | Commerce | Keep existing offer contracts but frame them as contextual private access |

## Visual system

The redesign avoids the shortcut of "make it dark red".

Foundation:

- near-black / graphite base;
- warm ivory foreground;
- selective oxblood only as signal/tension accent;
- editorial serif for narrative gravity;
- neutral UI sans for controls;
- square / restrained geometry instead of generic rounded SaaS cards;
- large typography and negative space;
- mobile bottom navigation where the global IA needs to stay reachable;
- movement kept subtle and reduced-motion aware.

## Mara Vera character correction

Creator Zero is intentionally treated differently from platform voice.

Removed the kitchen/wooden-spoon comedy canon and replaced it with adult private-world tension based on:

- eye contact;
- mirrors;
- doors;
- low light;
- direct vs slow preference;
- withholding;
- remembered choices;
- agency.

The interaction remains bounded fiction. A user's `no` / stop response is still respected immediately. Character dominance is never used as a payment-pressure tactic.

## Image direction

The founder-approved `mara-v2-reference.webp` remains an identity/model-sheet asset, not final campaign photography.

This branch uses it only where a stable identity anchor is necessary and labels the large homepage treatment as temporary campaign art pending. A future campaign set should be generated/reviewed from the actual founder reference, not invented from text alone, with multiple editorial moments rather than one repeated full-body image.

## Data truthfulness

Production currently has no public `creator_worlds` returned by the current public reader. The redesign does not fabricate additional creators, Worlds, demand counts or social proof.

Where data is empty, the UI says so. This is intentional.

## Backend / security boundary

This branch does not:

- change production secrets;
- enable payments;
- enable payouts;
- weaken RLS;
- rewrite Supabase schema;
- replace existing checkout APIs;
- replace creator ownership contracts;
- merge or deploy canonical production.

Existing API contracts are extended through read-only public discovery helpers only.

## Known follow-up before production consideration

1. Run typecheck/build/release-safety/canonical-integrity on the branch.
2. Obtain Vercel Preview and perform real mobile visual QA.
3. Review all empty/authenticated states in Preview.
4. Capture desktop/mobile screenshots.
5. Generate a true Mara Vera campaign image family from the founder reference in a tool that can preserve identity consistently; do not let placeholder/model-sheet imagery become permanent campaign art.
6. Validate the new information architecture with first-time users: can they understand Worlds + demand without a strategy explanation?
7. Validate creator acquisition copy with 3–5 target creators.

## Founder boundary

**NO MERGE unless Ignacio explicitly writes `mergea`.**
