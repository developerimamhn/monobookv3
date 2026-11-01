#!/usr/bin/env node
/**
 * Mobile Team + Accessibility Team checks on the built site.
 * - 375, 390, 768: no horizontal scroll, one column below 900px,
 *   body text 17px+, tap targets 44px+, full-width buttons.
 * - axe-core WCAG 2.1 AA scan at 390 and 1440, with and without reduced motion.
 * - Keyboard: first Tab reaches the skip link, every focusable has a visible outline.
 */
import { createRequire } from "node:module";
import { loadPlaywright, serveOut } from "./_browser.mjs";

const require = createRequire(import.meta.url);
const axeSource = require("fs").readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const { chromium } = loadPlaywright();
const server = await serveOut();
const browser = await chromium.launch();
let failures = 0;
const report = (ok, label, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

for (const width of [375, 390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 2, isMobile: width < 768, hasTouch: true });
  await page.goto(server.url, { waitUntil: "networkidle" });
  await scrollThrough(page);

  const data = await page.evaluate(() => {
    const doc = document.documentElement;
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    // Body copy: paragraphs and list items outside the small visual demos and labels.
    const bodyEls = [...document.querySelectorAll("main p, main li, main blockquote, footer p, footer li")]
      .filter((el) => visible(el) && !el.closest(".demo, .label, .visually-hidden") && !el.classList.contains("deliverable-index"));
    const small = bodyEls.map((el) => ({ t: el.textContent.trim().slice(0, 40), fs: parseFloat(getComputedStyle(el).fontSize) })).filter((x) => x.fs < 17);
    const allText = [...document.querySelectorAll("main *, header *, footer *")].filter((el) => visible(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
    const minAny = Math.min(...allText.map((el) => parseFloat(getComputedStyle(el).fontSize)));
    const targets = [...document.querySelectorAll("a, button")].filter((el) => visible(el) && !el.closest("p") && !el.classList.contains("skip-link"));
    const smallTargets = targets.map((el) => ({ t: el.textContent.trim().slice(0, 30), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) })).filter((x) => x.h < 44 || x.w < 44);
    const grids = [...document.querySelectorAll(".grid, .pace-options")].map((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    const buttons = [...document.querySelectorAll(".button")].map((el) => {
      const r = el.getBoundingClientRect();
      const parent = el.parentElement.getBoundingClientRect();
      return Math.round((r.width / parent.width) * 100);
    });
    return { overflow: doc.scrollWidth - window.innerWidth, small, minAny, smallTargets, grids, buttons };
  });

  report(data.overflow <= 0, `${width}px no horizontal scroll`, `overflow ${data.overflow}px`);
  report(data.small.length === 0, `${width}px body text 17px+`, data.small.length ? JSON.stringify(data.small.slice(0, 5)) : `smallest text anywhere ${data.minAny}px`);
  report(data.smallTargets.length === 0, `${width}px tap targets 44px+`, JSON.stringify(data.smallTargets));
  if (width < 900) report(data.grids.every((n) => n === 1), `${width}px one column`, `grid tracks ${data.grids.join(",")}`);
  if (width < 768) report(data.buttons.every((p) => p >= 99), `${width}px full-width buttons`, `widths ${data.buttons.join(",")}%`);
  await page.close();
}

// Accessibility: axe-core WCAG A/AA
for (const [width, reduced] of [[390, false], [1440, false], [1440, true]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  await page.goto(server.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.addScriptTag({ content: axeSource });
  const atLoad = await page.evaluate(async () => {
    const r = await axe.run(document, { runOnly: ["wcag2aa", "wcag21aa"] });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  });
  report(atLoad.length === 0, `axe WCAG AA at ${width}px on load${reduced ? " reduced motion" : ""}`, atLoad.join("; "));
  await scrollThrough(page);
  // Let scrubbed animations settle at their end state before contrast checks.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1500);
  const res = await page.evaluate(async () => {
    const r = await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  });
  report(res.length === 0, `axe WCAG AA at ${width}px${reduced ? " reduced motion" : ""}`, res.join("; "));
  await page.close();
}

// Keyboard
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(server.url, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.className);
  report(first === "skip-link", "First Tab reaches skip link", first);
  const outlines = [];
  for (let i = 0; i < 12; i++) {
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, text: el.textContent.trim().slice(0, 20), outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2 };
    });
    outlines.push(info);
    await page.keyboard.press("Tab");
  }
  const missing = outlines.filter((o) => o.tag !== "BODY" && !o.outline);
  report(missing.length === 0, "Visible focus on every stop", missing.length ? JSON.stringify(missing) : `${new Set(outlines.map((o) => o.text)).size} stops`);
  const headings = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]));
  const skips = headings.some((lvl, i) => i > 0 && lvl - headings[i - 1] > 1);
  report(headings[0] === 1 && !skips, "Headings in order", headings.join(" "));
  await page.close();
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll mobile and accessibility checks pass");
process.exit(failures ? 1 : 0);
