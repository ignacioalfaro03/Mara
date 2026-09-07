# Launch readiness: recovery and review

Base: `cf232013a28bef1e4e43e6d69ee2f71c4514f9aa` (PR #47 incorporated).
Recovered branch: `release/public-alpha-launch-readiness`. Recovery verified 30 tracked modifications and four new files; no reset, replacement checkout or reconstruction occurred.

## Review classification

Every recovered file was reviewed before further edits. Paths below are repository-relative.

| Classification | Files | Reason |
| --- | --- | --- |
| REQUIRED P0 | `web/components/dm-experience.tsx`, `web/lib/dm-scenes.ts` | Persistent return recognition, three distinct bounded scenes, actual value and honest completion/decline events. |
| REQUIRED P0 | `web/lib/local-device-state.ts`, `web/components/device-memory-boundary.tsx`, `web/app/auth/account-entry.tsx`, `web/app/experience/page.tsx`, `web/app/world/sofi/page.tsx` | Verify owner before private rendering; clear cross-account projections; explicit anonymous transfer only. |
| REQUIRED P0 | `web/lib/private-moment-client.ts`, `web/lib/ritual-client.ts`, `web/lib/world-client.ts`, `web/app/api/relationship/private-moment/route.ts` | Bounded import, server history wins, timeouts and stale-write protection. |
| REQUIRED P0 | `web/components/world-bridge.tsx`, `web/lib/world-canon.ts`, `web/app/world/sofi/sofi-experience.tsx` | Discovery produces a saved fact and an actual Mara response; no promised nonexistent clip. |
| REQUIRED P0 | `web/components/age-gate.tsx`, `web/app/api/auth/signin/route.ts`, `web/app/api/auth/signup/route.ts` | Gate visible before hydration; strict adult boolean; malformed credentials rejected safely. |
| REQUIRED P0 | `web/app/api/telemetry/route.ts`, `web/app/api/internal/qa-user/route.ts` | Technical probes excluded from decision data; QA identity deletion constrained and canonical production route inert. |
| REQUIRED TEST | `web/scripts/hosted-memory-e2e.mjs`, `web/scripts/launch-loop-smoke.mjs`, `web/scripts/canonical-asset-integrity.mjs`, `web/scripts/launch-smoke.mjs`, `web/scripts/public-purpose-smoke.mjs`, `web/scripts/world-sofi-smoke.mjs` | Preserve existing assertions; add exact-SHA, causal loop, ownership and truncation coverage. |
| REQUIRED TEST | `.github/workflows/web-launch-ci.yml`, `.github/workflows/mara-hosted-activation-preview.yml`, `web/app/api/health/route.ts` | Independent image gate and isolated exact-commit hosted evidence with no alias movement. |
| SAFE SUPPORTING CHANGE | `web/app/globals.css`, `web/components/dm-experience.module.css`, `web/components/world-bridge.module.css` | Mobile CTA visibility, usable input and inline World panel. |
| SAFE SUPPORTING CHANGE | `web/app/legal/page.tsx`, `web/scripts/alpha-signal-report.mjs` | Accurate device-deletion/payment language and explicitly aggregate event reporting. |
| UNNECESSARY SCOPE — removed | `web/next-env.d.ts` | Build-generated declarations; excluded from authored change. |

Review follow-up: `web/lib/preference-client.ts` also requires epoch checks so a pending import cannot continue after device reset. Automatic authenticated hydration clears unowned anonymous projections; only explicit successful sign-in/signup authorizes import. Imports are narrative progress, never monetary allowance or entitlements. The import timestamp records transfer time, not the historical session time.

## Canonical asset: founder blocker

`public/mara/mara-v1-reference.jpg` is the unchanged approved Git blob `1c4c4d3615eac915cf42efd9416ed20479eb8126`, but its bytes lack JPEG EOI and visual inspection shows extensive gray corruption. Dimensions/hash alone previously passed. The new integrity job deliberately fails; do not append EOI or substitute another face. The approved original was not recovered from Git or the prior 813-file search. **P0 FOUNDER ASSET REQUIRED.** Product verification and visual readiness are separate gates.

## Production boundary

No merge, automerge, real payment activation, external inference, paid infrastructure or canonical production deployment. Hosted proof uses existing isolated project `prj_AFQlC5fN2qKwrfZ8q7VzF9PnzAHc` and `--skip-domain`; canonical project `prj_47YN2RH1i1NvaRTuEVqqbA8cdxUK` is excluded from the production deploy path. Preview/proof telemetry is suppressed for founder decision data. QA accounts are ephemeral and removed in cleanup.

## Measurement contract

| Event | Actual producer | Founder question / decision |
| --- | --- | --- |
| `first_interaction` | User enters DM | Does landing curiosity reach interaction? Fix entry friction. |
| `ritual_completed` | Explicit completion | Is first value understandable? Keep/fix the invitation. |
| `experience_completed:private_moment` | User completes a bounded scene | Does the story earn continuation? Keep/fix scene. |
| `hero_cta_click:dm_continuity` | Optional account CTA after value | Does continuity motivate signup? Fix timing. |
| `signup_completed`, `signin_completed` | Successful explicit auth | Can users save/recover continuity? Fix auth. |
| `returning_user` | Remembered account/device renders | Is continuity exposed? Event count only, not unique retention. |
| `memory_recall_engaged`, `launch_return_continued` | User begins next scene | Does memory change behavior? Keep/fix return experience. |
| `experience_completed:world_sofi` | Explicit fact discovery | Does the World clue lead to discovery? Fix clue. |
| `experience_completed:world_sofi_return` | User asks for Mara's version | Does World knowledge have a consequence? Keep/fix callback. |
| `commercial_offer_dismissed` | Dismiss action | How often is an offer declined? Fix offer/context. |
| `commercial_post_offer_continued` | Subsequent real DM/World action | Does interaction survive a decline? Dismissal alone never counts. |

These are aggregate event signals, not unique-user conversion, D3 retention or revenue. QA/proof activity must not enter decision data.
