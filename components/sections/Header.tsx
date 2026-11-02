"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { Wordmark } from "@/components/ui/Logo";
import { header } from "@/content/copy";

const sectionIds = header.nav.map((item) => item.href.slice(1));
const MENU_ID = "site-menu";

/**
 * Fixed header. It gains a hairline once the page moves, turns dark over the
 * dark chapters, and marks the chapter you are reading. Below 1000px the links
 * fold into a Menu button.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  // An open menu closes on Escape, on a tap outside it, and when the screen grows past the breakpoint.
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 1000px)");
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", close);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", close);
    };
  }, [open]);

  const close = () => setOpen(false);
  const classes = ["site-header", scrolled && "is-scrolled", dark && "is-dark", open && "is-open"].filter(Boolean).join(" ");

  return (
    <header className={classes}>
      <a className="skip-link" href="#main">
        {header.skipLink}
      </a>
      <div className="container site-header-inner">
        <ScrollLink href="#top" className="wordmark" aria-label={header.wordmarkLabel} onNavigate={close}>
          <Wordmark className="wordmark-svg" />
        </ScrollLink>
        <nav ref={navRef} className="site-nav" aria-label={header.navLabel}>
          <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={open} aria-controls={MENU_ID} onClick={() => setOpen((o) => !o)}>
            {open ? header.menuClose : header.menuOpen}
          </button>
          <ul id={MENU_ID} className="site-nav-list">
            {header.nav.map((item) => (
              <li key={item.href}>
                <ScrollLink
                  href={item.href}
                  className="header-link"
                  aria-current={active === item.href.slice(1) ? "true" : undefined}
                  onNavigate={close}
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
            <li>
              <ScrollLink href="#contact" className="header-link header-link--contact" onNavigate={close}>
                {header.contact}
              </ScrollLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
