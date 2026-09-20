import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const web = path.join(here, "..");
const read = (relative) => fs.readFileSync(path.join(web, relative), "utf8");

const helper = read("lib/creator-site.ts");
const createRoute = read("app/api/creator/worlds/route.ts");
const updateRoute = read("app/api/creator/sites/[id]/route.ts");
const creatorHome = read("app/creator/page.tsx");
const publicRoute = read("app/[creator]/page.tsx");
const sitePage = read("components/creator-site-page.tsx");
const legacyRoute = read("app/world/[slug]/page.tsx");
const telemetry = read("app/api/telemetry/route.ts");

for (const reserved of ["api","auth","creator","creators","experience","legal","library","me","shop","world","mara"]) {
  assert(helper.includes(`"${reserved}"`), `reserved handle missing: ${reserved}`);
}

assert(createRoute.includes("isReservedCreatorHandle(slug)"), "site creation must block reserved handles");
assert(createRoute.includes('status: "draft"'), "new creator sites must start as draft");
assert(createRoute.includes('"creator_site_created"'), "site creation telemetry missing");

assert(updateRoute.includes("creator_id=eq."), "site update must filter by creator ownership");
assert(updateRoute.includes("isReservedCreatorHandle(slug)"), "site update must block reserved handles");
assert(updateRoute.includes('action === "publish" ? "active"'), "publish transition missing");
assert(updateRoute.includes('"creator_site_published"'), "publish telemetry missing");

assert(creatorHome.includes("Publicar sitio"), "Creator OS publish action missing");
assert(creatorHome.includes("Avatar URL"), "Creator Site identity editor missing");
assert(creatorHome.includes("moduleDemand"), "Creator Site module controls missing");

assert(publicRoute.includes("robots: { index: false, follow: false }"), "non-public Creator Site metadata must fail closed");
assert(publicRoute.includes("alternates: { canonical:"), "Creator Site canonical metadata missing");
assert(sitePage.includes('event="creator_site_viewed"'), "Creator Site view telemetry missing");
assert(sitePage.includes("Powered by Mara"), "Creator Site infrastructure attribution missing");
assert(sitePage.includes("siteConfig.modules.demand"), "Creator Site demand module toggle missing");
assert(sitePage.includes("siteConfig.modules.offers"), "Creator Site offer module toggle missing");
assert(legacyRoute.includes("permanentRedirect"), "legacy /world route must redirect to canonical Creator Site");
assert(legacyRoute.includes("`/${slug}`"), "legacy /world route must target canonical /<creator> path");
assert(telemetry.includes('"creator_site_link_copied"'), "Creator Site share telemetry not allowed");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const creatorResponse = await fetch(`${baseUrl}/creator`, { redirect: "manual" });
assert.equal(creatorResponse.status, 200, "reserved /creator route must not be captured by /[creator]");
const creatorHtml = await creatorResponse.text();
assert(creatorHtml.includes("CREATOR OS"), "reserved /creator route rendered wrong surface");


console.log("MARA_CREATOR_SITE_CONTRACT PASS");
