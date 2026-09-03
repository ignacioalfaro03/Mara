# Mara Vera — Public Alpha Launch Readiness

Status: **RELEASE CANDIDATE — READY EXCEPT EXTERNAL DEPLOY CREDENTIALS**

This document is the operational handoff for the public, free, text-first Mara Alpha.

It does not authorize merge, payments, merchant activation, adult providers, paid tools or production changes outside an explicitly authorized Alpha deployment action.

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
- privacy-minimal return telemetry buckets;
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

Connected Vercel tooling still reports no accessible team scope for the intended account/project path.

A previous one-shot GitHub Actions deploy attempt failed before running any Vercel command because these repository secrets were absent:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

No production state changed in that failed attempt.

There is no committed `.vercel/project.json`; the deploy job must establish and verify the intended link at runtime from the three existing secrets above.

## 4. Hardened one-shot deployment gate

Workflow:

`.github/workflows/mara-alpha-one-shot-deploy.yml`

The deployment job is intentionally inert unless the workflow-file push commit message contains:

`[deploy-alpha]`

A normal Web/P0 push does **not** deploy production.

The gate now:
1. checks out exactly `github.sha` and asserts `HEAD == GITHUB_SHA`;
2. requires the three Vercel credentials before any Vercel command;
3. installs the committed dependency graph with `npm ci`;
4. re-runs production audit, DEV-lab guard audit, typecheck and build;
5. uses pinned release tooling for the deployment pass;
6. runs `vercel pull --environment=production` before deployment;
7. reads the generated `.vercel/project.json` and fails if its `projectId` or `orgId` differs from the supplied secrets;
8. deploys that exact snapshot with `--prod`;
9. waits for terminal Vercel state;
10. verifies `/api/health` first;
11. runs the full production mobile smoke against the returned deployment URL;
12. prints the verified SHA and URL only after every gate passes.

The hardening commit was intentionally created **without** `[deploy-alpha]`. GitHub parsed the workflow and the resulting push run was `skipped`, confirming the production guard remained closed.

## 5. Deployment rule

Deploy only the exact Web/P0 head whose `Web Launch CI` is green.

Do not infer that a deployment is READY from creation alone.

A deployment becomes launch-verified only after:
1. Vercel reports a terminal READY state;
2. `/api/health` returns the expected Alpha contract;
3. the production smoke passes against the actual deployment URL;
4. public routes are reachable;
5. DEV labs remain 404 in production.

## 6. Post-deploy verification

The one-shot deploy gate now performs the production smoke itself.

For an independent repeat from `web/`, with Playwright available:

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

## 7. Manual launch sanity check

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

## 8. What does not block this Alpha

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

## 9. Stop conditions

Do not proceed or claim launch completion if:
- CI is red on the intended head;
- Vercel project/org link does not match the expected credentials;
- health endpoint is not 200/`ok`;
- canonical Mara image fails;
- age gate fails;
- a DEV lab is publicly reachable;
- telemetry accepts unknown intimate payloads;
- a mock commercial state appears public;
- deployment status is not terminal READY;
- production smoke fails.

## 10. Merge boundary

Deployment authorization and merge authorization are separate.

> **NO MERGE unless the founder says exactly `mergea`.**
