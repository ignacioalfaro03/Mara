import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import { completeMercadoPagoSandboxOAuth } from "@/lib/commerce/mercado-pago-sandbox-oauth-runtime";
import { getMercadoPagoSandboxExecutionRuntime } from "@/lib/commerce/mercado-pago-sandbox-runtime";

export const runtime = "nodejs";

function redirectToCreator(request: Request, status: string) {
  const url = new URL("/creator", request.url);
  url.searchParams.set("payment", status);
  return NextResponse.redirect(url, 303);
}

export async function GET(request: Request) {
  const sandbox = getMercadoPagoSandboxExecutionRuntime();
  if (!sandbox.configured) return redirectToCreator(request, "sandbox_unavailable");

  const backend = getServerBackendConfig();
  if (!backend) return redirectToCreator(request, "sandbox_backend_unavailable");

  const url = new URL(request.url);
  const authorizationCode = url.searchParams.get("code")?.trim() ?? "";
  const state = url.searchParams.get("state")?.trim() ?? "";
  const providerError = url.searchParams.get("error")?.trim() ?? "";

  if (providerError) return redirectToCreator(request, "mercado_pago_denied");
  if (!authorizationCode || !state) return redirectToCreator(request, "mercado_pago_callback_invalid");

  try {
    await completeMercadoPagoSandboxOAuth({
      authorizationCode,
      state,
      backend,
      runtime: sandbox,
    });
    return redirectToCreator(request, "mercado_pago_sandbox_connected");
  } catch {
    return redirectToCreator(request, "mercado_pago_sandbox_connect_failed");
  }
}
