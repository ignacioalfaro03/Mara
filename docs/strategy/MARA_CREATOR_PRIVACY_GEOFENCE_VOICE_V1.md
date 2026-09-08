# MARA — CREATOR PRIVACY SHIELD: GEO-FENCE + VOICE IDENTITY V1

Status: **FOUNDER-DIRECTED PRODUCT REQUIREMENT**  
Effective: **2026-09-08**  
Stack: extends `MARA_PRIVATE_DEMAND_NETWORK_FOUNDER_AMENDMENT.md` and `MARA_PRIVATE_DEMAND_NETWORK_V2.md`  
Strategic fit: PRIVACY + DEMAND + CREATOR SUPPLY + GMV

> **A CREATOR SHOULD BE ABLE TO MONETIZE A LARGE AUDIENCE WITHOUT HAVING TO MONETIZE HER REAL-WORLD IDENTITY.**

This document adds a first-class Creator Privacy Shield to Mara.

The objective is not perfect anonymity. The objective is controlled public exposure, verified pseudonymity where appropriate, and strong protection against accidental local or biometric deanonymization.

---

# 1. PRODUCT THESIS

Many potential creators will not participate if joining Mara means exposing:

- their real city;
- their neighborhood;
- their habitual geographic area;
- their natural voice;
- their face;
- their legal name;
- identifiable metadata;
- clues that make it easy for acquaintances to recognize them.

Mara should allow a creator to say:

> **SELL ME EVERYWHERE EXCEPT WHERE I DO NOT WANT TO BE RECOGNIZED.**

or:

> **TARGET THESE CITIES, BUT NEVER SHOW ME INSIDE MY PROTECTED ZONE.**

or:

> **USE MY CHARACTER AND A DIFFERENT VOICE.**

Privacy becomes a supply-acquisition feature, not merely a legal setting.

---

# 2. CREATOR PRIVACY SHIELD

The product has four coordinated controls:

1. **GEO TARGETING** — where the Creator wants Mara to actively build demand.
2. **GEO EXCLUSION** — where the Creator must not be discoverable or actively promoted.
3. **IDENTITY EXPOSURE** — how much of the Creator's real-world identity is public.
4. **VOICE IDENTITY** — whether the Creator uses her natural voice, a transformed voice, a character voice or no voice.

These controls must be independent.

A Creator can be visually public while geographically protected.

A Creator can use her real face but an altered voice.

A Creator can use a character-only identity and still target specific cities.

---

# 3. GEO TARGETING — "WHERE SHOULD MARA ACTIVATE DEMAND?"

Creator-configurable targeting can include:

- worldwide;
- selected countries;
- selected regions;
- selected cities;
- selected city clusters;
- selected languages / markets;
- demand-driven automatic expansion later.

Example:

`TARGET = Santiago + Concepción + Valparaíso`

Mara can then concentrate discovery, campaigns, Creator demand and future Host opportunity in those markets.

Internal strategic language may call this **CITY ATTACK / CITY ACTIVATION**, but consumer-facing copy should normally use **Target cities**, **Activate markets** or **Grow in these cities**.

---

# 4. GEO EXCLUSION — "WHERE SHOULD MARA NEVER EXPOSE ME?"

A Creator must be able to create one or more protected geographic rules.

Examples:

- all places except my city;
- exclude my city;
- exclude my region;
- exclude a 20 km radius around a protected area;
- exclude several cities;
- exclude home city + work city;
- allow Chile except one protected zone;
- only expose the Creator outside a defined perimeter.

Canonical examples:

`ALLOW = WORLDWIDE`

`DENY = CHILLÁN`

or:

`ALLOW = CHILE`

`DENY_RADIUS = 35 KM AROUND PROTECTED_ZONE_A`

or:

`ALLOW = WORLDWIDE`

`DENY = PROTECTED_CITY + PROTECTED_RADIUS`

The Creator does not need to expose the reason for an exclusion.

---

# 5. PROTECTED ZONE RULE

The product must avoid converting privacy protection into a new privacy leak.

Therefore:

- public users never see the Creator's protected city merely because it is excluded;
- Hosts should not see the exact protected zone;
- Creator public profile must not say "hidden within 30 km of X";
- APIs must not return raw protected coordinates to clients;
- exact home address is not required for this feature;
- if a radius is used, Mara should prefer the minimum geographic precision necessary;
- protected-zone evaluation should occur server-side;
- analytics should use coarse / aggregated geography wherever practical;
- logs must not unnecessarily reproduce protected coordinates.

User-facing result should be simple:

> **This Creator is not available in your area.**

not:

> **This Creator lives 18 km from you and has hidden that area.**

---

# 6. GEO ELIGIBILITY CONTRACT

Conceptual evaluation:

