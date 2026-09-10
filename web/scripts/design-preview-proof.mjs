import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL || "").replace(/\/$/, "");
if (!BASE_URL) throw new Error("BASE_URL is required");

const OUT = path.resolve("artifacts/design-preview");
await fs.mkdir(OUT, { recursive: true });

const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
const extraHTTPHeaders = bypass ? { "x-vercel-protection-bypass": bypass } : {};
const browser = await chromium.launch({ headless: true });
const evidence = [];

async function makeContext(viewport, agePassed = true) {
  const context = await browser.newContext({ viewport, extraHTTPHeaders });
  if (agePassed) {
    await context.addInitScript(() => {
      window.localStorage.setItem("mara_age_gate_passed", "true");
    });
  }
  return context;
}

async function capture({ name, route, viewport, agePassed = true, fullPage = true }) {
  const context = await makeContext(viewport, agePassed);
  const page = await context.newPage();
  const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
  const status = response?.status() ?? 0;
  if (status >= 500 || status === 0) throw new Error(`${route} returned ${status}`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 2) throw new Error(`${route} has ${overflow}px horizontal overflow at ${viewport.width}x${viewport.height}`);

  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  evidence.push({ name, route, viewport, status, overflow, file: path.relative(process.cwd(), file) });
  await context.close();
}

await capture({ name: "home-desktop", route: "/", viewport: { width: 1440, height: 900 } });
await capture({ name: "home-mobile", route: "/", viewport: { width: 390, height: 844 } });
await capture({ name: "age-gate-mobile", route: "/", viewport: { width: 390, height: 844 }, agePassed: false, fullPage: false });
await capture({ name: "make-it-happen-mobile", route: "/make-it-happen", viewport: { width: 390, height: 844 } });
await capture({ name: "creators-mobile", route: "/creators", viewport: { width: 390, height: 844 } });
await capture({ name: "creator-zero-mobile", route: "/experience", viewport: { width: 390, height: 844 }, fullPage: false });
await capture({ name: "creator-zero-access-mobile", route: "/shop", viewport: { width: 390, height: 844 } });
await capture({ name: "private-archive-mobile", route: "/library", viewport: { width: 390, height: 844 } });
await capture({ name: "activity-mobile", route: "/activity", viewport: { width: 390, height: 844 } });
await capture({ name: "creator-os-mobile", route: "/creator", viewport: { width: 390, height: 844 } });
await capture({ name: "sofi-cross-world-mobile", route: "/world/sofi", viewport: { width: 390, height: 844 }, fullPage: false });

const homeContext = await makeContext({ width: 390, height: 844 }, true);
const home = await homeContext.newPage();
await home.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 30_000 });
const homeText = await home.locator("body").innerText();
for (const forbidden of ["No tienes que hablar conmigo todo el día", "cantando con una cuchara", "la noche del chocolate"]) {
  if (homeText.includes(forbidden)) throw new Error(`Old product framing leaked onto redesigned home: ${forbidden}`);
}
if (!homeText.includes("Lo que quieres puede empezar aquí")) throw new Error("Redesigned platform hero is missing");
await homeContext.close();

await fs.writeFile(path.join(OUT, "evidence.json"), JSON.stringify({ baseUrl: BASE_URL, capturedAt: new Date().toISOString(), evidence }, null, 2));
console.log(`MARA_DESIGN_PREVIEW_PROOF PASS (${evidence.length} screenshots)`);

await browser.close();
