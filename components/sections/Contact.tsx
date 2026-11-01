import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { contact, site } from "@/content/copy";

/** The closing chapter: one line, one email button. */
export function Contact() {
  return (
    <Section id="contact" tone="stone" labelledBy="contact-title" className="contact">
      <Reveal>
        <Label>{contact.label}</Label>
        <h2 id="contact-title" className="h2 contact-heading">
          {contact.heading}
        </h2>
      </Reveal>
      <Reveal className="contact-action">
        <a className="button button-primary" href={`mailto:${site.email}`}>
          {contact.button} {site.email}
        </a>
        <p className="contact-note">{contact.note}</p>
      </Reveal>
    </Section>
  );
}
