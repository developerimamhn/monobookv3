#!/usr/bin/env node
/**
 * Performance Team + SEO Team: Lighthouse (mobile, default throttling) on out/.
 * Runs 3 times and reports the median performance score. Fails below 90.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromePath, serveOut } from "./_browser.mjs";

const runs = Number(process.env.LH_RUNS ?? 3);
const server = await serveOut();
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
const results = [];
for (let i = 0; i < runs; i++) {
  const { lhr, report } = await lighthouse(server.url, { port: chrome.port, output: "html", logLevel: "error" });
  const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
  const a = (k) => lhr.audits[k]?.displayValue ?? "";
  results.push({ perf: score("performance"), a11y: score("accessibility"), bp: score("best-practices"), seo: score("seo"), lcp: a("largest-contentful-paint"), cls: a("cumulative-layout-shift"), tbt: a("total-blocking-time"), fcp: a("first-contentful-paint"), si: a("speed-index") });
  if (i === runs - 1) {
    mkdirSync("reports", { recursive: true });
    writeFileSync("reports/lighthouse-mobile.html", report);
    writeFileSync("reports/lighthouse-mobile.json", JSON.stringify(lhr));
  }
}
await chrome.kill();
server.close();
console.table(results);
const median = [...results].sort((x, y) => x.perf - y.perf)[Math.floor(results.length / 2)];
console.log(`Median mobile performance: ${median.perf} (report: reports/lighthouse-mobile.html)`);
process.exit(median.perf >= 90 ? 0 : 1);
