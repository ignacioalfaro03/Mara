# Mara Vera Web MVP

Owned first-party web for brand, conversion, analytics, compliance and the P0 First Living Experience.

## Local development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run build
```

## P0 First Living Experience

`/experience` turns the Web MVP from a static site into a lightweight, app-like first interaction with Mara.

Current P0 flow:

**entry → safe user context → 3 choices → Mara reactions → prediction → confirm/correct → temporary preference profile → rule-based recommendation → story/voice moment → contextual commercial moment → Life State callback → local open loop → return session**

Implementation deliberately stays lean:

- no auth;
- no database;
- no persistent Relationship Engine;
- no ML recommender;
- no embeddings/vector DB;
- no realtime voice;
- no payment provider;
- no analytics vendor.

The P0 stores only a small low-sensitivity prototype state in browser `localStorage` under `mara_p0_living_experience`. The experience includes an explicit local reset action.

### Rule-based matcher

Structured experiences live in `data/experiences.ts` and are ranked by the pure matcher in `lib/p0/matcher.ts` using a temporary preference profile plus a small Life State.

Modes:

- `known_fit`;
- `explore`;
- `surprise_me`.

Scores are implementation detail and are never shown to the user. Mara presents the recommendation in character.

### Voice P0

The voice-note UI currently uses the browser Speech Synthesis API as a zero-cost UX placeholder where available, with a transcript fallback.

This is **not Mara's canonical production voice** and must not be used to judge final voice identity or acting quality. It exists only to validate whether a native voice-note interaction improves the experience before authorizing a real voice production workflow/provider.

## Momentum Commerce P0

The `/experience` route includes an in-context Momentum Commerce prototype rather than redirecting every premium moment to a store.

Domain data:
- `lib/p0/commercial.ts` — commercial moment, reward, availability, collection and mock-state types;
- `lib/p0/commercial-experiment.ts` — lightweight P0 A/B/C assignment;
- `data/commercial.ts` — P0 offers, continuation metadata, one collection and one clearly labeled scarcity prototype;
- `components/momentum-commerce-prototype.tsx` — intent, decline-without-penalty, DEV-only purchase/resume simulation, reward and collection UI.

The P0 validates the product contract:

**high-value moment → clear optional offer → premium intent or no-penalty decline → DEV-only mock entitlement → exact-state resume → Mara payoff → continuation**.

### P0 commercial experiment

P0 assigns one sticky local variant:

- `A_offer_only` — contextual offer only;
- `B_reward` — contextual offer plus explicit post-unlock payoff/resume contract;
- `C_ownership` — reward contract plus `My History with Mara` / collection ownership value.

The assignment is deliberately lightweight and stored locally. It is suitable for qualitative/early directional testing only; it is **not** production experimentation/statistical infrastructure.

A fourth concept — **real scarcity** — is intentionally excluded from normal A/B/C assignment until there is an actual enforceable capacity/time/edition constraint. The existing scarcity UI is only a developer-visible prototype example.

Users can choose `Ahora no`. Declining an offer:
- records `commercial_offer_dismissed`;
- causes no relationship penalty;
- causes no loss of state;
- allows the surrounding Mara experience to continue normally.

This is important for measuring whether commerce preserves momentum rather than merely maximizing CTA clicks.

### No real payment

Normal builds only record **premium intent**.

A simulated `purchase → resume` button is rendered only when `NODE_ENV === "development"`. It:
- creates no transaction;
- creates no real entitlement;
- is visibly labeled `DEV ONLY`;
- exists only to validate post-purchase UX and analytics.

`mock_purchase_completed` must never be counted as revenue or payer conversion.

### Scarcity P0

One capacity-limited offer exists as a **prototype example only**.

Its UI explicitly says:

`P0 PROTOTYPE AVAILABILITY — NOT REAL INVENTORY`

The demo slot count must never be shipped/presented as real scarcity. A production scarcity claim requires a real enforceable source of truth for inventory/time/capacity.

### Rewards

Offer definitions may include `rewardStyle` and a mock reward line.

Examples include praise such as `Good boy` where the selected interaction context makes it appropriate.

The prototype rule is:
- reward belongs to the experience/payoff;
- payment does not raise relationship closeness;
- payment does not buy baseline affection/respect;
- reward can be rare/contextual rather than mechanically repeated.

Variant A intentionally uses a generic resume instead of a contextual reward so the reward layer can be tested against a control.

### Collection / ownership prototype

`night_series_p0` demonstrates how an acquired continuation could become part of a collection/history.

Collection value is shown only in variant C and only for offers explicitly linked to the collection. Other mock purchases do not increment it.

No persistent ownership database exists in P0.

## Premium handoff

Real payment/provider activation is intentionally disabled by default.

To configure an authorized external premium destination:

```bash
NEXT_PUBLIC_PREMIUM_URL=https://authorized-provider.example/path
```

Do not populate this variable with a real provider until founder authorization and provider/compliance review are complete.

## Routes

- `/` — conversion-first Home with `Enter Mara` as the primary action
- `/experience` — Mara P0 First Living Experience + Momentum Commerce prototype
- `/meet-mara` — character/brand introduction
- `/premium` — premium value and configurable handoff
- `/legal` — AI disclosure, adult-only, consent, privacy and reporting requirements

## Analytics

The MVP dispatches provider-agnostic browser events through `lib/analytics.ts`. No analytics vendor is connected in this branch.

P0 analytics record only interaction/commercial metadata such as choice step, prediction hit/miss, recommendation mode, experience ID, voice interaction, return/open-loop behavior, experiment variant, premium intent, offer dismissal, offer type, availability type, DEV mock purchase/resume and reward style.

Do not attach raw intimate answers, fantasy values, raw conversation content, payment data or identity documents to the generic analytics event layer.
