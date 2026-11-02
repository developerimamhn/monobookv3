import { Reveal } from "@/components/motion/Reveal";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { contact, site } from "@/content/copy";

/** The closing chapter: one line, then the address itself as the call to action. */
export function Contact() {
  return (
    <Section id="contact" tone="brand" labelledBy="contact-title" className="contact">
      <Reveal>
        <Label index={contact.index}>{contact.label}</Label>
        <h2 id="contact-title" className="h2 contact-heading">
          {contact.heading}
        </h2>
      </Reveal>
      <Reveal className="contact-action">
        <a className="contact-email" href={`mailto:${site.email}`}>
          <span className="visually-hidden">{contact.emailLabel} </span>
          <span className="contact-email-text">{site.email}</span>
          <span className="contact-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M6 18 18 6M8 6h10v10" />
            </svg>
          </span>
        </a>
        <div className="contact-foot">
          <p className="contact-note">{contact.note}</p>
          <CopyEmail email={site.email} label={contact.copy} done={contact.copied} />
        </div>
      </Reveal>
    </Section>
  );
}
