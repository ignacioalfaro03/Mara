import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  return response;
}
