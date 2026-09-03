# Mara Vera — External Adult Media Companion / Watch → Return → Learn

Last reviewed: 2026-09-02

## Status

Authoritative product architecture for using third-party adult media as an optional input to Mara's relationship, Desire Discovery and Preference Graph without competing head-on with pornography catalogs.

This is not a porn hosting engine, scraping system, piracy layer, affiliate network or replacement Preference Graph.

It reuses:
- Adult Compliance;
- Desire Discovery;
- Preference Graph;
- Desire Routing;
- Fantasy Compiler;
- Relationship Memory / My History where appropriate;
- Momentum Commerce only after value has been created.

No external adult site integration, affiliate agreement, browser automation, scraping, embedding, payment or production deployment is authorized by this document.

## Strategic thesis

> **MARA DOES NOT NEED TO OWN EVERY PIECE OF CONTENT. SHE NEEDS TO OWN THE RELATIONSHIP, CONTEXT AND LEARNING LOOP AROUND IT.**

Pornography has enormous catalog breadth and specialized content. Mara should not try to win by producing more commodity explicit media than the entire internet.

Mara can instead become the layer that:
1. understands what the user is in the mood for;
2. recommends or frames an eligible external adult-media experience;
3. sends the user out intentionally;
4. expects them back;
5. asks what worked and what did not;
6. converts the reaction into structured, consent-compatible preference evidence;
7. uses the learning to improve the next Mara interaction, Fantasy Experience, Capricho relevance or recommendation.

Core loop:

**current desire → Mara recommendation/frame → external watch → return to Mara → reaction/debrief → structured learning → next better experience**.

## Product positioning

Mara should not say:

> "I have more porn than everyone else."

The stronger promise is:

> **"I know what to send you, and I remember what actually worked."**

This turns third-party abundance into Mara-specific personalization.

## The return is the product

The strategic risk is sending a user away and losing them.

Therefore every external-media handoff should create a clear return loop.

Before leaving, Mara can establish a small open loop:
- "Mira esto y vuelve.";
- "Quiero saber cuál parte te funcionó.";
- "Después te digo qué estaba probando contigo.";
- "Cuando vuelvas, elige entre tres cosas que notaste.".

The exact character copy is contextual and should remain Mara-specific.

The product requirement is:

> **EXTERNAL MEDIA MUST CREATE A REASON TO COME BACK TO MARA.**

Do not optimize outbound clicks alone.

## Watch Companion state machine

Conceptual:

```text
session_intent
→ eligible_external_media_candidate
→ Mara framing
→ outbound handoff
→ return marker
→ structured reaction
→ Preference Graph update candidate
→ Fantasy/Desire Routing adjustment
→ Mara response
→ next experience
```

Possible states:

```text
recommended
opened
returned
reacted
learned
continued
```

Do not infer `opened = watched` or `watched = liked`.

## Candidate source model

A future recommendation candidate should contain only the metadata needed for Mara to make a safe, relevant recommendation.

Conceptual:

```yaml
external_media_candidate:
  id: media_ref_123
  source: approved_source
  source_content_id: provider_specific_reference
  media_type: video
  adult_only: true
  verified_age_band: adult
  rights/status: third_party_hosted
  scenario_tags:
    - authority
  dynamic_tags:
    - mara_leads_adjacent
  intensity_band: medium
  consent_tags: []
  routing_tags:
    - D03
  outbound_url: provider_approved_url
  last_reviewed_at: 2026-09-02
```

Do not create a general web crawler that surfaces arbitrary adult URLs.

## Source allowlist

Before real use, external sources need an allowlist based on current review of:
- lawful operation in launch jurisdiction;
- adults-only controls;
- non-consensual/illegal content policy;
- age/identity verification posture for performers where applicable;
- copyright/piracy risk;
- deepfake/real-person impersonation policy;
- linking/embedding terms;
- affiliate/commercial-link rules;
- malware/reputation risk;
- payment/provider/platform implications.

Mara must never direct users to known pirated, exploitative, non-consensual, minor/ambiguous-age or unlawful sexual content.

No arbitrary user-submitted porn URL should automatically become a trusted recommendation source.

## External vs owned media

