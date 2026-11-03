"use client";

import { useEffect } from "react";
import { loadMotion, loadSplitText, motion, queueRefresh } from "./loadMotion";
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
 * - the Proof and Contact chapters open out from a rounded inset as they arrive
 * - the Mayfair "After" frame wipes in over "Before"
 * - the footer wordmark rises and the Mk. tile lands one last time
 * All of them follow the scroll (scrubbed), so the page plays like footage you scroll through.
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
        // As you scroll away, the headline drifts up slower than the page and its two lines
        // part (--hero-drift, see .hero-line in CSS), which gives the opening shot some depth.
        // Set up on the first scroll, so nothing touches the headline while the page loads.
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle && window.scrollY < window.innerHeight) {
          const startParallax = () =>
            ctx.add(() => {
              gsap.to(heroTitle, {
                yPercent: -10,
                "--hero-drift": 1,
                ease: "none",
                scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: motion.scrub },
              });
            });
          window.addEventListener("scroll", startParallax, { once: true, passive: true });
          ctx.add(() => () => window.removeEventListener("scroll", startParallax));
        }

        // Each showcase photo settles from a slight zoom inside its frame, and the two small
        // ones travel a little against the large one, like layers in a camera move.
        for (const img of document.querySelectorAll(".showcase-media img")) {
          if (passed(img)) continue;
          gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom 55%", scrub: motion.scrub } });
        }
        for (const media of document.querySelectorAll(".showcase-item--2 .showcase-media, .showcase-item--3 .showcase-media")) {
          if (passed(media)) continue;
          gsap.fromTo(media, { y: 28 }, { y: -28, ease: "none", scrollTrigger: { trigger: ".showcase-grid", start: "top bottom", end: "bottom top", scrub: motion.scrub } });
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
              { color: root.getPropertyValue("--paper").trim(), ease: "none", stagger: 0.1, scrollTrigger: { trigger: quote, start: "top 75%", end: "bottom 50%", scrub: motion.scrub } },
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

        // The two full-colour chapters, Proof in black and Contact in orange, open out from a
        // rounded inset as they arrive, like a cut to the next scene.
        for (const id of ["proof", "contact"]) {
          const chapter = document.getElementById(id);
          if (!chapter || passed(chapter)) continue;
          gsap.fromTo(
            chapter,
            { clipPath: "inset(4% 3% 0% 3% round 32px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "top 25%", scrub: motion.scrub } },
          );
        }

        const after = document.querySelector(".proof-frame--after");
        if (after && !inView(after) && !passed(after)) {
          gsap.fromTo(
            after,
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut", scrollTrigger: { trigger: after, start: "top 85%", end: "top 35%", scrub: motion.scrub } },
          );
        }

        // The closing shot: the wordmark rises into place as the page reaches its end, then the Mk. tile lands.
        const brand = document.querySelector(".footer-brand");
        if (brand && !inView(brand)) {
          gsap
            .timeline({ scrollTrigger: { trigger: brand, start: "top bottom", end: "bottom bottom", scrub: motion.scrub } })
            .fromTo(
              brand.querySelector(".footer-wordmark"),
              { yPercent: 60, clipPath: "inset(0% 0% 100% 0%)" },
              { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power2.out" },
            )
            .from(brand.querySelector(".footer-tile"), { scale: 1.15, opacity: 0, duration: 0.25, ease: "power3.out" }, 0.75);
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
