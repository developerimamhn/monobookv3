"use client";

import { useRef } from "react";
import { motion } from "@/components/motion/loadMotion";
import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { Label } from "@/components/ui/Label";
import { LogoTile } from "@/components/ui/Logo";
import { problem } from "@/content/copy";

const words = problem.statement.split(" ");

/**
 * One large sentence that darkens word by word on scroll, then two mismatched
 * marks slide together and resolve into the Mk. tile: one company.
 * Without motion the marks simply sit side by side (see .problem-marks in CSS).
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ gsap }, el) => {
    // Muted to Ink. Muted already passes WCAG AA on Stone, so every frame is readable.
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

    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: q(".problem-marks"), start: "top 85%", end: "center 30%", scrub: 1 } })
      .fromTo(q(".problem-mark--a"), { xPercent: -95 }, { xPercent: 0, ease: "power1.inOut", duration: 0.55 }, 0)
      .fromTo(q(".problem-mark--b"), { xPercent: 95, rotate: 12 }, { xPercent: 0, rotate: 0, ease: "power1.inOut", duration: 0.55 }, 0)
      .to(q(".problem-caption--before"), { opacity: 0, ease: "none", duration: 0.1 }, 0.45)
      .to(q(".problem-mark--a, .problem-mark--b"), { scale: 0.92, opacity: 0, ease: "power1.in", duration: 0.12 }, 0.55)
      .fromTo(
        q(".problem-mark--merged"),
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(75% at 50% 50%)", ease: "expo.out", duration: 0.3 },
        0.6,
      )
      .fromTo(q(".problem-caption--after"), { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.15 }, 0.8)
      .fromTo(q(".problem-follow"), { opacity: 0, y: motion.rise }, { opacity: 1, y: 0, ease: "none", duration: 0.25 }, 0.75);
  });

  return (
    <section ref={ref} id="problem" className="section section--stone problem" aria-labelledby="problem-title">
      <div className="container">
        <Label index={problem.index}>{problem.label}</Label>
        <h2 id="problem-title" className="h2 problem-statement">
          <span className="visually-hidden">{problem.statement}</span>
          {words.map((word, i) => (
            <span key={`${word}-${i}`} aria-hidden="true">
              <span data-word>{word}</span>{" "}
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
            <LogoTile className="problem-mark problem-mark--merged" />
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
