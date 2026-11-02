#!/usr/bin/env node
/**
 * Layout, accessibility and scroll checks on the built site.
 * - 375, 390, 768: no horizontal scroll, one column below 900px, body text
 *   17px+, tap targets 44px+, full-width buttons.
 * - axe-core WCAG 2.1 AA at 390 and 1440, with and without reduced motion.
 * - Keyboard: skip link first, every link and button reachable with Tab
 *   straight after load, a visible ring on each, headings in order.
 * - Deep links land the section just under the header, with motion on.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { launchBrowser, pause, serveOut } from "./_browser.mjs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const server = await serveOut();
const browser = await launchBrowser();
let failures = 0;
const report = (ok, label, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

async function open(viewport, { reduced = false, path = "" } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ deviceScaleFactor: 1, ...viewport });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
  await page.goto(server.url + path, { waitUntil: "networkidle0" });
  return page;
}

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await pause(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(300);
}

async function axe(page, tags) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async (runOnly) => {
    const r = await window.axe.run(document, { runOnly });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  }, tags);
}

for (const width of [320, 375, 390, 768]) {
  const page = await open({ width, height: 800, isMobile: width < 768, hasTouch: true });
  await scrollThrough(page);

  const data = await page.evaluate(() => {
    const doc = document.documentElement;
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    // Body copy: paragraphs and list items outside the small demos and labels.
    const bodyEls = [...document.querySelectorAll("main p, main li, main blockquote, footer p, footer li")].filter(
      (el) => visible(el) && !el.closest(".demo, .label, .visually-hidden") && !el.classList.contains("deliverable-index"),
    );
    const small = bodyEls.map((el) => ({ t: el.textContent.trim().slice(0, 40), fs: parseFloat(getComputedStyle(el).fontSize) })).filter((x) => x.fs < 17);
    const targets = [...document.querySelectorAll("a, button")].filter((el) => visible(el) && !el.closest("p") && !el.classList.contains("skip-link"));
    const smallTargets = targets
      .map((el) => ({ t: el.textContent.trim().slice(0, 30), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) }))
      .filter((x) => x.h < 44 || x.w < 44);
    const grids = [...document.querySelectorAll(".grid, .pace-options")].map((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    const buttons = [...document.querySelectorAll(".button")].map((el) => Math.round((el.getBoundingClientRect().width / el.parentElement.getBoundingClientRect().width) * 100));
    return { overflow: doc.scrollWidth - window.innerWidth, small, smallTargets, grids, buttons };
  });

  report(data.overflow <= 0, `${width}px no horizontal scroll`, `overflow ${data.overflow}px`);
  report(data.small.length === 0, `${width}px body text 17px+`, JSON.stringify(data.small.slice(0, 5)));
  report(data.smallTargets.length === 0, `${width}px tap targets 44px+`, JSON.stringify(data.smallTargets));
  report(data.grids.every((n) => n === 1), `${width}px one column`, `grid tracks ${data.grids.join(",")}`);
  if (width < 768) report(data.buttons.every((p) => p >= 99), `${width}px full-width buttons`, `widths ${data.buttons.join(",")}%`);
  await page.close();
}

for (const [width, reduced] of [[390, false], [1440, false], [1440, true]]) {
  const page = await open({ width, height: 900 }, { reduced });
  await pause(2500);
  const atLoad = await axe(page, ["wcag2aa", "wcag21aa"]);
  report(atLoad.length === 0, `axe WCAG AA at ${width}px on load${reduced ? ", reduced motion" : ""}`, atLoad.join("; "));
  await scrollThrough(page);
  // Let scrubbed animations settle at their end state before the contrast checks.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await pause(1500);
  const after = await axe(page, ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]);
  report(after.length === 0, `axe WCAG AA at ${width}px after scrolling${reduced ? ", reduced motion" : ""}`, after.join("; "));
  await page.close();
}

// Keyboard, straight after load with motion on: content waiting to reveal must still be reachable.
{
  const page = await open({ width: 1280, height: 900 });
  await pause(2000);
  const expected = await page.evaluate(
    () => [...document.querySelectorAll("a[href], button")].filter((el) => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden").length,
  );
  const stops = [];
  for (let i = 0; i < expected + 2; i++) {
    await page.keyboard.press("Tab");
    stops.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        const s = getComputedStyle(el);
        return { tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 24), ring: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2 };
      }),
    );
  }
  // One pass through the page: every stop until focus first leaves it.
  const end = stops.findIndex((s) => s.tag === "BODY");
  const real = stops.slice(0, end === -1 ? stops.length : end);
  report(real[0]?.cls === "skip-link", "First Tab reaches the skip link", real[0]?.cls);
  report(real.length >= expected, "Tab reaches every link and button", `${real.length} of ${expected}`);
  const noRing = real.filter((s) => !s.ring);
  report(noRing.length === 0, "Visible focus ring on every stop", JSON.stringify(noRing.slice(0, 3)));
  const headings = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]));
  report(headings[0] === 1 && !headings.some((lvl, i) => i > 0 && lvl - headings[i - 1] > 1), "Headings in order", headings.join(" "));
  await page.close();
}

// Deep links with pins and smooth scroll running.
for (const id of ["pace", "needs", "proof", "contact"]) {
  const page = await open({ width: 1440, height: 900 }, { path: `#${id}` });
  await pause(3000);
  const gap = await page.evaluate((target) => {
    const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
    return Math.round(document.getElementById(target).getBoundingClientRect().top - header);
  }, id);
  report(Math.abs(gap) <= 4, `/#${id} lands under the header`, `${gap}px off`);
  await page.close();
}

// The block under the header must survive a resize across the pin breakpoint and a reload.
{
  const blockUnderHeader = (page) =>
    page.evaluate(() => {
      const line = document.querySelector(".site-header").offsetHeight + 2;
      let hit = null;
      for (const el of document.querySelectorAll("main > section, .deliverable")) {
        const box = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
        if (box.getBoundingClientRect().top <= line) hit = el.id || el.getAttribute("aria-labelledby");
      }
      return hit;
    });
  const page = await open({ width: 1440, height: 900 });
  await pause(2500);
  await page.mouse.move(700, 450);
  for (let d = 0; d < 6800; d += 400) {
    await page.mouse.wheel({ deltaY: 400 });
    await pause(40);
  }
  await pause(1500);
  const start = await blockUnderHeader(page);
  await page.setViewport({ width: 800, height: 900 });
  await pause(2500);
  const narrow = await blockUnderHeader(page);
  await page.setViewport({ width: 1440, height: 900 });
  await pause(2500);
  const wide = await blockUnderHeader(page);
  report(start && narrow === start && wide === start, "Resize across the pin breakpoint keeps your place", `${start} > ${narrow} > ${wide}`);
  await page.reload({ waitUntil: "networkidle0" });
  await pause(3000);
  const reloaded = await blockUnderHeader(page);
  report(reloaded === start, "Reload keeps your place", `${start} > ${reloaded}`);
  await page.close();
}

// Phone menu: opens, lists every chapter, closes on Escape and after a jump.
{
  const page = await open({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const shown = () => page.evaluate(() => getComputedStyle(document.querySelector(".site-nav-list")).display !== "none");
  const closedAtStart = !(await shown());
  await page.click(".menu-toggle");
  const links = await page.evaluate(() => [...document.querySelectorAll(".site-nav-list a")].filter((a) => a.getClientRects().length).length);
  const expanded = await page.$eval(".menu-toggle", (b) => b.getAttribute("aria-expanded"));
  await page.keyboard.press("Escape");
  const closedByEscape = !(await shown());
  await page.click(".menu-toggle");
  await page.click('.site-nav-list a[href="#proof"]');
  await pause(2500);
  const closedAfterJump = !(await shown());
  const gap = await page.evaluate(() => Math.round(document.getElementById("proof").getBoundingClientRect().top - document.querySelector(".site-header").getBoundingClientRect().bottom));
  report(
    closedAtStart && expanded === "true" && links === 5 && closedByEscape && closedAfterJump && Math.abs(gap) <= 4,
    "Phone menu opens, closes and jumps",
    `links ${links}, expanded ${expanded}, escape ${closedByEscape}, after jump ${closedAfterJump}, landed ${gap}px off`,
  );
  await page.close();
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll layout, accessibility and scroll checks pass");
process.exit(failures ? 1 : 0);
