-- Mara premium catalog assets are intentionally server-delivered.
-- Keep this bucket PRIVATE. Do not add broad authenticated SELECT policies:
-- /api/commerce/content/[slug] verifies the user's commerce entitlement first
-- and fetches the object with server-only credentials.
--
-- This migration is versioned here but must not be applied to the live project
-- until the founder explicitly authorizes the release/storage activation gate.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'mara-premium',
  'mara-premium',
  false,
  209715200,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'text/plain',
    'application/json',
    'application/pdf'
  ]::text[]
)
on conflict (id) do nothing;

-- Deliberately no storage.objects SELECT policy here.
-- The private asset delivery route uses a server secret after verifying the
-- user's active commerce entitlement. This keeps storage URLs from becoming
-- a second, weaker authorization system.
