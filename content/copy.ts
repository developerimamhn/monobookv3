/**
 * Every word on the site. docs/BRIEF.md is the source; `npm run check:brief`
 * enforces its hard rules. Placeholders are marked [LIKE THIS].
 */

export const site = {
  name: "MonoBook Brand Architects",
  url: "https://monobook.co",
  email: "mehedi@monobook.co",
  owner: "Mehedi Hasan",
  locale: "en_GB",
} as const;

export const meta = {
  title: "Brand Identity Design for UK Trade Businesses | MonoBook",
  description:
    "Logo, colour, typeface, image style and brand guidelines for UK trade and service businesses. In one working day, seven days or fourteen.",
  ogAlt: "MonoBook Brand Architects. Your business works. It just does not look like it does.",
} as const;

type NavItem = { href: `#${string}`; label: string };

export const header = {
  wordmarkLabel: "MonoBook Brand Architects, back to top",
  navLabel: "Sections",
  nav: [
    { href: "#deliverables", label: "What you get" },
    { href: "#pace", label: "Process" },
    { href: "#needs", label: "Your brief" },
    { href: "#proof", label: "Proof" },
  ] satisfies NavItem[],
  contact: "Contact",
  menuOpen: "Menu",
  menuClose: "Close",
  skipLink: "Skip to content",
} as const;

export const hero = {
  lines: ["Your business works.", "It just does not look like it does."],
  sub: "We make your vans, signs, quotes and website look like one company. For established trade and service businesses in the UK.",
} as const;

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
  marksLabel: "Two mismatched logos that merge into one mark.",
  marksBefore: "Two logos",
  marksAfter: "One company",
} as const;

export type DeliverableId = "logo" | "colour" | "typeface" | "image" | "guidelines";

export type Deliverable = {
  id: DeliverableId;
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
      name: "Logo",
      body: "A primary and a secondary mark, with sizes and clear space rules. The same company shows up on a business card and on the side of a van.",
    },
    {
      id: "colour",
      name: "Colour",
      body: "One palette with exact values for print, screen, vehicle wrap and signage. Your sign maker and your web developer stop guessing.",
    },
    {
      id: "typeface",
      name: "Typeface",
      body: "A licensed type system for headings, body and documents. Quotes and invoices start looking like they came from the same company.",
    },
    {
      id: "image",
      name: "Image style",
      body: "A standard for job photos. Your own work becomes your proof.",
    },
    {
      id: "guidelines",
      name: "Guidelines",
      body: "One document your printer, sign maker, web developer and team can work from without calling you first.",
    },
  ] satisfies Deliverable[],
} as const;

/**
 * Text inside the deliverable demos. They show MonoBook's own identity, so the
 * values are real: the palette is the one in the brand guideline.
 */
export const demos = {
  logo: {
    figureLabel: "The MonoBook. wordmark on the side of a van, and the Mk. mark on a business card.",
    van: "Van, primary mark",
    card: "Business card, secondary mark",
    cardName: site.name,
    cardLine: site.email,
  },
  colour: {
    figureLabel: "The four colours of the MonoBook palette, with their Hex and RGB values.",
    swatches: [
      { tone: "orange", name: "Orange", hex: "#ED3614", rgb: "237 54 20" },
      { tone: "black", name: "Black", hex: "#0B0B0B", rgb: "11 11 11" },
      { tone: "white", name: "White", hex: "#FBFBFB", rgb: "251 251 251" },
      { tone: "grey", name: "Grey", hex: "#ABABAB", rgb: "171 171 171" },
    ],
    hexLabel: "Hex",
    rgbLabel: "RGB",
  },
  typeface: {
    figureLabel: "A heading, a paragraph and an invoice line set in the same family.",
    headingLabel: "Heading",
    heading: "Kitchen refit, Mill Lane",
    bodyLabel: "Body",
    body: "Remove the old units, refit the new ones and leave the room clean.",
    invoiceLabel: "Invoice line",
    invoiceItem: "Labour and materials",
    invoiceTerms: "Due on completion",
  },
  image: {
    figureLabel: "Three photos of MonoBook's own work, shot to one standard.",
    photos: ["business-card", "stationery", "poster-tube"],
    rules: ["Same light", "Same angle", "Your own jobs"],
  },
  guidelines: {
    figureLabel: "A guidelines document cover with its list of pages.",
    cover: "Brand guidelines",
    company: site.name,
    pages: ["Logo and clear space", "Colour values", "Type system", "Image style", "Vans and signs", "Documents"],
  },
} as const;

