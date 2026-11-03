import { demos } from "@/content/copy";

const copy = demos.image;

export function ImageDemo() {
  return (
    <figure className="demo" role="img" aria-label={copy.figureLabel}>
      <div className="photo-grid" aria-hidden="true">
        {copy.photos.map((name) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, the WebP sizes are prebuilt
          <img key={name} className="photo-frame" data-demo-step src={`/brand/${name}-800.webp`} width={800} height={533} alt="" loading="lazy" decoding="async" />
        ))}
      </div>
      <ul className="photo-rules" aria-hidden="true">
        {copy.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </figure>
  );
}
