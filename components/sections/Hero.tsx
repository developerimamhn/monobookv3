import { hero } from "@/content/copy";

/**
 * The main line and one sub line. Nothing else on screen.
 * The slow line-by-line rise is a CSS animation (see .hero-line in
 * globals.css): it needs no JavaScript, so the hero paints with the very
 * first frame and keeps Lighthouse LCP low. Off under reduced motion.
 */
export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <h1 id="hero-title" className="display hero-title">
          {hero.lines.map((line, i) => (
            <span key={line} className="hero-line" style={{ animationDelay: `${0.15 + i * 0.28}s` }}>
              {line}
            </span>
          ))}
        </h1>
        <p className="lead hero-sub hero-line" style={{ animationDelay: `${0.15 + hero.lines.length * 0.28 + 0.1}s` }}>
          {hero.sub}
        </p>
      </div>
    </section>
  );
}
