#!/usr/bin/env node
/** Dev helper: full-page screenshots, desktop, mobile and reduced motion. Usage: npm run shots -- <outDir> */
import { loadPlaywright, serveOut } from "./_browser.mjs";
const { chromium } = loadPlaywright();
const [outDir = "reports/shots"] = process.argv.slice(2);
const server = await serveOut();
const url = server.url;
(await import("node:fs")).mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const [name, viewport, reduced] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, false], ["reduced", { width: 1440, height: 900 }, true]]) {
  const page = await browser.newPage({ viewport, reducedMotion: reduced ? "reduce" : "no-preference" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.ceil(height / viewport.height);
  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * viewport.height);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${outDir}/${name}-${String(i).padStart(2, "0")}.png` });
  }
  console.log(name, "height", height, "shots", steps, "errors", JSON.stringify(errors));
  await page.close();
}
await browser.close();
server.close();
