"use client";

import { useRef } from "react";
import { motion } from "@/components/motion/loadMotion";
import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { Label } from "@/components/ui/Label";
import { problem } from "@/content/copy";

/**
 * One large sentence that reveals word by word on scroll, then two
 * mismatched placeholder marks that move together and become one.
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null);
  const words = problem.statement.split(" ");

  useScrollMotion(ref, ({ gsap }, el) => {
    // Words move from Muted to Ink. Both are brand tokens and Muted already
    // passes WCAG AA on Stone, so the sentence stays readable at every point.
    const root = getComputedStyle(document.documentElement);
    gsap.fromTo(
      el.querySelectorAll("[data-word]"),
      { color: root.getPropertyValue("--muted").trim() },
      {
        color: root.getPropertyValue("--ink").trim(),
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: el.querySelector(".problem-statement"), start: "top 80%", end: "bottom 45%", scrub: 1 },
      },
    );

    const marks = el.querySelector(".problem-marks");
    if (!marks) return;
    marks.classList.add("problem-marks--animated");
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: marks, start: "top 85%", end: "center 45%", scrub: 1 } })
      .fromTo(q(".problem-mark--a"), { xPercent: -95 }, { xPercent: 0, ease: "none" }, 0)
      .fromTo(q(".problem-mark--b"), { xPercent: 95, rotate: 12 }, { xPercent: 0, rotate: 0, ease: "none" }, 0)
      .to(q(".problem-caption--before"), { autoAlpha: 0, ease: "none", duration: 0.2 }, 0.65)
      .to(q(".problem-mark--a, .problem-mark--b"), { autoAlpha: 0, ease: "none", duration: 0.3 }, 0.7)
      .fromTo(q(".problem-mark--merged"), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, ease: "none", duration: 0.3 }, 0.7)
      .fromTo(q(".problem-caption--after"), { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.2 }, 0.85)
      .fromTo(q(".problem-follow"), { autoAlpha: 0, y: motion.rise }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.3 }, 0.75);

    return () => marks.classList.remove("problem-marks--animated");
  });

  return (
    <section ref={ref} id="problem" className="section section--stone problem" aria-labelledby="problem-title">
      <div className="container">
        <Label index={problem.index}>{problem.label}</Label>
        <h2 id="problem-title" className="h2 problem-statement" aria-label={problem.statement}>
          {words.map((word, i) => (
            <span key={`${word}-${i}`} aria-hidden="true">
              <span className="word" data-word>
                {word}
              </span>{" "}
            </span>
          ))}
        </h2>

        <figure className="problem-marks" role="img" aria-label={problem.marksLabel}>
          <div className="problem-pair">
            <svg className="problem-mark problem-mark--a" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="46" />
            </svg>
            <svg className="problem-mark problem-mark--b" viewBox="0 0 100 100" aria-hidden="true">
              <rect x="10" y="10" width="80" height="80" rx="6" />
            </svg>
            <span className="problem-caption problem-caption--before" aria-hidden="true">
              {problem.marksBefore}
            </span>
          </div>
          <div className="problem-one">
            <svg className="problem-mark problem-mark--merged" viewBox="0 0 100 100" aria-hidden="true">
              <rect x="6" y="6" width="88" height="88" rx="30" />
            </svg>
            <span className="problem-caption problem-caption--after" aria-hidden="true">
              {problem.marksAfter}
            </span>
          </div>
        </figure>

        <p className="lead problem-follow">{problem.follow}</p>
      </div>
    </section>
  );
}
