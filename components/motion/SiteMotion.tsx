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
 * - the hero headline drifts slower than the page; showcase photos settle from a zoom
 * - Eric Dahl's quote brightens word by word
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
      // Splitting text is the costly part, so each block is split only when it comes within
      // a screen of the viewport, not all at once after load. ctx.add keeps those late
      // tweens inside the context, so unmounting still reverts everything.
      const whenNear = (el: Element, run: () => void) =>
        ScrollTrigger.create({ trigger: el, start: "top bottom+=100%", once: true, onEnter: () => ctx.add(run) });

      // Created empty first: callbacks below call ctx.add, some of them straight away.
      const ctx = gsap.context(() => {});
      ctx.add(() => {
        // The headline drifts up a little slower than the page as you scroll away from it.
        // Set up on the first scroll, so nothing touches the headline while the page loads.
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle && window.scrollY < window.innerHeight) {
          const startParallax = () =>
            ctx.add(() => {
              gsap.to(heroTitle, { yPercent: -12, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
            });
          window.addEventListener("scroll", startParallax, { once: true, passive: true });
          ctx.add(() => () => window.removeEventListener("scroll", startParallax));
        }

        // Each showcase photo settles from a slight zoom inside its frame.
        for (const img of document.querySelectorAll(".showcase-media img")) {
          if (passed(img)) continue;
          gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom 60%", scrub: true } });
        }

        // Eric Dahl's words brighten one by one. They start at Paper 70%, which already passes AA on Ink.
        const quote = document.querySelector<HTMLElement>(".proof-quote blockquote p");
        if (quote && !passed(quote)) {
          whenNear(quote, () => {
            // aria "none": the word spans hold the real text, and a <p> may not carry an aria-label.
            const words = SplitText.create(quote, { type: "words", aria: "none" }).words;
            const root = getComputedStyle(document.documentElement);
            gsap.fromTo(
              words,
              { color: root.getPropertyValue("--paper-muted").trim() },
              { color: root.getPropertyValue("--paper").trim(), ease: "none", stagger: 0.1, scrollTrigger: { trigger: quote, start: "top 75%", end: "bottom 50%", scrub: 1 } },
            );
          });
        }

        for (const heading of document.querySelectorAll<HTMLElement>("main .h2:not(.problem-statement), .proof-company, .pace-identical")) {
          if (inView(heading) || passed(heading)) continue;
          whenNear(heading, () => {
            // autoSplit re-splits on resize; a heading that has already risen must not rise again.
            let played = false;
            SplitText.create(heading, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              // Only real headings may carry the aria-label SplitText adds; for the paragraph the lines hold the text.
              aria: /^H\d$/.test(heading.tagName) ? "auto" : "none",
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