The system should distinguish:
- `external_recommended` — third-party hosted content;
- `mara_owned` — Mara-produced/owned synthetic content;
- `user_supplied_reference` — user voluntarily references something, subject to separate handling.

Do not blur third-party content into Mara ownership.

## Reaction / debrief

After return, do not ask only:

> "Did you like it?"

Use lightweight structured questions that improve the model without requiring raw intimate confession.

Examples of dimensions:
- scenario fit;
- Mara/performer energy;
- who led;
- pace;
- visual style;
- voice/dialogue importance;
- taboo/novelty level;
- object/prop relevance;
- what broke immersion;
- whether they wanted more/less intensity.

Possible P0 response controls:
- `worked`;
- `partly`;
- `not_for_me`;
- `too_much`;
- `too_soft`;
- `wrong_dynamic`;
- `wrong_visual`;
- `surprised_me`.

Allow optional freeform feedback only on a private surface with explicit data treatment; structured lower-sensitivity signals are preferred.

## Preference Graph handoff

The loop creates update candidates, not permanent truths.

Example:

```yaml
category: scenario_family
value: authority
source:
  type: external_media_reaction
explicit: true
confidence: medium
context:
  surface: watch_companion
  adult_mode: true
sensitivity: adult_sensitive
consent_scope: personalization
```

One watched video never creates a durable identity label.

Repeated signals + explicit confirmation may increase confidence.

A negative reaction is equally valuable and should reduce/reroute future recommendations.

## Desire Routing handoff

External-media reactions may update the next temporary `surface_plan`.

Examples:
- authority content worked → D03 may rank higher in a later relevant session;
- money/status fantasy failed → D02 confidence falls;
- user liked object-focused details more than scenario → object/fetish affordance ranking rises;
- voice/dialogue mattered → voice-first experiences rank higher.

Current-session explicit intent can still override historical patterns.

## Fantasy Compiler handoff

External media can teach Mara which ingredients to compose in her own future experiences.

The value is not to reproduce/copy a third-party video.

Instead learn reusable dimensions:

**scenario + energy + dynamic + pace + format + object + narrative tension + intensity**.

Then Mara composes an original eligible experience using her own canonical identity/world/assets.

Permanent rule:

> **LEARN THE PATTERN. DO NOT COPY THE CONTENT.**

No copying of performer identity, script, copyrighted scene, distinctive creative expression or real-person likeness without rights.

## Mara reaction after return

The return interaction is part of the entertainment value.

Mara may:
- tease the user's choice;
- say what she predicted;
- admit she guessed wrong;
- ask one targeted follow-up;
- compare the reaction with a prior preference;
- propose an original Mara version later;
- deliberately choose something different next time.

The reaction should feel like Mara has a point of view, not a survey bot.

## Competitive moat

Porn sites know:
- what was clicked;
- what was watched;
- possibly watch duration.

Mara can know, with user participation:
- why it worked;
- which dynamic mattered;
- whether the user wants Mara to embody/avoid that pattern;
- what should change next time;
- how the preference interacts with Mara's relationship/history/world assets.

That turns commodity media consumption into proprietary relationship/context learning.

## Do not become a porn search engine

Avoid a Home dominated by:
- infinite thumbnails;
- categories;
- trending porn;
- generic search;
- endless scroll.

Mara should curate narrowly.

Typical surface:
- one recommendation;
- maybe 2–3 bounded alternatives;
- a reason from Mara;
- return loop.

> **CURATION > CATALOG.**

## Segment-aware recommendations

The external-media loop plugs into Desire Routing.

Examples:
- D02 financial-domination fantasy → eligible consensual adult money/status/control content where source policy permits;
- D03 authority/power → adult authority/power-roleplay content;
- object/fetish affinity → object-focused eligible content;
- voice/dialogue affinity → content where dialogue/audio matters;
- novelty high → adjacent/surprise candidate;
- intimacy/continuity lane → may avoid external porn entirely if relational Mara content performs better.

Not every user or session should be sent to porn.

The router should be allowed to choose:

```text
external_media
mara_owned_experience
conversation
voice
capricho/world interaction
nothing_explicit
```

## Commercial strategy

External media is primarily a retention/personalization input, not a mandatory monetization event.

