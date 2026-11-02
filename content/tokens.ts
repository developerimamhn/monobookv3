/**
 * Design tokens from the MonoBook brand guideline (Figma: MonoBook
 * Presentations, Guideline, page 11 "Color Palettes / Primary").
 * The CSS custom properties in app/globals.css mirror these values.
 */
export const colors = {
  brand: "#ED3614", // Primary Color, the orange
  ink: "#0B0B0B", // Black, all text
  paper: "#FBFBFB", // White, main background
  grey: "#ABABAB", // Grey, lines and placeholders only (too light for text)
} as const;

/**
 * Two working tints, mixed from the palette above so no new colour enters:
 * - stone: White with 5% Black, for alternate sections.
 * - muted: Black at 66% on White, for body and captions (passes WCAG AA).
 */
export const tints = {
  stone: "#EFEFEF",
  muted: "#5E5E5E",
} as const;

/**
 * Orange usage register. Orange is the brand's signature, so it is kept for
 * a few deliberate moments. Every CSS rule that uses var(--brand) must be
 * listed here; scripts/brief-check.mjs fails if the count goes above the list.
 * Orange text appears only at large sizes, where it passes WCAG AA (3:1).
 */
export const BRAND_USES = [
  "Header: the MonoBook. wordmark (components/sections/Header.tsx, .wordmark)",
  "Hero: the second line of the main line (components/sections/Hero.tsx, .hero-line--2)",
  "Problem: the single merged mark (components/sections/Problem.tsx, .problem-mark--merged)",
  "Deliverables: the progress line (components/sections/DeliverablesProgress.tsx, .progress-fill)",
  "Contact: the orange chapter, as on the guideline cover (components/sections/Contact.tsx, .section--brand)",
  "Logo tile: the Mk. square (components/ui/Logo.tsx, .logo-tile-bg)",
] as const;

export const BRAND_MAX = BRAND_USES.length;
