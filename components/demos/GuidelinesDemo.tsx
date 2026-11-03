import { LogoTile } from "@/components/ui/Logo";
import { pad2 } from "@/components/ui/format";
import { demos } from "@/content/copy";

const copy = demos.guidelines;

export function GuidelinesDemo() {
  return (
    <figure className="demo demo-guidelines" role="img" aria-label={copy.figureLabel}>
      <div className="doc-cover" aria-hidden="true" data-demo-step>
        <LogoTile className="doc-mark" data-stamp="" />
        <span className="doc-title">{copy.cover}</span>
        <span className="doc-company">{copy.company}</span>
      </div>
      <ol className="doc-pages" aria-hidden="true">
        {copy.pages.map((page, i) => (
          <li key={page} data-demo-step>
            <span className="doc-page-num">{pad2(i + 1)}</span>
            {page}
          </li>
        ))}
      </ol>
    </figure>
  );
}
