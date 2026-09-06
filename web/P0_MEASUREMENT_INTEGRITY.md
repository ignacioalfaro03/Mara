# Mara Vera — P0 Measurement Integrity

## Outcome

Public Alpha product decisions must reflect real canonical-production behavior, not hosted QA automation.

Permanent rule:

> **AUTOMATION MAY PROVE THE PIPELINE. AUTOMATION MUST NOT BECOME THE CUSTOMER.**

## Why this exists

On 2026-09-06 the live `public.launch_events` table was inspected after the Public Alpha RC hosted proofs. It contained ordinary-looking `direct` DM, ritual, auth, memory and World events generated during automated hosted proof runs, alongside explicit `/qa-telemetry-preview` and `/qa-telemetry-proof` events.

The browser E2E intentionally visits the same `/experience` and `/auth` surfaces a customer uses. Before this boundary, those browser events reached the same telemetry table and used the same `MARA_TELEMETRY` marker as decision traffic.

That makes activation, return and commerce ratios unsafe as founder evidence.

## Decision-traffic contract

An accepted event is eligible for Public Alpha decision telemetry only when the server proves both:

1. `VERCEL_ENV=production`; and
2. `VERCEL_PROJECT_ID=prj_47YN2RH1i1NvaRTuEVqqbA8cdxUK` (the canonical Mara Vercel project).

This classification is server-side. The browser cannot opt itself into decision telemetry.

### Canonical production

Ordinary allowlisted events:

- may persist to `public.launch_events`;
- log with the `MARA_TELEMETRY` marker;
- may be consumed by the Alpha signal report subject to the existing aggregate-metric caveats.

### Canonical Preview / isolated proof / local runtime

Ordinary allowlisted product events:

- return `ok: true` so instrumentation never breaks the experience;
- return `persisted: false`;
- return `decisionEligible: false`;
- return `suppressed: true`;
- log under `MARA_QA_TELEMETRY`, not `MARA_TELEMETRY`;
- do not enter the decision dataset.

### Technical persistence probe

Hosted CI still needs to prove that the telemetry write path works against the configured backend.

Exactly these fixed QA surfaces may reach the persistence path outside canonical production:

- `/qa-telemetry-preview`
- `/qa-telemetry-proof`

The probe must be a `page_view`. It remains `decisionEligible: false` and logs under `MARA_QA_TELEMETRY` even if persistence succeeds.

This exception proves infrastructure, not user behavior.

## Historical-data boundary

Rows written before this fix are not automatically clean. The live table already contains hosted proof traffic that can resemble real `direct` sessions.

Therefore:

- do not use the pre-cutover `launch_events` population as a clean real-user baseline;
- do not delete historical rows merely to make metrics look cleaner;
- once this change reaches canonical production, record the exact production deployment timestamp/SHA as the clean measurement cutover;
- founder decisions after cutover should use only evidence generated under this contract.

## Privacy boundary

This change adds no:

- user ID;
- fingerprint;
- IP-derived identity;
- free-text content;
- intimate preference labels;
- vulnerability state;
- analytics vendor;
- database column/table.

Existing sanitized, anonymous telemetry constraints remain authoritative.

## Validation

Required before merge:

1. `npm run alpha:report:selftest`
2. `npm run typecheck`
3. `npm run build`
4. full production mobile smoke
5. `node scripts/telemetry-environment-smoke.mjs` against the locally started production build
6. PR CI green

A later hosted Preview/RC must continue proving the fixed QA persistence event can write while ordinary automated product behavior stays out of decision telemetry.

## Production boundary

This P0 does not authorize a production deploy and does not authorize merge.

**NO MERGE without Ignacio saying exactly `mergea`.**
