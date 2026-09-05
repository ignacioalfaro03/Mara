# Mara Vera — Public Alpha Launch Readiness

Target: 2026-09-03

## Launch objective

Ship the smallest public experience capable of answering one question:

> **DO PEOPLE VOLUNTARILY COME BACK TO MARA?**

The Alpha is not a commercial launch and is not an adult-content checkout launch.

## Public promise

Mara is presented as:

- an adult synthetic virtual character;
- clearly AI-disclosed;
- Spanish-first for the Chile/LatAm launch;
- visually consistent with the canonical Mara asset;
- opinionated, selective and capable of leading the interaction;
- able to remember a small local state between visits;
- free during Alpha;
- text-first until canonical voice quality is good enough.

## Public funnel

`visit → 18+ gate → Home → /experience → first session completed → leave → voluntary return → return continuation`

Secondary educational route:

`Home → /meet-mara → /experience`

The public navigation does not promote Premium while payment/provider activation is disabled.

## Launch telemetry

Production now has minimal first-party anonymous telemetry through `/api/telemetry`.

Only allowlisted public-alpha events are accepted.

No user ID, email, alias, conversation text, fantasy, sexual history, payment data or vulnerability state is accepted by this endpoint.

Primary events:

- `page_view`
- `age_gate_view`
- `age_gate_pass`
- `hero_cta_click`
- `launch_experience_started`
- `prediction_hit`
- `prediction_miss`
- `launch_session_completed`
- `returning_user`
- `launch_return_continued`

Runtime logs emit the prefix:

`MARA_TELEMETRY`

This is deliberately a zero-database Alpha measurement layer. If traction appears, replace log-based measurement with a proper privacy-reviewed analytics store.

## Initial launch KPIs

Do not optimize dozens of metrics.

### 1. Experience start rate

`launch_experience_started / public Home visits`

Question: does Mara create enough curiosity to enter?

### 2. First-session completion

`launch_session_completed / launch_experience_started`

Question: does the first interaction hold attention long enough to finish?

### 3. Voluntary return

`returning_user / completed first sessions`

This is the principal behavioral signal.

### 4. Return continuation

`launch_return_continued / returning_user`

Question: when users come back, is Mara's remembered continuity interesting enough to continue?

### 5. Prediction response

`prediction_hit` vs `prediction_miss`

This is not a model-accuracy KPI by itself. Misses can be useful when Mara reacts naturally and learns.

## Interpretation windows

The Alpha should be read in cohorts rather than judged from the first handful of visits.

First useful read:

- 25+ adult unique real visitors if available;
- preferably 10+ completed first sessions;
- then wait long enough for a genuine return opportunity.

Do not infer retention from same-session refreshes or founder testing.

## Launch content requirement

Distribution begins with public-safe Mara content, not product screenshots.

Minimum organic starter pack:

1. canonical face / introduction;
2. ordinary-life post;
3. opinion / point-of-view post;
4. gym/lifestyle post;
5. evening/look post;
6. `Mara chooses` post;
7. `I have a theory about you` post;
8. short text/voice-style teaser;
9. callback/continuity concept;
10. direct invitation to `/experience`.

Permanent acquisition principle:

> **SOCIAL SHOWS MARA. THE WEB LETS MARA START KNOWING YOU.**

## Voice gate

Launch does not wait for voice.

No voice is preferable to a voice that breaks character.

Voice can be added when a candidate passes:

- native mother-tongue delivery for the target language;
- Human Presence;
- adult identity;
- flirt/seduction/dominance range;
- stable Mara identity;
- commercial-rights check before commercial publication.

For Chile/LatAm, native neutral Latin American Spanish is an accepted launch-quality fallback when a convincing Chilean-localized voice is unavailable.

## Hard launch exclusions

Do not activate in this Alpha without separate authorization:

- payment provider;
- subscription checkout;
- real Caprichos contributions;
- real scarcity;
- explicit adult-media integration;
- NSFW first-party public hosting;
- realtime paid voice;
- expensive subscriptions;
- paid acquisition;
- sensitive preference analytics;
- user identity graph;
- dependency or vulnerability targeting.

## Go-live checklist

Required before calling the updated Alpha live:

- [x] canonical Mara visual connected to public web;
- [x] Spanish-native public Home copy;
- [x] Spanish-native 18+ gate;
- [x] AI disclosure visible;
- [x] public Premium promotion removed while inactive;
- [x] local continuity survives a return;
- [x] return-specific experience exists;
- [x] anonymous launch telemetry code exists;
- [x] launch event typing fixed;
- [x] public page-view funnel tracking exists;
- [ ] dependency-backed `npm run typecheck` PASS;
- [ ] dependency-backed `npm run build` PASS;
- [ ] updated branch deployed and READY verified;
- [ ] mobile Safari smoke test;
- [ ] Home → experience → exit → return smoke test;
- [ ] production telemetry event visible in runtime logs;
- [ ] first public distribution posts ready.

## Release boundary

Do not merge PR #4 without explicit founder command:

`mergea`

Public deployment authorization and merge authorization are separate decisions.

## Post-launch operating rule

For the first real traffic, do not react to every anecdote by rebuilding Mara.

Collect:

- funnel behavior;
- return behavior;
- obvious copy/UX failures;
- repeated qualitative reactions.

Then improve the single weakest stage of:

`attraction → entry → completion → return → continuation`

Do not reopen the entire architecture unless the evidence requires it.
