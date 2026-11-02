import { Reveal } from "@/components/motion/Reveal";
import { showcase } from "@/content/copy";

/** Widths exported into public/brand/ (see README). */
const WIDTHS = [800, 1400, 2400] as const;

function srcSet(name: string) {
  return WIDTHS.map((w) => `/brand/${name}-${w}.webp ${w}w`).join(", ");
}

/**
 * MonoBook's own identity, applied: three mockups from the brand guideline.
 * The first image is large, the other two sit beside it on wide screens.
 * Images load lazily, so the hero stays the first thing to paint.
 */
export function Showcase() {
  return (
    <section id="showcase" className="showcase" aria-labelledby="showcase-title">
      <div className="container">
        <div className="showcase-grid">
          {showcase.images.map((image, i) => (
            <Reveal as="figure" key={image.name} className={`showcase-item showcase-item--${i + 1}`}>
              {/* Static export (images.unoptimized), so next/image adds nothing: the WebP sizes are prebuilt. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/brand/${image.name}-1400.webp`}
                srcSet={srcSet(image.name)}
                sizes={i === 0 ? "(min-width: 900px) 66vw, 100vw" : "(min-width: 900px) 33vw, 100vw"}
                width={4096}
                height={2731}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{image.caption}</figcaption>
            </Reveal>
          ))}
        </div>
        <Reveal className="showcase-text">
          <h2 id="showcase-title" className="showcase-label">
            {showcase.label}
          </h2>
          <p className="lead showcase-caption">{showcase.caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
