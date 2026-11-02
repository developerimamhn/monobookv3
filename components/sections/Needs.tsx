import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { pad2 } from "@/components/ui/format";
import { needs, site } from "@/content/copy";

// The email opens with the seven questions already in it, ready to fill in.
const body = [needs.emailIntro, "", ...needs.items.flatMap((item, i) => [`${i + 1}. ${item}`, "", ""])].join("\n");
const mailto = `mailto:${site.email}?subject=${encodeURIComponent(needs.subject)}&body=${encodeURIComponent(body)}`;

export function Needs() {
  return (
    <Section id="needs" tone="paper" labelledBy="needs-title" className="needs">
      <div className="grid">
        <Reveal className="col-5 needs-head">
          <Label index={needs.index}>{needs.label}</Label>
          <h2 id="needs-title" className="h2">
            {needs.heading}
          </h2>
          <p className="lead needs-note">{needs.note}</p>
          <a className="button needs-button" href={mailto}>
            {needs.button}
          </a>
        </Reveal>
        <Reveal as="ol" className="needs-list col-6 start-7" stagger>
          {needs.items.map((item, i) => (
            <li key={item}>
              <span className="needs-num" aria-hidden="true">
                {pad2(i + 1)}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