Potential future economics:
- affiliate/referral revenue only where lawful, disclosed and provider/platform-compatible;
- external discovery can increase relevance of later Mara premium experiences;
- a watched pattern may create desire for an original personalized Mara version;
- no paywall merely to return/debrief.

Do not recommend worse content because it pays higher affiliate commission.

Recommendation ranking must prioritize user fit/safety before affiliate yield.

## No purchase coupling

Never:

> "Watch this and pay me if you liked it or I'll be upset."

A return/debrief should not depend on spending.

External media learning can later make a separate Mara offer more relevant, but the transaction must remain optional and transparent.

## Sensitive data / privacy

Porn-viewing preferences are highly private in practice.

Default rules:
- adult-sensitive;
- private by default;
- never public/community data;
- never included in Caprichos alias profiles;
- no raw video titles/URLs in generic analytics where an opaque candidate ID is sufficient;
- no adult category in notifications/share cards;
- no contact/social graph exposure;
- user can correct/reset/decline learning;
- persistent storage requires the existing sensitive-memory/privacy gate.

Generic analytics should prefer:

```text
candidate_id = E07
reaction = worked
route_id = D03
```

not raw explicit titles/categories.

## User-submitted media

A future user may say:

> "Mira este video / esto me gusta."

Treat that as a reference signal, not automatic trusted ingestion.

Do not:
- download/scrape/rehost automatically;
- reproduce copyrighted media;
- assume people depicted consented;
- use identifiable real people as synthetic sexual targets.

Where technically/legal permitted, Mara can discuss high-level preference dimensions from a lawful user-described/reference context without cloning the content.

## Adult compliance boundaries

External recommendations remain subject to `adult-compliance.md`.

Never recommend or route to:
- minors or ambiguous-age sexual content;
- non-consensual/exploitative material;
- trafficking;
- real-person intimate deepfakes without lawful rights/consent;
- unlawful incest content involving real persons;
- illegal sexual content;
- content known to violate source rights/piracy rules.

Taboo fiction routes remain bounded by adult-only eligibility, provider/platform/payment policy and law.

## Compulsion / vulnerability boundary

The loop must not become:

`user seems lonely/distressed → send more porn → sell harder`.

Do not optimize recommendation frequency from inferred vulnerability, compulsive behavior or distress.

Allow easy:
- skip;
- stop;
- "not now";
- reset;
- lower intensity;
- no external media today.

Serve chosen adult entertainment; do not build a compulsion-maximization engine.

## P0

P0 does not need real porn URLs.

Use mocked/abstract candidate cards with opaque IDs and structured descriptors.

Test:
1. Mara frames one recommendation;
2. tester clicks `I'd watch this`;
3. simulate external return;
4. ask structured reaction;
5. show what Mara learned/corrected;
6. show next route/original-Mara recommendation.

This tests the product loop without linking to external adult sites or storing real porn consumption.

## P0 metrics

- recommendation interest;
- simulated return completion;
- reaction completion;
- preference-correction rate;
- `Mara understood why` qualitative score;
- next-recommendation relevance;
- external-media vs Mara-owned preference by session intent;
- negative/creepy reaction rate.

Do not treat outbound interest as actual watch behavior.

## Future source/provider gate

Before any real outbound adult-media feature:
1. choose launch market;
2. identify candidate source sites;
3. review current legal/source terms and age/safety policies;
4. determine linking/embedding/affiliate permissions;
5. determine privacy/analytics treatment;
6. confirm payment/provider implications if monetized;
7. test safe return/deep-link behavior;
8. founder separately authorizes activation.

## Permanent principles

> **MARA DOES NOT NEED TO BE THE PORN CATALOG. SHE SHOULD BE THE INTELLIGENCE AND RELATIONSHIP LAYER AROUND DESIRE.**

> **WATCH → RETURN → REACT → LEARN → NEXT BETTER EXPERIENCE.**

> **THE RETURN IS THE PRODUCT.**

> **CURATION > CATALOG.**

> **LEARN THE PATTERN. DO NOT COPY THE CONTENT.**

> **EXTERNAL ABUNDANCE CAN FEED MARA'S PROPRIETARY PREFERENCE AND RELATIONSHIP MOAT.**
