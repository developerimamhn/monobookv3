# MonoBook Brand Architects - website

One-page site for MonoBook Brand Architects, a brand identity studio for established UK trade and service businesses.

- **Brief:** [`docs/BRIEF.md`](docs/BRIEF.md). If anything conflicts with it, the brief wins.
- **Copy:** [`content/copy.ts`](content/copy.ts). Placeholders are marked `[LIKE THIS]`.
- **Design tokens:** the top of [`app/globals.css`](app/globals.css). Where orange may appear: [`content/tokens.ts`](content/tokens.ts).
- **Logo vectors:** [`content/logo.json`](content/logo.json), exported from the Figma brand guideline.

## Stack

Next.js 16 (App Router) as a static export, TypeScript in strict mode. GSAP with ScrollTrigger and Lenis for motion, loaded after the page is idle. Inter and Manrope through `next/font`, self-hosted at build time. No CMS, no tracking, no cookies.

## Run and build

Node 20.9 or newer (`.nvmrc` pins 22).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
npm start       # serve out/ on http://127.0.0.1:3000
```

`npm run build` first runs `scripts/brand-assets.mjs`, which draws `og.png`, `logo.png` and the PNG icons into `public/` from the same vectors the site uses. Those files are build output and are not committed.

## Deploy

Upload `out/` to any static host. Build command `npm run build`, output directory `out`.

- **cPanel or any Apache/LiteSpeed hosting** reads `public/.htaccess`; step-by-step upload and SEO launch guide in [`docs/DEPLOY.md`](docs/DEPLOY.md).
- **Vercel** reads `vercel.json`; **Netlify** and **Cloudflare Pages** read `public/_headers` and `public/_redirects`. Both set the security headers (CSP, HSTS, nosniff, referrer and permissions policy), send `www` to the bare domain, and keep Next's `.txt` data files out of search.
- Make sure the host serves `404.html` with a 404 status. Netlify and Cloudflare Pages do this on their own.
- On another host, copy those headers and the redirect into its config.

## Checks

| Command | What it checks |
|---|---|
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint, Next core web vitals |
| `npm run check:brief` | The brief's hard rules against the built page and the source: no prices, statistics, banned words or dashes; quote word for word; own-brand images only; palette colours only, in any notation; orange only where registered; no blue, caps styling, gradients or shadows; Inter and Manrope only; five deliverables and the page in order; one H1 |
| `npm run check:mobile` | 320 to 768px: no sideways scroll, one column, text 17px+, tap targets 44px+, full-width buttons. axe-core WCAG 2.1 AA with and without reduced motion. Every link and button reachable by Tab straight after load. Deep links land under the header |
| `npm run check:lighthouse` | Lighthouse mobile, median of three runs, must be 90+. Report in `reports/` |
| `npm run check` | All of the above |
| `npm run shots` | Screenshots into `reports/shots/` |

The browser checks drive your installed Chrome through puppeteer-core. Set `CHROME_PATH` to use another Chromium.

## Motion

- **Lenis** smooth scroll on mouse and trackpad. Touch devices keep native scrolling.
- **Hero:** the lines rise on load in plain CSS, so the first paint needs no script.
- **Problem:** the sentence darkens word by word; two mismatched marks slide together and resolve into the Mk. tile.
- **Deliverables:** on screens at least 900px wide and 760px tall, each one pins briefly and the Mk. tile lands on its demo. Elsewhere the parts reveal once.
- **Sprint day:** the timeline draws itself and each step's dot lands in turn.
- **Headings** rise line by line from behind a mask (GSAP SplitText), then return to plain text.
- **Contact** opens out from a rounded inset; the Mayfair "After" frame wipes in; the footer wordmark rises and the Mk. tile lands last.
- **Reveals** animate opacity only, never visibility, so content waiting to appear stays in the tab order, in find-in-page and in print.
- **Scroll keeper** (`components/motion/scrollKeeper.ts`): pins add height after the browser has scrolled, so it puts deep links, reloads and resizes back on the right block.
- **Reduced motion:** Lenis is never created and every GSAP effect is skipped, including when the setting changes while the page is open.

## Before launch

| Item | Where |
|---|---|
| Mayfair before and after images. The frames hold a labelled illustration until then | `components/sections/Proof.tsx` (BeforeDrawing, AfterDrawing) and `proof.images` in `content/copy.ts` |
| Confirm the privacy notice matches how you handle email | `privacy` in `content/copy.ts` |
| Lines written from the brief rather than quoted from it: `hero.sub`, `pace.heading`, `pace.intro`, `pace.options[].body`, `needs.heading`, `needs.note`, `demos.image.rules`, `footer.hours` | `content/copy.ts` |
