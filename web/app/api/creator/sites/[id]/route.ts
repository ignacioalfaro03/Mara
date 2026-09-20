import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import {
  creatorSitePersona,
  creatorSiteSettings,
  isReservedCreatorHandle,
  mergeCreatorSiteJson,
} from "@/lib/creator-site";
import { readOwnCreator, type WorldRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { safeLocalReturn, serviceRest, slugify, userRest } from "@/lib/supabase/server-rest";
import type { TablesUpdate } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const { id } = await params;
  const existingResult = await userRest<WorldRow[]>(
    session.accessToken,
    `creator_worlds?select=*&id=eq.${encodeURIComponent(id)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`,
  );
  const existing = existingResult.ok ? existingResult.data[0] : null;
  if (!existing) return NextResponse.json({ error: "creator_site_not_authorized" }, { status: 403 });

  const form = await request.formData();
  const displayName = String(form.get("displayName") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const slug = slugify(String(form.get("slug") ?? ""), 80);
  const visibility = form.get("visibility") === "private" ? "private" : "public";
  const action = String(form.get("action") ?? "save");
  const status = action === "publish" ? "active" : action === "unpublish" ? "draft" : existing.status;
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator");

  if (
    displayName.length < 2 ||
    displayName.length > 80 ||
    description.length > 1200 ||
    slug.length < 2 ||
    isReservedCreatorHandle(slug)
  ) {
    return NextResponse.json({ error: "invalid_creator_site" }, { status: 400 });
  }

  const persona = creatorSitePersona({
    avatarUrl: form.get("avatarUrl"),
    coverUrl: form.get("coverUrl"),
  });
  const settings = creatorSiteSettings({
    accent: form.get("accent"),
    primaryCtaLabel: form.get("primaryCtaLabel"),
    primaryCtaUrl: form.get("primaryCtaUrl"),
    instagram: form.get("instagram"),
    tiktok: form.get("tiktok"),
    x: form.get("x"),
    youtube: form.get("youtube"),
    memory: form.get("moduleMemory") === "on",
    demand: form.get("moduleDemand") === "on",
    offers: form.get("moduleOffers") === "on",
  });

  const update: TablesUpdate<"creator_worlds"> = {
    display_name: displayName,
    description,
    slug,
    visibility,
    status,
    persona: mergeCreatorSiteJson(existing.persona, persona),
    settings: mergeCreatorSiteJson(existing.settings, settings),
  };

  const result = await userRest<WorldRow[]>(
    session.accessToken,
    `creator_worlds?id=eq.${encodeURIComponent(existing.id)}&creator_id=eq.${encodeURIComponent(creator.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(update),
    },
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.status === 409 ? "creator_handle_taken" : "creator_site_update_failed" },
      { status: result.status === 409 ? 409 : 502 },
    );
  }

  const publishedNow = existing.status !== "active" && status === "active";
  await emitProductEvent(request, publishedNow ? "creator_site_published" : "creator_site_updated", {
    surface: "/creator",
    target: visibility,
  });

  if (publishedNow) {
    await serviceRest<unknown>(
      `creators?id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(session.user.id)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ onboarding_state: "active", updated_at: new Date().toISOString() }),
      },
    );
  }

  const response = NextResponse.redirect(
    new URL(`${returnTo}?site=${encodeURIComponent(existing.id)}&saved=1`, request.url),
    303,
  );
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
