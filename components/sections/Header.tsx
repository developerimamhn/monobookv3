"use client";

import { useEffect, useState } from "react";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { Wordmark } from "@/components/ui/Logo";
import { header } from "@/content/copy";

const sectionIds = header.nav.map((item) => item.href.slice(1));

/**
 * Fixed header. It gains a hairline once the page moves, turns dark over the
 * dark chapters, and marks the chapter you are reading in the nav.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".site-header");
    const darkZones = Array.from(document.querySelectorAll<HTMLElement>(".section--ink, .site-footer"));
    const sections = sectionIds.map((id) => document.getElementById(id));
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = bar?.offsetHeight ?? 0;
      const under = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      };
      setScrolled(window.scrollY > 8);
      setDark(darkZones.some(under));
      setActive(sectionIds.find((_, i) => under(sections[i] ?? null)) ?? null);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const classes = ["site-header", scrolled && "is-scrolled", dark && "is-dark"].filter(Boolean).join(" ");

  return (
    <header className={classes}>
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
                <ScrollLink href={item.href} className="header-link" aria-current={active === item.href.slice(1) ? "true" : undefined}>
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
