import type { MaraServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders } from "@/lib/commerce/backend";
import type { MercadoPagoSandboxAccountBinding } from "@/lib/commerce/mercado-pago-sandbox-webhook";
import type { CheckoutPaymentExpectation } from "@/lib/commerce/provider-payment-acceptance";

async function rpc<T>(
  backend: MaraServerBackendConfig,
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${backend.url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: serviceHeaders(backend),
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "error",
  });
  if (!response.ok) {
    throw new Error(`mara_mp_sandbox_webhook_rpc_failed:${functionName}:${response.status}`);
  }
  return await response.json() as T;
}

type BindingRow = {
  binding_id: string;
  creator_id: string;
  provider_account_id: string;
  credential_reference: string;
};

type ExpectationRow = {
  checkout_intent_id: string;
  creator_id: string;
  provider: string;
  provider_account_id: string;
  amount_minor: number;
  currency: string;
};

export function createMercadoPagoSandboxWebhookStore(backend: MaraServerBackendConfig) {
  return {
    async ensureBinding(creatorId: string) {
      const bindingId = await rpc<unknown>(backend, "mara_mp_sandbox_ensure_webhook_binding", {
        p_creator_id: creatorId,
      });
      if (typeof bindingId !== "string" || bindingId.length < 32) {
        throw new Error("mara_mp_sandbox_webhook_binding_invalid");
      }
      return bindingId;
    },

    async resolveAccountBinding(bindingId: string): Promise<MercadoPagoSandboxAccountBinding | null> {
      const rows = await rpc<BindingRow[]>(backend, "mara_mp_sandbox_resolve_webhook_binding", {
        p_binding_id: bindingId,
      });
      const row = rows[0];
      if (!row) return null;
      return {
        bindingId: row.binding_id,
        creatorId: row.creator_id,
        providerAccountId: row.provider_account_id,
        credentialReference: row.credential_reference,
      };
    },

    async readCheckoutExpectation(checkoutIntentId: string): Promise<CheckoutPaymentExpectation | null> {
      const rows = await rpc<ExpectationRow[]>(backend, "mara_mp_sandbox_checkout_expectation", {
        p_checkout_intent_id: checkoutIntentId,
      });
      const row = rows[0];
      if (!row) return null;
      return {
        checkoutIntentId: row.checkout_intent_id,
        creatorId: row.creator_id,
        provider: row.provider,
        providerAccountId: row.provider_account_id,
        amountMinor: Number(row.amount_minor),
        currency: row.currency,
      };
    },
  };
}
