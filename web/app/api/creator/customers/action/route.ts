import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { safeLocalReturn, serviceRest, userRest } from "@/lib/supabase/server-rest";
import type { Tables } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const ACTIONS = new Set([
  "FULFILL",
  "POST_PURCHASE_FOLLOWUP",
  "COMPLETE_COLLECTION",
  "OFFER_MEMBERSHIP",
  "REACTIVATE_WITH_FREE_PREVIEW",
  "WAIT",
  "NO_ACTION",
]);

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const form = await request.formData();
  const customerUserId = String(form.get("userId") ?? "");
  const action = String(form.get("action") ?? "").toUpperCase();
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator");
  if (!customerUserId || !ACTIONS.has(action)) return NextResponse.json({ error: "invalid_creator_action" }, { status: 400 });

  const relationship = await userRest<Tables<"creator_customer_relationships">[]>(
    session.accessToken,
    `creator_customer_relationships?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(customerUserId)}&limit=1`,
  );
  if (!relationship.ok || !relationship.data[0]) return NextResponse.json({ error: "customer_not_authorized" }, { status: 404 });

  const updated = await serviceRest<unknown>(
    `creator_customer_relationships?creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(customerUserId)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ last_creator_action_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
    },
  );
  if (!updated.ok) return NextResponse.json({ error: "creator_action_update_failed" }, { status: 502 });

  await emitProductEvent(request, "creator_next_action_used", {
    surface: "/creator",
    target: action.toLowerCase(),
  });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