export const pace = {
  index: "03",
  label: "Process",
  heading: "Same five parts. You choose the pace.",
  intro: "Your brand identity in one working day, seven days or fourteen days.",
  options: [
    {
      name: "Sprint",
      length: "One working day",
      body: "Your new identity, start to finish, in one working day.",
    },
    {
      name: "Standard",
      length: "Seven days",
      body: "Two review points, scheduled at times that suit you.",
    },
    {
      name: "Extended",
      length: "Fourteen days",
      body: "The same work as Standard, at a slower cadence.",
    },
  ],
  sprint: {
    heading: "How the one-day sprint runs",
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
  button: "Email your brief",
  subject: "Brief for MonoBook",
  emailIntro: "Answer what you can. Attach your logo and photos.",
} as const;

export const proof = {
  index: "05",
  label: "Proof",
  // The brief's line said "In every one of these"; with one case on the page it now names it.
  intro:
    "Mayfair was already good at what it does. What changed was whether that was visible in the seconds a customer gives it. We do not take credit for their revenue. They built that.",
  card: {
    company: "Mayfair Lumber Sales Ltd",
    facts: [
      { term: "Business", value: "Wholesale lumber and remanufacturing" },
      { term: "Where", value: "Alberta, Canada" },
      { term: "History", value: "Canadian owned since 1976" },
      { term: "Led by", value: "Mehedi Hasan, owner of MonoBook" },
    ],
    didLabel: "What we did",
    did: "A full visual rebrand of a company that had been trading for four decades: mark, colour, type and an applied identity system across print, signage and digital.",
  },
  // Until the real Mayfair images arrive, the frames hold a drawing of the idea, labelled as one.
  images: {
    before: "Before",
    after: "After",
    note: "Illustration. The Mayfair before and after images will replace it.",
    figureLabel: "An illustration of the change: three mismatched marks before, one consistent mark after. The Mayfair images will replace it.",
  },
  /** Word for word from the client. Do not edit, not even the spelling. */
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
  copy: "Copy address",
  copied: "Address copied",
} as const;

export const mobileCta = "Email us";

export const footer = {
  name: "MonoBook Brand Architects",
  postal: {
    street: "Thana Road, Kaliganj",
    locality: "Satkhira",
    postalCode: "9440",
    region: "Khulna Division",
    country: "Bangladesh",
    countryCode: "BD",
  },
  hours: "Working UK hours, by email.",
  studioLabel: "Studio",
  contactLabel: "Contact",
  pagesLabel: "On this page",
  backToTop: "Back to top",
  privacy: "Privacy",
} as const;

/** Plain-English privacy notice for UK visitors. The site sets no cookies and runs no analytics. */
export const privacy = {
  title: "Privacy",
  intro: "This site does not track you. Here is what happens to what you send us.",
  sections: [
    {
      heading: "Who we are",
      body: [
        `${site.name} is run by ${site.owner}. For anything about your data, email ${site.email}.`,
      ],
    },
    {
      heading: "What this site collects",
      body: [
        "Nothing. There are no cookies, no analytics and no tracking. Fonts and images load from this site, not from other companies.",
        "Like any website, the company that hosts it may keep short technical logs, such as an IP address and the page asked for, to keep the service running and secure.",
      ],
    },
    {
      heading: "When you email us",
      body: [
        "We receive your email address and whatever you send: your brief, logo files and photos.",
        "We use it to reply to you and, if you go ahead, to do the work. We keep it only as long as we need it for that, then delete it.",
        "We do not sell it or pass it on. The only other company that holds it is our email provider, which stores our mail.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Under UK data protection law you can ask to see what we hold about you, have it corrected or deleted, or object to how we use it. Email us and we will do it.",
        "If you are not happy with how we handle your data, you can complain to the Information Commissioner's Office at ico.org.uk.",
      ],
    },
  ],
  back: "Back to the home page",
} as const;

export const notFound = {
  title: "Page not found",
  body: "There is nothing at this address. The whole site is one page.",
  link: "Go to the home page",
} as const;
