"use client";

import { useEffect, useState } from "react";
import { deliverables } from "@/content/copy";

const total = deliverables.items.length;

/**
 * One thin progress line, 1/5 to 5/5, shown while the deliverables are on
 * screen. Uses IntersectionObserver, not GSAP, so it also works under
 * reduced motion (it just stops animating its width).
 */
export function DeliverablesProgress() {
  const [current, setCurrent] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const list = document.getElementById("deliverables-list");
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-deliverable]"));

    const inView = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      rootMargin: "-40% 0px -40% 0px",
    });
    inView.observe(list);

    const active = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(items.indexOf(entry.target as HTMLElement) + 1);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((item) => active.observe(item));

    return () => {
      inView.disconnect();
      active.disconnect();
    };
  }, []);

  return (
    <div className={`progress${visible ? " is-visible" : ""}`} aria-hidden="true">
      <span className="progress-count">
        {current}/{total}
      </span>
      <span className="progress-track">
        <span className="progress-fill" style={{ transform: `scaleX(${current / total})` }} />
      </span>
    </div>
  );
}
