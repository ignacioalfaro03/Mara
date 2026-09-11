import fs from "node:fs";

function read(file) {
  return fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const core = read("supabase/migrations/20260910190000_mara_product_realization_core.sql");
const comms = read("supabase/migrations/20260910193000_mara_messaging_requests_memberships.sql");
const hardening = read("supabase/migrations/20260910200000_mara_product_realization_hardening.sql");
const checkout = read("app/api/commerce/checkout/route.ts");
const requestApi = read("app/api/requests/route.ts");
const creatorRequestApi = read("app/api/creator/requests/route.ts");
const messagesApi = read("app/api/messages/route.ts");
const serviceRest = read("lib/supabase/server-rest.ts");
const commerceBackend = read("lib/commerce/backend.ts");

for (const table of [
  "creator_follows",
  "creator_content",
  "creator_content_media",
  "creator_customer_private_context",
  "creator_customer_notes",
]) {
  assert(core.includes(`alter table public.${table} enable row level security`), `${table}: RLS enable missing`);
}
for (const table of ["creator_threads", "creator_messages", "creator_requests", "creator_membership_tiers", "creator_memberships"]) {
  assert(comms.includes(`alter table public.${table} enable row level security`), `${table}: RLS enable missing`);
}

for (const table of ["creator_threads", "creator_messages", "creator_requests", "creator_memberships"]) {
  assert(
    hardening.includes(`revoke insert, update, delete on table public.${table} from anon, authenticated`),
    `${table}: server-owned DML revoke missing`,
  );
}

assert(core.includes("creator_customer_private_context_creator_only"), "Debilidad creator-only policy missing");
assert(core.includes("creator_customer_notes_select_creator"), "Creator notes select isolation missing");
assert(core.includes("visibility <> 'paid_unlock' or offer_id is not null"), "Paid content must reference an offer");
assert(core.includes("creator_content_media_owner_all"), "Media metadata creator ownership policy missing");
assert(hardening.includes("creator_threads_creator_world_fkey"), "Thread creator/world composite FK missing");
assert(hardening.includes("creator_requests_creator_world_fkey"), "Request creator/world composite FK missing");
assert(hardening.includes("currency ~ '^[A-Z]{3}$'"), "Strict request currency shape missing");

assert(checkout.includes("getAmountForOffer"), "Checkout no longer derives/validates amount server-side");
assert(checkout.includes("creator_offer_live_payment_not_authorized"), "Creator live-payment release guard missing");
assert(checkout.includes("clientRequestId"), "Checkout idempotency key contract missing");
assert(!requestApi.includes("creator_id: body."), "Consumer request API trusts browser creator_id");
assert(requestApi.includes("readWorld(worldSlug"), "Consumer request must resolve creator/world server-side");
assert(creatorRequestApi.includes("ensureRequestOffer"), "Creator request acceptance must create/reuse canonical commerce offer");
assert(creatorRequestApi.includes("complete_mara_creator_fulfillment"), "Request delivery must use canonical fulfillment RPC");
assert(messagesApi.includes("senderKind ="), "Message sender identity must be derived server-side");
assert(messagesApi.includes("only_creator_can_send_offer"), "Only creator may attach offer to message");

for (const helper of [serviceRest, commerceBackend]) {
  assert(helper.includes('startsWith("sb_secret_")'), "Modern Supabase secret-key handling missing");
}
assert(!serviceRest.includes("NEXT_PUBLIC_SUPABASE_SECRET"), "Secret-key browser exposure pattern detected");

console.log("MARA_PRODUCT_REALIZATION_SECURITY_CONTRACT PASS");
