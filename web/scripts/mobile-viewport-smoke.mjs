import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const sizes = [[360,800],[390,844],[430,932]];
const browser = await chromium.launch({ headless: true });

try {
  for (const [width, height] of sizes) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, locale: "es-CL" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of ["/", "/creators"]) {
      await page.goto(baseUrl + path, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert(overflow <= 2, `${path} overflows horizontally at ${width}x${height}: ${overflow}px`);
    }
    assert.equal(errors.length, 0, `page errors at ${width}x${height}: ${errors.join(" | ")}`);
    await context.close();
  }
  console.log("MARA_MOBILE_VIEWPORT_SMOKE PASS");
} finally {
  await browser.close();
}
