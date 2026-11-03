"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { motion } from "./loadMotion";
import { useScrollMotion } from "./useScrollMotion";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "figure" | "ol" | "article";
  className?: string;
  /** Reveal the direct children one after another instead of the whole block. */
  stagger?: boolean;
};

/*
 * Fade and rise tied to the scroll: the block comes in as it moves up the
 * screen and goes back if you scroll the other way, like scrubbing a video.
 * Only opacity is animated, never visibility, so content still waiting to
 * appear stays in the tab order, in find-in-page and in the accessibility
 * tree. CSS shows it at once if it takes focus or the page is printed.
 */
export function Reveal({ children, as: Tag = "div", className, stagger = false }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // A callback ref takes any of the four tags; an object ref would need one element type.
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    // Never hide what the visitor can see, or has already scrolled past.
    if (ScrollTrigger.isInViewport(el, 0.05) || el.getBoundingClientRect().bottom < 0) return;
    // In a list each item follows its own place on the screen, so the last rows rise when they arrive.
    for (const target of stagger ? Array.from(el.children) : [el]) {
      gsap.from(target, {
        opacity: 0,
        y: motion.rise,
        ease: "power2.out",
        scrollTrigger: { trigger: target, start: "top 95%", end: "top 65%", scrub: motion.scrub },
      });
    }
  });

  return (
    <Tag ref={setRef} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
