import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");

const contract = read("../docs/product/CREATOR_MONETIZATION_ENGINE.md");
const draft = read("supabase/drafts/mara_creator_monetization_engine_v1.sql");
const preferencesApi = read("app/api/preferences/route.ts");
const tastePage = read("app/c/[slug]/taste/page.tsx");
const requestPage = read("app/c/[slug]/request/page.tsx");
const storefront = read("app/c/[slug]/page.tsx");
const creatorHub = read("app/creator/monetization/page.tsx");

for (const mechanism of [
  "FIXED_PRICE",
  "AUCTION",
  "WISH",
  "CUSTOM_REQUEST",
  "LIMITED_DROP",
  "MEMBERSHIP",
  "PAID_INTERACTION",
]) {
  assert.match(contract, new RegExp(`\\b${mechanism}\\b`), `missing mechanism ${mechanism}`);
}
assert.match(contract, /No pay-per-bid, bid-fee, lottery or gambling mechanics/i);
assert.match(contract, /NOT PAYMENT READY/);
assert.match(contract, /content creators with an existing audience/i);

assert.match(draft, /DRAFT ONLY \/ DO NOT APPLY DIRECTLY/);
assert.match(draft, /for update;/i, "auction bid write must lock current auction state");
assert.match(draft, /place_creator_auction_bid_v1/);
assert.match(draft, /revoke all on function private\.place_creator_auction_bid_v1[\s\S]*from public, anon, authenticated/i);
assert.match(draft, /grant execute on function private\.place_creator_auction_bid_v1[\s\S]*to service_role/i);
assert.match(draft, /preference_events = creator-scoped Taste Engine event persistence/i);
assert.doesNotMatch(draft, /create table if not exists public\.creator_taste_choices/i, "must reuse preference_events instead of creating a second Taste silo");
assert.match(draft, /rollback;/i, "draft must remain non-applying by design");

for (const group of [
  "creator_format_v1",
  "creator_personalization_v1",
  "creator_length_v1",
  "creator_offer_style_v1",
]) {
  assert.match(preferencesApi, new RegExp(group), `preferences API missing ${group}`);
}
assert.match(preferencesApi, /signal_scope:\s*body\.signalScope === "creator_world" \? "creator_world" : "network"/);
assert.match(preferencesApi, /safeLocalReturn\(body\.returnTo, "\/"\)/, "Revenue OS preference fallback must not return to legacy /experience");

assert.match(tastePage, /name="signalScope" value="creator_world"/);
assert.match(tastePage, /Preferencias, no vulnerabilidades\./);
assert.match(tastePage, /no generan ningún cobro/i);
assert.doesNotMatch(tastePage, /Mara Vera/i);

assert.match(requestPage, /Solicitud ≠ compra\./);
assert.match(requestPage, /no genera ningún cobro/i);
assert.match(storefront, /href=\{`\/c\/\$\{slug\}\/request`\}/);
assert.match(storefront, /href=\{`\/c\/\$\{slug\}\/taste`\}/);

assert.match(creatorHub, /MARA FREE/);
assert.match(creatorHub, /MARA PLUS/);
assert.match(creatorHub, /Pagos reales siguen bloqueados\./);
assert.doesNotMatch(creatorHub, /Mara Vera/i);

console.log("MARA_CREATOR_MONETIZATION_SURFACE_CONTRACT PASS");
