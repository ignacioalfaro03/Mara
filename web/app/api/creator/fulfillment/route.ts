import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type PurchaseRow } from "@/lib/mara-real-data";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

type FulfillmentResult = {
  purchase_id: string;
  fulfilled_at: string;
};

export async function POST(request: Request) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const form = await request.formData();
  const purchaseId = String(form.get("purchaseId") ?? "");
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator");
  const purchaseResult = await userRest<PurchaseRow[]>(session.accessToken, `commerce_purchases?select=*&id=eq.${encodeURIComponent(purchaseId)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`);
  const purchase = purchaseResult.ok ? purchaseResult.data[0] : null;
  if (!purchase) return NextResponse.json({ error: "purchase_not_authorized" }, { status: 404 });
  if (purchase.status !== "succeeded") return NextResponse.json({ error: "purchase_not_fulfillable" }, { status: 409 });

  if (!purchase.fulfilled_at) {
    const fulfilled = await userRest<FulfillmentResult[]>(session.accessToken, "rpc/complete_mara_creator_fulfillment", {
      method: "POST",
      body: JSON.stringify({ p_purchase_id: purchase.id }),
    });
    if (!fulfilled.ok) return NextResponse.json({ error: "fulfillment_failed" }, { status: fulfilled.status === 400 ? 409 : 502 });
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
