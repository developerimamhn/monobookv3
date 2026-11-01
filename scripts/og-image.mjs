#!/usr/bin/env node
/**
 * Builds public/og.png (1200x630) for social sharing, in the site's one
 * typeface. Runs before `next build` (see package.json "prebuild"), so the
 * image is a real .png file that every static host serves correctly.
 * The main line is read from content/copy.ts, which stays the single copy source.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const root = new URL("..", import.meta.url).pathname;
const copy = await readFile(`${root}content/copy.ts`, "utf8");
const lines = JSON.parse(copy.match(/lines:\s*(\[[^\]]+\])/)[1]);
const name = copy.match(/name:\s*"([^"]+)"/)[1];
const shortName = copy.match(/shortName:\s*"([^"]+)"/)[1];
const font = await readFile(`${root}node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff`);

const tree = h(
  "div",
  { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#FAFAF8", color: "#101012", fontFamily: "Hanken Grotesk" } },
  h("div", { style: { fontSize: 30 } }, shortName),
  h("div", { style: { display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1.02, letterSpacing: "-0.03em" } }, ...lines.map((l) => h("span", { key: l }, l))),
  h("div", { style: { fontSize: 28, color: "#6B6B70" } }, name),
);

const res = new ImageResponse(tree, { width: 1200, height: 630, fonts: [{ name: "Hanken Grotesk", data: font, weight: 500, style: "normal" }] });
await writeFile(`${root}public/og.png`, Buffer.from(await res.arrayBuffer()));
console.log("public/og.png written");
