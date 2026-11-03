"use client";

import { useRef } from "react";
import { motion } from "@/components/motion/loadMotion";
import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { pace } from "@/content/copy";

/**
 * The sprint day as a timeline. With motion, the line draws across (down, on
 * phones) and each step's dot lands as the line reaches it.
 */
export function SprintSteps() {
  const ref = useRef<HTMLOListElement>(null);

  useScrollMotion(ref, ({ gsap, ScrollTrigger }, el) => {
    if (ScrollTrigger.isInViewport(el, 0.2) || el.getBoundingClientRect().bottom < 0) return;
    const steps = el.querySelectorAll(".sprint-step");
    // Drawn by the scroll: the line runs through the day and each step lands as the line reaches it.
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: motion.scrub } })
      .fromTo(el, { "--sprint-line": 0 }, { "--sprint-line": 1, duration: 1, ease: "none" }, 0)
      .from(el.querySelectorAll(".sprint-dot"), { scale: 0, duration: 0.12, ease: "power2.out", stagger: 0.25 }, 0.02)
      .from(steps, { opacity: 0, y: 24, duration: 0.2, ease: "power2.out", stagger: 0.25 }, 0.04);
  });

  return (
    <ol ref={ref} className="sprint-steps">
      {pace.sprint.steps.map((step) => (
        <li key={step.when} className="sprint-step">
          <span className="sprint-dot" aria-hidden="true" />
          <p className="sprint-when">{step.when}</p>
          <p className="body">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
