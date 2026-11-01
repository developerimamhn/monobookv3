import { demos } from "@/content/copy";

const t = demos.image;
const frames = ["a", "b", "c", "d", "e", "f"] as const;

/** A grid of photo frames that all follow one standard. */
export function ImageDemo() {
  return (
    <figure className="demo demo-image" role="img" aria-label={t.figureLabel}>
      <div className="photo-grid" aria-hidden="true">
        {frames.map((f) => (
          <span key={f} className="photo-frame">
            {t.photo}
          </span>
        ))}
      </div>
      <ul className="photo-rules" aria-hidden="true">
        {t.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </figure>
  );
}
