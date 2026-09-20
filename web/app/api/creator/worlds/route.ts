import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { isReservedCreatorHandle } from "@/lib/creator-site";
import { readOwnCreator, readOwnWorlds, type WorldRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { safeLocalReturn, serviceRest, slugify, userRest } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const existingSites = await readOwnWorlds(session.accessToken, creator.id);
  if (existingSites.length > 0) {
    return NextResponse.json({ error: "creator_site_already_exists" }, { status: 409 });
  }

  const form = await request.formData();
  const displayName = String(form.get("displayName") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const requestedSlug = String(form.get("slug") ?? displayName);
  const slug = slugify(requestedSlug, 80);
  const visibility = form.get("visibility") === "private" ? "private" : "public";
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

  const row: TablesInsert<"creator_worlds"> = {
    creator_id: creator.id,
    display_name: displayName,
    slug,
    description,
    visibility,
    status: "draft",
    persona: {},
    settings: {
      accent: "#efe5dc",
      primary_cta_label: "Ver lo que ofrece",
      modules: { memory: true, demand: true, offers: true },
    },
  };

  const result = await userRest<WorldRow[]>(session.accessToken, "creator_worlds", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.status === 409 ? "creator_handle_taken" : "creator_site_create_failed" },
      { status: result.status === 409 ? 409 : 502 },
    );
  }

  await serviceRest<unknown>(
    `creators?id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(session.user.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ onboarding_state: "setup", updated_at: new Date().toISOString() }),
    },
  );

  await emitProductEvent(request, "creator_site_created", {
    surface: "/creator",
    target: visibility,
  });

  const response = NextResponse.redirect(new URL(`${returnTo}?site=${encodeURIComponent(result.data[0]?.id ?? "")}&created=1`, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
