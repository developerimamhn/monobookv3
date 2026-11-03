"use client";

import type Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import { loadLenis, loadMotion, queries, queueRefresh } from "./loadMotion";
import { createScrollKeeper, headerHeight } from "./scrollKeeper";

type MotionContextValue = {
  reduced: boolean;
  /** Scroll so the target sits under the header, then call done. */
  scrollTo: (target: HTMLElement | "top", done?: () => void) => void;
};

const MotionContext = createContext<MotionContextValue>({ reduced: true, scrollTo: () => {} });

export const useMotion = () => useContext(MotionContext);

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(queries.reduced);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(queries.reduced).matches;
// The server cannot know, so it renders the still version; nothing depends on motion.
const getServerReduced = () => true;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getReduced, getServerReduced);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Touch scrolling is already smooth; Lenis would only add work there.
    const touch = window.matchMedia("(pointer: coarse)").matches;

    Promise.all([loadMotion(), touch ? null : loadLenis()]).then(([{ gsap, ScrollTrigger }, LenisClass]) => {
      if (cancelled) return;
      const lenis = LenisClass ? new LenisClass({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true }) : null;
      const onTick = (time: number) => lenis?.raf(time * 1000);
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);
      }
      lenisRef.current = lenis;

      const keeper = createScrollKeeper((y) => (lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y)));
      ScrollTrigger.addEventListener("refresh", keeper.onRefresh);
      document.fonts.ready.then(() => !cancelled && queueRefresh(ScrollTrigger));
      queueRefresh(ScrollTrigger);

      cleanup = () => {
        ScrollTrigger.removeEventListener("refresh", keeper.onRefresh);
        keeper.destroy();
        if (lenis) {
          gsap.ticker.remove(onTick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        }
        lenisRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  const scrollTo = useCallback(
    (target: HTMLElement | "top", done?: () => void) => {
      const y = target === "top" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight());
      const lenis = lenisRef.current;
      if (lenis) {
        // Short hops stay quick; a jump across the whole page tops out at 1.2s.
        const duration = Math.min(1.2, 0.5 + Math.abs(y - window.scrollY) / 10000);
        lenis.scrollTo(y, { duration, easing: easeInOutCubic, onComplete: () => done?.() });
        return;
      }
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      done?.();
    },
    [reduced],
  );

  const value = useMemo(() => ({ reduced, scrollTo }), [reduced, scrollTo]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
