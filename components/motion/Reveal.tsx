"use client";

import { useCallback, useRef, type ReactNode } from "react";
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
  // A callback ref takes any of the four tags; an object ref would need one element type.
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

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
      // Leave no inline styles behind, so CSS (hover lifts, print) has the last word.
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  return (
    <Tag ref={setRef} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
