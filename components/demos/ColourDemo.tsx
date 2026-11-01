import { demos } from "@/content/copy";

const t = demos.colour;
const tones = ["swatch--1", "swatch--2", "swatch--3", "swatch--4"] as const;

/** Four swatches, each with print and screen values left as placeholders. */
export function ColourDemo() {
  return (
    <figure className="demo demo-colour" role="img" aria-label={t.figureLabel}>
      <ul className="swatches" aria-hidden="true">
        {t.swatches.map((name, i) => (
          <li key={name} className="swatch">
            <span className={`swatch-chip ${tones[i]}`} />
            <span className="swatch-name">{name}</span>
            {t.rows.map((row) => (
              <span key={row} className="swatch-row">
                <span>{row}</span>
                <span>{t.value}</span>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </figure>
  );
}
