"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "./loadMotion";
import { useScrollMotion } from "./useScrollMotion";

type PinnedMomentProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  /** How long the moment holds, as a share of the viewport height. */
  hold?: number;
};

/**
 * One idea per screen. On wide screens with motion allowed, the moment
 * pins briefly while its parts ([data-pin-part]) fade and rise in.
 * On small screens there is no pinning, only a gentle reveal.
 * Under prefers-reduced-motion nothing moves.
 */
export function PinnedMoment({ children, className, id, labelledBy, hold = 0.6 }: PinnedMomentProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    const parts = el.querySelectorAll("[data-pin-part]");
    const mm = gsap.matchMedia();

    mm.add(motion.pinQuery, () => {
      gsap.from(parts, {
        autoAlpha: 0,
        y: motion.rise * 1.5,
        ease: "none",
        stagger: 0.2,
        scrollTrigger: { trigger: el, start: "top 80%", end: "top 20%", scrub: 1 },
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * hold)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });

    mm.add(motion.mobileQuery, () => {
      if (ScrollTrigger.isInViewport(el, 0.1)) return;
      gsap.from(parts, {
        autoAlpha: 0,
        y: motion.rise,
        duration: motion.duration,
        ease: motion.ease,
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });

    return () => mm.revert();
  });

  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
