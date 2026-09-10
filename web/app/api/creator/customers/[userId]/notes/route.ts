import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator } from "@/lib/mara-real-data";
import type { CreatorCustomerNoteRow } from "@/lib/product-realization";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function resolveCreatorCustomer(accessToken: string, ownerUserId: string, customerUserId: string) {
  const creator = await readOwnCreator(accessToken, ownerUserId);
  if (!creator) return null;
  const relationship = await userRest<Array<{ creator_id: string; user_id: string }>>(
    accessToken,
    `creator_customer_relationships?select=creator_id,user_id&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(customerUserId)}&limit=1`,
  );
  return relationship.ok && relationship.data[0] ? creator : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  if (process.env.MARA_CRM_SYSTEM_ENABLED !== "true") return NextResponse.json({ enabled: false, notes: [] });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { userId } = await params;
  if (!UUID_LIKE.test(userId)) return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  const creator = await resolveCreatorCustomer(session.accessToken, session.user.id, userId);
  if (!creator) return NextResponse.json({ error: "customer_not_authorized" }, { status: 404 });

  const result = await userRest<CreatorCustomerNoteRow[]>(
    session.accessToken,
    `creator_customer_notes?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=50`,
  );
  const response = result.ok
    ? NextResponse.json({ enabled: true, notes: result.data })
    : NextResponse.json({ error: "customer_notes_read_failed" }, { status: 502 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  if (process.env.MARA_CRM_SYSTEM_ENABLED !== "true") return NextResponse.json({ error: "crm_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { userId } = await params;
  if (!UUID_LIKE.test(userId)) return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  const creator = await resolveCreatorCustomer(session.accessToken, session.user.id, userId);
  if (!creator) return NextResponse.json({ error: "customer_not_authorized" }, { status: 404 });

  const form = await request.formData();
  const action = String(form.get("action") ?? "create");
  const returnTo = safeLocalReturn(form.get("returnTo"), `/creator/customers/${userId}`);

  if (action === "delete") {
    const noteId = String(form.get("noteId") ?? "");
    if (!UUID_LIKE.test(noteId)) return NextResponse.json({ error: "invalid_note" }, { status: 400 });
    const deleted = await userRest<unknown>(
      session.accessToken,
      `creator_customer_notes?id=eq.${encodeURIComponent(noteId)}&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}`,
      { method: "DELETE", headers: { Prefer: "return=minimal" } },
    );
    if (!deleted.ok) return NextResponse.json({ error: "customer_note_delete_failed" }, { status: 502 });
  } else {
    const body = String(form.get("body") ?? "").trim();
    if (body.length < 1 || body.length > 4000) return NextResponse.json({ error: "invalid_note" }, { status: 400 });
    const created = await userRest<CreatorCustomerNoteRow[]>(session.accessToken, "creator_customer_notes", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ creator_id: creator.id, user_id: userId, body, created_by: session.user.id }),
    });
    if (!created.ok || !created.data[0]) return NextResponse.json({ error: "customer_note_create_failed" }, { status: 502 });
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
