-- Mara Product Realization core foundation.
--
-- This migration is intentionally VERSIONED ONLY on the product-realization branch.
-- Do not apply it to canonical production until the founder explicitly authorizes
-- the corresponding release/database activation gate.
--
-- Design rules:
-- - reuse creators, creator_worlds, commerce_offers, commerce_purchases and
--   commerce_entitlements as the canonical commercial backbone;
-- - price truth stays on commerce_offers, not duplicated on content rows;
-- - consumer private/paid media is never granted through broad table/storage read;
-- - creator-private CRM context never becomes consumer-visible;
-- - all public-schema tables have RLS and explicit Data API grants.

create table if not exists public.creator_follows (
  creator_id uuid not null references public.creators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'following'
    check (status in ('following', 'muted', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (creator_id, user_id)
);

create index if not exists creator_follows_user_status_idx
  on public.creator_follows (user_id, status, updated_at desc);
create index if not exists creator_follows_creator_status_idx
  on public.creator_follows (creator_id, status, updated_at desc);

alter table public.creator_follows enable row level security;

revoke all on table public.creator_follows from anon, authenticated;
grant select, insert, update, delete on table public.creator_follows to authenticated;
grant all on table public.creator_follows to service_role;

create policy creator_follows_select_own
  on public.creator_follows
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy creator_follows_insert_own
  on public.creator_follows
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.creators c
      where c.id = creator_follows.creator_id
        and c.status in ('pilot', 'active')
    )
  );

create policy creator_follows_update_own
  on public.creator_follows
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy creator_follows_delete_own
  on public.creator_follows
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger creator_follows_set_updated_at
before update on public.creator_follows
for each row execute function private.set_mara_commerce_updated_at();

create table if not exists public.creator_content (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  world_id uuid not null references public.creator_worlds(id) on delete cascade,
  offer_id uuid null references public.commerce_offers(id) on delete set null,
  type text not null
    check (type in ('text', 'photo', 'video', 'audio', 'gallery', 'bundle_preview', 'announcement', 'experience', 'event')),
  title text not null default '' check (char_length(title) <= 180),
  caption text not null default '' check (char_length(caption) <= 5000),
  visibility text not null default 'public'
    check (visibility in ('public', 'followers', 'members', 'paid_unlock', 'private', 'unlisted')),
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published', 'archived', 'removed')),
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint creator_content_paid_offer_required
    check (visibility <> 'paid_unlock' or offer_id is not null)
);

create index if not exists creator_content_world_feed_idx
  on public.creator_content (world_id, status, published_at desc nulls last, created_at desc);
create index if not exists creator_content_creator_feed_idx
  on public.creator_content (creator_id, status, published_at desc nulls last, created_at desc);
create index if not exists creator_content_offer_idx
  on public.creator_content (offer_id)
  where offer_id is not null;

alter table public.creator_content enable row level security;

revoke all on table public.creator_content from anon, authenticated;
grant select on table public.creator_content to anon;
grant select, insert, update, delete on table public.creator_content to authenticated;
grant all on table public.creator_content to service_role;

create policy creator_content_select_public_anon
  on public.creator_content
  for select
  to anon
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
    and visibility = 'public'
    and exists (
      select 1
      from public.creator_worlds w
      where w.id = creator_content.world_id
        and w.creator_id = creator_content.creator_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  );

create policy creator_content_select_authenticated
  on public.creator_content
  for select
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
    or (
      status = 'published'
      and published_at is not null
      and published_at <= now()
      and exists (
        select 1
        from public.creator_worlds w
        where w.id = creator_content.world_id
          and w.creator_id = creator_content.creator_id
          and w.status = 'active'
          and w.visibility = 'public'
      )
      and (
        visibility = 'public'
        or (
          visibility = 'followers'
          and exists (
            select 1
            from public.creator_follows f
            where f.creator_id = creator_content.creator_id
              and f.user_id = (select auth.uid())
              and f.status in ('following', 'muted')
          )
        )
        or (
          visibility = 'paid_unlock'
          and offer_id is not null
          and exists (
            select 1
            from public.commerce_entitlements e
            where e.user_id = (select auth.uid())
              and e.offer_id = creator_content.offer_id
              and e.status = 'active'
          )
        )
      )
    )
  );

create policy creator_content_insert_owner
  on public.creator_content
  for insert
  to authenticated
  with check (
    creator_id in (
      select c.id
      from public.creators c
      where c.user_id = (select auth.uid())
        and c.status in ('pilot', 'active')
    )
    and exists (
      select 1
      from public.creator_worlds w
      where w.id = creator_content.world_id
        and w.creator_id = creator_content.creator_id
    )
    and (
      offer_id is null
      or exists (
        select 1
        from public.commerce_offers o
        where o.id = creator_content.offer_id
          and o.creator_id = creator_content.creator_id
          and o.world_id = creator_content.world_id
      )
    )
  );

