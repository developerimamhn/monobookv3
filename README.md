# MonoBook Brand Architects - website

A one-page marketing site for MonoBook Brand Architects, a brand identity studio for established UK trade and service businesses.

- **Brief (single source of truth):** [`docs/BRIEF.md`](docs/BRIEF.md). If anything conflicts with it, the brief wins.
- **All copy:** [`content/copy.ts`](content/copy.ts). Placeholders are marked `[LIKE THIS]`.
- **Design tokens and the orange register:** [`content/tokens.ts`](content/tokens.ts) and the top of [`app/globals.css`](app/globals.css). Both follow the brand guideline in Figma (MonoBook Presentations, Guideline).

## Stack

- Next.js 16 (App Router), TypeScript in strict mode, static export (`output: "export"`).
- GSAP + ScrollTrigger for scroll animation. Lenis for smooth scroll. Both load lazily after first paint.
- Inter (headings) and Manrope (text) via `next/font/google`, as in the brand guideline. Both are self-hosted at build time, so visitors make no request to Google.
- No CMS, no tracking. Logos are inline SVG exported from Figma. The only photos are MonoBook's own brand mockups in `public/brand/` (WebP at 800, 1400 and 2400px, lazy-loaded).

## Run, build, export

Needs Node 20 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export into out/
npm start            # serve out/ locally
```

`npm run build` runs `prebuild` first, which writes `public/og.png` (the social share image) from the main line in `content/copy.ts`.

### Deploying the static export

Upload the `out/` folder to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, nginx). There is no server code. Before going live:

1. `site.url` (https://monobook.co) and `site.email` (mehedi@monobook.co) are set in `content/copy.ts`. The URL feeds the canonical URL, sitemap, robots file and Open Graph tags.
2. Make sure the host serves text files with gzip or brotli. All the common hosts do this by default, and the Lighthouse score depends on it.

## Checks

Each review team's checklist is automated where it can be.

| Command | What it checks | Team |
|---|---|---|
| `npm run typecheck` | TypeScript strict, zero errors | Code Quality |
| `npm run lint` | ESLint (Next core web vitals + TypeScript) | Code Quality |
| `npm run check:brief` | 16 hard rules from the brief, against the built page and the source: prices, statistics, banned words, dashes, caps, exact tokens, orange only where registered, no blue, Inter and Manrope only, own-brand images only, no gradients or shadows, five deliverables in order, page order, quote word for word, one H1 | Brief Guardian, Visual Design |
| `npm run check:mobile` | 375, 390 and 768px: no horizontal scroll, body 17px+, tap targets 44px+, one column, full-width buttons. axe-core WCAG 2.1 AA on load and after scrolling, with and without reduced motion. Keyboard: skip link, visible focus, heading order | Mobile, Accessibility |
| `npm run check:lighthouse` | Lighthouse mobile, 3 runs, median must be 90+. Report saved to `reports/` | Performance, SEO |
| `npm run check` | All of the above, in order | |
| `npm run shots` | Full-page screenshots (desktop, mobile, reduced motion) into `reports/shots/` | Dev helper |

The browser checks use Playwright's Chromium. On Windows, set `CHROME_PATH` to your Chrome (for example `C:/Program Files/Google/Chrome/Application/chrome.exe`) for Lighthouse. If Playwright is not installed globally, run `npm i -D playwright && npx playwright install chromium`. Set `CHROME_PATH` to use another Chromium for Lighthouse.

## Folder structure

```
app/
  layout.tsx          fonts, metadata, motion provider
  page.tsx            the page, in brief order
  globals.css         tokens, type scale, 12-col grid, all styles
  sitemap.ts, robots.ts, icon.svg
components/
  motion/             MotionProvider (Lenis), Reveal, PinnedMoment, useScrollMotion, lazy loaders
  sections/           Header, Hero, Showcase, Problem, Deliverables (+ progress line), Pace, Needs, Proof, Contact, Footer
  demos/              the five small deliverable demos (placeholder shapes only)
  ui/                 Section, Label, Logo, ScrollLink, StructuredData
content/
  copy.ts             every word on the site
  tokens.ts           colour tokens and the orange usage register
docs/BRIEF.md
scripts/              check scripts and the OG image builder
```

## Motion

- **Lenis:** gentle smooth scroll, driven by the GSAP ticker and synced with ScrollTrigger.
- **Hero:** the lines rise one by one on load. This is a CSS animation, so it needs no JavaScript and keeps LCP low.
- **Problem:** words go from Muted to Ink as you scroll. Two grey marks slide together and become one orange mark.
- **Deliverables:** on screens 900px and wider, each one pins briefly while its parts fade and rise in. Below 900px there is no pinning, only a gentle reveal.
- **Reduced motion:** when `prefers-reduced-motion: reduce` is set, Lenis is never created and every GSAP effect is skipped. The page shows its final, static layout.
- **Cleanup:** every component's tweens, ScrollTriggers and matchMedia are created inside `gsap.context` and reverted on unmount.

## Design rules (from the brief)

- Colours from the guideline: Orange `#ED3614`, Black `#0B0B0B`, White `#FBFBFB`, Grey `#ABABAB`, plus two tints mixed from them: Stone `#EFEFEF` and Muted `#5E5E5E`. Placeholder greys are Black at low opacity, so no other colours enter.
- Orange appears only where `BRAND_USES` in `content/tokens.ts` lists it. Adding an unlisted use fails `check:brief`.
- Inter for headings, Manrope for text (both SIL Open Font License). No serif, no script, no ALL CAPS styling.
- No gradients, shadows, stock photos, icon grids, carousels, badges, countdowns or emoji.

## Placeholders still to fill

All of these are in `content/copy.ts`.

| Placeholder | Where | What it is |
|---|---|---|
| `[MAYFAIR BEFORE IMAGE]`, `[MAYFAIR AFTER IMAGE]` | `proof.images` | Before and after frames in the Proof chapter. When the images are ready, swap the frames in `components/sections/Proof.tsx` and add their path to the allowed image folders in `scripts/brief-check.mjs` (rule 4) |
| `[YOUR COMPANY]`, `[NAME]`, `[PHONE]` | `demos.logo`, `demos.guidelines` | Text on the demo business card and guidelines cover. They can stay, since they stand for a client's details |
| `[PLACEHOLDER]` | `demos.colour.value` | Print and screen values on the demo swatches |
| `[INVOICE REF]` | `demos.typeface.invoiceRef` | Reference on the demo invoice line |
| `[PHOTO]` | `demos.image.photo` | The six frames in the image style demo |

## Written from the brief, please confirm

These lines are not word for word from the brief. Check that they match how the studio actually works:

- `hero.sub`: "We make your vans, signs, quotes and website look like one company. For established trade and service firms in the UK."
- `pace.heading`: "Same five parts. You choose the pace."
- `needs.heading` and `needs.note`: "Send these and we can start." / "One email with all of it is enough."
- `demos.image.rules`: "Same light, Same angle, Your own jobs"
