import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { proof } from "@/content/copy";

/** The only proof on the site: Mayfair Lumber and Eric Dahl's words. No logo, no link. */
export function Proof() {
  return (
    <Section id="proof" tone="paper" labelledBy="proof-title">
      <Reveal>
        <Label>{proof.label}</Label>
        <h2 id="proof-title" className="visually-hidden">
          {proof.label}: {proof.card.company}
        </h2>
        <p className="lead proof-intro">{proof.intro}</p>
      </Reveal>

      <Reveal as="article" className="proof-card">
        <h3 id="proof-company" className="h3 proof-company">
          {proof.card.company}
        </h3>
        <p className="proof-meta">
          {proof.card.what}
          <br />
          {proof.card.since}
        </p>
        <div className="proof-did">
          <p className="proof-did-label">{proof.card.didLabel}</p>
          <p className="body">{proof.card.did}</p>
        </div>
      </Reveal>

      <Reveal as="figure" className="proof-quote">
        <blockquote>
          <p>&ldquo;{proof.quote}&rdquo;</p>
        </blockquote>
        <figcaption>{proof.cite}</figcaption>
      </Reveal>
    </Section>
  );
}
