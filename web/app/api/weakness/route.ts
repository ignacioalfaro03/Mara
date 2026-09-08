import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readWeakness, type DeclaredPreferenceRow, type WorldRow } from "@/lib/mara-real-data";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

async function resolveWorld(accessToken: string, worldId: string, creatorId: string) {
  if (!worldId || !creatorId) return null;
  const result = await userRest<WorldRow[]>(accessToken, `creator_worlds?select=*&id=eq.${encodeURIComponent(worldId)}&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`);
  return result.ok ? result.data[0] ?? null : null;
}

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const form = await request.formData();
  const action = String(form.get("action") ?? "save");
  const scope = form.get("scope") === "creator_world" ? "creator_world" : "network";
  const creatorId = String(form.get("creatorId") ?? "");
  const worldId = String(form.get("worldId") ?? "");
  const valueText = String(form.get("valueText") ?? "").trim();
  const returnTo = safeLocalReturn(form.get("returnTo"), "/me/history");
  const world = scope === "creator_world" ? await resolveWorld(session.accessToken, worldId, creatorId) : null;
  if (scope === "creator_world" && !world) return NextResponse.json({ error: "world_unavailable" }, { status: 404 });

  const existing = await readWeakness(session.accessToken, session.user.id, world);
  if (action === "delete") {
    if (existing) {
      const deleted = await userRest<unknown>(session.accessToken, `user_declared_preferences?id=eq.${encodeURIComponent(existing.id)}&user_id=eq.${encodeURIComponent(session.user.id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
      if (!deleted.ok) return NextResponse.json({ error: "weakness_delete_failed" }, { status: 502 });
    }
  } else {
    if (valueText.length < 1 || valueText.length > 1000) return NextResponse.json({ error: "invalid_weakness" }, { status: 400 });
    const creatorVisible = scope === "creator_world" && form.get("creatorVisible") === "on";
    if (existing) {
      const updated = await userRest<DeclaredPreferenceRow[]>(session.accessToken, `user_declared_preferences?id=eq.${encodeURIComponent(existing.id)}&user_id=eq.${encodeURIComponent(session.user.id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ value_text: valueText, creator_visible: creatorVisible, source: "user_edit", last_confirmed_at: new Date().toISOString() }),
      });
      if (!updated.ok) return NextResponse.json({ error: "weakness_update_failed" }, { status: 502 });
    } else {
      const row: TablesInsert<"user_declared_preferences"> = {
        user_id: session.user.id,
        preference_type: "weakness",
        value_text: valueText,
        scope,
        source: "user_free_text",
        creator_visible: creatorVisible,
        creator_id: world?.creator_id ?? null,
        world_id: world?.id ?? null,
      };
      const inserted = await userRest<DeclaredPreferenceRow[]>(session.accessToken, "user_declared_preferences", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      });
      if (!inserted.ok) return NextResponse.json({ error: "weakness_save_failed" }, { status: 502 });
    }
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
