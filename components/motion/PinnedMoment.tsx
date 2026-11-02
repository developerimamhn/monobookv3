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
 * One idea per screen. On screens with room for it the panel pins briefly
 * while its [data-pin-part] children rise in, then the Mk. tile ([data-stamp])
 * lands on the demo. Elsewhere the parts simply reveal once.
 */
export function PinnedMoment({ children, className, labelledBy, hold = 0.3 }: PinnedMomentProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    const parts = el.querySelectorAll("[data-pin-part]");
    const stamps = el.querySelectorAll("[data-stamp]");
    const stamp = { scale: 1.12, opacity: 0, duration: 0.45, ease: "power4.out", transformOrigin: "50% 50%" };
    const mm = gsap.matchMedia();

    mm.add(queries.pin, () => {
      gsap.from(parts, {
        opacity: 0,
        y: motion.rise,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: 0.6 },
      });
      gsap.from(stamps, { ...stamp, scrollTrigger: { trigger: el, start: "top 30%", toggleActions: "play none none reverse" } });
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * hold)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });

    mm.add(queries.noPin, () => {
      if (ScrollTrigger.isInViewport(el, 0.1) || el.getBoundingClientRect().bottom < 0) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      tl.from(parts, { opacity: 0, y: motion.rise, duration: motion.duration, ease: motion.ease, stagger: 0.12 });
      tl.from(stamps, stamp, "-=0.3");
    });
  });

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
