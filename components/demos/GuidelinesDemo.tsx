import { demos } from "@/content/copy";

const t = demos.guidelines;

/** A document cover beside its list of pages. */
export function GuidelinesDemo() {
  return (
    <figure className="demo demo-guidelines" role="img" aria-label={t.figureLabel}>
      <div className="doc-cover" aria-hidden="true">
        <svg viewBox="0 0 40 40" className="doc-mark">
          <circle className="mark-fill" cx="20" cy="20" r="16" />
        </svg>
        <span className="doc-title">{t.cover}</span>
        <span className="doc-company">{t.company}</span>
      </div>
      <ol className="doc-pages" aria-hidden="true">
        {t.pages.map((page, i) => (
          <li key={page}>
            <span className="doc-page-num">{String(i + 1).padStart(2, "0")}</span>
            {page}
          </li>
        ))}
      </ol>
    </figure>
  );
}
