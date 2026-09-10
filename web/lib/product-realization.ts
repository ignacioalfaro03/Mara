import { first, publicRest, serviceRest, userRest } from "@/lib/supabase/server-rest";
import type { WorldRow, OfferRow } from "@/lib/mara-real-data";

export type CreatorFollowStatus = "following" | "muted" | "blocked";

export type CreatorFollowRow = {
  creator_id: string;
  user_id: string;
  status: CreatorFollowStatus;
  created_at: string;
  updated_at: string;
};

export type CreatorContentType =
  | "text"
  | "photo"
  | "video"
  | "audio"
  | "gallery"
  | "bundle_preview"
  | "announcement"
  | "experience"
  | "event";

export type CreatorContentVisibility = "public" | "followers" | "members" | "paid_unlock" | "private" | "unlisted";

export type CreatorContentRow = {
  id: string;
  creator_id: string;
  world_id: string;
  offer_id: string | null;
  type: CreatorContentType;
  title: string;
  caption: string;
  visibility: CreatorContentVisibility;
  status: "draft" | "scheduled" | "published" | "archived" | "removed";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
};

export type CreatorContentMediaRow = {
  id: string;
  content_id: string;
  creator_id: string;
  media_type: "image" | "video" | "audio" | "file";
  bucket: string;
  object_path: string;
  preview_bucket: string | null;
  preview_object_path: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type CreatorCustomerPrivateContextRow = {
  creator_id: string;
  user_id: string;
  weakness_note: string | null;
  commercial_context: Record<string, unknown>;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

export type CreatorCustomerNoteRow = {
  id: string;
  creator_id: string;
  user_id: string;
  body: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type PublicCreator = {
  creatorId: string;
  worldId: string;
  slug: string;
  displayName: string;
  description: string;
  persona: Record<string, unknown>;
  followerCount: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function productCapability(name: "follow" | "content" | "messaging" | "requests" | "memberships") {
  const key = `MARA_${name.toUpperCase()}_SYSTEM_ENABLED`;
  return process.env[key] === "true";
}

export async function readPublicCreators(limit = 24): Promise<PublicCreator[]> {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const worlds = await publicRest<WorldRow[]>(
    `creator_worlds?select=*&status=eq.active&visibility=eq.public&order=updated_at.desc&limit=${safeLimit}`,
  );
  if (!worlds.ok || worlds.data.length === 0) return [];

  const creatorIds = [...new Set(worlds.data.map((world) => world.creator_id))];
  const followed = productCapability("follow")
    ? await serviceRest<Array<{ creator_id: string }>>(
        `creator_follows?select=creator_id&status=in.(following,muted)&creator_id=in.(${creatorIds.map(encodeURIComponent).join(",")})`,
      )
    : null;
  const countByCreator = new Map<string, number>();
  if (followed?.ok) {
    for (const row of followed.data) countByCreator.set(row.creator_id, (countByCreator.get(row.creator_id) ?? 0) + 1);
  }

  return worlds.data.map((world) => ({
    creatorId: world.creator_id,
    worldId: world.id,
    slug: world.slug,
    displayName: world.display_name,
    description: world.description,
    persona: asRecord(world.persona),
    followerCount: countByCreator.get(world.creator_id) ?? 0,
  }));
}

export async function readCreatorFeed(accessToken?: string, worldId?: string, limit = 30): Promise<CreatorContentRow[]> {
  if (!productCapability("content")) return [];
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const worldFilter = worldId ? `&world_id=eq.${encodeURIComponent(worldId)}` : "";
  const path = `creator_content?select=*&status=eq.published${worldFilter}&order=published_at.desc.nullslast,created_at.desc&limit=${safeLimit}`;
  const result = accessToken
    ? await userRest<CreatorContentRow[]>(accessToken, path)
    : await publicRest<CreatorContentRow[]>(path);
  return result.ok ? result.data : [];
}

export async function readCreatorFollow(accessToken: string, userId: string, creatorId: string) {
  if (!productCapability("follow")) return null;
  return first(
    await userRest<CreatorFollowRow[]>(
      accessToken,
      `creator_follows?select=*&user_id=eq.${encodeURIComponent(userId)}&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`,
    ),
  );
}

export async function readCreatorCustomerPrivateContext(accessToken: string, creatorId: string, userId: string) {
  if (!productCapability("content")) return null;
  return first(
    await userRest<CreatorCustomerPrivateContextRow[]>(
      accessToken,
      `creator_customer_private_context?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    ),
  );
}

export async function readCreatorCustomerNotes(accessToken: string, creatorId: string, userId: string, limit = 30) {
  if (!productCapability("content")) return [] as CreatorCustomerNoteRow[];
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const result = await userRest<CreatorCustomerNoteRow[]>(
    accessToken,
    `creator_customer_notes?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=${safeLimit}`,
  );
  return result.ok ? result.data : [];
}

export async function readOfferForContent(accessToken: string | undefined, offerId: string | null) {
  if (!offerId) return null;
  const path = `commerce_offers?select=*&id=eq.${encodeURIComponent(offerId)}&limit=1`;
  return first(accessToken ? await userRest<OfferRow[]>(accessToken, path) : await publicRest<OfferRow[]>(path));
}