create policy creator_content_update_owner
  on public.creator_content
  for update
  to authenticated
  using (
    creator_id in (
      select c.id
      from public.creators c
      where c.user_id = (select auth.uid())
        and c.status in ('pilot', 'active')
    )
  )
  with check (
    creator_id in (
      select c.id
      from public.creators c
      where c.user_id = (select auth.uid())
        and c.status in ('pilot', 'active')
    )
    and exists (
      select 1
      from public.creator_worlds w
      where w.id = creator_content.world_id
        and w.creator_id = creator_content.creator_id
    )
    and (
      offer_id is null
      or exists (
        select 1
        from public.commerce_offers o
        where o.id = creator_content.offer_id
          and o.creator_id = creator_content.creator_id
          and o.world_id = creator_content.world_id
      )
    )
  );

create policy creator_content_delete_owner
  on public.creator_content
  for delete
  to authenticated
  using (
    creator_id in (
      select c.id
      from public.creators c
      where c.user_id = (select auth.uid())
        and c.status in ('pilot', 'active')
    )
  );

create trigger creator_content_set_updated_at
  before update on public.creator_content
  for each row execute function private.set_mara_commerce_updated_at();

create table if not exists public.creator_content_media (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.creator_content(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video', 'audio', 'file')),
  bucket text not null,
  object_path text not null,
  preview_bucket text null,
  preview_object_path text null,
  sort_order integer not null default 0 check (sort_order >= 0),
  width integer null check (width is null or width > 0),
  height integer null check (height is null or height > 0),
  duration_seconds integer null check (duration_seconds is null or duration_seconds >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (content_id, sort_order)
);

create index if not exists creator_content_media_content_idx
  on public.creator_content_media (content_id, sort_order);

alter table public.creator_content_media enable row level security;

-- Consumer media metadata is deliberately server-mediated. The browser never
-- receives unrestricted private bucket/object paths from the Data API.
revoke all on table public.creator_content_media from anon, authenticated;
grant select, insert, update, delete on table public.creator_content_media to authenticated;
grant all on table public.creator_content_media to service_role;

create policy creator_content_media_owner_all
  on public.creator_content_media
  for all
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
  )
  with check (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.creator_content cc
      where cc.id = creator_content_media.content_id
        and cc.creator_id = creator_content_media.creator_id
    )
  );

create table if not exists public.creator_customer_private_context (
  creator_id uuid not null references public.creators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  weakness_note text null check (weakness_note is null or char_length(weakness_note) <= 2000),
  commercial_context jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (creator_id, user_id)
);

alter table public.creator_customer_private_context enable row level security;

revoke all on table public.creator_customer_private_context from anon, authenticated;
grant select, insert, update, delete on table public.creator_customer_private_context to authenticated;
grant all on table public.creator_customer_private_context to service_role;

create policy creator_customer_private_context_creator_only
  on public.creator_customer_private_context
  for all
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
  )
  with check (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.creator_customer_relationships r
      where r.creator_id = creator_customer_private_context.creator_id
        and r.user_id = creator_customer_private_context.user_id
    )
    and created_by = (select auth.uid())
    and updated_by = (select auth.uid())
  );

create trigger creator_customer_private_context_set_updated_at
  before update on public.creator_customer_private_context
  for each row execute function private.set_mara_commerce_updated_at();

create table if not exists public.creator_customer_notes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_customer_notes_timeline_idx
  on public.creator_customer_notes (creator_id, user_id, created_at desc);

alter table public.creator_customer_notes enable row level security;

revoke all on table public.creator_customer_notes from anon, authenticated;
grant select, insert, update, delete on table public.creator_customer_notes to authenticated;
grant all on table public.creator_customer_notes to service_role;

create policy creator_customer_notes_select_creator
  on public.creator_customer_notes
  for select
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
  );

create policy creator_customer_notes_insert_creator
  on public.creator_customer_notes
  for insert
  to authenticated
  with check (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.creator_customer_relationships r
      where r.creator_id = creator_customer_notes.creator_id
        and r.user_id = creator_customer_notes.user_id
    )
    and created_by = (select auth.uid())
  );

create policy creator_customer_notes_update_creator
  on public.creator_customer_notes
  for update
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
  )
  with check (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
    and created_by = (select auth.uid())
  );

create policy creator_customer_notes_delete_creator
  on public.creator_customer_notes
  for delete
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c where c.user_id = (select auth.uid())
    )
  );

create trigger creator_customer_notes_set_updated_at
  before update on public.creator_customer_notes
  for each row execute function private.set_mara_commerce_updated_at();
