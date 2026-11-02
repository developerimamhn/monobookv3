/** Shared by the check scripts: a static server for out/ and a headless Chrome. */
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";
import { Launcher } from "chrome-launcher";
import puppeteer from "puppeteer-core";

export const root = fileURLToPath(new URL("..", import.meta.url));

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json", ".webmanifest": "application/manifest+json" };

/** Serve out/ on a free port, compressed like a production host. Returns { url, close }. */
export async function serveOut(dir = join(root, "out"), port = 0) {
  const server = createServer(async (req, res) => {
    let file = join(dir, decodeURIComponent((req.url ?? "/").split("?")[0]));
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      let body = await readFile(file);
      const headers = { "content-type": types[extname(file)] ?? "application/octet-stream" };
      const accept = String(req.headers["accept-encoding"] ?? "");
      if (/\.(html|js|css|txt|xml|json|svg|webmanifest)$/.test(file)) {
        if (accept.includes("br")) {
          body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } });
          headers["content-encoding"] = "br";
        } else if (accept.includes("gzip")) {
          body = gzipSync(body, { level: 9 });
          headers["content-encoding"] = "gzip";
        }
      }
      res.writeHead(200, headers).end(body);
    } catch {
      const notFound = await readFile(join(dir, "404.html")).catch(() => "not found");
      res.writeHead(404, { "content-type": "text/html" }).end(notFound);
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return { url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() };
}

/** CHROME_PATH if set, otherwise the first Chrome that chrome-launcher finds on this machine. */
export const chromePath = process.env.CHROME_PATH ?? Launcher.getInstallations()[0];

export function launchBrowser() {
  if (!chromePath) throw new Error("No Chrome found. Install Chrome or set CHROME_PATH.");
  return puppeteer.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox"] });
}

export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
