"use client";

import { useEffect, useState } from "react";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { Wordmark } from "@/components/ui/Logo";
import { header } from "@/content/copy";

/**
 * Fixed header: the MonoBook. wordmark, the chapter links and Contact.
 * It gains a hairline once the page has scrolled past the top.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="skip-link" href="#main">
        {header.skipLink}
      </a>
      <div className="container site-header-inner">
        <ScrollLink href="#top" className="wordmark" aria-label={header.wordmarkLabel}>
          <Wordmark className="wordmark-svg" />
        </ScrollLink>
        <nav className="site-nav" aria-label={header.navLabel}>
          <ul>
            {header.nav.map((item) => (
              <li key={item.href} className="site-nav-chapter">
                <ScrollLink href={item.href as `#${string}`} className="header-link">
                  {item.label}
                </ScrollLink>
              </li>
            ))}
            <li>
              <ScrollLink href="#contact" className="header-link header-link--contact">
                {header.contact}
              </ScrollLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
