"use client";

import { useRef, type ReactNode } from "react";
import { motion, queries } from "./loadMotion";
import { useScrollMotion } from "./useScrollMotion";

type PinnedMomentProps = {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  /** How long the moment holds, as a share of the viewport height. */
  hold?: number;
};

/*
 * One idea per screen, played by the scroll like a short film: the panel's
 * [data-pin-part] children rise, its demo builds piece by piece
 * ([data-demo-step]), then the Mk. tile lands ([data-stamp]). On screens with
 * room for it the panel pins while that plays; elsewhere it plays in place.
 */
export function PinnedMoment({ children, className, labelledBy, hold = 0.35 }: PinnedMomentProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    const parts = el.querySelectorAll("[data-pin-part]");
    const steps = el.querySelectorAll("[data-demo-step]");
    const stamps = el.querySelectorAll("[data-stamp]");

    // The storyboard, in timeline units: 0 to 1 is the whole scroll range it is given.
    const storyboard = (tl: GSAPTimeline) =>
      tl
        .from(parts, { opacity: 0, y: motion.rise, ease: "power2.out", duration: 0.35, stagger: 0.06 }, 0)
        .from(steps, { opacity: 0, y: 20, ease: "power2.out", duration: 0.25, stagger: 0.05 }, 0.3)
        .from(stamps, { opacity: 0, scale: 1.15, ease: "power3.out", duration: 0.15, transformOrigin: "50% 50%" }, 0.78);

    const mm = gsap.matchMedia();

    mm.add(queries.pin, () => {
      // From the panel entering low on the screen until its pin ends.
      storyboard(
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 85%", end: () => `+=${Math.round(window.innerHeight * (0.85 + hold))}`, scrub: motion.scrub },
        }),
      );
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * hold)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      // Created after the pin so its positions include the pin's spacing: the panel
      // dims as it leaves, overlapping the next one rising in, so there is no blank band.
      // Once it is fully off screen it returns to full strength, so nothing stays faded.
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "bottom 75%", end: "bottom top", scrub: motion.scrub } })
        .to(el.firstElementChild, { opacity: 0.15, y: -32, ease: "none", duration: 0.8 })
        .set(el.firstElementChild, { opacity: 1, y: 0 }, 1);
    });

    mm.add(queries.noPin, () => {
      if (ScrollTrigger.isInViewport(el, 0.1) || el.getBoundingClientRect().bottom < 0) return;
      storyboard(gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", end: "center 45%", scrub: motion.scrub } }));
    });
  });

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
