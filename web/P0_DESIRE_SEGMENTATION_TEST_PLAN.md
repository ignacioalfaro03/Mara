# P0 Desire Segmentation Test Plan

## Purpose

Test whether **one canonical Mara can become materially more relevant when the product routes by current desire**, without creating multiple contradictory Maras, leaking sensitive preferences or turning sensitive segments into vulnerability pricing.

DEV route:

`/experience/segment-lab`

No real adult preference profile, payment, checkout or production personalization is activated.

## Segmentation is multi-dimensional

Do not reduce segmentation to fetish labels.

The useful routing stack eventually combines:

1. **desire family** — control, authority, intimacy, taboo fiction, object/fetish, world-building, etc.;
2. **interaction style** — Mara leads, collaborative, teasing, direct, mysterious;
3. **format** — voice, visual, text, mixed;
4. **intensity** — current eligible band, not a permanent identity;
5. **relationship/continuity preference** — standalone vs callback/history;
6. **novelty preference** — known fit vs adjacent vs Surprise Me;
7. **commercial product fit** — which defined SKU/Capricho/collection is relevant, not hidden willingness-to-pay;
8. **session intent** — what the user wants *right now*.

The same user may route differently on different sessions. A durable preference can influence ranking, but current explicit intent should usually win.

## Core hypotheses

### H1 — Surface relevance

Changing hero/visual/CTA framing by desire lane should make the tester say `this feels more like what I would click`.

### H2 — Product-wide coherence

A useful segment should alter more than chat copy. The tester should understand a coherent path across:
- landing framing;
- first scenario;
- Mara energy;
- preferred format;
- featured Caprichos;
- commercial surface.

### H3 — Same Mara

Despite the route changes, the tester should still perceive one coherent Mara rather than five different characters.

### H4 — Correction / fluidity

A tester should feel comfortable saying `wrong direction` without the product treating the route as a permanent identity label.

### H5 — Caprichos relevance

Different lanes should make different World Assets feel naturally more relevant while the Goal amount/terms remain unchanged.

### H6 — Sensitive-route privacy

Tester should expect the desire route to remain private and should react negatively if sensitive labels appeared in public URLs, notifications, share cards or generic analytics.

## Canonical P0 routes

The lab uses opaque IDs in analytics:
- `D01` — control/submission fixture;
- `D02` — financial-domination fantasy fixture;
- `D03` — authority/power fixture;
- `D04` — taboo/forbidden adult-fiction fixture;
- `D05` — intimacy/continuity/world-builder fixture.

Raw sensitive labels are for DEV/tester interpretation only and should not become generic production analytics dimensions.

## Test method

Suggested first pass: 5–8 adult testers.

For each tester:
1. begin with a neutral explanation that all routes are the same Mara;
2. show 3–5 routes in randomized order;
3. ask which entry they would click first;
4. inspect first-scenario fit;
5. inspect Capricho ordering;
6. inspect commercial surface;
7. ask whether Mara still feels like the same person;
8. ask which parts feel fake/overfitted;
9. use `This feels more relevant` / `Wrong direction` to record P0 fit/correction events;
10. interview separately about privacy expectations.

## Do not ask

Do not pressure testers to disclose intimate real-life details.

Do not collect:
- real sexual history;
- partner names;
- actual relatives;
- financial distress/debt;
- loneliness/dependency;
- trauma;
- raw fantasy descriptions unless voluntarily offered and separately handled.

The test is about routing/product relevance, not extracting confessions.

## Findom firewall test

For `D02`, specifically verify that testers understand the distinction:

> fantasy framing can involve money/status/control, while the real checkout/Goal terms remain ordinary transparent commerce.

A tester should not interpret the design as:
- hidden higher prices;
- unlimited spending encouragement;
- affection proportional to spend;
- debt/borrowing pressure.

If a future findom-themed SKU exists, it should be a clearly defined adult experience/ritual/voice/collection or other explicit entitlement with transparent price/terms, and payment-provider acceptance must be separately verified.

## Taboo route test

`D04` is an architecture fixture only. Any future production category remains subject to:
- adults-only eligibility;
- consent;
- active content/provider policy;
- payment-provider rules;
- legal review where needed.

Do not treat P0 route interest as authorization to generate any specific prohibited category.

## Signals

P0 safe events:
- `desire_route_selected`;
- `desire_surface_plan_viewed`;
- `desire_route_fit`;
- `desire_route_correction`.

Properties should use opaque `route_id` only.

Do not log raw sensitive route labels to generic analytics.

## Decision criteria

Segmentation deserves deeper implementation only if:
- testers consistently prefer different routes;
- route choice increases perceived relevance;
- users still recognize one coherent Mara;
- Capricho ordering makes intuitive sense;
- corrections feel easy;
- sensitive-route privacy expectations can be met.

Do not proceed if the result feels like:
- five fake personalities;
- a porn-category menu with Mara pasted on top;
- creepy over-inference;
- hidden price discrimination;
- public outing of adult preferences.

## Next step after evidence

Only after signal:
1. add a lightweight first-session Desire Discovery router;
2. store adult-sensitive route signals only through the existing Preference Graph with consent/context/confidence;
3. combine durable fit with current-session explicit intent;
4. create temporary `surface_plan` projections;
5. integrate route ranking into Home, First Living Experience, Caprichos and Fantasy Compiler;
6. keep prices/Goal terms transparent and independent from vulnerability or inferred spending capacity.
