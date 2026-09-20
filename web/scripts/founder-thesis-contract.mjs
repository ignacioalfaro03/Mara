import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const webRoot = process.cwd();
const repoRoot = path.resolve(webRoot, "..");
const readWeb = (p) => fs.readFileSync(path.join(webRoot, p), "utf8");
const readRepo = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");

const readme = readRepo("README.md");
const constitution = readRepo("MARA_FOUNDER_CONSTITUTION_V3.md");
const home = readWeb("app/page.tsx");
const layout = readWeb("app/layout.tsx");
const creator = readWeb("app/creator/page.tsx");
const creatorRoute = readWeb("app/[creator]/page.tsx");
const creatorSitePage = readWeb("components/creator-site-page.tsx");
const legacyRoute = readWeb("app/world/[slug]/page.tsx");

assert.match(readme, /MARA_FOUNDER_CONSTITUTION_V3/);
assert.match(readme, /Creator Site/);
assert.match(constitution, /Mara Vera is no longer part of the product thesis/);
assert.match(constitution, /Creator World \/ World is no longer a product concept/);

assert.doesNotMatch(home, /Mara Vera|MaraHeroVisual|Probar a Mara gratis/);
assert.match(home, /Crear mi sitio en Mara/);
assert.match(home, /Convierte tu audiencia en un negocio mejor/);
assert.doesNotMatch(layout, /Mara Vera/);
assert.doesNotMatch(layout, /href="\/experience"/);
assert.match(layout, /Creator OS/);

for (const forbidden of ["Ver World", "Crear World", "Tus Worlds", "Crea tu primer World"]) {
  assert.doesNotMatch(creator, new RegExp(forbidden));
}
assert.match(creator, /Crear mi sitio/);
assert.match(creator, /Publicar sitio/);
assert.match(creator, /CreatorSiteActions/);

assert.match(creatorRoute, /alternates:/);
assert.match(creatorRoute, /canonical/);
assert.match(creatorRoute, /CreatorSitePage/);
assert.match(creatorSitePage, /SITIO EN MARA/);
assert.match(legacyRoute, /permanentRedirect/);
assert.doesNotMatch(legacyRoute, /SITIO EN MARA/);

console.log("MARA_FOUNDER_THESIS_CONTRACT PASS");
