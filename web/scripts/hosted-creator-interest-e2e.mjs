import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");
const protectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
if (!baseUrl) throw new Error("BASE_URL is required");

const headers = protectionBypass
  ? {
      "x-vercel-protection-bypass": protectionBypass,
      "x-vercel-set-bypass-cookie": "true",
    }
  : {};

const evidenceDir = path.resolve("artifacts/creator-alpha-e2e");
fs.mkdirSync(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
  extraHTTPHeaders: Object.keys(headers).length ? headers : undefined,
});

try {
  const page = await context.newPage();
  await page.goto(`${baseUrl}/creators`, { waitUntil: "networkidle" });

  const ageGate = page.getByRole("dialog");
  if (await ageGate.isVisible({ timeout: 3000 }).catch(() => false)) {
    await ageGate.getByRole("button", { name: "Sí, tengo 18+" }).click();
    await ageGate.waitFor({ state: "hidden", timeout: 10000 });
  }

  await page.getByRole("heading", { name: "Tu personaje puede ser público. Tú no tienes que serlo." }).waitFor({ timeout: 15000 });

  await page.getByLabel("Correo de contacto").fill("mara.qa.creator-interest@example.com");
  await page.getByLabel("¿Hasta dónde te gustaría exponerte?").selectOption("character_only");
  await page.getByLabel("Contenido y colecciones digitales").check();
  await page.getByLabel("Audiencia actual").selectOption("none");
  await page.getByLabel("Experiencia como creadora").selectOption("never");
  await page.getByLabel(/Soy mayor de 18 años/).check();

  await page.getByRole("button", { name: "Quiero conocer el piloto" }).click();
  await page.getByText("Interés registrado.").waitFor({ timeout: 15000 });
  await page.screenshot({ path: path.join(evidenceDir, "00-creator-interest.png"), fullPage: true });

  console.log("MARA_CREATOR_INTEREST_HOSTED_E2E PASS");
} finally {
  await context.close().catch(() => undefined);
  await browser.close().catch(() => undefined);
}
