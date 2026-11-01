# MonoBook Brand Architects - website

A one-page marketing site for MonoBook Brand Architects, a brand identity studio for established UK trade and service businesses.

- **Brief (single source of truth):** [`docs/BRIEF.md`](docs/BRIEF.md). If anything conflicts with it, the brief wins.
- **All copy:** [`content/copy.ts`](content/copy.ts). Placeholders are marked `[LIKE THIS]`.
- **Design tokens and the Pine register:** [`content/tokens.ts`](content/tokens.ts) and the top of [`app/globals.css`](app/globals.css).

## Stack

- Next.js 16 (App Router), TypeScript in strict mode, static export (`output: "export"`).
- GSAP + ScrollTrigger for scroll animation. Lenis for smooth scroll. Both load lazily after first paint.
- Hanken Grotesk via `next/font/google`. It is self-hosted at build time, so visitors make no request to Google.
- No CMS, no images, no tracking.

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

1. Set `site.url` in `content/copy.ts` to the real domain. This feeds the canonical URL, sitemap, robots file and Open Graph tags.
2. Set `site.email` to the studio inbox.
3. Make sure the host serves text files with gzip or brotli. All the common hosts do this by default, and the Lighthouse score depends on it.

## Checks

Each review team's checklist is automated where it can be.

| Command | What it checks | Team |
|---|---|---|
| `npm run typecheck` | TypeScript strict, zero errors | Code Quality |
| `npm run lint` | ESLint (Next core web vitals + TypeScript) | Code Quality |
| `npm run check:brief` | 16 hard rules from the brief, against the built page and the source: prices, statistics, banned words, dashes, caps, exact tokens, Pine max 3, no blue, one font family, no gradients or shadows, five deliverables in order, page order, quote word for word, one H1 | Brief Guardian, Visual Design |
| `npm run check:mobile` | 375, 390 and 768px: no horizontal scroll, body 17px+, tap targets 44px+, one column, full-width buttons. axe-core WCAG 2.1 AA on load and after scrolling, with and without reduced motion. Keyboard: skip link, visible focus, heading order | Mobile, Accessibility |
| `npm run check:lighthouse` | Lighthouse mobile, 3 runs, median must be 90+. Report saved to `reports/` | Performance, SEO |
| `npm run check` | All of the above, in order | |
| `npm run shots` | Full-page screenshots (desktop, mobile, reduced motion) into `reports/shots/` | Dev helper |

The browser checks use Playwright's Chromium. If Playwright is not installed globally, run `npm i -D playwright && npx playwright install chromium`. Set `CHROME_PATH` to use another Chromium for Lighthouse.

## Folder structure

```
app/
  layout.tsx          fonts, metadata, motion provider
  page.tsx            the page, in brief order
  globals.css         tokens, type scale, 12-col grid, all styles
  sitemap.ts, robots.ts, icon.svg
components/
  motion/             MotionProvider (Lenis), Reveal, PinnedMoment, useScrollMotion, lazy loaders
  sections/           Header, Hero, Problem, Deliverables (+ progress line), Pace, Proof, Contact, Footer
  demos/              the five small deliverable demos (placeholder shapes only)
  ui/                 Section, Label, ScrollLink, StructuredData
content/
  copy.ts             every word on the site
  tokens.ts           colour tokens and the Pine usage register
docs/BRIEF.md
scripts/              check scripts and the OG image builder
```

## Motion

- **Lenis:** gentle smooth scroll, driven by the GSAP ticker and synced with ScrollTrigger.
- **Hero:** the lines rise one by one on load. This is a CSS animation, so it needs no JavaScript and keeps LCP low.
- **Problem:** words go from Muted to Ink as you scroll. Two grey marks slide together and become one Pine mark.
- **Deliverables:** on screens 900px and wider, each one pins briefly while its parts fade and rise in. Below 900px there is no pinning, only a gentle reveal.
- **Reduced motion:** when `prefers-reduced-motion: reduce` is set, Lenis is never created and every GSAP effect is skipped. The page shows its final, static layout.
- **Cleanup:** every component's tweens, ScrollTriggers and matchMedia are created inside `gsap.context` and reverted on unmount.

## Design rules (from the brief)

- Colours: Ink `#101012`, Paper `#FAFAF8`, Stone `#EDEDE9`, Muted `#6B6B70`, Pine `#1F3D2E`. Placeholder greys are Ink at low opacity, so no other colours enter.
- Pine is used exactly three times: the merged mark in Problem, the deliverables progress line, and the contact button. Adding a fourth use fails `check:brief`.
- One grotesque family (Hanken Grotesk, SIL Open Font License). No serif, no script, no ALL CAPS styling.
- No gradients, shadows, stock photos, icon grids, carousels, badges, countdowns or emoji.

## Placeholders still to fill

All of these are in `content/copy.ts`.

| Placeholder | Where | What it is |
|---|---|---|
| `[CONTACT EMAIL]` | `site.email` | Studio inbox for the contact button |
| `[SITE URL]` | `site.url` (currently `https://monobook.example`) | Live domain, used for canonical, sitemap, robots and OG |
| `[REPLY TIME]` | `contact.note` | How fast you reply, e.g. "one working day" |
| `[YOUR COMPANY]`, `[NAME]`, `[PHONE]` | `demos.logo`, `demos.guidelines` | Text on the demo business card and guidelines cover. They can stay as placeholders, since they show a client's details |
| `[PLACEHOLDER]` | `demos.colour.value` | Print and screen values on the demo swatches |
| `[INVOICE REF]` | `demos.typeface.invoiceRef` | Reference on the demo invoice line |
| `[PHOTO]` | `demos.image.photo` | The six frames in the image style demo |

## Written from the brief, please confirm

These lines are not word for word from the brief. Check that they match how the studio actually works:

- `hero.sub`: "We make your vans, signs, quotes and website look like one company. For established trade and service firms in the UK."
- `pace.options[*].body`, the client experience at each speed (for example, "We talk in the morning. You see the finished identity by the end of the day.")
- `pace.effort`: "Your part / Our part"
- `demos.image.rules`: "Same light, Same angle, Your own jobs"
