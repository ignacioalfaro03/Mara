# P0 Identity + Preference Memory Test Plan

Issue: #5

## Objective

Validate that Mara can remember a user's literal choices across sessions/devices without turning registration into a funnel wall or persisting sensitive inferred labels.

## Functional smoke

1. Backend not configured:
   - `/experience` still works;
   - visual choice renders using canonical Mara fallback;
   - choosing A/B does not interrupt the experience;
   - choice is queued locally;
   - account CTA remains hidden if backend is unavailable.

2. Backend configured:
   - `/auth` renders;
   - signup rejects missing 18+ confirmation;
   - signup validates email/password;
   - signin creates `httpOnly` session cookies;
   - `/api/auth/me` returns authenticated state;
   - signout clears session cookies.

3. Preference persistence:
   - user chooses `pose_a` or `pose_b`;
   - generic Alpha analytics receives only `visual_choice_completed`, never selected option;
   - signed-in choice inserts exactly one `preference_events` row;
   - signed-out choice is queued locally;
   - after sign-in, pending choices flush to the private table;
   - duplicate `client_event_id` is idempotent.

4. RLS isolation:
   - anon cannot select any private table;
   - user A cannot select/update user B profile/state;
   - user A cannot insert a preference event with `user_id = B`;
   - user A can read their own preference events.

## Product quality

The interaction should feel like Mara asking for an opinion, not like research:

> `¿Cuál te gusta más?`

> `No lo pienses tanto. La primera reacción vale más.`

After choosing:

> `No voy a inventarme una teoría sobre ti por una foto. Pero sí me acuerdo de cuál elegiste.`

## Asset quality gate

Dedicated A/B pose assets are not required for the code path to work, but they are required before treating the visual-choice hypothesis as a meaningful creative test.

Both assets must:
- depict the same canonical adult Mara;
- be provocative but non-explicit;
- avoid copying a real creator's face/body identity;
- have meaningfully different pose/composition so the choice contains signal;
- keep option IDs stable for the experiment version.

## Data interpretation

A selected pose means only:

`In this context, this user selected this option over the alternative.`

It does **not** mean:
- sexual orientation;
- fetish identity;
- personality type;
- arousal level;
- willingness to pay;
- vulnerability state.

## Deployment boundary

Do not connect a live database or deploy this branch without a dedicated Mara project, environment configuration, migration verification and founder authorization.

No merge without `mergea`.
