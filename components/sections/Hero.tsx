import { hero } from "@/content/copy";

/**
 * The main line and one sub line, set large. A quiet scroll cue sits on
 * the bottom rule. The slow line-by-line rise is a CSS animation (see
 * .hero-line in globals.css): it needs no JavaScript, so the hero paints
 * with the very first frame and keeps Lighthouse LCP low. Off under
 * reduced motion.
 */
export function Hero() {
  const subDelay = `${0.15 + hero.lines.length * 0.28 + 0.1}s`;
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <h1 id="hero-title" className="display hero-title">
          {hero.lines.map((line, i) => (
            <span key={line} className={`hero-line hero-line--${i + 1}`} style={{ animationDelay: `${0.15 + i * 0.28}s` }}>
              {line}
            </span>
          ))}
        </h1>
        <div className="hero-foot hero-line" style={{ animationDelay: subDelay }}>
          <p className="lead hero-sub">{hero.sub}</p>
          <span className="hero-scroll" aria-hidden="true">
            {hero.scroll}
            <span className="hero-scroll-line" />
          </span>
        </div>
      </div>
    </section>
  );
}
