import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import { getVerifiedSession, setSessionCookies, type MaraAuthSession } from "@/lib/auth-session";
import { serviceHeaders } from "@/lib/commerce/backend";
import { getStoreProduct } from "@/lib/commerce/storefront";

export const runtime = "nodejs";

function encodedStoragePath(path: string) {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

function jsonError(error: string, status: number, refreshedSession: MaraAuthSession | null) {
  const response = NextResponse.json({ error }, { status });
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product?.entitlementKey || !product.privateAssetPath) {
    return jsonError("premium_content_not_found", 404, session.refreshedSession);
  }

  const bucket = process.env.MARA_PREMIUM_STORAGE_BUCKET?.trim();
  const deliveryReady = process.env.MARA_PREMIUM_DELIVERY_READY === "true";
  if (!bucket || !deliveryReady) {
    return jsonError("private_delivery_not_configured", 503, session.refreshedSession);
  }

  const config = getServerBackendConfig();
  if (!config) {
    return jsonError("commerce_backend_not_configured", 503, session.refreshedSession);
  }

  const userId = encodeURIComponent(session.user.id);
  const entitlementKey = encodeURIComponent(product.entitlementKey);
  const entitlementResponse = await fetch(
    `${config.url}/rest/v1/commerce_entitlements?select=entitlement_key&user_id=eq.${userId}&entitlement_key=eq.${entitlementKey}&status=eq.active&limit=1`,
    { headers: serviceHeaders(config, false), cache: "no-store" },
  );

  if (!entitlementResponse.ok) {
    return jsonError("entitlement_check_failed", 502, session.refreshedSession);
  }

  const entitlements = (await entitlementResponse.json()) as Array<{ entitlement_key: string }>;
  if (entitlements.length === 0) {
    return jsonError("entitlement_required", 403, session.refreshedSession);
  }

  const assetResponse = await fetch(
    `${config.url}/storage/v1/object/authenticated/${encodeURIComponent(bucket)}/${encodedStoragePath(product.privateAssetPath)}`,
    { headers: serviceHeaders(config, false), cache: "no-store" },
  );

  if (!assetResponse.ok) {
    return jsonError("premium_asset_unavailable", assetResponse.status === 404 ? 503 : 502, session.refreshedSession);
  }

  const body = await assetResponse.arrayBuffer();
  const response = new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": assetResponse.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
  if (session.refreshedSession) setSessionCookies(response, session.refreshedSession);
  return response;
}
