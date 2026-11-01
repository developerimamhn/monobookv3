"use client";

import type { MouseEvent, ReactNode } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

type ScrollLinkProps = {
  /** "#id" of the target, or "#top" for the top of the page. */
  href: `#${string}`;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/**
 * In-page link. Scrolls with Lenis when it runs, then moves keyboard focus
 * to the target so screen reader and keyboard users land in the right place.
 */
export function ScrollLink({ href, children, className, ...rest }: ScrollLinkProps) {
  const { scrollTo } = useMotion();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = href.slice(1);
    const target = id === "top" ? document.getElementById("main") : document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollTo(id === "top" ? "top" : target);
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    history.replaceState(null, "", id === "top" ? location.pathname : href);
  };

  return (
    <a href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}
