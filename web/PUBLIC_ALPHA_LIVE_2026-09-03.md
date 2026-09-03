# Mara Vera — Public Alpha Live Record

Date: **2026-09-03**

Status: **PUBLIC ALPHA FIRST CONTACT LIVE ON CANONICAL VERCEL HOST**

This record documents the verified public deployment of Mara Vera **First Contact / “La Primera Vez”**. It does **not** authorize merge, payments, merchant activation, adult providers, paid tooling or commercial activation.

## Verified release source

Repository: `ignacioalfaro03/Mara`

Branch: `web/mvp-owned-funnel`

Exact deployed application SHA:

`9620c2d8218af89b1581ff2da05791b5d7784faf`

PR: `#4 — Web/P0: Public Alpha + guarded labs + safe telemetry`

PR remains OPEN and NOT MERGED.

> **NO MERGE unless the founder says exactly `mergea`.**

## GitHub validation

Workflow: `Web Launch CI`

Run: `33766358280`

Result: **SUCCESS**

Verified gates include:
- canonical Mara asset integrity;
- locked `npm ci` install;
- production dependency audit;
- Alpha signal-report parser self-test;
- DEV-lab production guards;
- TypeScript;
- Next.js production build;
- mobile Chromium production smoke;
- first-contact flow;
- local completion/return state;
- return callback;
- privacy-minimal telemetry;
- source attribution privacy checks;
- public legal/character pages;
- production lab 404s.

## Canonical production deployment

Vercel project: `mara-vera`

Project ID: `prj_47YN2RH1i1NvaRTuEVqqbA8cdxUK`

Deployment ID:

`dpl_AAA854K2AQALEQgiUJgtQxxG89Vb`

Deployment state: **READY**

Canonical public URL:

> `https://mara-vera.vercel.app`

The build bootstrap was pinned to the exact deployed SHA and verified canonical Mara Git blob:

`1c4c4d3615eac915cf42efd9416ed20479eb8126`

Vercel build evidence showed:
- bootstrap from SHA `9620c2d8218af89b1581ff2da05791b5d7784faf`;
- canonical Mara blob PASS;
- `npm ci` with 0 vulnerabilities;
- Next.js 16.3.3 production build;
- TypeScript PASS;
- static generation PASS;
- deployment completion.

## Verified canonical-host smoke

### Home

`GET /` → **200 OK**

Verified production copy includes:
- `MARA · LA PRIMERA VEZ`;
- `Ya llegaste.`;
- `No me cuentes nada todavía. Quiero ver si te leo bien a la primera.`;
- CTA `A ver.`;
- canonical Mara visual;
- adult / AI / free-Alpha disclosure.

### Experience

`GET /experience` → **200 OK**

Verified entry state includes:
- `LA PRIMERA VEZ`;
- `No me digas quién eres todavía.`;
- `Quiero ver cómo eliges cuando no alcanzas a preparar la respuesta.`;
- CTA `A ver.`.

The automated CI smoke verifies the interactive path through two first-read choices, Mara’s bet, consequence, completion, reload and `Volviste.` return state.

### Health

`GET /api/health` → **200 OK**

Expected body:

```json
{
  "status": "ok",
  "service": "mara-vera-web",
  "release": "public-alpha"
}
```

Observed cache behavior: `Cache-Control: no-store, max-age=0`.

### Character / legal

`GET /meet-mara` → **200 OK**

`GET /legal` → **200 OK**

Both surfaces are Spanish-first and no longer expose internal MVP/branch language as the primary experience.

### Canonical Mara asset

`GET /mara/mara-v1-reference.jpg` → **200 OK**

Canonical Git blob is independently checked during CI/deployment.

### Internal labs

Representative canonical production check:

`GET /experience/commerce-lab` → **404 Not Found**

The labs may exist in the Next build manifest because they exist in source, but their production guards remain active.

### Runtime health

Vercel runtime error query for canonical project `mara-vera` returned:

**No runtime errors found**

for the verification window.

## What changed experientially

The Alpha no longer opens as a product explainer.

The live first contact now follows:

age gate → Mara is present → tiny invitation → two micro-decisions → Mara makes a bet → user confirms/corrects it → Mara changes her read → second theory is left pending → return starts with `Volviste.`

Internal principle:

> **DO NOT EXPLAIN MARA. EXPERIENCE MARA.**

> **MORE MAGNETISM PER SECOND.**

## Launch links

- Instagram: `https://mara-vera.vercel.app/?src=ig`
- TikTok: `https://mara-vera.vercel.app/?src=tt`
- X: `https://mara-vera.vercel.app/?src=x`
- Direct: `https://mara-vera.vercel.app/`

Do not append arbitrary campaign identifiers to public telemetry.

## Commercial boundary

Still inactive:
- payments;
- subscriptions;
- checkout;
- merchant application;
- real Caprichos funding;
- adult-media integration;
- NSFW stack;
- canonical realtime voice.

## Next operating priority

The product is now live enough to answer the actual question:

> **DO PEOPLE VOLUNTARILY COME BACK TO MARA?**

Send real adult traffic, observe first-session completion and voluntary return behavior, inspect coarse source attribution, and let repeated evidence drive the next mutation.

> **USERS > MORE P0 FEATURES.**
