# Mara Vera — P0 Momentum Commerce Test Plan

## Purpose

Validate whether Mara can introduce commerce **without killing the interaction that created the desire**.

This plan is intentionally pre-payment and low-cost. It does not authorize deployment, payment processing, real scarcity, paid voice or analytics vendors.

Primary question:

> **Does the commercial moment make the user want more Mara without making the experience feel like it turned into a store?**

## P0 variants

### A — Contextual offer only

`A_offer_only`

User sees:
- Mara-framed contextual offer;
- clear scope;
- premium-intent CTA;
- `Ahora no` no-penalty decline.

No reward promise or ownership layer is emphasized.

Purpose: control.

### B — Offer + payoff/reward contract

`B_reward`

Adds:
- explicit expectation that the experience resumes in the same context;
- immediate Mara reaction/payoff after DEV mock purchase;
- contextual Reward Grammar where eligible.

Purpose: test whether **post-purchase product design itself** increases perceived value and desire to continue.

### C — Offer + payoff + ownership

`C_ownership`

Adds:
- `My History with Mara` / collection value;
- visible notion that an acquired moment can remain part of the user's history;
- collection progression only when the offer is genuinely linked to that collection.

Purpose: test whether persistent ownership/history creates incremental willingness to continue/pay.

### D — Real scarcity

**NOT ACTIVE.**

Do not include real scarcity in comparison until one of these exists:
- founder-defined weekly custom capacity;
- real time-bounded drop;
- fixed edition count;
- real live/realtime concurrency window.

The current `12/12` capacity example is developer prototype data and must remain labeled `NOT REAL INVENTORY`.

## Running the P0 commerce lab

The development-only `P0 COMMERCE LAB` panel makes qualitative sessions repeatable without external analytics.

For each tester:
1. choose the intended variant (`A_offer_only`, `B_reward` or `C_ownership`) in the DEV panel;
2. forcing a variant clears the previous P0 living state and safe session event log, stores the selected variant and reloads;
3. let the tester use Mara without coaching the commercial decision;
4. if an offer appears, allow either premium intent or `Ahora no` naturally;
5. after either path, `Seguir con Mara` / `Seguimos` records whether the person explicitly continues after commerce;
6. at the end, update and copy the DEV scorecard;
7. copy the raw P0 event log only when deeper debugging is useful;
8. capture the qualitative interview separately without putting intimate answers into generic analytics.

The scorecard is directional only. It summarizes safe counts such as:
- commercial moments;
- premium intents;
- declines;
- post-offer continuations;
- DEV mock purchases;
- delivered rewards;
- collection views.

Do not combine different testers in one uncleared local P0 session.

## Stage 1 — UX sanity

Use a very small qualitative sample first.

Suggested starting point:
- 3–5 testers per A/B/C variant;
- observe rather than optimize statistically;
- stop immediately for obvious confusion, broken continuity, fake-feeling copy or commerce fatigue.

Questions after the session:
1. When the offer appeared, did it feel natural or like an ad?
2. Did you understand what you would get?
3. Did `Ahora no` feel safe/normal?
4. After declining, did Mara still feel like the same character?
5. Did the reward/payoff make the paid version feel more valuable?
6. Did `My History with Mara` make the experience feel more worth keeping?
7. What part felt fake, manipulative or too salesy?
8. At what exact moment did you most want to continue?

Do not ask users to rationalize intimate preferences.

## Stage 2 — Directional comparison

Only after UX sanity.

If recruitment is feasible, expand each variant enough to identify directional differences, not statistical certainty.

Candidate directional metrics:
- `commercial_moment_shown → premium_intent`;
- `commercial_moment_shown → commercial_offer_dismissed`;
- `intent/decline → commercial_post_offer_continued`;
- session continuation after offer exposure;
- session continuation after decline;
- qualitative perceived-value score;
- qualitative 'felt like an ad/store' signal;
- voice-upgrade intent;
- custom-slot intent where prototype wording is clearly understood.

Do not call a winner from tiny samples.

## Local evidence capture — zero vendor

Development mode keeps a capped **safe P0 event log** in `sessionStorage` under:

