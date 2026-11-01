import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  tone?: "paper" | "stone";
  id?: string;
  labelledBy?: string;
  className?: string;
};

/** A page chapter. Tone picks Paper (main) or Stone (alternate). */
export function Section({ children, tone = "paper", id, labelledBy, className }: SectionProps) {
  const classes = ["section", `section--${tone}`, className].filter(Boolean).join(" ");
  return (
    <section id={id} aria-labelledby={labelledBy} className={classes}>
      <div className="container">{children}</div>
    </section>
  );
}
