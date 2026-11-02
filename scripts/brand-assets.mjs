#!/usr/bin/env node
/**
 * Runs before `next build`. Draws the raster brand files into public/ from the
 * same vectors the site uses (content/logo.json):
 * - og.png, the 1200x630 share image, White on orange, set in Inter
 * - logo.png (512) for search engines, plus the favicon and home-screen icons
 * They are build output, so they are not committed.
 */
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const ORANGE = "#ED3614";
const WHITE = "#FBFBFB";
const BLACK = "#0B0B0B";

const logo = JSON.parse(await readFile(`${root}content/logo.json`, "utf8"));
const copy = await readFile(`${root}content/copy.ts`, "utf8");

// copy.ts is TypeScript, so read the two strings we need from it directly.
function pick(pattern, what) {
  const match = copy.match(pattern);
  if (!match) throw new Error(`brand-assets: could not find ${what} in content/copy.ts`);
  return match[1];
}
const lines = JSON.parse(pick(/export const hero = \{\s*lines: (\[[^\]]*\])/, "hero.lines"));
const name = pick(/export const site = \{\s*name: "([^"]+)"/, "site.name");

const svgUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const { wordmark, mark, tile } = logo;
const wordmarkUri = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wordmark.w} ${wordmark.h}"><path fill="${WHITE}" d="${wordmark.d}"/></svg>`);
const tileUri = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile.size} ${tile.size}"><rect width="${tile.size}" height="${tile.size}" fill="${ORANGE}"/><path transform="translate(${tile.x} ${tile.y})" fill="${WHITE}" d="${mark.d}"/></svg>`,
);

async function write(file, tree, width, height, fonts) {
  const res = new ImageResponse(tree, { width, height, fonts });
  await writeFile(`${root}public/${file}`, Buffer.from(await res.arrayBuffer()));
}

// Share image, set like the guideline cover.
const fontFile = `${root}node_modules/@fontsource/inter/files/inter-latin-500-normal.woff`;
if (existsSync(fontFile)) {
  const font = await readFile(fontFile);
  const shareImage = h(
    "div",
    { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: ORANGE, color: WHITE, fontFamily: "Inter" } },
    h("img", { src: wordmarkUri, width: 260, height: Math.round((260 * wordmark.h) / wordmark.w) }),
    h("div", { style: { display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.06, letterSpacing: "-0.035em" } }, ...lines.map((l) => h("span", { key: l }, l))),
    h("div", { style: { fontSize: 28, color: BLACK } }, name),
  );
  await write("og.png", shareImage, 1200, 630, [{ name: "Inter", data: font, weight: 500, style: "normal" }]);
} else if (existsSync(`${root}public/og.png`)) {
  console.warn("brand-assets: @fontsource/inter is not installed, keeping the existing public/og.png");
} else {
  throw new Error("brand-assets: install devDependencies (@fontsource/inter) to draw public/og.png");
}

// The Mk. tile at each icon size.
for (const [file, size] of [["logo.png", 512], ["icon-512.png", 512], ["icon-192.png", 192], ["apple-touch-icon.png", 180], ["icon-48.png", 48]]) {
  await write(file, h("img", { src: tileUri, width: size, height: size }), size, size);
}

console.log("brand-assets: og.png, logo.png and icons written to public/");
