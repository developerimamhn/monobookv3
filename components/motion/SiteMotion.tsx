"use client";

import { useEffect } from "react";
import { loadMotion, loadSplitText, queueRefresh } from "./loadMotion";
import { useMotion } from "./MotionProvider";

const inView = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
};
const passed = (el: Element) => el.getBoundingClientRect().bottom < 0;

/*
 * Page-wide moments that span several server-rendered sections, so they live
 * in one place instead of turning those sections into client components:
 * - chapter headings rise line by line from behind a mask
 * - the orange Contact chapter opens out from a rounded inset as it arrives
 * - the Mayfair "After" frame wipes in over "Before"
 * - the footer wordmark rises and the Mk. tile lands one last time
 */
export function SiteMotion() {
  const { reduced } = useMotion();

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    Promise.all([loadMotion(), loadSplitText()]).then(([{ gsap, ScrollTrigger }, SplitText]) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        for (const heading of document.querySelectorAll<HTMLElement>("main .h2:not(.problem-statement), .proof-company")) {
          if (inView(heading) || passed(heading)) continue;
          // autoSplit re-splits on resize; a heading that has already risen must not rise again.
          let played = false;
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              played
                ? undefined
                : gsap.from(self.lines, {
                    yPercent: 120,
                    duration: 0.9,
                    ease: "expo.out",
                    stagger: 0.08,
                    // Put the heading back as plain text, so the masks never clip it afterwards.
                    onComplete: () => {
                      played = true;
                      self.revert();
                    },
                    scrollTrigger: { trigger: heading, start: "top 88%", once: true },
                  }),
          });
        }

        const contact = document.getElementById("contact");
        if (contact && !passed(contact)) {
          gsap.fromTo(
            contact,
            { clipPath: "inset(5% 3% 0% 3% round 32px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: contact, start: "top bottom", end: "top 30%", scrub: 0.6 } },
          );
        }

        const after = document.querySelector(".proof-frame--after");
        if (after && !inView(after) && !passed(after)) {
          gsap.fromTo(
            after,
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut", scrollTrigger: { trigger: after, start: "top 70%", once: true } },
          );
        }

        const brand = document.querySelector(".footer-brand");
        if (brand && !inView(brand)) {
          gsap
            .timeline({ scrollTrigger: { trigger: brand, start: "top 95%", once: true } })
            .fromTo(
              brand.querySelector(".footer-wordmark"),
              { yPercent: 40, clipPath: "inset(0% 0% 100% 0%)" },
              { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out" },
            )
            .from(brand.querySelector(".footer-tile"), { scale: 1.12, opacity: 0, duration: 0.45, ease: "power4.out" }, "-=0.35");
        }
      });
      revert = () => ctx.revert();
      queueRefresh(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [reduced]);

  return null;
}
