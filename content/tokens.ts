/**
 * Where the brand orange may appear. The colour values themselves live in
 * app/globals.css. Each entry is one CSS rule that reads the --brand token;
 * scripts/brief-check.mjs fails when the source has more uses than this list.
 * Orange text only at large sizes, where it passes WCAG AA (3:1).
 */
export const BRAND_USES = [
  "Header wordmark (.wordmark)",
  "Hero, second line of the main line (.hero-line--2)",
  "Mk. tile background: footer, the Problem merge and the demos (.logo-tile-bg)",
  "Deliverables progress line (.progress-fill)",
  "Colour demo, the Orange swatch (.swatch--orange)",
  "Contact chapter background, as on the guideline cover (.section--brand)",
] as const;
