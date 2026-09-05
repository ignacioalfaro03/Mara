import { NextResponse } from "next/server";
import { isBackendConfigured } from "@/lib/backend-config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    service: "mara-identity-memory",
    configured: isBackendConfigured(),
  });
}
