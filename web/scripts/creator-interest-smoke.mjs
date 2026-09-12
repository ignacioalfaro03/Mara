const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const pageResponse = await fetch(`${baseUrl}/creators`, { redirect: "manual" });
assert(pageResponse.status === 200, `/creators returned ${pageResponse.status}`);
const pageHtml = await pageResponse.text();
assert(pageHtml.includes("Gana más con la audiencia que ya tienes"), "creator Revenue OS positioning missing");
assert(pageHtml.includes("GMV por creador activo"), "creator North Star positioning missing");
assert(pageHtml.includes("No te estamos vendiendo un curso ni prometiendo ingresos"), "creator no-income-promise guardrail missing");
assert(pageHtml.includes("Quiero probar Mara"), "creator pilot CTA missing");
assert(pageHtml.includes("autorizo que Mara use estos datos únicamente para contactarme respecto del piloto privado"), "creator consent/privacy copy missing");

const invalidConsent = await fetch(`${baseUrl}/api/creator-interest`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "qa@example.com",
    exposureLevel: "character_only",
    productInterests: ["digital_content"],
    audienceSize: "none",
    currentCreatorStatus: "never",
    adultConsent: false,
    website: "",
  }),
});
assert(invalidConsent.status === 400, `missing adult consent returned ${invalidConsent.status}`);

const honeypot = await fetch(`${baseUrl}/api/creator-interest`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "qa@example.com",
    exposureLevel: "character_only",
    productInterests: ["digital_content"],
    audienceSize: "none",
    currentCreatorStatus: "never",
    adultConsent: true,
    website: "https://spam.invalid",
  }),
});
assert(honeypot.status === 400, `honeypot payload returned ${honeypot.status}`);

const invalidExposure = await fetch(`${baseUrl}/api/creator-interest`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "qa@example.com",
    exposureLevel: "anything_goes",
    productInterests: ["digital_content"],
    audienceSize: "none",
    currentCreatorStatus: "never",
    adultConsent: true,
    website: "",
  }),
});
assert(invalidExposure.status === 400, `invalid exposure token returned ${invalidExposure.status}`);

console.log("MARA_CREATOR_INTEREST_SMOKE PASS");
