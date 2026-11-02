import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { pace } from "@/content/copy";

/** Same five parts, three speeds, then how the one-day sprint runs. No prices. */
export function Pace() {
  return (
    <Section id="pace" tone="stone" labelledBy="pace-title" className="pace">
      <Reveal className="grid pace-head">
        <div className="col-12">
          <Label index={pace.index}>{pace.label}</Label>
        </div>
        <h2 id="pace-title" className="h2 col-7">
          {pace.heading}
        </h2>
        <p className="lead pace-intro col-4 start-9">{pace.intro}</p>
      </Reveal>

      <Reveal as="ol" className="pace-options" stagger>
        {pace.options.map((option, i) => (
          <li key={option.name} className={`pace-option${i === 0 ? " pace-option--sprint" : ""}`}>
            <span className="pace-step" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="pace-name">{option.name}</h3>
            <p className="pace-length">{option.length}</p>
            <p className="body">{option.body}</p>
          </li>
        ))}
      </Reveal>

      <Reveal className="sprint">
        <h3 className="sprint-heading">{pace.sprint.heading}</h3>
        <ol className="sprint-steps">
          {pace.sprint.steps.map((step, i) => (
            <li key={step.when} className="sprint-step">
              <span className="sprint-dot" aria-hidden="true" />
              <span className="sprint-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="sprint-when">{step.when}</p>
              <p className="body">{step.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <p className="h3 pace-identical">{pace.identical}</p>
      </Reveal>
    </Section>
  );
}
