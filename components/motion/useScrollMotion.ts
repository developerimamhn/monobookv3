"use client";

import { useEffect, type RefObject } from "react";
import { loadGsap, prefersReducedMotion, whenIdle, type MotionLib } from "./loadMotion";

type Setup = (lib: MotionLib, scope: HTMLElement) => void | (() => void);

/**
 * Run a GSAP setup for one component, scoped to its root element.
 * - Skipped entirely under prefers-reduced-motion.
 * - Waits for idle, then loads GSAP + ScrollTrigger once for the whole page.
 * - Everything created inside (tweens, ScrollTriggers, matchMedia) is
 *   reverted on unmount through gsap.context.
 */
export function useScrollMotion(ref: RefObject<HTMLElement | null>, setup: Setup) {
  useEffect(() => {
    const scope = ref.current;
    if (!scope || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    whenIdle()
      .then(loadGsap)
      .then((lib) => {
        if (cancelled) return;
        let extra: void | (() => void);
        const ctx = lib.gsap.context(() => {
          extra = setup(lib, scope);
        }, scope);
        revert = () => {
          if (typeof extra === "function") extra();
          ctx.revert();
        };
        lib.ScrollTrigger.refresh();
      });

    return () => {
      cancelled = true;
      revert?.();
    };
    // setup is defined inline by callers and is stable in intent; run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
