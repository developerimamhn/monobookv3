import { Reveal } from "@/components/motion/Reveal";
import { showcase } from "@/content/copy";

const WIDTHS = [800, 1400, 2400] as const;
const srcSet = (name: string) => WIDTHS.map((w) => `/brand/${name}-${w}.webp ${w}w`).join(", ");

// The grid is 2fr | 1fr inside a container capped at 90rem with 4rem gutters,
// so past 1440px the images stop growing.
const SIZES = {
  large: "(min-width: 1440px) 870px, (min-width: 900px) 64vw, calc(100vw - 32px)",
  small: "(min-width: 1440px) 430px, (min-width: 900px) 32vw, calc(100vw - 32px)",
};

/** MonoBook's own identity, applied: three mockups from the brand guideline. */
export function Showcase() {
  return (
    <section id="showcase" className="showcase" aria-labelledby="showcase-title">
      <div className="container">
        <Reveal className="showcase-text">
          <h2 id="showcase-title" className="showcase-label">
            {showcase.label}
          </h2>
          <p className="lead showcase-caption">{showcase.caption}</p>
        </Reveal>
        <div className="showcase-grid">
          {showcase.images.map((image, i) => (
            <Reveal as="figure" key={image.name} className={`showcase-item showcase-item--${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, the WebP sizes are prebuilt */}
              <img
                src={`/brand/${image.name}-1400.webp`}
                srcSet={srcSet(image.name)}
                sizes={i === 0 ? SIZES.large : SIZES.small}
                width={2400}
                height={1600}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{image.caption}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
