"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { motion } from "./loadMotion";
import { useScrollMotion } from "./useScrollMotion";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  /** Reveal direct children one after another instead of the whole block. */
  stagger?: boolean;
};

/**
 * Fade and small rise when the element scrolls into view.
 * Does nothing under prefers-reduced-motion: content stays fully visible.
 * Content is visible in the HTML; it is only hidden once GSAP is ready and
 * the element is still below the fold.
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0, stagger = false }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    const targets = stagger ? Array.from(el.children) : el;
    // Never hide something the visitor can already see.
    if (ScrollTrigger.isInViewport(el, 0.05)) return;
    gsap.from(targets, {
      autoAlpha: 0,
      y: motion.rise,
      duration: motion.duration,
      ease: motion.ease,
      delay,
      stagger: stagger ? 0.15 : 0,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
