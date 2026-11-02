#!/usr/bin/env node
/**
 * Brief Guardian: checks the built site (out/) and the source against the
 * hard rules in docs/BRIEF.md. Exit code 1 on any failure.
 * Run after `npm run build`.
 */
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "out");
const results = [];
const pass = (rule, detail = "") => results.push({ rule, ok: true, detail });
const fail = (rule, detail) => results.push({ rule, ok: false, detail });

function walk(dir, exts) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p, exts);
    return exts.includes(extname(p)) ? [p] : [];
  });
}

if (!existsSync(join(out, "index.html"))) {
  console.error("out/index.html not found. Run `npm run build` first.");
  process.exit(1);
}

const html = readFileSync(join(out, "index.html"), "utf8");
const visible = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ");
// Attribute text the visitor or a screen reader can meet (alt, aria-label, title, meta content).
const attrText = [...html.matchAll(/\b(?:alt|aria-label|title|content)="([^"]*)"/g)].map((m) => m[1]).join(" ");
const allText = `${visible} ${attrText}`;

const cssFiles = walk(join(out, "_next"), [".css"]);
const builtCss = cssFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const srcFiles = [...walk(join(root, "app"), [".ts", ".tsx", ".css"]), ...walk(join(root, "components"), [".ts", ".tsx"]), ...walk(join(root, "content"), [".ts"])];
const src = srcFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const sourceCss = readFileSync(join(root, "app", "globals.css"), "utf8");

// 1. No prices
{
  const hits = allText.match(/[£$€]\s?\d|\b\d+\s?(?:gbp|usd|pounds)\b|\bpric(?:e|es|ing)\b|\bper month\b|\bfrom only\b/gi);
  hits ? fail("No prices anywhere", hits.join(", ")) : pass("No prices anywhere");
}

// 2. No revenue / growth claims, no stats
{
  const banned = [/\d+(?:\.\d+)?\s?%/g, /lucidpress/gi, /stanford/gi, /46\.1/g, /\b23 ?percent/gi, /\bpercent\b/gi, /\bgrowth\b/gi, /\bincrease(?:d|s)? (?:sales|revenue)/gi, /\broi\b/gi];
  // The proof intro is allowed to say "We do not take credit for their revenue."
  // The company name "Mayfair Lumber Sales Ltd" is not a sales claim.
  const text = allText.replace("We do not take credit for their revenue.", "").replaceAll("Mayfair Lumber Sales Ltd", "");
  const hits = banned.flatMap((r) => text.match(r) ?? []);
  const revenue = text.match(/\brevenue\b|\bsales\b/gi);
  const all = [...hits, ...(revenue ?? [])];
  all.length ? fail("No revenue, growth or statistic claims", all.join(", ")) : pass("No revenue, growth or statistic claims");
}

// 3. Mayfair: no website claim, no link
{
  const link = /href="[^"]*mayfair[^"]*"/i.test(html);
  const site = /\bwebsite\b[^.]*mayfair|mayfair[^.]*\bwebsite\b/i.test(visible);
  link || site ? fail("Never claim or link Mayfair's website", link ? "link found" : "website claim found") : pass("Never claim or link Mayfair's website");
}

// 4. Only the brief's proof
{
  const quote = "Mehedi was hired to do a visual rebrand for our 40+ year organization. He was an excellent communicator, showed exceptional passion for the project, and delivered a finished product exactly what we were hoping for.";
  const quoteOk = visible.includes(quote);
  const citeOk = visible.includes("Eric Dahl, Client, December 2023");
  const blockquotes = (html.match(/<blockquote/g) ?? []).length;
  // Images may only be MonoBook's own brand mockups from public/brand/. No client logos.
  const srcs = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const foreign = srcs.filter((src) => !src.startsWith("/brand/"));
  quoteOk && citeOk && blockquotes === 1 && foreign.length === 0
    ? pass("Only the brief's proof (quote word for word, no client images)", `1 blockquote, ${srcs.length} own-brand images`)
    : fail("Only the brief's proof (quote word for word, no client images)", `quote:${quoteOk} cite:${citeOk} blockquotes:${blockquotes} foreign:${foreign.join(" ")}`);
}

