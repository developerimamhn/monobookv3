# MonoBook Brand Architects - Brief

Single source of truth. If anything conflicts with this file, this file wins.

### Stack
- Next.js (App Router), TypeScript
- GSAP + ScrollTrigger for animation, Lenis for smooth scroll
- Static export friendly. No CMS.
- Respect prefers-reduced-motion: turn off GSAP and Lenis effects when it is set.
- All copy lives in `/content/copy.ts`. Placeholders marked [LIKE THIS].

### Who we are
MonoBook Brand Architects is a brand identity studio. We build the part customers judge first: the identity a small, established business shows on its vans, signs, quotes, website and listings.
Main line: "Your business works. It just does not look like it does."
Audience: owners of established trade and service businesses in the UK. They are good at their work. Their identity does not show it.

### What we deliver - always these five, in this order, never more, never less
1. Logo - a primary and secondary mark, with sizes and clear space rules, so the same company shows up on a business card and on the side of a van.
2. Colour - one palette with exact values for print, screen, vehicle wrap and signage. Your sign maker and your web developer stop guessing.
3. Typeface - a licensed type system for headings, body and documents. Quotes and invoices start looking like they came from the same company.
4. Image style - a standard for job photos, so your own work becomes your proof.
5. Guidelines - one document your printer, sign maker, web developer and team can work from without calling you first.

### Pace - same work, three speeds
The same five parts every time: Logo, Colour, Typeface, Image style, Guidelines. You choose the pace. The work is identical.
- Sprint, one working day. Before the day, the client sends their current logo, a few photos of their van, signs and workwear, and answers to a short brief. In the morning we confirm the brief by a short call or email. The whole studio works on the project that day. By the end of the day the client receives all five parts: logo files, colour palette with exact codes, typeface, image style and the guideline document.
- Standard, seven days. Two review points, scheduled at times that suit the client.
- Extended, fourteen days. The same work as seven days, at a slower cadence.

### What we need from the client
Current logo file. A line about the business and how long it has been running. Who the customers are. Two competitors with their websites. What must stay and what they want to change. Where the new identity goes first (van, site board, workwear, quote sheet, website). Photos of their van, signs and workwear.

### Proof - use exactly this, nothing else
Mayfair Lumber Sales Ltd, wholesale lumber and remanufacturing, Alberta. Canadian owned since 1976. A full visual rebrand of a company that had been trading for four decades: mark, colour, type and an applied identity system across print, signage and digital.
Quote (word for word):
"Mehedi was hired to do a visual rebrand for our 40+ year organization. He was an excellent communicator, showed exceptional passion for the project, and delivered a finished product exactly what we were hoping for."
- Eric Dahl, Client, December 2023
Mehedi Hasan is the owner of MonoBook and led the Mayfair rebrand.
Mayfair before and after images: placeholders for now.
Proof intro: "In every one of these the company was already good at what it does. What changed was whether that was visible in the seconds a customer gives it. We do not take credit for their revenue. They built that."

### Page order
1. Hero: the main line, one short sub line, nothing else on screen. Below it, a band of MonoBook's own brand mockups.
2. The problem: a customer who sees two different logos is looking at two companies
3. The five deliverables, each its own moment while scrolling
4. Pace: the three speeds, then how the sprint day runs
5. What we need from you
6. Proof: Mayfair card, before and after, then the Eric Dahl quote
7. Contact: one clear email CTA: mehedi@monobook.co. Reply time: within two hours, during UK working hours. Email only, no phone or WhatsApp.
8. Footer: MonoBook Brand Architects, Thana Road, Kaliganj, Satkhira 9440, Khulna Division, Bangladesh

### Hard rules - do not break
- No prices anywhere on the site.
- No revenue, sales or growth claims. No invented numbers or statistics. Never use the Lucidpress 23 percent or Stanford 46.1 percent statistic.
- Never say we designed Mayfair's website. Do not link to Mayfair's live site.
- No fake testimonials, client logos or team members. Only the proof above. No other clients or reviews.
- No social links for now.
- Banned words: "free audit", "free", "luxury", "world-class", "bespoke", "elevate", "seamless", "cutting-edge". No em dashes, hyphens only.
- Plain, peer-to-peer English. Short sentences. Facts, not praise.

### Design system
Source: the MonoBook brand guideline in Figma (file "MonoBook Presentations", page "Guideline"). Where this section and the old site differ, the guideline wins.
- Domain: monobook.co
- Logos, exported as vectors from Figma (components/ui/Logo.tsx):
  - Primary logo: the "MonoBook." wordmark. Orange in the header, White in the footer and on the share image.
  - Mk. mark: White letters on the orange square. Favicon and footer.
- Colours (guideline page 11): Primary Orange #ED3614, Black #0B0B0B, White #FBFBFB, Grey #ABABAB.
  - Black is all text and the dark chapters (Proof, footer). White is the main background. Grey is for lines and placeholders only, because it is too light for text.
  - Two working tints, mixed from the palette: Stone #EFEFEF (White with 5% Black) for alternate sections, Muted #5E5E5E (Black at 66% on White) for body and captions.
  - Orange is the signature, kept for a few moments listed in content/tokens.ts (BRAND_USES): header wordmark, the hero's second line, the merged mark, the progress line, the Contact chapter and the Mk. tile.
  - Orange text only at large sizes (24px and up), where it passes WCAG AA. On the orange Contact chapter, large text is White and small text is Black.
- Type (guideline pages 14 and 15): Inter for headings and brand areas, Manrope for paragraphs and short text. No serif, no script, no ALL CAPS.
- No blue anywhere.
- Images: only MonoBook's own brand mockups from the guideline (business cards, stationery, poster tube), in public/brand/. No client logos or client images other than the Mayfair placeholders.
- Apple-style calm. Lots of empty space. One idea per screen.
- No gradients, shadows, stock photos, icon grids, carousels, badges, countdowns or emoji.
- Mobile: one column, no horizontal scroll, body text at least 17px, full-width buttons.

### Animation
- Lenis smooth scroll, gentle.
- GSAP ScrollTrigger: text fades and rises in, each deliverable pins briefly as its own moment. Slow and quiet, never flashy.
- Lighthouse performance above 90 on mobile.

