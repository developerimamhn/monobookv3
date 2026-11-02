import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { needs, site } from "@/content/copy";

/** What the client sends before work starts, as one numbered list. */
export function Needs() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(needs.subject)}`;
  return (
    <Section id="needs" tone="paper" labelledBy="needs-title" className="needs">
      <div className="grid">
        <Reveal className="col-5 needs-head">
          <Label index={needs.index}>{needs.label}</Label>
          <h2 id="needs-title" className="h2">
            {needs.heading}
          </h2>
          <p className="lead needs-note">{needs.note}</p>
          <a className="button button-outline needs-button" href={mailto}>
            {needs.button}
          </a>
        </Reveal>
        <Reveal as="ol" className="needs-list col-6 start-7" stagger>
          {needs.items.map((item, i) => (
            <li key={item}>
              <span className="needs-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