// 5. Banned words
{
  const words = ["free audit", "free", "luxury", "world-class", "world class", "bespoke", "elevate", "elevates", "elevated", "seamless", "seamlessly", "cutting-edge", "cutting edge"];
  const hits = words.filter((w) => new RegExp(`\\b${w.replace("-", "[- ]")}\\b`, "i").test(allText));
  hits.length ? fail("No banned words", hits.join(", ")) : pass("No banned words");
}

// 6. No em or en dashes (site text and source)
{
  const dash = /[\u2014\u2013]|&mdash;|&ndash;/;
  const where = [dash.test(allText) && "built page", dash.test(src) && "source"].filter(Boolean);
  where.length ? fail("No em or en dashes", where.join(", ")) : pass("No em or en dashes");
}

// 7. No ALL CAPS styling
{
  const t = /text-transform\s*:\s*uppercase|font-variant(?:-caps)?\s*:\s*(?:all-)?small-caps/i;
  const where = [t.test(builtCss) && "built css", t.test(src) && "source"].filter(Boolean);
  // Words in all caps in visible text, ignoring [PLACEHOLDERS] and the acronym UK.
  const words = visible.replace(/\[[^\]]*\]/g, " ").match(/\b[A-Z]{2,}\b/g)?.filter((w) => w !== "UK") ?? [];
  where.length || words.length ? fail("No ALL CAPS", [...where, ...words].join(", ")) : pass("No ALL CAPS", "UK and [PLACEHOLDERS] allowed");
}

// 8. Colour tokens exact (brand guideline palette plus two tints)
{
  const want = { "--brand": "#ed3614", "--ink": "#0b0b0b", "--paper": "#fbfbfb", "--grey": "#ababab", "--stone": "#efefef", "--muted": "#5e5e5e" };
  const bad = Object.entries(want).filter(([k, v]) => !new RegExp(`${k}:\\s*${v}`, "i").test(sourceCss));
  bad.length ? fail("Colour tokens exact", bad.map(([k]) => k).join(", ")) : pass("Colour tokens exact");
}

// 9. Orange only where the register in content/tokens.ts allows it
{
  const tokens = readFileSync(join(root, "content", "tokens.ts"), "utf8");
  const allowed = (tokens.match(/BRAND_USES = \[([\s\S]*?)\] as const/)?.[1].match(/^\s*"/gm) ?? []).length;
  const uses = (sourceCss.match(/var\(--brand\)/g) ?? []).length;
  // The hex may appear in tokens.ts (definition) and globals.css (token) only.
  const stray = srcFiles.filter((f) => !/tokens\.ts$|globals\.css$|Logo\.tsx$/.test(f) && /#ed3614/i.test(readFileSync(f, "utf8")));
  uses <= allowed && !stray.length
    ? pass("Orange only where registered", `${uses} of ${allowed} registered uses`)
    : fail("Orange only where registered", `${uses} uses, ${allowed} registered, stray: ${stray.join(" ")}`);
}

// 10. No blue anywhere
{
  const hexes = [...new Set([...(builtCss + src).matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)].map((m) => m[1].toLowerCase()))];
  const rgbs = [...(builtCss + src).matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/gi)].map((m) => [+m[1], +m[2], +m[3]]);
  const toRgb = (h) => (h.length === 3 ? h.split("").map((c) => parseInt(c + c, 16)) : [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)));
  const isBlue = ([r, g, b]) => {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (d < 24) return false; // grey
    let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    return h >= 180 && h <= 265;
  };
  const blue = [...hexes.filter((h) => isBlue(toRgb(h))).map((h) => `#${h}`), ...rgbs.filter(isBlue).map((c) => `rgb(${c})`)];
  const named = /(?:color|background|fill|stroke)[^;{}]*\b(?:blue|navy|teal|cyan|aqua)\b/i.test(builtCss + sourceCss);
  blue.length || named ? fail("No blue anywhere", blue.join(", ") || "named colour") : pass("No blue anywhere");
}

