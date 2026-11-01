import { ScrollLink } from "@/components/ui/ScrollLink";
import { header } from "@/content/copy";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {header.skipLink}
      </a>
      <div className="container site-header-inner">
        <ScrollLink href="#top" className="wordmark" aria-label={header.wordmarkLabel}>
          {header.wordmark}
        </ScrollLink>
        <ScrollLink href="#contact" className="header-link">
          {header.contact}
        </ScrollLink>
      </div>
    </header>
  );
}
