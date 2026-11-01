import { demos } from "@/content/copy";

const t = demos.typeface;

/** A heading, a paragraph and an invoice line, all in one family. */
export function TypeDemo() {
  return (
    <figure className="demo demo-type" role="img" aria-label={t.figureLabel}>
      <div className="type-sheet" aria-hidden="true">
        <span className="type-tag">{t.headingLabel}</span>
        <span className="type-heading">{t.heading}</span>
        <span className="type-tag">{t.bodyLabel}</span>
        <span className="type-body">{t.body}</span>
        <span className="type-tag">{t.invoiceLabel}</span>
        <span className="type-invoice">
          <span>{t.invoiceItem}</span>
          <span>{t.invoiceRef}</span>
        </span>
      </div>
    </figure>
  );
}
