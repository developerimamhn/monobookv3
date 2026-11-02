"use client";

import type { MouseEvent, ReactNode } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

type ScrollLinkProps = {
  /** "#id" of the target, or "#top" for the top of the page. */
  href: `#${string}`;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "true";
};

/**
 * In-page link. Scrolls the target to just under the header, then moves
 * keyboard focus there. Each jump is a history entry, so Back returns to it.
 */
export function ScrollLink({ href, children, className, ...rest }: ScrollLinkProps) {
  const { scrollTo } = useMotion();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = href.slice(1);
    const target = id === "top" ? null : document.getElementById(id);
    if (id !== "top" && !target) return;
    event.preventDefault();

    const focusTarget = target ?? document.getElementById("main");
    scrollTo(target ?? "top", () => {
      if (!focusTarget) return;
      if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    });

    const url = id === "top" ? location.pathname : href;
    if (location.hash !== (id === "top" ? "" : href)) history.pushState(null, "", url);
  };

  return (
    <a href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}