`ELIGIBLE = TARGET_MATCH && !EXCLUSION_MATCH && COMPLIANCE_MATCH`

The final decision can also include:

- Creator age / verification state;
- country availability;
- payment-provider eligibility;
- content / category restrictions;
- local legal requirements;
- Host / fulfillment availability;
- Creator-specific boundaries.

Geo privacy wins over growth optimization.

If an automatic campaign would target a protected area, it must fail closed.

---

# 7. DEMAND GRAPH + GEO PRIVACY

The Demand Graph can still learn that demand exists in a protected city without exposing the Creator there.

Example:

- 600 people in City A want a Creator experience;
- Creator has City A excluded;
- Mara stores the aggregate market signal;
- Mara does **not** activate the Creator there;
- the Creator can later decide whether to keep the exclusion, delegate to a licensed representation format, or ignore the opportunity.

Creator-facing insight can say:

> **Strong demand exists in a protected market.**

without forcing exposure or revealing to users why the market is protected.

---

# 8. CITY ACTIVATION ENGINE — LATER

Once the Demand Graph has sufficient liquidity, Mara can recommend where a Creator should expand.

Potential ranking inputs:

- verified demand;
- pledged GMV;
- conversion rate;
- demand growth;
- Creator competition;
- local acquisition cost;
- Host / venue supply;
- fulfillment complexity;
- language fit;
- protected-zone rules.

Example Creator recommendation:

> **Concepción is your strongest unprotected expansion opportunity this week.**

Future action:

`ACTIVATE CITY`

This can trigger:

- discovery weighting;
- local demand pages;
- waitlists;
- city-specific offers;
- local Creator collaborations;
- future Host opportunity creation;
- IRL demand only when safety / provider / legal gates allow it.

---

# 9. VOICE IDENTITY MODES

A Creator must not be forced to publish her natural voice.

Conceptual modes:

## REAL_VOICE
Use approved natural Creator voice.

## TRANSFORMED_VOICE
Use the Creator's speech with a privacy-preserving voice transformation.

## CHARACTER_VOICE
Use an approved synthetic / character voice associated with the Creator persona.

## TEXT_ONLY
Creator does not expose voice.

## MIXED
Creator chooses per offer / content type.

Voice mode should be configurable independently from visual exposure.

---

# 10. VOICE PRIVACY PRINCIPLES

Voice alteration is for Creator privacy and character design, not for deceptive impersonation.

Rules:

- do not clone or imitate an identifiable third party without rights / authorization;
- preserve Creator control over the selected voice identity;
- avoid publishing raw voice files when transformed output is sufficient;
- minimize retention of raw source audio where technically and legally practical;
- store voice assets privately when they can identify the Creator;
- do not leak voice-model identifiers or source file metadata to consumers;
- disclose synthetic / altered media where legally or platform-policy required;
- allow the Creator to revoke a voice identity and prevent new generation from it, subject to legitimate transaction / record retention requirements.

---

# 11. CREATOR EXPOSURE MATRIX

Mara should model identity exposure explicitly.

Conceptual dimensions:

### FACE
- REAL;
- PARTIAL;
- CHARACTER_ONLY;
- HIDDEN.

### VOICE
- REAL;
- TRANSFORMED;
- CHARACTER;
- NONE.

### LOCATION
- PUBLIC_MARKET_ONLY;
- TARGETED;
- PROTECTED_ZONES;
- NO_LOCATION_DISCLOSURE.

### REAL NAME
- PUBLIC;
- CREATOR_ALIAS_ONLY.

### DIRECT INTERACTION
- NONE;
- ASYNC;
- SCHEDULED;
- LIVE.

A Creator should be able to combine these settings into a reusable privacy profile.

Example:

`PROFILE = CHARACTER_ONLY + TRANSFORMED_VOICE + WORLDWIDE_EXCEPT_HOME_CITY + ALIAS_ONLY + ASYNC`

---

# 12. UX — CREATOR ONBOARDING

Privacy configuration should be simple enough to understand in under one minute.

Suggested flow:

## Step 1 — How do you want to appear?
- As myself;
- As a Creator persona;
- As a virtual identity.

## Step 2 — What can people recognize?
- Face;
- voice;
- both;
- neither.

## Step 3 — Where can Mara promote you?
- Everywhere;
- selected countries;
- selected cities.

## Step 4 — Where should Mara never expose you?
- exclude city;
- exclude region;
- exclude protected radius;
- add another protected zone.

## Step 5 — Voice
- my real voice;
- transform my voice;
- use my character voice;
- no voice.

Final summary should be human-readable, for example:

> **Your character can be promoted worldwide except your protected area. Your real name and natural voice stay private.**

---

# 13. CREATOR PRIVACY CHECK

