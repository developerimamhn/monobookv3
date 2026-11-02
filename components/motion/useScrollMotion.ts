"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";
import { loadMotion, queueRefresh, type MotionLib } from "./loadMotion";
import { useMotion } from "./MotionProvider";

type Setup = (lib: MotionLib, scope: HTMLElement) => void | (() => void);

/**
 * Runs a GSAP setup scoped to one element. Everything it creates is reverted
 * through gsap.context on unmount, or as soon as the visitor turns on reduced motion.
 */
export function useScrollMotion(ref: RefObject<HTMLElement | null>, setup: Setup) {
  const { reduced } = useMotion();
  const run = useEffectEvent(setup);

  useEffect(() => {
    const scope = ref.current;
    if (!scope || reduced) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadMotion().then((lib) => {
      if (cancelled) return;
      const ctx = lib.gsap.context(() => run(lib, scope), scope);
      revert = () => ctx.revert();
      queueRefresh(lib.ScrollTrigger);
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [ref, reduced]);
}
