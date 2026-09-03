import { NextResponse } from "next/server";
import { fulfillSignedTestWebhook } from "@/lib/commerce/payment-fulfillment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const result = await fulfillSignedTestWebhook(rawBody, request.headers.get("mara-test-signature"));

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, purchaseId: result.purchaseId });
}
