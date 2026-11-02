/*
 * MonoBook logos, exported as vectors from the brand guideline in Figma.
 * The path data lives in content/logo.json so the build scripts can draw the
 * same shapes into the share image and the PNG icons.
 * Both are decorative: the link or label around them carries the name.
 */
import logo from "@/content/logo.json";

export { logo };

type LogoProps = { className?: string; "data-stamp"?: "" };

export function Wordmark({ className }: LogoProps) {
  const { w, h, d } = logo.wordmark;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/** The Mk. mark: White letters on the orange square. */
export function LogoTile({ className, ...rest }: LogoProps) {
  const { size, x, y } = logo.tile;
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false" {...rest}>
      <rect className="logo-tile-bg" width={size} height={size} />
      <path className="logo-tile-mark" transform={`translate(${x} ${y})`} d={logo.mark.d} />
    </svg>
  );
}
