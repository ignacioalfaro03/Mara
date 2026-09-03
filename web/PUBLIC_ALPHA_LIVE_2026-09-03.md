# Mara Vera — Public Alpha Live Record

Date: **2026-09-03**

Status: **PUBLIC ALPHA OPERATIONAL ON VERIFIED VERCEL RC HOST**

This record documents the first verified public Vercel release of the current Web/P0 Alpha. It does **not** authorize merge, payments, merchant activation, adult providers, paid tooling or any commercial activation.

## Verified release source

GitHub repository:

`ignacioalfaro03/Mara`

Branch:

`web/mvp-owned-funnel`

Exact deployed Web/P0 SHA:

`93e1a2e94775c12463d739ea99351ce65a22c1ad`

PR:

`#4 — Web/P0: Public Alpha + guarded labs + safe telemetry`

PR state at verification time:
- OPEN;
- NOT MERGED;
- merge boundary remains unchanged.

> **NO MERGE unless the founder says exactly `mergea`.**

## Verified Vercel project

Project name:

`mara-vera-alpha-rc-93e1a2e`

Project ID:

`prj_eAeEok4wwnf0guK0ahDDeTolNRMO`

Deployment ID:

`dpl_9YMqEaGwDGpD8ZvbMefn2xP3QfYN`

Deployment state:

**READY**

Deployment target reported by Vercel:

**production**

Verified public production host:

`https://mara-vera-alpha-rc-93e1a2e.vercel.app`

Use this host for Alpha links until the canonical `mara-vera.vercel.app` project is explicitly updated and separately verified.

## Build evidence

Vercel build completed successfully from the exact SHA above.

Observed build evidence included:
- bootstrap pinned to SHA `93e1a2e94775c12463d739ea99351ce65a22c1ad`;
- canonical Mara Git blob `1c4c4d3615eac915cf42efd9416ed20479eb8126`;
- `npm ci` dependency install;
- Next.js production build;
- TypeScript pass;
- static generation pass;
- deployment completion.

## Public smoke verified

### Health

`GET /api/health`

Result:

**200 OK**

Body:

```json
{
  "status": "ok",
  "service": "mara-vera-web",
  "release": "public-alpha"
}
```

Cache behavior observed:

`Cache-Control: no-store, max-age=0`

### Home

`GET /`

Result:

**200 OK**

Verified in returned production HTML:
- Spanish-first Home;
- canonical Mara image reference;
- headline `No necesitas otra IA. Necesitas a alguien a quien quieras volver.`;
- CTA to `/experience`;
- CTA to `/meet-mara`;
- adult / AI disclosure;
- Open Graph image points to the canonical Mara runtime asset.

### First Living Experience

`GET /experience`

Result:

**200 OK**

Verified in returned production HTML:
- canonical Mara portrait;
- first public living-experience entry state;
- local-state disclosure;
- no payment surface.

### Canonical Mara asset

`GET /mara/mara-v1-reference.jpg`

Result:

**200 OK**

Observed content type:

`image/jpeg`

Observed content length:

`10582`

### Internal labs

Representative production check:

`GET /experience/commerce-lab`

Result:

**404 Not Found**

The build manifest may contain internal lab routes because they exist in source, but the production guard is active and the checked lab surface is not publicly reachable.

### Runtime health

Vercel runtime error query for the release project returned:

**No runtime errors found**

for the verification window.

## Important domain state

Historical/canonical project:

`mara-vera`

Historical public domain:

`https://mara-vera.vercel.app`

That project still serves the older deployment and must **not** be represented as the current Alpha release yet.

Its `/api/health` currently returns `404`, which is direct evidence that it has not been updated to the current Web/P0 release.

Therefore the verified launch host today is:

> `https://mara-vera-alpha-rc-93e1a2e.vercel.app`

not the historical canonical host.

## Launch-link convention

Until the canonical host is moved and re-verified:

- Instagram: `https://mara-vera-alpha-rc-93e1a2e.vercel.app/?src=ig`
- TikTok: `https://mara-vera-alpha-rc-93e1a2e.vercel.app/?src=tt`
- X: `https://mara-vera-alpha-rc-93e1a2e.vercel.app/?src=x`
- Direct: `https://mara-vera-alpha-rc-93e1a2e.vercel.app/`

Do not append arbitrary campaign identifiers to public telemetry.

## What is now true

We can now literally say:

> **The free, text-first Mara Vera Public Alpha is operational on a verified public Vercel host.**

We cannot yet literally say:
- `mara-vera.vercel.app` is running the latest Alpha;
- the canonical domain migration is complete;
- voice is live;
- payments are live;
- commercial activation has started;
- PR #4 is merged.

## Next operating priority

P0 remains frozen.

The next meaningful work is not another feature burst. It is:
1. send real traffic to the verified host;
2. observe first-session completion;
3. observe voluntary return behavior;
4. inspect coarse source attribution;
5. collect repeated user feedback;
6. only then decide the next product mutation.

Primary behavioral question remains:

> **DO PEOPLE VOLUNTARILY COME BACK TO MARA?**

> **USERS > MORE P0 FEATURES.**
