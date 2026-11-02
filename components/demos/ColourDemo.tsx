import { demos } from "@/content/copy";

const copy = demos.colour;

export function ColourDemo() {
  return (
    <figure className="demo" role="img" aria-label={copy.figureLabel}>
      <ul className="swatches" aria-hidden="true">
        {copy.swatches.map((swatch) => (
          <li key={swatch.name} className="swatch">
            <span className={`swatch-chip swatch--${swatch.tone}`} />
            <span className="swatch-name">{swatch.name}</span>
            <span className="swatch-row">
              <span>{copy.hexLabel}</span>
              <span>{swatch.hex}</span>
            </span>
            <span className="swatch-row">
              <span>{copy.rgbLabel}</span>
              <span>{swatch.rgb}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
