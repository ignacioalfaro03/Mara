import crypto from "node:crypto";

export type FlowEnvironment = "sandbox" | "production";
export type FlowConfig = { apiKey: string; secretKey: string; environment: FlowEnvironment };
export type FlowPaymentStatus = { flowOrder: number; commerceOrder: string; requestDate?: string; status: number; subject?: string; currency?: string; amount: number; payer?: string; optional?: string; paymentData?: { date?: string; media?: string; conversionDate?: string; conversionRate?: number; amount?: number; currency?: string; fee?: number; balance?: number; transferDate?: string } };
export type FlowCreateResponse = { url: string; token: string; flowOrder: number };

export const FLOW_API_BASE = { sandbox: "https://sandbox.flow.cl/api", production: "https://www.flow.cl/api" } as const;

export function signFlowParams(params: Record<string,string|number>, secretKey:string) {
 const canonical=Object.keys(params).sort().map(k=>k+String(params[k])).join("");
 return crypto.createHmac("sha256",secretKey).update(canonical).digest("hex");
}
export function flowSignedParams(params:Record<string,string|number>,config:FlowConfig){return {...params,s:signFlowParams(params,config.secretKey)};}
export function flowPaymentCreateParams(input:{commerceOrder:string;subject:string;currency:string;amountMinor:number;payerEmail:string;confirmationUrl:string;returnUrl:string;optional?:Record<string,unknown>;merchantId?:string},config:FlowConfig){
 if(input.currency!=="CLP") throw new Error("flow_currency_not_supported");
 if(!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0) throw new Error("flow_invalid_amount");
 const params:Record<string,string|number>={apiKey:config.apiKey,commerceOrder:input.commerceOrder,subject:input.subject,currency:input.currency,amount:input.amountMinor,email:input.payerEmail,paymentMethod:9,urlConfirmation:input.confirmationUrl,urlReturn:input.returnUrl};
 if(input.optional) params.optional=JSON.stringify(input.optional); if(input.merchantId) params.merchantId=input.merchantId;
 return flowSignedParams(params,config);
}
export function flowGetStatusParams(token:string,config:FlowConfig){if(!token||token.length>256)throw new Error("flow_invalid_token");return flowSignedParams({apiKey:config.apiKey,token},config);}
export function normalizeFlowPaymentStatus(status:FlowPaymentStatus){
 const amountMinor=Number(status.amount); if(!Number.isSafeInteger(amountMinor)||amountMinor<=0)throw new Error("flow_invalid_status_amount");
 return {provider:"flow" as const,providerCheckoutId:String(status.flowOrder),providerPaymentId:String(status.flowOrder),commerceOrder:status.commerceOrder,amountMinor,currency:status.currency??"CLP",succeeded:status.status===2,pending:status.status===1,rejected:status.status===3||status.status===4,rawStatus:status.status};
}
export async function createFlowPayment(input:Parameters<typeof flowPaymentCreateParams>[0],config:FlowConfig,fetchImpl:typeof fetch=fetch){
 const params=flowPaymentCreateParams(input,config); const body=new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)]));
 const response=await fetchImpl(`${FLOW_API_BASE[config.environment]}/payment/create`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body,cache:"no-store"});
 if(!response.ok) throw new Error("flow_payment_create_failed"); const data=await response.json() as FlowCreateResponse;
 if(!data.url||!data.token||!Number.isSafeInteger(Number(data.flowOrder))) throw new Error("flow_invalid_create_response");
 return {providerCheckoutId:String(data.flowOrder),checkoutUrl:`${data.url}?token=${encodeURIComponent(data.token)}`,token:data.token};
}
export async function fetchFlowPaymentStatus(token:string,config:FlowConfig,fetchImpl:typeof fetch=fetch){
 const params=flowGetStatusParams(token,config); const query=new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)]));
 const response=await fetchImpl(`${FLOW_API_BASE[config.environment]}/payment/getStatus?${query.toString()}`,{method:"GET",cache:"no-store"});
 if(!response.ok)throw new Error("flow_status_lookup_failed"); return normalizeFlowPaymentStatus(await response.json() as FlowPaymentStatus);
}

