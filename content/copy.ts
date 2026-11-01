/**
 * All site copy lives here. Source of truth: docs/BRIEF.md.
 * Placeholders are marked [LIKE THIS] and listed in README.md.
 *
 * House rules (checked by `npm run check:brief`):
 * - No prices, no revenue or growth claims, no invented numbers.
 * - No banned words (see scripts/brief-check.mjs).
 * - Hyphens only, never em or en dashes.
 * - Plain, peer-to-peer English. Short sentences.
 */

export const site = {
  name: "MonoBook Brand Architects",
  shortName: "MonoBook",
  /** [SITE URL] - replace with the live domain before launch. */
  url: "https://monobook.example",
  /** [CONTACT EMAIL] - replace with the studio inbox. */
  email: "[CONTACT EMAIL]",
  locale: "en_GB",
} as const;

export const meta = {
  title: "MonoBook Brand Architects - Brand identity for UK trade and service businesses",
  description:
    "Your business works. It just does not look like it does. We build the logo, colour, typeface, image style and guidelines that your vans, signs, quotes and website share.",
  ogAlt: "MonoBook Brand Architects. Your business works. It just does not look like it does.",
} as const;

export const header = {
  wordmark: "MonoBook",
  wordmarkLabel: "MonoBook Brand Architects, back to top",
  contact: "Contact",
  skipLink: "Skip to content",
} as const;

export const hero = {
  /** Main line from the brief. Split into two lines for the load reveal. */
  lines: ["Your business works.", "It just does not look like it does."],
  sub: "We make your vans, signs, quotes and website look like one company. For established trade and service firms in the UK.",
} as const;

export const problem = {
  label: "The problem",
  statement:
    "A customer who sees one logo on your van and another on your quote is looking at two different companies.",
  follow: "You know it is the same firm. They do not.",
  marksLabel: "Two mismatched logos that merge into one.",
  marksBefore: "Two logos",
  marksAfter: "One company",
} as const;

export type DeliverableId = "logo" | "colour" | "typeface" | "image" | "guidelines";

export type Deliverable = {
  id: DeliverableId;
  index: string;
  name: string;
  body: string;
};

export const deliverables = {
  label: "What you get",
  heading: "Five things. Always these five, in this order.",
  progressLabel: "Deliverable",
  progressOf: "of",
  items: [
    {
      id: "logo",
      index: "001",
      name: "Logo",
      body: "A primary and a secondary mark, with sizes and clear space rules. The same company shows up on a business card and on the side of a van.",
    },
    {
      id: "colour",
      index: "002",
      name: "Colour",
      body: "One palette with exact values for print, screen, vehicle wrap and signage. Your sign maker and your web developer stop guessing.",
    },
    {
      id: "typeface",
      index: "003",
      name: "Typeface",
      body: "A licensed type system for headings, body and documents. Quotes and invoices start looking like they came from the same company.",
    },
    {
      id: "image",
      index: "004",
      name: "Image style",
      body: "A standard for job photos. Your own work becomes your proof.",
    },
    {
      id: "guidelines",
      index: "005",
      name: "Guidelines",
      body: "One document your printer, sign maker, web developer and team can work from without calling you first.",
    },
  ] satisfies Deliverable[],
} as const;

/** Text used inside the small visual demos for each deliverable. */
export const demos = {
  logo: {
    primary: "Primary mark",
    secondary: "Secondary mark",
    card: "Business card",
    van: "Van",
    cardName: "[YOUR COMPANY]",
    cardLine: "[NAME] - [PHONE]",
    figureLabel: "The primary mark on a van and the secondary mark on a business card.",
  },
  colour: {
    figureLabel: "Four colour swatches, each with print and screen values.",
    rows: ["Print", "Screen"],
    swatches: ["Primary", "Secondary", "Neutral", "Light"],
    value: "[PLACEHOLDER]",
  },
  typeface: {
    figureLabel: "A heading, a paragraph and an invoice line set in the same family.",
    headingLabel: "Heading",
    heading: "Kitchen refit, Mill Lane",
    bodyLabel: "Body",
    body: "Remove the old units, refit the new ones and leave the room clean.",
    invoiceLabel: "Invoice line",
    invoiceItem: "Labour and materials",
    invoiceRef: "[INVOICE REF]",
  },
  image: {
    figureLabel: "A grid of six photo frames following one standard.",
    photo: "[PHOTO]",
    rules: ["Same light", "Same angle", "Your own jobs"],
  },
  guidelines: {
    figureLabel: "A guidelines document cover with its list of pages.",
    cover: "Brand guidelines",
    company: "[YOUR COMPANY]",
    pages: ["Logo and clear space", "Colour values", "Type system", "Image style", "Vans and signs", "Documents"],
  },
} as const;

export const pace = {
  label: "Pace",
  heading: "Same work. Three speeds.",
  intro: "Pick the pace that suits your diary.",
  options: [
    {
      length: "1 working day",
      title: "The whole studio on your project",
      body: "We talk in the morning. You see the finished identity by the end of the day.",
    },
    {
      length: "7 days",
      title: "Two review points",
      body: "You see the direction early and again before it is finished. Your comments go into each round.",
    },
    {
      length: "14 days",
      title: "A slower cadence",
      body: "More time between steps, for owners who want to think it over or bring in a partner.",
    },
  ],
  identical: "The work is identical. Only the pace changes.",
  effort: {
    yoursLabel: "Your part",
    yours: "Tell us about the business. Say what works and what does not at each review.",
    oursLabel: "Our part",
    ours: "Everything else, from the first sketch to the finished guidelines.",
  },
} as const;

export const proof = {
  label: "Proof",
  intro:
    "In every one of these the company was already good at what it does. What changed was whether that was visible in the seconds a customer gives it. We do not take credit for their revenue. They built that.",
  card: {
    company: "Mayfair Lumber Sales Ltd",
    what: "Wholesale lumber and remanufacturing, Alberta.",
    since: "Canadian owned since 1976.",
    didLabel: "What we did",
    did: "A full visual rebrand of a company that had been trading for four decades: mark, colour, type and an applied identity system across print, signage and digital.",
  },
  /** Word for word from the client. Do not edit. */
  quote:
    "Mehedi was hired to do a visual rebrand for our 40+ year organization. He was an excellent communicator, showed exceptional passion for the project, and delivered a finished product exactly what we were hoping for.",
  cite: "Eric Dahl, Client, December 2023",
} as const;

export const contact = {
  label: "Contact",
  heading: "Tell us what your business does and where your name shows up.",
  /** Button text. The address itself comes from site.email. */
  button: "Email",
  note: "One email is enough to start. We reply within [REPLY TIME].",
} as const;

export const footer = {
  name: "MonoBook Brand Architects",
  address: ["Thana Road, Kaliganj", "Satkhira 9440, Khulna Division", "Bangladesh"],
  /** The same address, split for search engines (schema.org). */
  postal: {
    street: "Thana Road, Kaliganj",
    locality: "Satkhira",
    postalCode: "9440",
    region: "Khulna Division",
    country: "BD",
  },
  backToTop: "Back to top",
} as const;
