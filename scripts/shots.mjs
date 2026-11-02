#!/usr/bin/env node
/** Screenshots, one per screen height: desktop, mobile and reduced motion. Usage: npm run shots -- <outDir> */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { launchBrowser, pause, root, serveOut } from "./_browser.mjs";

const outDir = process.argv[2] ?? join(root, "reports", "shots");
mkdirSync(outDir, { recursive: true });
const server = await serveOut();
const browser = await launchBrowser();

const runs = [
  ["desktop", { width: 1440, height: 900 }, false],
  ["mobile", { width: 390, height: 844, isMobile: true, hasTouch: true }, false],
  ["reduced", { width: 1440, height: 900 }, true],
];

for (const [name, viewport, reduced] of runs) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
  await page.goto(server.url, { waitUntil: "networkidle0" });
  await pause(2600);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.ceil(height / viewport.height);
  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * viewport.height);
    await pause(1400);
    await page.screenshot({ path: join(outDir, `${name}-${String(i).padStart(2, "0")}.png`) });
  }
  console.log(name, "height", height, "shots", steps, "errors", JSON.stringify(errors));
  await page.close();
}

await browser.close();
server.close();
