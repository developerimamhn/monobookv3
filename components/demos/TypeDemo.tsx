import { demos } from "@/content/copy";

const copy = demos.typeface;

export function TypeDemo() {
  return (
    <figure className="demo" role="img" aria-label={copy.figureLabel}>
      <div className="type-sheet" aria-hidden="true">
        <span className="type-tag">{copy.headingLabel}</span>
        <span className="type-heading">{copy.heading}</span>
        <span className="type-tag">{copy.bodyLabel}</span>
        <span className="type-body">{copy.body}</span>
        <span className="type-tag">{copy.invoiceLabel}</span>
        <span className="type-invoice">
          <span>{copy.invoiceItem}</span>
          <span>{copy.invoiceTerms}</span>
        </span>
      </div>
    </figure>
  );
}
