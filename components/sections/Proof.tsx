import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { proof } from "@/content/copy";

// Three places a name shows up: a card, a sign and a van side (viewBox units).
const PANELS = [
  { x: 20, y: 40, w: 110, h: 70 },
  { x: 150, y: 20, w: 230, h: 110 },
  { x: 20, y: 150, w: 360, h: 120 },
];

/** Before: each place has its own mark, size and name bar. */
function BeforeDrawing() {
  return (
    <svg viewBox="0 0 400 290" className="proof-drawing">
      {PANELS.map((p) => (
        <rect key={p.x + p.y} className="drawing-panel" x={p.x} y={p.y} width={p.w} height={p.h} rx="4" />
      ))}
      <circle className="drawing-mark drawing-mark--faint" cx="48" cy="66" r="14" />
      <rect className="drawing-bar drawing-mark--faint" x="40" y="88" width="70" height="6" rx="2" />
      <rect className="drawing-mark" x="172" y="44" width="40" height="40" transform="rotate(8 192 64)" />
      <rect className="drawing-bar drawing-mark--faint" x="226" y="58" width="120" height="12" rx="2" />
      <path className="drawing-mark drawing-mark--faint" d="M60 238 84 186 108 238z" />
      <rect className="drawing-bar" x="124" y="204" width="200" height="8" rx="2" />
      <rect className="drawing-bar drawing-mark--faint" x="124" y="222" width="90" height="8" rx="2" />
    </svg>
  );
}

/** After: one mark, one name bar, the same in every place. */
function AfterDrawing() {
  return (
    <svg viewBox="0 0 400 290" className="proof-drawing">
      {PANELS.map((p) => {
        const size = Math.min(p.h * 0.4, 44);
        const left = p.x + 18;
        const top = p.y + p.h / 2 - size / 2;
        return (
          <g key={p.x + p.y}>
            <rect className="drawing-panel" x={p.x} y={p.y} width={p.w} height={p.h} rx="4" />
            <rect className="drawing-mark" x={left} y={top} width={size} height={size} rx={size * 0.22} />
            <rect className="drawing-bar" x={left + size + 12} y={top + size / 2 - 4} width={Math.min(p.w - size - 54, 160)} height="8" rx="2" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The only proof on the site: Mayfair Lumber and Eric Dahl's words, set like
 * a case study. No client logo and no link to their site.
 */
export function Proof() {
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

        <figure className="proof-images">
          <div className="proof-frames" role="img" aria-label={proof.images.figureLabel}>
            <div className="proof-frame" aria-hidden="true">
              <span className="proof-frame-label">{proof.images.before}</span>
              <BeforeDrawing />
            </div>
            <div className="proof-frame proof-frame--after" aria-hidden="true">
              <span className="proof-frame-label">{proof.images.after}</span>
              <AfterDrawing />
            </div>
          </div>
          <figcaption className="proof-note">{proof.images.note}</figcaption>
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