Before content, offers or campaigns go live, Mara should run a privacy check.

Potential leak classes:

- location metadata;
- EXIF / file metadata;
- recognizable background;
- street / building identifiers;
- workplace identifiers;
- school / institution identifiers;
- license plates;
- tattoos / unique marks if Creator has chosen to hide them;
- natural voice when transformed voice is required;
- accidental legal name;
- public social handle collision;
- raw filename / cloud metadata leakage.

The check should warn the Creator before publishing.

Do not claim that automated checks guarantee anonymity.

---

# 14. HOST / OPERATOR PRIVACY FIREWALL

Future Hosts and Operators receive only the information required to fulfill an authorized transaction.

They should not automatically receive:

- Creator legal identity;
- home city;
- protected coordinates;
- raw voice;
- private contact information;
- unrelated demand history.

Where physical fulfillment genuinely requires identity or contact disclosure, that disclosure must be purpose-limited, authorized and auditable.

A Creator may also designate an authorized **Creator Host / Representative** who operates on her behalf while the Creator remains publicly pseudonymous.

---

# 15. BUSINESS VALUE

This feature is expected to expand supply because it lowers the perceived cost of becoming a Creator.

It enables Mara to recruit people who want to monetize:

- a persona;
- a character;
- selective content;
- their time;
- their creativity;
- their audience;

without requiring them to turn local real-world recognition into part of the product.

Commercial effects to measure:

- higher creator application conversion;
- higher creator activation;
- higher share of privacy-sensitive creators who launch an SKU;
- lower creator churn due to exposure concerns;
- more geographic expansion outside protected markets;
- higher GMV from creators who would otherwise remain offline;
- stronger trust and differentiation versus generic creator platforms.

Core privacy protection must not be held hostage behind a paid tier.

Advanced workflow, analytics, multi-persona management and automation may later support Creator Pro monetization, but essential safety/privacy controls remain baseline product infrastructure.

---

# 16. DATA CONTRACT — CONCEPTUAL

Possible future creator privacy policy:

```text
CreatorPrivacyPolicy
- creator_id
- exposure_profile
- voice_mode
- target_countries[]
- target_regions[]
- target_cities[]
- excluded_countries[]
- excluded_regions[]
- excluded_cities[]
- protected_zones[]
- geo_disclosure_mode
- direct_interaction_mode
- updated_at
```

Possible protected zone:

```text
ProtectedZone
- id
- creator_id
- zone_type: CITY | REGION | RADIUS
- coarse_reference
- radius_km
- active
- server_only
```

Do not expose server-only protected-zone detail to public clients.

---

# 17. MVP / V1 / V2

## MVP

Prove product logic with synthetic data only:

- selected target cities;
- excluded city;
- protected radius concept;
- REAL / TRANSFORMED / CHARACTER / NONE voice mode;
- privacy summary;
- eligibility simulation;
- fail-closed protected-zone behavior.

## V1

- production-safe Creator privacy policy persistence;
- server-side geo eligibility;
- campaign/discovery exclusion enforcement;
- Creator privacy summary;
- transformed / character voice integration only after provider/privacy review;
- privacy check for metadata and obvious location leakage.

## V2

- demand-driven city recommendations;
- multi-zone and scheduled targeting;
- automatic city activation outside protected zones;
- Creator Host / Representative permissioning;
- richer privacy leak detection;
- geography-aware Creator analytics;
- privacy-preserving Host fulfillment handoff.

---

# 18. METRICS

Track:

- % Creators with protected zones;
- % Creators using non-real voice;
- creator onboarding completion by privacy mode;
- creator activation rate by exposure profile;
- protected-zone enforcement failures = **0 target**;
- privacy warning rate;
- privacy-related Creator churn;
- GMV outside protected zones;
- city activation conversion;
- expansion recommendation acceptance;
- creator support incidents related to deanonymization.

Security / privacy incidents are not growth experiments.

---

# 19. NON-NEGOTIABLES

- Mara never markets a Creator inside an active protected zone because the growth model wants more GMV.
- Public users never receive enough protected-zone data to infer where the Creator lives.
- Voice privacy must not become third-party impersonation infrastructure.
- KYC / payout / tax / lawful compliance may still require Mara or regulated providers to know legal identity.
- Public pseudonymity is not a promise of regulatory anonymity.
- A Creator can change targeting without rebuilding her World.
- Privacy settings are part of the Creator's operating system, not buried account preferences.

---

# FINAL PRODUCT TEST

Creator:

> **I can choose where Mara grows my audience, block the places where I do not want to be recognized, use a different voice, and still monetize my character.**

Business:

> **Mara unlocks creator supply that other platforms lose because exposure is treated as mandatory.**

**NO MERGE unless Ignacio explicitly writes `mergea`.**
