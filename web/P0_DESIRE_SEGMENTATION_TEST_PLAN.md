# P0 Desire OS / Segmentation Test Plan

## Purpose

Test whether **one canonical Mara can become materially more relevant when the product routes by current desire and interaction shape**, without creating contradictory Maras, leaking sensitive preferences or turning adult-specificity into vulnerability pricing.

DEV route:

`/experience/segment-lab`

No real adult preference profile, payment, checkout, external adult-media integration or production personalization is activated.

## What the lab is actually testing

This is not a fetish-category menu test.

The P0 projection combines:

1. **desire lane** — control, financial-domination fantasy, authority, eligible forbidden fiction, intimacy, object focus, world building or exploration;
2. **modality** — text, voice, image, mixed, simulated external media or ritual;
3. **pace** — fast, gradual, story-led or delayed;
4. **control direction** — Mara leads, user leads or co-created;
5. **repeatability** — repeat comfort, occasional or exploration;
6. **novelty mode** — known fit, adjacent or surprise;
7. **voice budget** — V0/V1/V2/V3 ceiling, not a different Mara voice;
8. **session rhythm** — the changing cadence of entry, play, tension, payoff, normalization and open loop;
9. **consent/eligibility metadata** — composable prototype scopes;
10. **Caprichos ordering** — same Goals/terms, different relevance ordering;
11. **product ladder** — different eligible next products, never hidden individualized pricing;
12. **session intent** — what the user wants *right now*.

A route is temporary. Current explicit intent may override historical/default fit without deleting durable preference evidence.

## Core hypotheses

### H1 — Surface relevance

Different testers/current moments prefer different macro-lanes and say `this feels more like what I would click`.

### H2 — Product-wide coherence

A useful route changes more than copy. The tester should perceive one coherent plan across:
- hero/visual direction;
- first scenario;
- modality;
- pace;
- control direction;
- voice ceiling;
- rhythm;
- Caprichos ordering;
- product ladder.

### H3 — Same Mara

Despite route differences, testers still recognize one coherent Mara rather than eight characters.

### H4 — Current session beats static identity

A tester should understand that `what I want tonight` can differ from prior/default route fit.

### H5 — Fetish portability

The same underlying dimension should make sense across more than one surface. Example: authority can influence voice, scenario, challenge style and product ordering without requiring separate authority-specific engines.

### H6 — Correction / fluidity

`Wrong direction` must feel easy and non-punitive. One hit/miss cannot become a permanent identity label.

### H7 — Modality matters

A tester may like a desire concept but prefer a different delivery mode. `WHAT` and `HOW` must remain separable.

### H8 — Pace matters

Fast payoff vs tension/story/delay should materially change perceived fit.

### H9 — Control direction matters

Mara-leading, user-leading and co-created experiences should not be treated as the same preference.

### H10 — Voice contrast matters

V0–V3 is a performance budget. Testers should expect high-intensity V3 to lose value if repeated constantly.

### H11 — Session rhythm beats constant escalation

A route with normalization, ordinary beats and open loops should feel more alive than `sexual escalation → maximum → end`.

### H12 — Caprichos relevance

Different routes can make different World Assets feel naturally relevant while target/terms stay unchanged.

### H13 — Sensitive-route privacy

Tester should expect adult route data to remain private and react negatively to raw labels in public URLs, notifications, share cards or generic analytics.

### H14 — Product ladder without exploitation

Different routes may rank different eligible SKUs, but same equivalent SKU should retain transparent price/terms and no route should use arousal, loneliness, debt or emotional dependency as a commercial variable.

## Canonical P0 macro-lanes

Opaque analytics IDs:

- `D01` — Control / Submission.
- `D02` — Financial Domination Fantasy.
- `D03` — Authority / Power.
- `D04` — Forbidden / Taboo Adult Fiction, only as an abstract policy-gated fixture.
- `D05` — Intimacy / Continuity.
- `D06` — Object / Fetish Focus.
- `D07` — World Builder / Collector.
- `D08` — Exploration / Surprise.

