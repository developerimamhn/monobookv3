import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { LogoTile, Wordmark } from "@/components/ui/Logo";
import { Section } from "@/components/ui/Section";
import { pad2 } from "@/components/ui/format";
import { contact, deliverables, footer, needs, pace, proof, site } from "@/content/copy";
import { roofing } from "./content";
import styles from "./page.module.css";

/*
 * Hidden capability page for the roofing campaign. Reachable only by its link:
 * nothing on the site points here, it is left out of the sitemap, and search
 * engines are told not to index or follow it. robots.txt does not mention it,
 * because a Disallow line would publish the path.
 */
const PATH = "/roofing-200fed/";

export const metadata: Metadata = {
  title: roofing.title,
  description: roofing.description,
  alternates: { canonical: PATH },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: { url: PATH, title: roofing.title, description: roofing.description },
};

const { postal } = footer;
const mailto = `mailto:${site.email}?subject=${encodeURIComponent(roofing.subject)}`;

export default function RoofingPage() {
  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className="wordmark" aria-label={roofing.home}>
          <Wordmark className="wordmark-svg" />
        </Link>
        <a href={mailto} className={`button ${styles.barButton}`}>
          {roofing.cta}
        </a>
      </div>

      <section className={`container ${styles.hero}`} aria-labelledby="roofing-title">
        <Label>{roofing.label}</Label>
        <h1 id="roofing-title" className={`display ${styles.title}`}>
          {/* The home page's hero lines: same rise, same orange second line, same indent. */}
          {roofing.lines.map((line, i) => (
            <span key={line} className={`hero-line hero-line--${i + 1}`} style={{ animationDelay: `${0.05 + i * 0.12}s` }}>
              {line}
            </span>
          ))}
        </h1>
        <p className={`lead ${styles.sub}`}>{roofing.sub}</p>
        <a href={mailto} className={`button ${styles.heroButton}`}>
          {roofing.cta}
        </a>
      </section>

      <Section tone="stone" labelledBy="roofing-parts">
        <Label index="01">{roofing.partsLabel}</Label>
        <h2 id="roofing-parts" className="h2">
          {roofing.partsHeading}
        </h2>
        <Reveal as="ol" className={styles.parts} stagger>
          {deliverables.items.map((item, i) => (
            <li key={item.id} className={styles.part}>
              <span className={styles.num}>{pad2(i + 1)}</span>
              <h3 className="h3">{item.name}</h3>
              <p className="body">{item.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section labelledBy="roofing-pace">
        <Label index="02">{roofing.paceLabel}</Label>
        <h2 id="roofing-pace" className="h2">
          {roofing.paceHeading}
        </h2>
        <Reveal as="ol" className="pace-options" stagger>
          {pace.options.map((option, i) => (
            <li key={option.name} className={`pace-option${i === 0 ? " pace-option--sprint" : ""} ${styles.paceCard}`}>
              <h3 className="pace-name">{option.name}</h3>
              <p className="pace-length">{option.length}</p>
              <p className="body">{option.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section tone="stone" labelledBy="roofing-needs">
        <div className="grid">
          <div className="col-5">
            <Label index="03">{roofing.needsLabel}</Label>
            <h2 id="roofing-needs" className="h2">
              {roofing.needsHeading}
            </h2>
            <p className="lead needs-note">{needs.note}</p>
          </div>
          <Reveal as="ol" className="needs-list col-6 start-7" stagger>
            {needs.items.map((item, i) => (
              <li key={item}>
                <span className="needs-num" aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section tone="ink" labelledBy="roofing-proof">
        <Label index="04">{roofing.proofLabel}</Label>
        <h2 id="roofing-proof" className="proof-company">
          {proof.card.company}
        </h2>
        <p className="lead proof-intro">{proof.intro}</p>
        <div className={`grid ${styles.proofBody}`}>
          <dl className="proof-facts col-5">
            {proof.card.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <figure className="col-6 start-7">
            <blockquote>
              <p className={styles.quote}>&ldquo;{proof.quote}&rdquo;</p>
            </blockquote>
            <figcaption className={styles.cite}>{proof.cite}</figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="brand" labelledBy="roofing-contact" className="contact">
        <Label index="05">{roofing.contactLabel}</Label>
        <h2 id="roofing-contact" className="h2 contact-heading">
          {roofing.contactHeading}
        </h2>
        <div className="contact-action">
          <a className="contact-email" href={mailto}>
            <span className="visually-hidden">{contact.emailLabel} </span>
            <span className="contact-email-text">{site.email}</span>
            <span className="contact-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 18 18 6M8 6h10v10" />
              </svg>
            </span>
          </a>
          <p className={`contact-note ${styles.note}`}>{contact.note}</p>
        </div>
      </Section>

      <div className={`container ${styles.foot}`}>
        <p>
          {footer.name}, {postal.street}, {postal.locality} {postal.postalCode}, {postal.country}
        </p>
        <LogoTile className={styles.tile} />
      </div>
    </main>
  );
}
