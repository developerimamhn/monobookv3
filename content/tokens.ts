/**
 * Design tokens, exactly as set in docs/BRIEF.md.
 * The CSS custom properties in app/globals.css mirror these values.
 */
export const colors = {
  ink: "#101012", // all text
  paper: "#FAFAF8", // main background
  stone: "#EDEDE9", // alternate sections
  muted: "#6B6B70", // body, captions
  pine: "#1F3D2E", // the one accent, max three uses on the page
} as const;

/**
 * Pine usage register. The brief allows at most three uses on the page.
 * Every element that renders Pine must be listed here, and
 * scripts/brief-check.mjs fails the build check if the count goes above 3.
 */
export const PINE_USES = [
  "Problem: the single merged mark (components/sections/Problem.tsx, .problem-mark--merged)",
  "Deliverables: the one progress line (components/sections/DeliverablesProgress.tsx, .progress-fill)",
  "Contact: the email button (components/sections/Contact.tsx, .button-primary)",
] as const;

export const PINE_MAX = 3;
