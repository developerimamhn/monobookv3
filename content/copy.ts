/**
 * All site copy lives here. Source of truth: docs/BRIEF.md.
 * Placeholders are marked [LIKE THIS] and listed in README.md.
 *
 * House rules (checked by `npm run check:brief`):
 * - No prices, no revenue or growth claims, no invented numbers.
 * - No banned words (see scripts/brief-check.mjs).
 * - Hyphens only, never em or en dashes.
 * - Plain, peer-to-peer English. Short sentences.
 * - Only one client and one review: Mayfair Lumber and Eric Dahl.
 */

export const site = {
  name: "MonoBook Brand Architects",
  shortName: "MonoBook",
  url: "https://monobook.co",
  email: "mehedi@monobook.co",
  owner: "Mehedi Hasan",
  locale: "en_GB",
} as const;

export const meta = {
  title: "MonoBook Brand Architects - Brand identity for UK trade and service businesses",
  description:
    "Your business works. It just does not look like it does. We build the logo, colour, typeface, image style and guidelines that your vans, signs, quotes and website share.",
  ogAlt: "MonoBook Brand Architects. Your business works. It just does not look like it does.",
} as const;

export const header = {
  wordmarkLabel: "MonoBook Brand Architects, back to top",
  navLabel: "Sections",
  nav: [
    { href: "#deliverables", label: "What you get" },
    { href: "#pace", label: "Process" },
    { href: "#proof", label: "Proof" },
  ],
  contact: "Contact",
  skipLink: "Skip to content",
} as const;

export const hero = {
  /** Main line from the brief. Split into two lines for the load reveal. */
  lines: ["Your business works.", "It just does not look like it does."],
  sub: "We make your vans, signs, quotes and website look like one company. For established trade and service firms in the UK.",
  scroll: "Scroll",
} as const;

/** The studio's own identity, applied. MonoBook's own brand, not a client. */
export const showcase = {
  label: "Our own identity",
  caption: "We built MonoBook from the same five parts we deliver. One mark, one palette, one type system, on every card, sheet and tube.",
  images: [
    {
      name: "business-card",
      alt: "MonoBook business cards. The orange front carries the Mk. mark, the white back carries the name and contact details.",
      caption: "Business cards",
    },
    {
      name: "stationery",
      alt: "MonoBook stationery: letterhead, envelope, compliment slip and business cards in orange, black and white.",
      caption: "Stationery",
    },
    {
      name: "poster-tube",
      alt: "A black MonoBook poster tube with an orange band and the MonoBook. wordmark.",
      caption: "Poster tube",
    },
  ],
} as const;

export const problem = {
  index: "01",
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
  index: "02",
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
  index: "03",
  label: "Process",
  heading: "Same five parts. You choose the pace.",
  intro: "Logo, Colour, Typeface, Image style and Guidelines, every time. The work is identical.",
  options: [
    {
      name: "Sprint",
      length: "One working day",
      body: "The whole studio works on your project that day. You receive all five parts by the end of it.",
    },
    {
      name: "Standard",
      length: "Seven days",
      body: "Two review points, scheduled at times that suit you.",
    },
    {
      name: "Extended",
      length: "Fourteen days",
      body: "The same work as seven days, at a slower cadence.",
    },
  ],
  sprint: {
    heading: "How the sprint day runs",
    steps: [
      {
        when: "Before the day",
        body: "You send your current logo, a few photos of your van, signs and workwear, and answers to a short brief.",
      },
      {
        when: "In the morning",
        body: "We confirm the brief by a short call or email.",
      },
      {
        when: "During the day",
        body: "The whole studio works on your project.",
      },
      {
        when: "By the end of the day",
        body: "You receive all five parts: logo files, colour palette with exact codes, typeface, image style and the guideline document.",
      },
    ],
  },
  identical: "The work is identical. Only the pace changes.",
} as const;

export const needs = {
  index: "04",
  label: "What we need from you",
  heading: "Send these and we can start.",
  items: [
    "Your current logo file.",
    "A line about your business and how long it has been running.",
    "Who your customers are.",
    "Two competitors, with their websites.",
    "What must stay, and what you want to change.",
    "Where the new identity goes first: van, site board, workwear, quote sheet or website.",
    "Photos of your van, signs and workwear.",
  ],
  note: "One email with all of it is enough.",
  button: "Send your brief",
  subject: "Brief for MonoBook",
} as const;

export const proof = {
  index: "05",
  label: "Proof",
  intro:
    "In every one of these the company was already good at what it does. What changed was whether that was visible in the seconds a customer gives it. We do not take credit for their revenue. They built that.",
  card: {
    company: "Mayfair Lumber Sales Ltd",
    facts: [
      { term: "Business", value: "Wholesale lumber and remanufacturing" },
      { term: "Where", value: "Alberta, Canada" },
      { term: "History", value: "Canadian owned since 1976" },
      { term: "Scope", value: "Mark, colour, type and an applied identity system across print, signage and digital" },
      { term: "Led by", value: "Mehedi Hasan, owner of MonoBook" },
    ],
    didLabel: "What we did",
    did: "A full visual rebrand of a company that had been trading for four decades: mark, colour, type and an applied identity system across print, signage and digital.",
  },
  images: {
    before: { label: "Before", placeholder: "[MAYFAIR BEFORE IMAGE]" },
    after: { label: "After", placeholder: "[MAYFAIR AFTER IMAGE]" },
    figureLabel: "Mayfair Lumber identity before and after the rebrand. Images to follow.",
  },
  /** Word for word from the client. Do not edit. */
  quote:
    "Mehedi was hired to do a visual rebrand for our 40+ year organization. He was an excellent communicator, showed exceptional passion for the project, and delivered a finished product exactly what we were hoping for.",
  cite: "Eric Dahl, Client, December 2023",
} as const;

export const contact = {
  index: "06",
  label: "Contact",
  heading: "Tell us what your business does and where your name shows up.",
  emailLabel: "Email",
  note: "Email only. We reply within two hours, during UK working hours.",
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
  studioLabel: "Studio",
  contactLabel: "Contact",
  pagesLabel: "On this page",
  backToTop: "Back to top",
} as const;