`mara_p0_event_log`

The `/experience` route exposes a DEV-only panel with:
- forced A/B/C variant controls;
- an on-device scorecard;
- `Copiar scorecard`;
- `Copiar log P0`;
- `Limpiar log`.

The log is limited to selected P0 interaction/commerce events and capped at 250 records.

It may contain metadata such as:
- experiment variant;
- offer ID/type;
- premium intent or dismissal;
- explicit post-offer continuation;
- resume/reward events;
- collection events;
- voice interaction;
- onboarding/prediction/return events.

It must not be extended to capture:
- raw conversation;
- intimate answers;
- fantasy text/labels;
- payment details;
- identity documents.

This local log is for prototype observation only. It is not an analytics warehouse and does not justify adding a SaaS analytics vendor.

## Momentum rule

A variant is commercially bad even with higher CTA intent if it materially increases:
- abandonment immediately after offer;
- perceived manipulation;
- loss of Mara character;
- confusion about payment/state;
- repeated offer fatigue;
- lower desire to return.

This is the practical meaning of **Commercial Inertia**.

Pre-payment proxy:

> **Post-Offer Continuation = users who explicitly continue after intent/decline ÷ users who made an offer decision.**

This is not the future Post-Purchase Continuation Rate. It is an early indicator of whether the commercial interruption preserved momentum.

## No-penalty decline test

`Ahora no` is a core control surface, not merely compliance copy.

After decline:
- relationship tone does not worsen because of the decline;
- no content already earned is removed;
- Mara does not guilt the user;
- no fake urgency appears;
- the surrounding Life/User interaction continues.

A user who declines and keeps engaging can still be a healthy future customer.

## Reward test

Reward should be evaluated as a product payoff, not as purchased affection.

Potential reward styles:
- praise;
- teasing;
- acknowledgement;
- progression;
- reveal;
- surprise;
- collectible.

For praise such as `Good boy`, ask:
- did it fit the interaction?
- did it feel earned?
- would repetition make it cheap?
- would the user prefer teasing/neutral acknowledgement instead?

Do not optimize toward mechanically repeating the highest-click reward phrase.

## Ownership test

For variant C test whether the user understands:

> **This moment can become part of my history/collection with Mara.**

Good signal:
- wants to revisit it;
- cares about completing a series;
- values having been present for a drop/episode;
- sees history as meaningfully different from downloading a generic file.

Bad signal:
- collection feels like arbitrary gamification;
- completion pressure feels manipulative;
- user cannot explain what is actually owned/accessed.

## Real scarcity entry gate

Do not test production scarcity until the constraint exists before the copy.

Required fields:
- availability type;
- source of truth;
- start/end or total capacity;
- remaining-capacity update rule;
- ownership/access rule;
- reopen policy;
- operational reason;
- founder approval.

Once active, compare truthful scarcity against an equivalent evergreen offer.

Never compare fake scarcity against no scarcity.

## First real-payment experiment — future only

When separately authorized and payment/provider/compliance review is complete, the first real test should preserve the same product contract:

**contextual desire → transparent offer → checkout → exact-state resume → immediate payoff → continuation**.

Primary post-payment metrics:
- Purchase Resume Success;
- Post-Purchase Continuation Rate;
- first → second purchase;
- time to second purchase;
- Voice Attach Rate;
- refund/dispute;
- satisfaction;
- contribution margin.

## Decision framework

### Keep
A variant deserves further testing if it improves intent/value while preserving or improving continuation and trust.

### Iterate
If intent rises but users describe the moment as salesy, fake or disruptive, change presentation/timing before adding more offers.

### Kill
Kill mechanics that require:
- fake scarcity;
- emotional punishment after decline;
- unclear price/scope;
- purchased baseline affection;
- repeated interruption;
- significant drop in return intent.

## P0 success

P0 does not need to prove revenue yet.

It needs to identify the strongest candidate for:

> **the moment where the user already wants more, understands what more means, can decline safely, and would naturally continue if they chose to pay.**

That candidate becomes the first real payment experiment after separate authorization.
