"use client";

import { useRef } from "react";
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
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } })
      .fromTo(el, { "--sprint-line": 0 }, { "--sprint-line": 1, duration: 0.9, ease: "power2.inOut" }, 0)
      .from(el.querySelectorAll(".sprint-dot"), { scale: 0, duration: 0.3, ease: "power2.out", stagger: 0.18 }, 0.1)
      .from(steps, { opacity: 0, y: 16, duration: 0.6, ease: "power3.out", stagger: 0.18 }, 0.15);
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
