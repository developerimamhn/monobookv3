import { ScrollLink } from "@/components/ui/ScrollLink";
import { footer } from "@/content/copy";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <address className="footer-address">
          <span className="footer-name">{footer.name}</span>
          {footer.address.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
        <ScrollLink href="#top" className="footer-top">
          {footer.backToTop}
        </ScrollLink>
      </div>
    </footer>
  );
}
