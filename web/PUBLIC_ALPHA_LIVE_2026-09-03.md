# Mara Vera — Public Alpha Live Record

Date: **2026-09-03**

Status: **PUBLIC ALPHA SITUATIONAL FIRST CONTACT LIVE ON CANONICAL VERCEL HOST**

This record documents the verified public deployment of Mara Vera **First Contact / “La Primera Vez”** after replacing questionnaire-like discovery with playable situations and behavioral callbacks. It does **not** authorize merge, payments, merchant activation, adult providers, paid tooling or commercial activation.

## Verified release source

Repository: `ignacioalfaro03/Mara`

Branch: `web/mvp-owned-funnel`

Exact deployed application SHA:

`0724050d84edba1acb53af3809f53892bc1e81b4`

PR: `#4 — Web/P0: Public Alpha + guarded labs + safe telemetry`

PR state at verification:
- OPEN;
- NOT MERGED;
- mergeable.

> **NO MERGE unless the founder says exactly `mergea`.**

## GitHub validation

Workflow: `Web Launch CI`

Run: `33771857649` (`#56`)

Validation job: **SUCCESS**

Verified gates include:
- canonical Mara asset integrity;
- locked dependency install;
- production dependency audit;
- Alpha signal-report parser self-test;
- DEV-lab production guards;
- TypeScript;
- Next.js production build;
- mobile Chromium smoke;
- situational first-session flow;
- behavioral state persistence;
- factual return callback;
- return-life scene;
- privacy-minimal telemetry;
- coarse source attribution;
- all production lab 404s.

## Canonical production deployment

Vercel project: `mara-vera`

Project ID: `prj_47YN2RH1i1NvaRTuEVqqbA8cdxUK`

Deployment ID:

`dpl_EwZHdd2qaXMFDkhQMWVYMX4GySWw`

Deployment state: **READY**

Canonical public URL:

> `https://mara-vera.vercel.app`

The deployment bootstrap was pinned to exact SHA `0724050d84edba1acb53af3809f53892bc1e81b4` and checked canonical Mara Git blob:

`1c4c4d3615eac915cf42efd9416ed20479eb8126`

## What is live now

### Situation Zero / Home

`GET /` → **200 OK**

Live copy:
- `MARA · LA PRIMERA VEZ`;
- `Llegaste justo.`;
- `Estoy a punto de salir y ya cambié de idea dos veces. Necesito una decisión rápida.`;
- CTA `Métete.`.

The public metadata is also situational rather than product/psychology explanatory:
- description: `Llegaste justo. Mara ya estaba en medio de algo.`;
- OG/Twitter: `Entraste en medio de algo. A ver qué haces.`.

### First session

The interactive path is now built from situations rather than self-description:

1. **Outfit** — `Negro o crema.`
2. **Bar** — `Te pillé mirando.` / Mara gestures `ven`.
3. **Messages** — `No vengas todavía.` → `Ya. Ven.`
4. **Consequence** — Mara can hit or miss her behavioral bet.
5. **Twist** — Mara may reverse the rhythm instead of simply continuing.
6. **Open loop** — `Después te cuento qué pasó. O no.`

Choices change copy, behavioral counters and later callbacks. The product does not convert them into identity labels.

> **BEHAVIOR BEFORE SELF-DESCRIPTION.**

> **SITUATIONS BEFORE QUESTIONS.**

> **CONSEQUENCES BEFORE LABELS.**

### Return continuity

A return starts with `Volviste.` and recalls a concrete fact, for example:

> `La última vez te dije “ven” y viniste sin pedirme otra explicación.`

Mara then explicitly avoids pretending that behavior equals identity:

> `No te voy a sacar una conclusión por eso. Solo me acuerdo.`

Return situations rotate through small life beats such as:
- gym;
- posting a Story/photo;
- choosing between a sensible night and one that probably ends late.

This creates continuity through shared events instead of a personality-test result.

### Canonical Mara image resilience

Runtime image remains:

`/mara/mara-v1-reference.jpg`

The browser implementation now:
- reserves `1024 × 1536` dimensions;
- loads the primary Mara portrait eagerly;
- gives the main portrait high fetch priority;
- retries a transient failure up to three times;
- cache-busts only on retry;
- never swaps Mara for another woman;
- falls back to a Mara text state only after retries fail.

Verified canonical image request with version/retry query returned **200 OK**, `image/jpeg`.

### Health / safety

`GET /api/health` → **200 OK**

Expected body:

```json
{
  "status": "ok",
  "service": "mara-vera-web",
  "release": "public-alpha"
}
```

Representative internal lab:

`GET /experience/commerce-lab` → **404 Not Found**

Runtime error query after the situational release returned:

**No runtime errors found**.

## Measurement boundary

Primary behavioral question remains:

> **DO PEOPLE VOLUNTARILY COME BACK TO MARA?**

Public telemetry stays privacy-minimal. It does not transmit raw intimate text, sexual identity labels, arbitrary campaign data, anonymous user UUIDs, payment data or inferred vulnerability states.

Launch links:
- Instagram: `https://mara-vera.vercel.app/?src=ig`
- TikTok: `https://mara-vera.vercel.app/?src=tt`
- X: `https://mara-vera.vercel.app/?src=x`
- Direct: `https://mara-vera.vercel.app/`

## Commercial boundary

Still inactive:
- payments;
- subscriptions;
- checkout;
- merchant activation;
- real Caprichos funding;
- adult-media integration;
- NSFW stack;
- canonical realtime voice.

## Product direction now proven in code

Do not design future discovery as a questionnaire.

Ask:

> **WHAT CAN HAPPEN THAT REVEALS SOMETHING ABOUT THE USER?**

Mara should increasingly feel like a playable life with memory: things happen, the user changes moments, Mara reacts, the world moves on, and later she remembers.

> **EARN THE RETURN.**
