"use client";

import type Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import { loadGsap, loadLenis, whenIdle } from "./loadMotion";

type MotionContextValue = {
  /** True when the visitor asked for reduced motion. */
  reduced: boolean;
  /** Scroll to an element or to the top. Uses Lenis when it is running. */
  scrollTo: (target: HTMLElement | "top") => void;
};

const MotionContext = createContext<MotionContextValue>({ reduced: true, scrollTo: () => {} });

export function useMotion() {
  return useContext(MotionContext);
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
/* On the server, assume reduced motion so nothing depends on animation. */
const getServerReduced = () => true;

/**
 * One motion provider for the whole site.
 * - Lenis smooth scroll, gentle, driven by the GSAP ticker and synced with ScrollTrigger.
 * - Loaded after first paint, so it never slows the first render.
 * - Under prefers-reduced-motion Lenis is never created. Every GSAP effect
 *   is skipped too (see useScrollMotion).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getReduced, getServerReduced);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    whenIdle()
      .then(() => Promise.all([loadGsap(), loadLenis()]))
      .then(([{ gsap, ScrollTrigger }, LenisClass]) => {
        if (cancelled) return;
        const lenis = new LenisClass({
          duration: 1.3,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          wheelMultiplier: 0.9,
        });
        const onTick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);
        lenisRef.current = lenis;

        // Measure pins again once the web font has loaded, so nothing shifts.
        document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());

        cleanup = () => {
          gsap.ticker.remove(onTick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
          lenisRef.current = null;
        };
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  const scrollTo = useCallback((target: HTMLElement | "top") => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target === "top" ? 0 : target, { duration: 1.6 });
      return;
    }
    if (target === "top") window.scrollTo({ top: 0 });
    else target.scrollIntoView();
  }, []);

  const value = useMemo(() => ({ reduced, scrollTo }), [reduced, scrollTo]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
