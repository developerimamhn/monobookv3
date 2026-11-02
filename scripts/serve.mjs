#!/usr/bin/env node
/** `npm start`: serve the static export in out/ on http://127.0.0.1:3000 (or PORT). */
import { serveOut } from "./_browser.mjs";

const { url } = await serveOut(undefined, Number(process.env.PORT ?? 3000));
console.log(`Serving out/ at ${url}`);
