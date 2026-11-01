import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { pace } from "@/content/copy";

/** Same work, three speeds. No prices. */
export function Pace() {
  return (
    <Section id="pace" tone="stone" labelledBy="pace-title">
      <Reveal>
        <Label>{pace.label}</Label>
        <h2 id="pace-title" className="h2">
          {pace.heading}
        </h2>
        <p className="lead pace-intro">{pace.intro}</p>
      </Reveal>

      <Reveal as="ol" className="pace-options" stagger>
        {pace.options.map((option, i) => (
          <li key={option.length} className="pace-option">
            <span className="pace-step" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="pace-length">{option.length}</h3>
            <p className="pace-title">{option.title}</p>
            <p className="body">{option.body}</p>
          </li>
        ))}
      </Reveal>

      <Reveal>
        <p className="h3 pace-identical">{pace.identical}</p>
        <dl className="pace-effort">
          <div>
            <dt>{pace.effort.yoursLabel}</dt>
            <dd>{pace.effort.yours}</dd>
          </div>
          <div>
            <dt>{pace.effort.oursLabel}</dt>
            <dd>{pace.effort.ours}</dd>
          </div>
        </dl>
      </Reveal>
    </Section>
  );
}
