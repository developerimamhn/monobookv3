import { ScrollLink } from "@/components/ui/ScrollLink";
import { LogoTile, Wordmark } from "@/components/ui/Logo";
import { footer, header, site } from "@/content/copy";

const { postal } = footer;
const addressLines = [postal.street, `${postal.locality} ${postal.postalCode}, ${postal.region}`, postal.country];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="grid site-footer-cols">
          <div className="footer-col col-4">
            <span className="footer-label">{footer.studioLabel}</span>
            <address className="footer-address">
              <span>{footer.name}</span>
              {addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <span className="footer-hours">{footer.hours}</span>
          </div>
          <div className="footer-col col-3">
            <span className="footer-label">{footer.contactLabel}</span>
            <a href={`mailto:${site.email}`} className="footer-link">
              {site.email}
            </a>
          </div>
          <nav className="footer-col col-3" aria-label={footer.pagesLabel}>
            <span className="footer-label">{footer.pagesLabel}</span>
            <ul>
              {header.nav.map((item) => (
                <li key={item.href}>
                  <ScrollLink href={item.href} className="footer-link">
                    {item.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-col footer-col--top col-2">
            <ScrollLink href="#top" className="footer-link">
              {footer.backToTop}
            </ScrollLink>
            {/* A plain link: Next's static export does not write the data file a <Link> prefetches for this route. */}
            <a href="/privacy/" className="footer-link">
              {footer.privacy}
            </a>
          </div>
        </div>
        <div className="footer-brand">
          <Wordmark className="footer-wordmark" />
          <LogoTile className="footer-tile" />
        </div>
      </div>
    </footer>
  );
}
