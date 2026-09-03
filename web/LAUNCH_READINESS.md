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

Secondary acquisition question:

> **WHICH PUBLIC CHANNELS CREATE FIRST-PARTY BEHAVIOR, NOT JUST ATTENTION?**

## 2. Canonical Mara web-asset integrity

Default runtime visual:

`web/public/mara/mara-v1-reference.jpg`

Runtime URL:

`/mara/mara-v1-reference.jpg`

Public Alpha manifest:

`web/public/mara/ASSET_MANIFEST.md`

Expected Git blob SHA-1:

`1c4c4d3615eac915cf42efd9416ed20479eb8126`

Committed web derivative dimensions:

`1024 × 1536`

The asset was introduced by commit:

`257fa744ff62b3926cdcf27d6ae8941f3008d01a`

with commit message:

`launch: add canonical Mara image to public web`

Foundation registers the founder-approved source reference separately, including:
- generation ID `deb9733e-63aa-4068-a38a-090bc2c30bc9`;
- original PNG dimensions `1024 × 1536`;
- source PNG SHA-256 `b931964b5317460e02ce7ebc77f2182d81a101bdcc4b451377fdf6033204143c`.

The committed JPG is the web launch derivative. Different encodings have different binary hashes, so the manifest does not claim byte identity between the JPG and source PNG.

Both `Web Launch CI` and the one-shot production deploy gate verify:

```bash
git hash-object public/mara/mara-v1-reference.jpg
```

against the expected Git blob SHA before release work continues.

Success marker:

`MARA_CANONICAL_ASSET PASS`

If the file is silently replaced while preserving its filename, CI/deploy must fail.

Changing the expected blob is an explicit canonical-asset decision, not routine content maintenance.

> **THIS WOMAN IS MARA.**

> **ONE MARA. MANY CONTEXTS.**

## 3. Privacy-safe channel attribution

Launch acquisition links may use one coarse source parameter:

`?src=<source>`

Supported values:
- `ig`
- `tt`
- `x`
- `direct`
- `other`

Any other non-empty `src` value collapses to `other`.

The browser stores only the coarse source in `sessionStorage` for the current browsing session under:

`mara_public_entry_source_v1`

The telemetry property is:

`entry_source`

This is **session attribution, not user attribution**.

The launch implementation deliberately does not transmit:
- arbitrary `campaign` or UTM strings;
- click IDs;
- referrer URLs;
- handles;
- post IDs as free text;
- persistent acquisition identity.

The server independently validates `entry_source` against the same fixed source allowlist.

The production smoke starts with:

`/?src=ig&campaign=must-not-leak`

and asserts that a later actual UI-emitted return event contains:
- `entry_source=ig`;
- no `campaign` property;
- no `anonymous_id`.

Measurement contract:

`web/ALPHA_MEASUREMENT.md`

> **CHANNEL DIRECTION > PERSON-LEVEL TRACKING.**

## 4. Automated release gates

`Web Launch CI` must be green on the exact branch head intended for deployment.

Required gates:
- canonical Mara web-asset blob guard;
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
- privacy-safe session `entry_source` attribution;
- proof arbitrary campaign query data does not leave the browser through public telemetry;
- `/meet-mara`;
- `/legal`;
- all `*-lab` routes return production 404;
- safe telemetry accepted;
- unknown intimate telemetry shape rejected.

Terminal smoke success marker:

`MARA_LAUNCH_SMOKE PASS`

## 5. Current external blocker

The release candidate is not currently claimed as deployed.

Verified blockers are credential/access related, not application-code failures.

Connected Vercel tooling still cannot access the intended historical project scope. Direct access to `ignacioalfaz-6766 / mara-vera` returns `403 Forbidden`, confirming this is an authorization/scope problem rather than simple project discovery.

A previous one-shot GitHub Actions deploy attempt failed before running any Vercel command because these repository secrets were absent:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

No production state changed in that failed attempt.

There is no committed `.vercel/project.json`; the deploy job must establish and verify the intended link at runtime from the three existing secrets above.

## 6. Hardened one-shot deployment gate

Workflow:

`.github/workflows/mara-alpha-one-shot-deploy.yml`

The deployment job is intentionally inert unless the workflow-file push commit message contains:

`[deploy-alpha]`

A normal Web/P0 push does **not** deploy production.

The gate now:
1. checks out exactly `github.sha` and asserts `HEAD == GITHUB_SHA`;
2. verifies the canonical Mara web-asset Git blob before any deploy work;
3. requires the three Vercel credentials before any Vercel command;
4. installs the committed dependency graph with `npm ci`;
5. re-runs production audit, DEV-lab guard audit, typecheck and build;
6. uses pinned release tooling for the deployment pass;
7. runs `vercel pull --environment=production` before deployment;
8. reads the generated `.vercel/project.json` and fails if its `projectId` or `orgId` differs from the supplied secrets;
9. deploys that exact snapshot with `--prod`;
10. waits for terminal Vercel state;
11. verifies `/api/health` first;
12. runs the full production mobile smoke against the returned deployment URL, including attribution/privacy checks;
13. prints the verified SHA and URL only after every gate passes.

The latest asset-guard deploy-workflow commit was intentionally created **without** `[deploy-alpha]`:

`fbef9cc4635c9cd3be65a4290ad210fda06b0add`

GitHub Actions push run:

`33711797995`

Result:

**SKIPPED**

This confirms the production guard remained closed and no deployment was attempted.

## 7. Deployment rule

Deploy only the exact Web/P0 head whose `Web Launch CI` is green.

Do not infer that a deployment is READY from creation alone.

A deployment becomes launch-verified only after:
1. Vercel reports a terminal READY state;
2. `/api/health` returns the expected Alpha contract;
3. the production smoke passes against the actual deployment URL;
4. public routes are reachable;
5. DEV labs remain 404 in production;
6. canonical Mara asset integrity passes;
7. attribution/privacy smoke passes.

## 8. Post-deploy verification

The one-shot deploy gate performs the production smoke itself.

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

Canonical local file check from `web/`:

```bash
test "$(git hash-object public/mara/mara-v1-reference.jpg)" = "1c4c4d3615eac915cf42efd9416ed20479eb8126"
```

## 9. Launch link convention

Once the public URL is verified, use:

- Instagram: `<PUBLIC_URL>/?src=ig`
- TikTok: `<PUBLIC_URL>/?src=tt`
- X: `<PUBLIC_URL>/?src=x`

Direct/owned links may omit `src`; they resolve to `direct` for the session when no source is already present.

Do not append free-form campaign tracking merely because conventional marketing stacks do.

## 10. Manual launch sanity check

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

## 11. What does not block this Alpha

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

## 12. Stop conditions

Do not proceed or claim launch completion if:
- CI is red on the intended head;
- canonical Mara web-asset blob differs from the expected release asset;
- Vercel project/org link does not match the expected credentials;
- health endpoint is not 200/`ok`;
- canonical Mara image fails;
- age gate fails;
- a DEV lab is publicly reachable;
- telemetry accepts unknown intimate payloads;
- arbitrary campaign/source strings escape the attribution allowlist;
- a mock commercial state appears public;
- deployment status is not terminal READY;
- production smoke fails.

## 13. Merge boundary

Deployment authorization and merge authorization are separate.

> **NO MERGE unless the founder says exactly `mergea`.**