// 11. The guideline's two sans families (Inter, Manrope), no serif or script
{
  const families = [...builtCss.matchAll(/font-family\s*:\s*([^;}]+)/gi)].map((m) => m[1]);
  const bad = families.filter((f) => /(?:^|,)\s*(?:serif|cursive|fantasy|"?(?:georgia|times)[^,]*)\s*(?:,|$)/i.test(f) && !/sans-serif/i.test(f.replace(/sans-serif/gi, "")));
  const named = [...new Set(families.flatMap((f) => f.split(",").map((n) => n.trim().replace(/["']/g, ""))))].filter((n) => n && !/^var\(|Fallback|Helvetica|Arial|^sans-serif$|^inherit$/i.test(n));
  const extra = named.filter((n) => !/^(Inter|Manrope)$/i.test(n));
  bad.length || extra.length ? fail("Inter and Manrope only", `${named.join(", ")} ${bad.join(", ")}`) : pass("Inter and Manrope only", named.join(", "));
}

// 12. No gradients, shadows, emoji, carousels, images
{
  const g = [/gradient\(/i, /box-shadow\s*:\s*(?!none)/i, /text-shadow\s*:\s*(?!none)/i, /drop-shadow/i].filter((r) => r.test(builtCss) || r.test(sourceCss));
  const emoji = /\p{Extended_Pictographic}/u.test(allText);
  const carousel = /carousel|swiper|slick|marquee/i.test(html + src);
  g.length || emoji || carousel ? fail("No gradients, shadows, emoji, carousels", `${g.map(String).join(" ")} emoji:${emoji} carousel:${carousel}`) : pass("No gradients, shadows, emoji, carousels");
}

// 13. Five deliverables, in order, never more or less
{
  const names = ["Logo", "Colour", "Typeface", "Image style", "Guidelines"];
  const heads = [...html.matchAll(/<h3[^>]*class="[^"]*deliverable-name[^"]*"[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]);
  JSON.stringify(heads) === JSON.stringify(names) ? pass("Five deliverables, in order", heads.join(" > ")) : fail("Five deliverables, in order", heads.join(" > ") || "none found");
}

// 14. Page order
{
  const ids = ["hero", "problem", "deliverables", "pace", "needs", "proof", "contact"];
  const pos = ids.map((id) => html.indexOf(`id="${id}"`));
  const footer = html.indexOf("<footer");
  const ordered = pos.every((p, i) => p > -1 && (i === 0 || p > pos[i - 1])) && footer > pos[pos.length - 1];
  ordered ? pass("Page order", ids.concat("footer").join(" > ")) : fail("Page order", JSON.stringify(Object.fromEntries(ids.map((id, i) => [id, pos[i]]))));
}

// 15. Footer address, main line, contact
{
  const address = ["MonoBook Brand Architects", "Thana Road, Kaliganj", "Satkhira 9440", "Khulna Division", "Bangladesh"];
  const missing = address.filter((a) => !visible.includes(a));
  const mainLine = visible.includes("Your business works.") && visible.includes("It just does not look like it does.");
  const mail = /href="mailto:/.test(html);
  missing.length || !mainLine || !mail ? fail("Main line, contact email, footer address", `missing:${missing.join("|")} mainLine:${mainLine} mailto:${mail}`) : pass("Main line, contact email, footer address");
}

// 16. One H1
{
  const h1 = (html.match(/<h1\b/g) ?? []).length;
  h1 === 1 ? pass("Exactly one H1") : fail("Exactly one H1", `${h1} found`);
}

const width = Math.max(...results.map((r) => r.rule.length));
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.rule.padEnd(width)}  ${r.detail}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} rules pass`);
process.exit(failed ? 1 : 0);
