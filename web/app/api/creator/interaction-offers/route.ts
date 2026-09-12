import { NextResponse } from "next/server";
import { getVerifiedSession, setSessionCookies } from "@/lib/auth-session";
import { readOwnCreator, type OfferRow, type WorldRow } from "@/lib/mara-real-data";
import { emitProductEvent } from "@/lib/product-telemetry";
import { productCapability } from "@/lib/product-realization";
import { safeLocalReturn, serviceRest, slugify, userRest } from "@/lib/supabase/server-rest";

export const runtime = "nodejs";

const INTERACTION_KINDS = new Set(["time_boxed_chat", "audio", "photo", "video", "message", "bundle"]);
const CURRENCIES = new Set(["CLP", "USD", "EUR"]);
const MAX_MAJOR = 10_000_000;

function withSession(response: NextResponse, refreshedSession: Parameters<typeof setSessionCookies>[1] | null | undefined) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

export async function POST(request: Request) {
  if (!productCapability("paid_interactions")) {
    return NextResponse.json({ error: "paid_interactions_disabled" }, { status: 404 });
  }

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator || !["pilot", "active"].includes(creator.status)) {
    return NextResponse.json({ error: "creator_not_authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const worldId = String(form.get("worldId") ?? "");
  const interactionKind = String(form.get("interactionKind") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const currency = String(form.get("currency") ?? "CLP").toUpperCase();
  const priceMajor = Number(form.get("price") ?? 0);
  const durationMinutes = Number(form.get("durationMinutes") ?? 0);
  const turnaroundHours = Number(form.get("turnaroundHours") ?? 0);
  const status = form.get("status") === "draft" ? "draft" : "active";
  const returnTo = safeLocalReturn(form.get("returnTo"), "/creator/monetization");

  if (
    !INTERACTION_KINDS.has(interactionKind) ||
    title.length < 2 || title.length > 140 ||
    description.length < 2 || description.length > 1200 ||
    !CURRENCIES.has(currency) ||
    !Number.isFinite(priceMajor) || priceMajor <= 0 || priceMajor > MAX_MAJOR
  ) {
    return NextResponse.json({ error: "invalid_paid_interaction_offer" }, { status: 400 });
  }

  if (interactionKind === "time_boxed_chat") {
    if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 240) {
      return NextResponse.json({ error: "invalid_chat_duration" }, { status: 400 });
    }
  } else if (!Number.isInteger(turnaroundHours) || turnaroundHours < 1 || turnaroundHours > 720) {
    return NextResponse.json({ error: "invalid_turnaround" }, { status: 400 });
  }

  const worldResult = await userRest<WorldRow[]>(
    session.accessToken,
    `creator_worlds?select=*&id=eq.${encodeURIComponent(worldId)}&creator_id=eq.${encodeURIComponent(creator.id)}&limit=1`,
  );
  const world = worldResult.ok ? worldResult.data[0] : null;
  if (!world) return NextResponse.json({ error: "world_not_authorized" }, { status: 403 });

  const suffix = crypto.randomUUID().slice(0, 8);
  const slug = `${slugify(title, 58) || "interaction"}-${suffix}`;
  const isTimedChat = interactionKind === "time_boxed_chat";
  const offerFamily = isTimedChat ? "bounded_interaction" : "personalized_digital";
  const fulfillmentConcept = isTimedChat ? "time_boxed_chat" : `personalized_${interactionKind}`;
  const fulfillmentKey = slugify(`${fulfillmentConcept}-${suffix}`, 100).replaceAll("-", "_") || `interaction_${suffix}`;

  const created = await serviceRest<OfferRow[]>("commerce_offers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      creator_id: creator.id,
      world_id: world.id,
      demand_request_id: null,
      slug,
      type: "fixed_unlock",
      title,
      description,
      price_mode: "fixed",
      amount_minor: Math.round(priceMajor * 100),
      currency,
      fulfillment_key: fulfillmentKey,
      offer_family: offerFamily,
      status,
      visibility: "public",
      buyer_user_id: null,
      mechanism: "PAID_INTERACTION",
      metadata: {
        fulfillment_mode: "creator_manual",
        fulfillment_concept: fulfillmentConcept,
        paid_interaction_v1: true,
        interaction_kind: interactionKind,
        duration_minutes: isTimedChat ? durationMinutes : null,
        turnaround_hours: isTimedChat ? null : turnaroundHours,
      },
    }),
  });
  if (!created.ok || !created.data[0]) {
    return NextResponse.json({ error: "paid_interaction_offer_create_failed" }, { status: 502 });
  }

  await emitProductEvent(request, "creator_offer_created", {
    surface: "/creator/monetization",
    target: `paid_interaction_${interactionKind}`,
    offer_slug: created.data[0].slug,
    offer_type: offerFamily,
    currency,
  });

  return withSession(NextResponse.redirect(new URL(returnTo, request.url), 303), session.refreshedSession);
}
