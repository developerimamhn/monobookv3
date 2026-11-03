import { demos } from "@/content/copy";

const copy = demos.typeface;

export function TypeDemo() {
  return (
    <figure className="demo" role="img" aria-label={copy.figureLabel}>
      <div className="type-sheet" aria-hidden="true">
        <span className="type-tag" data-demo-step>{copy.headingLabel}</span>
        <span className="type-heading" data-demo-step>{copy.heading}</span>
        <span className="type-tag" data-demo-step>{copy.bodyLabel}</span>
        <span className="type-body" data-demo-step>{copy.body}</span>
        <span className="type-tag" data-demo-step>{copy.invoiceLabel}</span>
        <span className="type-invoice" data-demo-step>
          <span>{copy.invoiceItem}</span>
          <span>{copy.invoiceTerms}</span>
        </span>
      </div>
    </figure>
  );
}
