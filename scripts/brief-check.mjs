#!/usr/bin/env node
/**
 * Checks the built site (out/) and the source against the site's hard rules:
 * no prices, invented numbers or other clients, the quote word for word, the
 * brand palette and type. Run after `npm run build`. Exits 1 on any failure.
 */
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "out");

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

const read = (f) => readFileSync(f, "utf8");
const html = read(join(out, "index.html"));
const visible = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ");
// Attribute text a visitor or a screen reader can meet.
const attrText = [...html.matchAll(/\b(?:alt|aria-label|title|content)="([^"]*)"/g)].map((m) => m[1]).join(" ");
const allText = `${visible} ${attrText}`;

const builtCss = walk(join(out, "_next"), [".css"]).map(read).join("\n");
const srcFiles = [
  ...walk(join(root, "app"), [".ts", ".tsx", ".css"]),
  ...walk(join(root, "components"), [".ts", ".tsx"]),
  ...walk(join(root, "content"), [".ts"]),
  ...walk(join(root, "public"), [".svg"]),
  ...walk(join(root, "scripts"), [".mjs"]).filter((f) => !f.endsWith("brief-check.mjs")),
];
const src = srcFiles.map(read).join("\n");
const styles = builtCss + "\n" + src;

/* Colour literals in every form CSS and SVG accept: #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba() with commas or spaces. */
function colours(text) {
  const found = [];
  for (const m of text.matchAll(/#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi)) {
    let hex = m[1].toLowerCase();
    if (hex.length <= 4) hex = [...hex].map((c) => c + c).join("");
    if (hex.slice(6) === "00") continue; // fully transparent, how minifiers write `transparent`
    found.push({ raw: m[0], rgb: [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) });
  }
  for (const m of text.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/gi)) found.push({ raw: m[0], rgb: [+m[1], +m[2], +m[3]] });
  return found;
}
const key = ([r, g, b]) => `${r},${g},${b}`;
// The guideline palette and the two tints. Ink and Paper may also appear at any opacity.
const PALETTE = new Set(["237,54,20", "11,11,11", "251,251,251", "171,171,171", "239,239,239", "94,94,94"]);
// Hex digits shown as text in the colour demo, in the copy file only.
const isCopyFile = (f) => f.endsWith(join("content", "copy.ts"));

const rules = [];
/** A rule returns a list of problems (empty means pass), or { problems, detail }. */
const rule = (name, fn) => rules.push({ name, fn });

rule("No prices anywhere", () => allText.match(/[£$€]\s?\d|\b\d+\s?(?:gbp|usd|pounds)\b|\bpric(?:e|es|ing)\b|\bper month\b|\bfrom only\b/gi) ?? []);

rule("No revenue, growth or statistic claims", () => {
  // Allowed: the brief's own line about revenue, and the client's company name.
  const text = allText.replace("We do not take credit for their revenue.", "").replaceAll("Mayfair Lumber Sales Ltd", "");
  const banned = [/\d+(?:\.\d+)?\s?%/g, /lucidpress/gi, /stanford/gi, /\bpercent\b/gi, /\bgrowth\b/gi, /\brevenue\b|\bsales\b/gi, /\broi\b/gi];
  return banned.flatMap((r) => text.match(r) ?? []);
});

rule("Never claim or link Mayfair's website", () => [
  /href="[^"]*mayfair[^"]*"/i.test(html) && "link found",
  /\bwebsite\b[^.]*mayfair|mayfair[^.]*\bwebsite\b/i.test(visible) && "website claim found",
].filter(Boolean));

