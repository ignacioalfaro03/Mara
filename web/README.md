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

**entry → 3 choices → Mara reactions → prediction → confirm/correct → temporary preference profile → rule-based recommendation → story/voice moment → Life State callback → local open loop → return session**

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

## Premium handoff

Real payment/provider activation is intentionally disabled by default.

To configure an authorized external premium destination:

```bash
NEXT_PUBLIC_PREMIUM_URL=https://authorized-provider.example/path
```

Do not populate this variable with a real provider until founder authorization and provider/compliance review are complete.

The P0 `/experience` route also contains disabled/no-checkout **premium intent** moments. Clicking them records intent only; no charge occurs.

## Routes

- `/` — conversion-first Home with `Enter Mara` as the primary action
- `/experience` — Mara P0 First Living Experience
- `/meet-mara` — character/brand introduction
- `/premium` — premium value and configurable handoff
- `/legal` — AI disclosure, adult-only, consent, privacy and reporting requirements

## Analytics

The MVP dispatches provider-agnostic browser events through `lib/analytics.ts`. No analytics vendor is connected in this branch.

P0 analytics record only interaction metadata such as choice step, prediction hit/miss, recommendation mode, experience ID, voice interaction, return/open-loop behavior and premium intent.

Do not attach raw intimate answers, fantasy values, raw conversation content, payment data or identity documents to the generic analytics event layer.
