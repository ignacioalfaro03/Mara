import type { Json } from "@/lib/supabase/database.types";
import type { WorldRow } from "@/lib/mara-real-data";

export const RESERVED_CREATOR_HANDLES = new Set([
  "api","auth","creator","creators","experience","legal","library","me","meet-mara","shop","world",
  "_next","favicon","robots","sitemap","admin","settings","account","login","signup","signin","support",
  "help","privacy","terms","mara","www",
]);

const SAFE_HEX = /^#[0-9a-f]{6}$/i;

type JsonRecord = Record<string, Json | undefined>;

export type CreatorSiteConfig = {
  theme: "clean" | "bold" | "dark";
  avatarUrl: string | null;
  coverUrl: string | null;
  accent: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string | null;
  socials: {
    instagram: string | null;
    tiktok: string | null;
    x: string | null;
    youtube: string | null;
  };
  modules: {
    memory: boolean;
    demand: boolean;
    offers: boolean;
  };
};

function record(value: Json): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

export function isReservedCreatorHandle(slug: string) {
  return RESERVED_CREATOR_HANDLES.has(slug.trim().toLowerCase());
}

export function safeExternalUrl(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function safeAccent(value: unknown) {
  return typeof value === "string" && SAFE_HEX.test(value.trim()) ? value.trim().toLowerCase() : "#efe5dc";
}

export function creatorSiteConfig(site: WorldRow): CreatorSiteConfig {
  const persona = record(site.persona);
  const settings = record(site.settings);
  const socialsRaw = record((settings.socials ?? {}) as Json);
  const modulesRaw = record((settings.modules ?? {}) as Json);
  const theme = settings.theme === "bold" || settings.theme === "dark" ? settings.theme : "clean";
  return {
    theme,
    avatarUrl: safeExternalUrl(persona.avatar_url),
    coverUrl: safeExternalUrl(persona.cover_url),
    accent: safeAccent(settings.accent),
    primaryCtaLabel:
      typeof settings.primary_cta_label === "string" && settings.primary_cta_label.trim().length > 0
        ? settings.primary_cta_label.trim().slice(0, 60)
        : "Ver lo que ofrece",
    primaryCtaUrl: safeExternalUrl(settings.primary_cta_url),
    socials: {
      instagram: safeExternalUrl(socialsRaw.instagram),
      tiktok: safeExternalUrl(socialsRaw.tiktok),
      x: safeExternalUrl(socialsRaw.x),
      youtube: safeExternalUrl(socialsRaw.youtube),
    },
    modules: {
      memory: modulesRaw.memory !== false,
      demand: modulesRaw.demand !== false,
      offers: modulesRaw.offers !== false,
    },
  };
}

export function mergeCreatorSiteJson(existing: Json, next: Json): Json {
  return { ...record(existing), ...record(next) };
}

export function creatorSitePersona(input: { avatarUrl: unknown; coverUrl: unknown }): Json {
  return {
    avatar_url: safeExternalUrl(input.avatarUrl),
    cover_url: safeExternalUrl(input.coverUrl),
  };
}

export function creatorSiteSettings(input: {
  theme: unknown;
  accent: unknown;
  primaryCtaLabel: unknown;
  primaryCtaUrl: unknown;
  instagram: unknown;
  tiktok: unknown;
  x: unknown;
  youtube: unknown;
  memory: boolean;
  demand: boolean;
  offers: boolean;
}): Json {
  const primaryCtaLabel =
    typeof input.primaryCtaLabel === "string" ? input.primaryCtaLabel.trim().slice(0, 60) : "";
  const theme = input.theme === "bold" || input.theme === "dark" ? input.theme : "clean";
  return {
    theme,
    accent: safeAccent(input.accent),
    primary_cta_label: primaryCtaLabel || "Ver lo que ofrece",
    primary_cta_url: safeExternalUrl(input.primaryCtaUrl),
    socials: {
      instagram: safeExternalUrl(input.instagram),
      tiktok: safeExternalUrl(input.tiktok),
      x: safeExternalUrl(input.x),
      youtube: safeExternalUrl(input.youtube),
    },
    modules: {
      memory: input.memory,
      demand: input.demand,
      offers: input.offers,
    },
  };
}
