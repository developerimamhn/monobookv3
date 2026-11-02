import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { pace } from "@/content/copy";
import { SprintSteps } from "./SprintSteps";

/** Same five parts, three speeds, then how the one-day sprint runs. */
export function Pace() {
  return (
    <Section id="pace" tone="stone" labelledBy="pace-title">
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
            <h3 className="pace-name">{option.name}</h3>
            <p className="pace-length">{option.length}</p>
            <p className="body">{option.body}</p>
          </li>
        ))}
      </Reveal>

      <div className="sprint">
        <h3 className="sprint-heading">{pace.sprint.heading}</h3>
        <SprintSteps />
      </div>

      <Reveal>
        <p className="h3 pace-identical">{pace.identical}</p>
      </Reveal>
    </Section>
  );
}
