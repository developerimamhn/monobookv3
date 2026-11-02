import { hero } from "@/content/copy";

// Line i rises at this delay; the sub line follows the last one.
const lineDelay = (i: number) => `${0.05 + i * 0.12}s`;

/**
 * The main line and one sub line, nothing else (the brief keeps this screen
 * clear). The rise is plain CSS, so it paints with the first frame and needs
 * no script.
 */
export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <h1 id="hero-title" className="display hero-title">
          {hero.lines.map((line, i) => (
            <span key={line} className={`hero-line hero-line--${i + 1}`} style={{ animationDelay: lineDelay(i) }}>
              {line}
            </span>
          ))}
        </h1>
        <div className="hero-foot hero-line" style={{ animationDelay: lineDelay(hero.lines.length + 1) }}>
          <p className="lead hero-sub">{hero.sub}</p>
        </div>
      </div>
    </section>
  );
}
