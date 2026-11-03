import { LogoTile, logo } from "@/components/ui/Logo";
import { demos } from "@/content/copy";

const copy = demos.logo;
// Wordmark scaled to sit on the van's side panel (viewBox units).
const WORDMARK_WIDTH = 140;
const wordmarkScale = WORDMARK_WIDTH / logo.wordmark.w;

export function LogoDemo() {
  return (
    <figure className="demo demo-logo" role="img" aria-label={copy.figureLabel}>
      <div aria-hidden="true" data-demo-step>
        <svg viewBox="0 0 320 160" className="van">
          <path className="van-body" d="M12 118V40a8 8 0 0 1 8-8h180a8 8 0 0 1 8 8v20h44c4 0 7 2 9 5l35 38c2 2 3 5 3 8v7a6 6 0 0 1-6 6H12z" />
          <path className="van-line" d="M208 60v58M232 60v34h66" />
          <circle className="van-wheel" cx="72" cy="124" r="18" />
          <circle className="van-wheel" cx="252" cy="124" r="18" />
          <path className="van-wordmark" transform={`translate(36 62) scale(${wordmarkScale})`} d={logo.wordmark.d} />
        </svg>
        <p className="demo-caption">{copy.van}</p>
      </div>
      <div aria-hidden="true" data-demo-step>
        <div className="card">
          <LogoTile className="card-mark" data-stamp="" />
          <div className="card-text">
            <span>{copy.cardName}</span>
            <span>{copy.cardLine}</span>
          </div>
        </div>
        <p className="demo-caption">{copy.card}</p>
      </div>
    </figure>
  );
}
