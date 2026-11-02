"use client";

import { useEffect, useState } from "react";
import { deliverables } from "@/content/copy";

export const LIST_ID = "deliverables-list";
const total = deliverables.items.length;

/**
 * A thin line that fills as you scroll through the five deliverables, with a
 * 1/5 count beside it. Plain scroll maths rather than GSAP, so it also works
 * with reduced motion.
 */
export function DeliverablesProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const list = document.getElementById(LIST_ID);
    if (!list) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      setVisible(r.top < vh * 0.4 && r.bottom > vh * 0.6);
      setProgress(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh))));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = Math.min(total, Math.floor(progress * total) + 1);

  return (
    <div className={`progress${visible ? " is-visible" : ""}`} aria-hidden="true">
      <span>
        {current}/{total}
      </span>
      <span className="progress-track">
        <span className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </span>
    </div>
  );
}
