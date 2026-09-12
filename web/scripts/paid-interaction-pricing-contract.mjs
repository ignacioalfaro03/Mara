import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const builder = read("app/api/creator/interaction-offers/route.ts");
const sender = read("app/api/creator/paid-interactions/route.ts");
const hub = read("app/creator/monetization/page.tsx");

for (const kind of ["time_boxed_chat", "audio", "photo", "video", "message", "bundle"]) {
  assert.match(builder, new RegExp(`"${kind}"`), `missing paid interaction kind ${kind}`);
}

assert.match(builder, /productCapability\("paid_interactions"\)/);
assert.match(builder, /priceMajor/);
assert.match(builder, /amount_minor:\s*Math\.round\(priceMajor \* 100\)/);
assert.match(builder, /mechanism:\s*"PAID_INTERACTION"/);
assert.match(builder, /visibility:\s*"public"/);
assert.match(builder, /duration_minutes:/);
assert.match(builder, /turnaround_hours:/);
assert.match(builder, /fulfillment_mode:\s*"creator_manual"/);
assert.match(builder, /world_id:\s*world\.id/);
assert.match(builder, /creator_id:\s*creator\.id/);

// Sending the commercial option in chat must reference the canonical offer; the
// message route cannot invent another amount or charge the recipient implicitly.
assert.match(sender, /offer_id:\s*offer\.id/);
assert.doesNotMatch(sender, /amount_minor\s*:/i);
assert.match(hub, /El chat normal puede seguir gratis/);
assert.match(hub, /Chat por tiempo/);
assert.match(hub, /Audio personalizado/);
assert.match(hub, /Foto personalizada/);
assert.match(hub, /Video personalizado/);
assert.match(hub, /action="\/api\/creator\/interaction-offers"/);
assert.match(hub, /name="price"/);
assert.doesNotMatch(builder, /pay_per_message|per_message_price|message_price/i);

console.log("MARA_PAID_INTERACTION_PRICING_CONTRACT PASS");
