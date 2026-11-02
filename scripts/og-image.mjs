#!/usr/bin/env node
/**
 * Builds public/og.png (1200x630) for social sharing, in the site's one
 * typeface. Runs before `next build` (see package.json "prebuild"), so the
 * image is a real .png file that every static host serves correctly.
 * The main line is read from content/copy.ts, which stays the single copy source.
 */
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const copy = await readFile(`${root}content/copy.ts`, "utf8");
const lines = JSON.parse(copy.match(/lines:\s*(\[[^\]]+\])/)[1]);
const name = copy.match(/name:\s*"([^"]+)"/)[1];
const logo = await readFile(`${root}components/ui/Logo.tsx`, "utf8");
const [, w, hgt, d] = logo.match(/WORDMARK = \{ w: (\d+), h: (\d+), d: "([^"]+)"/);
const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${hgt}"><path fill="#FBFBFB" d="${d}"/></svg>`;
const wordmark = `data:image/svg+xml;base64,${Buffer.from(wordmarkSvg).toString("base64")}`;
const font = await readFile(`${root}node_modules/@fontsource/inter/files/inter-latin-500-normal.woff`);

// Set like the guideline cover: White on the brand orange, Inter.
const tree = h(
  "div",
  { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#ED3614", color: "#FBFBFB", fontFamily: "Inter" } },
  h("img", { src: wordmark, width: 260, height: Math.round((260 * hgt) / w) }),
  h("div", { style: { display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.06, letterSpacing: "-0.035em" } }, ...lines.map((l) => h("span", { key: l }, l))),
  h("div", { style: { fontSize: 28, color: "#0B0B0B" } }, name),
);

const res = new ImageResponse(tree, { width: 1200, height: 630, fonts: [{ name: "Inter", data: font, weight: 500, style: "normal" }] });
await writeFile(`${root}public/og.png`, Buffer.from(await res.arrayBuffer()));
console.log("public/og.png written");