These are composable lanes, not user identities.

## Test method

Suggested first pass: 5–8 adult testers.

For each tester:

1. explain that every route is the same Mara;
2. show a randomized subset first, then allow comparison of all eight;
3. ask which entry they would click **in this moment**;
4. inspect first-scenario fit;
5. inspect modality/pace/control fit;
6. inspect voice ceiling and rhythm arc;
7. inspect Capricho ordering;
8. inspect product ladder;
9. ask whether Mara still feels like one person;
10. ask which parts feel fake/overfitted;
11. use `This feels more relevant` / `Wrong direction` to record fit/correction;
12. ask how their choice might change in a different session;
13. interview separately about privacy expectations.

## Synthetic-data rule

Do not pressure testers to disclose real intimate history.

They may test with a fictional statement such as:

`For this test, pretend I want authority + voice + gradual pace.`

Do not collect:
- real sexual history;
- partner/relative identities;
- actual financial distress/debt;
- loneliness/dependency;
- trauma;
- raw explicit fantasy text unless voluntarily offered and separately handled.

The product question is whether the architecture creates relevance, not whether the tester will confess private facts.

## Session-state boundary

The lab intentionally stores the selected route only in `sessionStorage`.

That is a prototype of a temporary surface plan, not durable Preference Graph storage.

Future promotion into persistent adult-sensitive preference memory requires:
- explicit compatible consent;
- confidence rule;
- context;
- correction/reset support;
- privacy/retention review.

## Findom firewall test

For `D02`, verify that testers understand:

> fantasy framing can involve money/status/control, while real checkout/Goal terms remain ordinary transparent commerce.

The UI must not imply:
- hidden higher prices;
- debt/borrowing encouragement;
- unlimited spending;
- affection proportional to spend;
- relationship punishment for refusal.

## Policy-gated fiction test

`D04` is an abstract architecture fixture only.

Any future specific category must pass:
- adults-only eligibility;
- consent scope;
- jurisdiction/legal gate;
- provider policy;
- platform/channel policy;
- rights/real-person restrictions.

The test does not authorize production of prohibited content.

## Unexpected-attraction test

`D08` should validate the UX idea:

**Mara predicts → tester reacts → Mara notices hit/miss → candidate signal → correction or later retest**.

One surprising positive reaction must not imply sexual orientation, a permanent fetish identity or a psychological explanation.

## Signals

Safe P0 events remain:
- `desire_route_selected`;
- `desire_surface_plan_viewed`;
- `desire_route_fit`;
- `desire_route_correction`.

Properties use opaque `route_id` only.

Do not log raw sensitive lane labels, fantasy text, external adult URLs or vulnerability states to generic analytics.

## Decision criteria

Deeper implementation is justified only if:
- testers consistently prefer different routes/current-session projections;
- route choice materially increases perceived relevance;
- WHAT/HOW/pace/control distinctions matter;
- users still recognize one coherent Mara;
- V0–V3 contrast is understood and high-intensity repetition appears fatiguing;
- rhythm/normalization improves character quality;
- Capricho ordering makes intuitive sense;
- corrections feel easy;
- privacy expectations can be met;
- product ladders feel relevant rather than extractive.

Do not proceed if the result feels like:
- eight fake personalities;
- a porn-category catalog with Mara pasted on top;
- creepy over-inference;
- constant maximum intensity;
- hidden price discrimination;
- public outing of adult preferences;
- duplicate engines for every fetish/surface.

## Next step after evidence

Only after signal:

1. add lightweight current-session Desire Discovery to `/experience`;
2. keep temporary session state distinct from durable Preference Graph;
3. promote only filtered/high-confidence consented signals;
4. create expiring `surface_plan` projections;
5. connect route ranking into First Living Experience, Fantasy Compiler, Caprichos and return experience;
6. test a bounded novelty/exploration budget;
7. keep pricing/Goal terms transparent and independent from vulnerability or inferred spending capacity;
8. defer recommender ML/vector DB/realtime orchestration until manual deterministic routing becomes a measured bottleneck.
