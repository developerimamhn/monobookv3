/**
 * GSAP, ScrollTrigger and Lenis are loaded lazily, after first paint, so
 * they never block the first render (Lighthouse mobile budget).
 * Only ScrollTrigger is registered. No other GSAP plugins ship.
 */
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type MotionLib = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let gsapPromise: Promise<MotionLib> | null = null;

export function loadGsap(): Promise<MotionLib> {
  gsapPromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return gsapPromise;
}

export function loadLenis() {
  return import("lenis").then((m) => m.default);
}

/** Resolve after the browser is idle (or a short timeout), once the page has painted. */
export function whenIdle(timeout = 1200): Promise<void> {
  return new Promise((resolve) => {
    const run = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout });
      else setTimeout(resolve, 200);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
  });
}

/** Shared motion settings. Slow and quiet. */
export const motion = {
  ease: "power2.out",
  duration: 1.2,
  rise: 24,
  okQuery: "(prefers-reduced-motion: no-preference)",
  /** Deliverables pin only on wide screens. */
  pinQuery: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
  mobileQuery: "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)",
} as const;

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
