# MARA VERA — PRIVATE MOMENT READINESS

## Outcome

This slice proves a bounded Private Moment loop on top of the existing DM, relationship state and commerce kernel.

North star:

> **DON'T BE THE PORN. OWN THE MOMENT.**

Mara should become the preferred place a user opens when they explicitly want a private/intimate moment, without exposing a fetish catalogue or turning every high-interest moment into a checkout.

## Implemented contract

- Explicit user entry through `Hoy manda tú`.
- Two bounded session styles: `direct` and `slow`.
- Explicit style choice only; no inferred arousal, loneliness, desperation or vulnerability.
- Anonymous users keep local-first continuity.
- Authenticated users can project the chosen style and coarse session history onto the existing `relationship_state` table.
- First private session is free-value-first and commerce stays closed.
- From the second completed private session, the existing fixed unlock can become eligible if there is no recent offer fatigue.
- A shown offer creates a 7-day cooldown before this policy can show another private-moment offer.
- Existing `private_after_scene_note_v1` checkout/entitlement truth is reused; no second commerce engine.
- Declining the offer does not freeze or degrade the relationship.
- Free-text intimate conversation is not persisted by this slice and is not sent through public telemetry.

## Commercial readiness V1

The current policy is deliberately small and deterministic:

1. `private_session_count < 2` → `closed / free_value_first`.
2. offer shown in the previous 7 days → `closed / offer_fatigue`.
3. otherwise → `offer_now / repeat_session_context`.

This is a product contract, not a claim of an ML propensity model.

## Data minimization

Persist only:

- `preferred_private_style`: `direct | slow | null`;
- `private_session_count`;
- `last_private_session_at`;
- `last_private_offer_at`.

Do not persist raw intimate text, inferred sexual state, vulnerability/dependency scores, or a hidden fetish taxonomy in this slice.

## Proof boundary

CI/mobile smoke can prove:

- explicit private-moment entry;
- first-session commerce closed;
- explicit preference persisted locally;
- second-session preference reuse;
- second-session offer eligibility;
- offer-view cooldown timestamp;
- decline without relationship freeze;
- simulated clean-device hydration of authenticated-style memory contract.

It does **not** prove the new Supabase migration has been applied live, real cross-device persistence, real hosted preview behavior, a payment processor, voice generation, or open-ended sexual AI chat.

No production deploy.
No merge without exact founder command `mergea`.
