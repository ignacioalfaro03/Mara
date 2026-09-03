-- Mara Vera — minimal cross-device relationship continuity.
-- This stores product continuity only; it does not add inferred intimate or vulnerability labels.

alter table public.relationship_state
  add column if not exists launch_completed boolean not null default false;
