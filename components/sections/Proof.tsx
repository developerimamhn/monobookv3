import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { proof } from "@/content/copy";

/**
 * The only proof on the site: Mayfair Lumber and Eric Dahl's words, set like
 * a case study. No client logo and no link to their site.
 */
export function Proof() {
  const { before, after } = proof.images;
  return (
    <Section id="proof" tone="ink" labelledBy="proof-title">
      <Reveal>
        <Label index={proof.index}>{proof.label}</Label>
        <h2 id="proof-title" className="proof-company">
          {proof.card.company}
        </h2>
        <p className="lead proof-intro">{proof.intro}</p>
      </Reveal>

      <Reveal as="article" className="proof-case">
        <div className="grid proof-body">
          <dl className="proof-facts col-5">
            {proof.card.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="col-6 start-7">
            <p className="proof-did-label">{proof.card.didLabel}</p>
            <p className="proof-did-text">{proof.card.did}</p>
          </div>
        </div>

        <figure className="proof-images" role="img" aria-label={proof.images.figureLabel}>
          {[before, after].map((frame) => (
            <div key={frame.label} className="proof-frame" aria-hidden="true">
              <span className="proof-frame-label">{frame.label}</span>
              <span className="proof-frame-placeholder">{frame.placeholder}</span>
            </div>
          ))}
        </figure>
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
