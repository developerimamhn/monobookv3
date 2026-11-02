"use client";

import { useEffect, useState } from "react";
import { mobileCta, needs, site } from "@/content/copy";

/**
 * Phones only: an email bar within thumb reach. It appears once the hero has
 * scrolled away and steps aside when the Contact chapter or the footer, which
 * carry the address themselves, come into view.
 */
export function MobileCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const ends = Array.from(document.querySelectorAll<HTMLElement>("#contact, .site-footer"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const pastHero = (hero?.getBoundingClientRect().bottom ?? 0) < 0;
      const atEnd = ends.some((el) => el.getBoundingClientRect().top < window.innerHeight);
      setShown(pastHero && !atEnd);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`mobile-cta${shown ? " is-shown" : ""}`} inert={!shown}>
      <a className="mobile-cta-link" href={`mailto:${site.email}?subject=${encodeURIComponent(needs.subject)}`}>
        {mobileCta}
      </a>
    </div>
  );
}
