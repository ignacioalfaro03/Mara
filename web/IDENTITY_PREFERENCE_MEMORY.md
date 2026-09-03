# Mara Vera — Identity + Preference Memory

Status: implementation branch for Issue #5. No production database has been created or connected yet.

## Product rule

**PLAY FIRST. REGISTER WHEN CONTINUITY HAS VALUE.**

Mara must not become a registration form. The first-party experience can run without an account. When the user has made choices worth remembering, Mara may offer an optional account so those choices persist across devices.

## What we persist

Authenticated, private, user-owned data only:

- account identity in Supabase Auth;
- minimal private `profiles` row;
- literal `preference_events` such as `pose_a` selected over `pose_b`;
- low-sensitivity `relationship_state` counters/timestamps.

## What we do not persist

- inferred sexual orientation or identity;
- loneliness, distress, dependency or arousal labels;
- intimate free text;
- contact graph / address book;
- fingerprints;
- vulnerability-based commercial segments;
- payment data in this layer.

Permanent rule:

> **STORE THE CHOICE. DO NOT INVENT THE PERSON.**

## Visual choice v1

Canonical group: `pose_pair_launch_v1`.

The UX asks:

> `¿Cuál te gusta más?`

Two adult, provocative but non-explicit images of the same canonical Mara may be presented. Option IDs remain deterministic (`pose_a`, `pose_b`) even if creative assets are refreshed within a controlled experiment version.

Until dedicated pose assets exist, both slots safely fall back to Mara's canonical runtime portrait. This keeps implementation shippable without introducing a second inconsistent woman.

The selected option is private preference data. Generic Alpha analytics should record completion of the interaction, not the intimate option value.

## Backend

Recommended dedicated Supabase project for Mara, separate from Rivalia or any other product.

Required public Vercel variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never expose a Supabase secret/service-role key to the browser.

Apply:

`supabase/migrations/20260903_identity_preference_memory.sql`

Then run Supabase security/performance advisors and verify:

1. unauthenticated callers cannot read `profiles`, `preference_events` or `relationship_state`;
2. user A cannot read/write user B rows;
3. authenticated user can insert an allowed visual-choice event for self;
4. duplicate `client_event_id` is idempotent;
5. `/api/auth/signup`, `/api/auth/signin`, `/api/auth/me` and `/api/preferences` behave correctly;
6. no secret key appears in the client bundle.

## Auth implementation

The branch intentionally adds no new NPM dependency. The Next.js server routes call Supabase Auth/PostgREST over HTTPS using the project's **publishable** key. Access and refresh tokens are kept in `httpOnly`, `SameSite=Lax` cookies and validated server-side against Supabase Auth before protected writes.

This can later migrate to `@supabase/ssr` if/when the dependency is added with a pinned version + lockfile update. The data/RLS contract remains the same.

## Launch boundary

No payments, subscriptions, processor activation or commercial pressure is introduced here.

No merge without founder authorization: `mergea`.
