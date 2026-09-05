import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";

export const runtime = "nodejs";

type QaUserBody =
  | { action?: "create"; email?: string; password?: string }
  | { action?: "delete"; userId?: string };

const QA_EMAIL = /^mara\.qa\.[a-z0-9.-]+@example\.com$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function authorized(request: Request) {
  const expected = process.env.MARA_QA_PROOF_TOKEN?.trim();
  const received = request.headers.get("x-mara-qa-token")?.trim();
  if (!expected || !received) return false;

  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

function adminHeaders(serviceRoleKey: string): Record<string, string> {
  if (serviceRoleKey.startsWith("sb_secret_")) {
    return {
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
    };
  }

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function POST(request: Request) {
  // This route is inert unless an isolated proof deployment explicitly injects
  // MARA_QA_PROOF_TOKEN. Canonical production does not configure that token.
  if (!process.env.MARA_QA_PROOF_TOKEN?.trim()) {
    return new NextResponse(null, { status: 404 });
  }
  if (!authorized(request)) {
    return new NextResponse(null, { status: 401 });
  }

  const config = getServerBackendConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "backend_not_configured" }, { status: 503 });
  }

  let body: QaUserBody;
  try {
    body = (await request.json()) as QaUserBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.action === "create") {
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (!QA_EMAIL.test(email) || password.length < 12 || password.length > 128) {
      return NextResponse.json({ ok: false, error: "invalid_qa_identity" }, { status: 400 });
    }

    const upstream = await fetch(`${config.url}/auth/v1/admin/users`, {
      method: "POST",
      headers: adminHeaders(config.serviceRoleKey),
      body: JSON.stringify({ email, password, email_confirm: true }),
      cache: "no-store",
    });
    const payload = (await upstream.json().catch(() => ({}))) as {
      id?: string;
      user?: { id?: string };
    };
    const userId = payload.id ?? payload.user?.id;

    if (!upstream.ok || !userId || !UUID.test(userId)) {
      console.error("MARA_QA_USER_CREATE_FAILED", JSON.stringify({ status: upstream.status }));
      return NextResponse.json({ ok: false, error: "qa_user_create_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, userId });
  }

  if (body.action === "delete") {
    const userId = body.userId?.trim() ?? "";
    if (!UUID.test(userId)) {
      return NextResponse.json({ ok: false, error: "invalid_qa_user" }, { status: 400 });
    }

    const upstream = await fetch(`${config.url}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: adminHeaders(config.serviceRoleKey),
      cache: "no-store",
    });
    if (!upstream.ok && upstream.status !== 404) {
      console.error("MARA_QA_USER_DELETE_FAILED", JSON.stringify({ status: upstream.status }));
      return NextResponse.json({ ok: false, error: "qa_user_delete_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
}
