/*
 * GSAP, ScrollTrigger and Lenis load after the page is idle, so they never
 * hold up the first paint. Every component shares the same idle promise and
 * the same GSAP import, which means all setups run in one tick and can share
 * a single ScrollTrigger.refresh().
 */
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type MotionLib = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

const NO_PREF = "(prefers-reduced-motion: no-preference)";

export const queries = {
  reduced: "(prefers-reduced-motion: reduce)",
  // Pins need room: a wide screen that is also tall enough to show a whole panel.
  pin: `(min-width: 900px) and (min-height: 760px) and ${NO_PREF}`,
  noPin: `(max-width: 899.98px) and ${NO_PREF}, (max-height: 759.98px) and ${NO_PREF}`,
} as const;

export const motion = {
  ease: "power3.out",
  duration: 0.8,
  rise: 40,
  stagger: 0.08,
  // Scroll-linked tweens trail the scroll by this many seconds, which smooths every jolt of the wheel.
  scrub: 1,
} as const;

let idle: Promise<void> | null = null;
let lib: Promise<MotionLib> | null = null;

function whenIdle() {
  idle ??= new Promise((resolve) => {
    const run = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 1200 });
      else setTimeout(resolve, 200);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
  });
  return idle;
}

export function loadMotion(): Promise<MotionLib> {
  lib ??= whenIdle()
    .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]))
    .then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    });
  return lib;
}

let split: Promise<typeof import("gsap/SplitText").SplitText> | null = null;

/** SplitText, for the masked heading reveals. Loaded only when motion is on. */
export function loadSplitText() {
  split ??= Promise.all([loadMotion(), import("gsap/SplitText")]).then(([{ gsap }, m]) => {
    gsap.registerPlugin(m.SplitText);
    return m.SplitText;
  });
  return split;
}

export function loadLenis() {
  return import("lenis").then((m) => m.default);
}

let refreshQueued = false;

/** Twenty components each asking for a refresh in the same frame get one. */
export function queueRefresh(ScrollTrigger: MotionLib["ScrollTrigger"]) {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
}
