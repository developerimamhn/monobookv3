/*
 * Pins add height to the page after the browser has already scrolled. Left
 * alone, a deep link (/#contact), a reload half way down, or a resize across
 * the pin breakpoint all land somewhere else. The keeper remembers which block
 * sits under the header and puts it back there after every ScrollTrigger refresh.
 */

type Spot = { el: HTMLElement; offset: number };

const ANCHORS = "main > section, .deliverable, .site-footer";
const STORE = "monobook:scroll";

export function headerHeight() {
  return document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
}

// A pinned element is position: fixed while pinned; its spacer keeps the real place in the page.
const box = (el: HTMLElement) => (el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el);

const anchors = () => Array.from(document.querySelectorAll<HTMLElement>(ANCHORS));

function spotUnderHeader(): Spot | null {
  const line = headerHeight() + 1;
  let spot: Spot | null = null;
  for (const el of anchors()) {
    const top = box(el).getBoundingClientRect().top;
    if (top <= line) spot = { el, offset: top };
  }
  return spot;
}

function initialSpot(): Spot | null {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === "reload" || nav?.type === "back_forward") {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null") as { index: number; offset: number } | null;
      const el = saved ? anchors()[saved.index] : undefined;
      if (saved && el) return { el, offset: saved.offset };
    } catch {
      // Storage can be blocked; the page then simply starts where the browser put it.
    }
  }
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  return target ? { el: target, offset: headerHeight() } : null;
}

export function createScrollKeeper(jump: (y: number) => void) {
  let spot = initialSpot();
  let following = false;
  let paused = false;
  let unpause = 0;
  let width = window.innerWidth;

  // Until the visitor scrolls by hand, keep honouring the hash or the reload position.
  const follow = () => {
    following = true;
  };
  const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  inputs.forEach((type) => window.addEventListener(type, follow, { passive: true, once: true }));

  // A width change can drop the pins and clamp the scroll; ignore the scroll
  // events that causes until the refresh that follows has put things back.
  const onResize = () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    paused = true;
    clearTimeout(unpause);
    unpause = window.setTimeout(() => (paused = false), 800);
  };

  const onScroll = () => {
    if (following && !paused) spot = spotUnderHeader();
  };

  const onPageHide = () => {
    const current = spotUnderHeader();
    try {
      if (current) sessionStorage.setItem(STORE, JSON.stringify({ index: anchors().indexOf(current.el), offset: current.offset }));
      else sessionStorage.removeItem(STORE);
    } catch {
      // Nothing to restore next time, which is fine.
    }
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pagehide", onPageHide);

  return {
    onRefresh() {
      clearTimeout(unpause);
      paused = false;
      if (!spot?.el.isConnected) return;
      const y = window.scrollY + box(spot.el).getBoundingClientRect().top - spot.offset;
      if (Math.abs(y - window.scrollY) > 1) jump(Math.max(0, y));
    },
    destroy() {
      clearTimeout(unpause);
      inputs.forEach((type) => window.removeEventListener(type, follow));
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onPageHide);
    },
  };
}
