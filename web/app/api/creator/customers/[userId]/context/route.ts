import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator } from "@/lib/mara-real-data";
import type { CreatorCustomerPrivateContextRow } from "@/lib/product-realization";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function authorizedCustomer(accessToken: string, creatorId: string, userId: string) {
  const result = await userRest<Array<{ creator_id: string; user_id: string }>>(
    accessToken,
    `creator_customer_relationships?select=creator_id,user_id&creator_id=eq.${encodeURIComponent(creatorId)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
  );
  return result.ok && Boolean(result.data[0]);
}

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  if (process.env.MARA_CRM_SYSTEM_ENABLED !== "true") return NextResponse.json({ enabled: false, context: null });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { userId } = await params;
  if (!UUID_LIKE.test(userId)) return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !(await authorizedCustomer(session.accessToken, creator.id, userId))) return NextResponse.json({ error: "customer_not_authorized" }, { status: 404 });

  const result = await userRest<CreatorCustomerPrivateContextRow[]>(
    session.accessToken,
    `creator_customer_private_context?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
  );
  const response = result.ok
    ? NextResponse.json({ enabled: true, context: result.data[0] ?? null })
    : NextResponse.json({ error: "customer_context_read_failed" }, { status: 502 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  if (process.env.MARA_CRM_SYSTEM_ENABLED !== "true") return NextResponse.json({ error: "crm_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { userId } = await params;
  if (!UUID_LIKE.test(userId)) return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !(await authorizedCustomer(session.accessToken, creator.id, userId))) return NextResponse.json({ error: "customer_not_authorized" }, { status: 404 });

  const form = await request.formData();
  const weaknessNote = String(form.get("weaknessNote") ?? "").trim();
  const returnTo = safeLocalReturn(form.get("returnTo"), `/creator/customers/${userId}`);
  if (weaknessNote.length > 2000) return NextResponse.json({ error: "context_too_long" }, { status: 400 });

  const result = await userRest<CreatorCustomerPrivateContextRow[]>(
    session.accessToken,
    "creator_customer_private_context?on_conflict=creator_id,user_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        creator_id: creator.id,
        user_id: userId,
        weakness_note: weaknessNote || null,
        commercial_context: {},
        created_by: session.user.id,
        updated_by: session.user.id,
      }),
    },
  );
  if (!result.ok) return NextResponse.json({ error: "customer_context_write_failed" }, { status: 502 });

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
