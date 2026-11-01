import { demos } from "@/content/copy";

const t = demos.logo;

/** Primary mark on a van, secondary mark on a business card. Placeholder shapes only. */
export function LogoDemo() {
  return (
    <figure className="demo demo-logo" role="img" aria-label={t.figureLabel}>
      <div className="demo-logo-van" aria-hidden="true">
        <svg viewBox="0 0 320 160" className="van">
          <path className="van-body" d="M12 118V40a8 8 0 0 1 8-8h180a8 8 0 0 1 8 8v20h44c4 0 7 2 9 5l35 38c2 2 3 5 3 8v7a6 6 0 0 1-6 6H12z" />
          <path className="van-line" d="M208 60v58M232 60v34h66" />
          <circle className="van-wheel" cx="72" cy="124" r="18" />
          <circle className="van-wheel" cx="252" cy="124" r="18" />
          {/* Primary mark: symbol plus name bar */}
          <circle className="mark-fill" cx="54" cy="70" r="14" />
          <rect className="mark-fill" x="76" y="62" width="96" height="8" rx="2" />
          <rect className="mark-soft" x="76" y="76" width="64" height="6" rx="2" />
        </svg>
        <p className="demo-caption">
          {t.van} - {t.primary}
        </p>
      </div>
      <div className="demo-logo-card" aria-hidden="true">
        <div className="card">
          <svg viewBox="0 0 40 40" className="card-mark">
            <circle className="mark-fill" cx="20" cy="20" r="16" />
          </svg>
          <div className="card-text">
            <span>{t.cardName}</span>
            <span>{t.cardLine}</span>
          </div>
        </div>
        <p className="demo-caption">
          {t.card} - {t.secondary}
        </p>
      </div>
    </figure>
  );
}
