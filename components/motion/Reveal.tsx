"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "./loadMotion";
import { useScrollMotion } from "./useScrollMotion";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "figure" | "ol" | "article";
  className?: string;
  delay?: number;
  /** Reveal the direct children one after another instead of the whole block. */
  stagger?: boolean;
};

/*
 * Fade and rise when the block scrolls into view. Only opacity is animated,
 * never visibility, so hidden-for-now content stays in the tab order, in
 * find-in-page and in the accessibility tree. CSS shows it at once if it
 * takes focus or the page is printed.
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0, stagger = false }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    // Never hide what the visitor can see, or has already scrolled past.
    if (ScrollTrigger.isInViewport(el, 0.05) || el.getBoundingClientRect().bottom < 0) return;
    gsap.from(stagger ? Array.from(el.children) : el, {
      opacity: 0,
      y: motion.rise,
      duration: motion.duration,
      ease: motion.ease,
      delay,
      stagger: stagger ? motion.stagger : 0,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  return (
    // The union of tags shares one ref type in practice; React types each tag's ref separately.
    <Tag ref={ref as never} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
