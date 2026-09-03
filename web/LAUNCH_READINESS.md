# Mara Vera — Public Alpha Launch Readiness

Status: **RELEASE CANDIDATE — READY EXCEPT EXTERNAL DEPLOY CREDENTIALS**

This document is the operational handoff for the public, free, text-first Mara Alpha.

It does not authorize merge, payments, merchant activation, adult providers, paid tools or production changes outside the already-authorized free Alpha deployment attempt.

## 1. Public Alpha contract

Public surface:
- `/`
- `/experience`
- `/meet-mara`
- `/legal`
- `/premium` — informational only; no live price or checkout
- `/api/health`
- `/api/telemetry`

Public Alpha remains:
- adults only;
- synthetic character disclosed;
- free;
- text-first;
- no real payments;
- no real Caprichos funding;
- no adult-media integration;
- no browser TTS represented as Mara;
- no persistent raw intimate data in generic telemetry.

Primary behavioral question:

> **DO PEOPLE VOLUNTARILY COME BACK TO MARA?**

## 2. Automated release gates

`Web Launch CI` must be green on the exact branch head intended for deployment.

Required gates:
- locked install via `npm ci`;
- production dependency audit;
- DEV-lab production guards;
- TypeScript;
- Next production build;
- production server boot;
- mobile Chromium smoke at the launch viewport;
- `/api/health` contract;
- Home + 18+ gate;
- canonical Mara image load;
- `/experience` first session;
- prediction interaction;
- completion persistence;
- reload / return callback;
- `/meet-mara`;
- `/legal`;
- all `*-lab` routes return production 404;
- safe telemetry accepted;
- unknown intimate telemetry shape rejected.

Terminal smoke success marker:

`MARA_LAUNCH_SMOKE PASS`

## 3. Current external blocker

The release candidate is not currently claimed as deployed.

Verified blockers are credential/access related, not application-code failures.

Connected Vercel tooling currently cannot access the intended project/team scope.

A separate one-shot GitHub Actions deploy attempt failed before running any Vercel command because these repository secrets were absent:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

No production state changed in that failed attempt.

## 4. Deployment rule

Deploy only the exact Web/P0 head whose `Web Launch CI` is green.

Do not infer that a deployment is READY from creation alone.

A deployment becomes launch-verified only after:
1. Vercel reports a terminal READY state;
2. `/api/health` returns the expected Alpha contract;
3. the production smoke passes against the actual deployment URL;
4. public routes are reachable;
5. DEV labs remain 404 in production.

## 5. Post-deploy verification

From `web/`, with Playwright available, run:

```bash
BASE_URL="https://<actual-deployment-host>" node scripts/launch-smoke.mjs
```

Quick health-only check:

```bash
curl --fail --silent "https://<actual-deployment-host>/api/health"
```

Expected JSON shape:

```json
{
  "status": "ok",
  "service": "mara-vera-web",
  "release": "public-alpha"
}
```

Expected cache behavior:
- `Cache-Control` contains `no-store`.

## 6. Manual launch sanity check

After automated smoke passes, manually inspect once:
- mobile Home hierarchy;
- age gate readability;
- canonical Mara visual crop;
- first CTA into `/experience`;
- first complete experience;
- reload / return continuity;
- `/meet-mara` disclosure clarity;
- `/legal` availability;
- no DEV/P0 language exposed publicly;
- no mock price / fake checkout / fake scarcity;
- no broken asset;
- no browser-generated voice presented as Mara.

A physical-iPhone Safari pass is useful but is not required to pretend current Chromium automation already tested Safari. Keep evidence claims literal.

## 7. What does not block this Alpha

Do not hold the free Alpha for:
- realtime canonical voice;
- full Relationship Engine backend;
- accounts/profile system;
- vector memory;
- payments;
- adult generation stack;
- custom domain;
- sophisticated analytics dashboard;
- native mobile app.

Those layers are gated by real user signal and/or separate compliance/commercial decisions.

## 8. Stop conditions

Do not proceed or claim launch completion if:
- CI is red on the intended head;
- health endpoint is not 200/`ok`;
- canonical Mara image fails;
- age gate fails;
- a DEV lab is publicly reachable;
- telemetry accepts unknown intimate payloads;
- a mock commercial state appears public;
- deployment status is not terminal READY;
- production smoke fails.

## 9. Merge boundary

Deployment authorization and merge authorization are separate.

> **NO MERGE unless the founder says exactly `mergea`.**
