/** Shared helpers for the check scripts: a static server for out/ and Playwright. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { join, extname } from "node:path";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";

const require = createRequire(import.meta.url);

export function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    const globalRoot = execSync("npm root -g").toString().trim();
    return require(join(globalRoot, "playwright"));
  }
}

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json", ".ico": "image/x-icon" };

/** Serve out/ on a free port. Returns { url, close }. */
export async function serveOut(root = new URL("../out", import.meta.url).pathname) {
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = join(root, path);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      let body = await readFile(file);
      const headers = { "content-type": types[extname(file)] ?? "application/octet-stream", "cache-control": "public, max-age=31536000" };
      // Compress text like any production static host does (Vercel, Netlify, nginx).
      const accept = String(req.headers["accept-encoding"] ?? "");
      if (/\.(html|js|css|txt|xml|json|svg)$/.test(file)) {
        if (accept.includes("br")) {
          body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } });
          headers["content-encoding"] = "br";
        } else if (accept.includes("gzip")) {
          body = gzipSync(body, { level: 9 });
          headers["content-encoding"] = "gzip";
        }
      }
      res.writeHead(200, headers);
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return { url: `http://127.0.0.1:${port}/`, close: () => server.close() };
}

export const chromePath = process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium";