rule("Only the brief's proof: quote word for word, own-brand images only", () => {
  const quote = "Mehedi was hired to do a visual rebrand for our 40+ year organization. He was an excellent communicator, showed exceptional passion for the project, and delivered a finished product exactly what we were hoping for.";
  const images = [
    ...[...html.matchAll(/<(?:img|source)\b[^>]*\b(?:src|srcset|srcSet)="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(/\s+/)[0])),
    ...[...builtCss.matchAll(/url\(\s*["']?([^"')]+)/g)].map((m) => m[1]).filter((u) => !u.startsWith("data:") && !/\.woff2?$/.test(u)),
  ];
  const foreign = images.filter((u) => !u.startsWith("/brand/"));
  const blockquotes = (html.match(/<blockquote/g) ?? []).length;
  const problems = [
    !visible.includes(quote) && "quote changed",
    !visible.includes("Eric Dahl, Client, December 2023") && "cite changed",
    blockquotes !== 1 && `${blockquotes} blockquotes`,
    ...foreign.map((u) => `foreign image ${u}`),
  ].filter(Boolean);
  return { problems, detail: `1 blockquote, ${images.length} own-brand image references` };
});

rule("No banned words", () => {
  const words = ["free audit", "free", "luxury", "world-class", "bespoke", "elevat\\w*", "seamless\\w*", "cutting-edge"];
  return words.filter((w) => new RegExp(`\\b${w.replace("-", "[- ]")}\\b`, "i").test(allText));
});

rule("No em or en dashes", () => {
  const dash = /[—–]|&mdash;|&ndash;/;
  return [dash.test(allText) && "built page", dash.test(src) && "source"].filter(Boolean);
});

rule("No ALL CAPS", () => {
  const styled = /text-transform\s*:\s*uppercase|textTransform:\s*["']uppercase|font-variant(?:-caps)?\s*:\s*(?:all-)?(?:small|petite)-caps|letter-spacing\s*:\s*0?\.(?:[1-9]|0[6-9])\d*em/i;
  // Acronyms are fine; so are [PLACEHOLDERS] and the hex codes in the colour demo.
  const words = visible.replace(/\[[^\]]*\]|#[0-9A-F]{3,8}\b/g, " ").match(/\b[A-Z]{2,}\b/g)?.filter((w) => !["UK", "RGB"].includes(w)) ?? [];
  return [styled.test(builtCss) && "built css", styled.test(src) && "source", ...words];
});

rule("Colour tokens exact", () => {
  const css = read(join(root, "app", "globals.css"));
  const want = { "--brand": "#ed3614", "--ink": "#0b0b0b", "--paper": "#fbfbfb", "--grey": "#ababab", "--stone": "#efefef", "--muted": "#5e5e5e" };
  return Object.entries(want)
    .filter(([k, v]) => (css.match(new RegExp(`${k}:\\s*#[0-9a-f]+`, "gi")) ?? []).map((d) => d.toLowerCase()).join() !== `${k}: ${v}`)
    .map(([k]) => `${k} missing, changed or defined twice`);
});

rule("Only palette colours, in any notation", () => {
  const offenders = [];
  for (const f of srcFiles.filter((f) => !isCopyFile(f))) for (const c of colours(read(f))) if (!PALETTE.has(key(c.rgb))) offenders.push(`${c.raw} in ${relative(root, f)}`);
  for (const c of colours(builtCss)) if (!PALETTE.has(key(c.rgb))) offenders.push(`${c.raw} in built css`);
  return [...new Set(offenders)];
});

rule("Orange only where registered", () => {
  const tokens = read(join(root, "content", "tokens.ts"));
  const allowed = (tokens.match(/BRAND_USES = \[([\s\S]*?)\] as const/)?.[1].match(/^\s*"/gm) ?? []).length;
  const uses = srcFiles.reduce((n, f) => n + (read(f).match(/var\(\s*--brand\b/g) ?? []).length, 0);
  // The raw orange may appear only where it is defined: the token, the static favicon and the build script.
  const definedIn = /globals\.css$|icon\.svg$|brand-assets\.mjs$/;
  const stray = srcFiles
    .filter((f) => !definedIn.test(f) && !isCopyFile(f))
    .filter((f) => colours(read(f)).some((c) => key(c.rgb) === "237,54,20"))
    .map((f) => relative(root, f));
  return { problems: [uses > allowed && `${uses} uses, ${allowed} registered`, ...stray.map((f) => `raw orange in ${f}`)].filter(Boolean), detail: `${uses} of ${allowed} registered uses` };
});

rule("No blue anywhere", () => {
  const isBlue = ([r, g, b]) => {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (d < 24) return false; // grey
    const h = ((max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60 + 360) % 360;
    return h >= 180 && h <= 265;
  };
  const named = styles.match(/(?:color|background|fill|stroke|outline)[^;{}]*\b(?:blue|navy|teal|cyan|aqua)\b/gi) ?? [];
  const hsl = [...styles.matchAll(/hsla?\(\s*(\d+)/gi)].filter((m) => +m[1] >= 180 && +m[1] <= 265).map((m) => m[0]);
  return [...colours(styles).filter((c) => isBlue(c.rgb)).map((c) => c.raw), ...hsl, ...named];
});

rule("Inter and Manrope only, no serif or script", () => {
  const families = [...builtCss.matchAll(/font-family\s*:\s*([^;}]+)/gi)].map((m) => m[1]);
  const names = [...new Set(families.flatMap((f) => f.split(",").map((n) => n.trim().replace(/["']/g, ""))))].filter(Boolean);
  const generic = /^(?:var\(.*|.*Fallback|Helvetica Neue|Arial|sans-serif|inherit|system-ui)$/i;
  const extra = names.filter((n) => !generic.test(n) && !/^(Inter|Manrope)$/i.test(n));
  return { problems: extra, detail: names.filter((n) => /^(Inter|Manrope)$/i.test(n)).join(", ") };
});

rule("No gradients, shadows, emoji, carousels", () => [
  ...[/gradient\(/i, /<(?:linear|radial)Gradient\b/, /box-shadow\s*:\s*(?!none)/i, /text-shadow\s*:\s*(?!none)/i, /drop-shadow/i].filter((r) => r.test(styles)).map(String),
  /\p{Extended_Pictographic}/u.test(allText) && "emoji",
  /carousel|swiper|slick|marquee/i.test(html + src) && "carousel",
].filter(Boolean));

rule("Five deliverables, in order", () => {
  const names = ["Logo", "Colour", "Typeface", "Image style", "Guidelines"];
  const heads = [...html.matchAll(/<h3[^>]*class="[^"]*deliverable-name[^"]*"[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  return { problems: JSON.stringify(heads) === JSON.stringify(names) ? [] : [heads.join(" > ") || "none found"], detail: heads.join(" > ") };
});

rule("Page order", () => {
  const ids = ["hero", "problem", "deliverables", "pace", "needs", "proof", "contact"];
  const pos = ids.map((id) => html.indexOf(`id="${id}"`));
  const ordered = pos.every((p, i) => p > -1 && (i === 0 || p > pos[i - 1])) && html.indexOf("<footer") > pos.at(-1);
  return { problems: ordered ? [] : [JSON.stringify(Object.fromEntries(ids.map((id, i) => [id, pos[i]])))], detail: [...ids, "footer"].join(" > ") };
});

rule("Main line, contact email, footer address", () => {
  const address = ["MonoBook Brand Architects", "Thana Road, Kaliganj", "Satkhira 9440", "Khulna Division", "Bangladesh"];
  return [
    ...address.filter((a) => !visible.includes(a)).map((a) => `missing ${a}`),
    !(visible.includes("Your business works.") && visible.includes("It just does not look like it does.")) && "main line missing",
    !/href="mailto:mehedi@monobook\.co/.test(html) && "no mailto",
    /href="(?:tel|sms):|wa\.me|whatsapp/i.test(html) && "phone or WhatsApp link",
  ].filter(Boolean);
});

rule("Exactly one H1", () => {
  const h1 = (html.match(/<h1\b/g) ?? []).length;
  return h1 === 1 ? [] : [`${h1} found`];
});

const results = rules.map(({ name, fn }) => {
  const r = fn();
  const problems = (Array.isArray(r) ? r : r.problems).filter(Boolean);
  return { name, ok: problems.length === 0, detail: problems.length ? problems.join(", ") : Array.isArray(r) ? "" : r.detail };
});
const width = Math.max(...results.map((r) => r.name.length));
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(width)}  ${r.detail}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} rules pass`);
process.exit(failed ? 1 : 0);
