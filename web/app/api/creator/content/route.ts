import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, readOwnWorlds, type OfferRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability, type CreatorContentRow, type CreatorContentType, type CreatorContentVisibility } from "@/lib/product-realization";
import { safeLocalReturn, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const TYPES = new Set<CreatorContentType>(["text", "photo", "video", "audio", "gallery", "bundle_preview", "announcement", "experience", "event"]);
const VISIBILITIES = new Set<CreatorContentVisibility>(["public", "followers", "members", "paid_unlock", "private", "unlisted"]);
const STATUSES = new Set(["draft", "scheduled", "published", "archived"]);
const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function offerIsRequestScoped(offer: OfferRow) {
  if (!offer.metadata || typeof offer.metadata !== "object" || Array.isArray(offer.metadata)) return false;
  return typeof (offer.metadata as Record<string, unknown>).request_id === "string";
}

export async function GET() {
  if (!productCapability("content")) return NextResponse.json({ enabled: false, items: [] });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const result = await userRest<CreatorContentRow[]>(
    session.accessToken,
    `creator_content?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&order=updated_at.desc&limit=100`,
  );
  const response = result.ok
    ? NextResponse.json({ enabled: true, items: result.data })
    : NextResponse.json({ error: "content_read_failed" }, { status: 502 });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}

export async function POST(request: Request) {
  if (!productCapability("content")) return NextResponse.json({ error: "content_system_disabled" }, { status: 404 });
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });

  const form = await request.formData();
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator");
  const worldId = String(form.get("worldId") ?? "");
  const typeRaw = String(form.get("type") ?? "text") as CreatorContentType;
  const visibilityRaw = String(form.get("visibility") ?? "public") as CreatorContentVisibility;
  const status = String(form.get("status") ?? "draft");
  const title = String(form.get("title") ?? "").trim();
  const caption = String(form.get("caption") ?? "").trim();
  const offerIdRaw = String(form.get("offerId") ?? "").trim();
  const offerId = offerIdRaw && UUID_LIKE.test(offerIdRaw) ? offerIdRaw : null;

  if (!TYPES.has(typeRaw) || !VISIBILITIES.has(visibilityRaw) || !STATUSES.has(status)) {
    return NextResponse.json({ error: "invalid_content_state" }, { status: 400 });
  }
  if (!worldId || title.length > 180 || caption.length > 5000 || (!title && !caption)) {
    return NextResponse.json({ error: "invalid_content" }, { status: 400 });
  }
  if (visibilityRaw === "members") return NextResponse.json({ error: "membership_content_not_activated" }, { status: 409 });
  if (visibilityRaw === "paid_unlock" && !offerId) return NextResponse.json({ error: "paid_content_requires_offer" }, { status: 400 });

  const worlds = await readOwnWorlds(session.accessToken, creator.id);
  if (!worlds.some((world) => world.id === worldId)) return NextResponse.json({ error: "world_not_owned" }, { status: 403 });

  if (offerId) {
    const offerResult = await userRest<OfferRow[]>(
      session.accessToken,
      `commerce_offers?select=*&id=eq.${encodeURIComponent(offerId)}&creator_id=eq.${encodeURIComponent(creator.id)}&world_id=eq.${encodeURIComponent(worldId)}&status=eq.active&limit=1`,
    );
    const offer = offerResult.ok ? offerResult.data[0] ?? null : null;
    if (!offer) return NextResponse.json({ error: "content_offer_not_available" }, { status: 404 });
    if (offerIsRequestScoped(offer)) return NextResponse.json({ error: "private_request_offer_cannot_be_published" }, { status: 409 });
  }

  const result = await userRest<CreatorContentRow[]>(session.accessToken, "creator_content", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: creator.id,
      world_id: worldId,
      offer_id: offerId,
      type: typeRaw,
      title,
      caption,
      visibility: visibilityRaw,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      metadata: {},
    }),
  });
  if (!result.ok || !result.data[0]) return NextResponse.json({ error: "content_create_failed" }, { status: 502 });

  if (status === "published") {
    await emitProductEvent(request, "content_published", { surface: "/creator", target: typeRaw });
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
