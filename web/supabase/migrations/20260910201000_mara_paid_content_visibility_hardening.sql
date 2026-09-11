-- Paid content discoverability vs entitlement hardening.
-- Versioned only; depends on 20260910200000_mara_product_realization_hardening.sql.
-- A paid_unlock content row is safe preview metadata. The private asset itself remains
-- server-delivered only after entitlement validation. Request/private-user offers may
-- never be attached to public paid content.

drop policy if exists creator_content_select_public_anon on public.creator_content;
create policy creator_content_select_public_anon
  on public.creator_content
  for select
  to anon
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
    and visibility in ('public', 'paid_unlock')
    and exists (
      select 1
      from public.creator_worlds w
      where w.id = creator_content.world_id
        and w.creator_id = creator_content.creator_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
    and (
      visibility <> 'paid_unlock'
      or exists (
        select 1 from public.commerce_offers o
        where o.id = creator_content.offer_id
          and o.creator_id = creator_content.creator_id
          and o.world_id = creator_content.world_id
          and o.status = 'active'
          and o.visibility = 'public'
      )
    )
  );

drop policy if exists creator_content_select_authenticated on public.creator_content;
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
            select 1 from public.creator_follows f
            where f.creator_id = creator_content.creator_id
              and f.user_id = (select auth.uid())
              and f.status in ('following', 'muted')
          )
        )
        or (
          visibility = 'paid_unlock'
          and exists (
            select 1 from public.commerce_offers o
            where o.id = creator_content.offer_id
              and o.creator_id = creator_content.creator_id
              and o.world_id = creator_content.world_id
              and o.status = 'active'
              and o.visibility = 'public'
          )
        )
      )
    )
  );

-- Rebuild owner write policies after offer visibility exists. Paid content may only
-- point at a creator-owned public offer. A private-user request offer cannot leak into feed.
drop policy if exists creator_content_insert_owner on public.creator_content;
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
      select 1 from public.creator_worlds w
      where w.id = creator_content.world_id
        and w.creator_id = creator_content.creator_id
    )
    and (
      offer_id is null
      or exists (
        select 1 from public.commerce_offers o
        where o.id = creator_content.offer_id
          and o.creator_id = creator_content.creator_id
          and o.world_id = creator_content.world_id
          and o.visibility = 'public'
      )
    )
  );

drop policy if exists creator_content_update_owner on public.creator_content;
create policy creator_content_update_owner
  on public.creator_content
  for update
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c
      where c.user_id = (select auth.uid())
        and c.status in ('pilot', 'active')
    )
  )
  with check (
    creator_id in (
      select c.id from public.creators c
      where c.user_id = (select auth.uid())
        and c.status in ('pilot', 'active')
    )
    and exists (
      select 1 from public.creator_worlds w
      where w.id = creator_content.world_id
        and w.creator_id = creator_content.creator_id
    )
    and (
      offer_id is null
      or exists (
        select 1 from public.commerce_offers o
        where o.id = creator_content.offer_id
          and o.creator_id = creator_content.creator_id
          and o.world_id = creator_content.world_id
          and o.visibility = 'public'
      )
    )
  );
