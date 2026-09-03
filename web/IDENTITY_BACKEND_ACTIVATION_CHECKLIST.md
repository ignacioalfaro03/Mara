# Identity + Preference Memory — activation checklist

Status date: 2026-09-03

This checklist distinguishes **implemented**, **verified**, **configured**, **deployed** and **live**. Those states are not interchangeable.

## Already implemented and verified

- Dedicated Supabase project: `Mara_vera` / `hctykprkwenhatbjxkpb` / `sa-east-1`.
- Mara data is isolated from Rivalia.
- `public.profiles`, `public.preference_events`, `public.relationship_state` exist.
- RLS is enabled on every exposed Mara table.
- Own-row RLS policies are present for authenticated users.
- Auth user trigger creates profile + relationship state.
- Visual preference events are append-only/idempotent and restricted to the P0 allowlist.
- Relationship memory includes first/last seen, return count, launch completion and latest literal visual choice.
- Relationship snapshots merge atomically through `merge_mara_relationship_state`.
- Monotonic guarantees verified against the real Mara database:
  - return count does not decrease;
  - first seen keeps the earliest timestamp;
  - last seen keeps the latest timestamp;
  - launch completion cannot revert to false;
  - stale relationship snapshots cannot overwrite an existing visual-choice projection.
- Two authenticated test identities verified RLS isolation; test data was rolled back/removed.
- Supabase Security Advisor: 0 findings after current DDL.
- Supabase Performance Advisor: 0 findings after current DDL.
- CI validates the backendless experience plus the browser remote-hydration contract in a clean second context.

## Manual hosted configuration still required before backend-connected browser validation

### Supabase Auth

Dashboard → `Mara_vera` → Authentication → URL Configuration

- Site URL: `https://mara-vera.vercel.app`
- Keep redirect allowlist minimal. The P0 password signup can use the Site URL as its confirmation destination; do not add preview/wildcard redirects until a flow actually needs them.
- Authentication → Providers / Email: verify email/password is enabled and email confirmation posture matches the Alpha decision.

Current P0 UX already handles both Supabase outcomes:
- immediate session returned; or
- account created but email confirmation required.

### Vercel

Canonical project: `mara-vera` (`prj_47YN2RH1i1NvaRTuEVqqbA8cdxUK`)

Add the Mara Supabase **publishable** configuration to the intended deployment environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never add a service-role key, database password or JWT secret to browser-exposed variables.

## Creative asset gate

Before treating `pose_pair_launch_v1` as a meaningful preference experiment, configure two genuinely distinct adult, provocative-but-non-explicit images of the **same canonical Mara**:

- `NEXT_PUBLIC_MARA_POSE_A_IMAGE`
- `NEXT_PUBLIC_MARA_POSE_B_IMAGE`

Until then both slots intentionally fall back to the canonical Mara asset and the interaction is functional but not a valid visual A/B preference signal.

## Required verification after hosted configuration

Use a non-production or explicitly authorized target where possible:

1. Clean browser → complete first experience → choose a pose → create temporary account.
2. Verify `profiles`, `preference_events`, `relationship_state` for that account.
3. Sign out.
4. Second browser context with empty storage → sign in to same account.
5. Verify Mara hydrates remote continuity and remembers the literal visual choice.
6. Continue once and verify return count increments monotonically.
7. Create a second temporary user and confirm RLS isolation through the HTTP/Auth path.
8. Remove all QA users/data.
9. Re-run Security + Performance advisors.
10. Run full mobile/browser smoke.

## Founder gates

- **NO MERGE** until the founder says exactly `mergea`.
- **NO production activation/deployment** of this identity-memory layer without separate explicit production authorization.
- Payments, subscriptions, checkout and merchant activation remain out of scope.
