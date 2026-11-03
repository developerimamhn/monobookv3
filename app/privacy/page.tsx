import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Logo";
import { privacy, site } from "@/content/copy";

export const metadata: Metadata = {
  title: `${privacy.title} | MonoBook`,
  description: privacy.intro,
  alternates: { canonical: "/privacy/" },
};

export default function Privacy() {
  return (
    <main id="main" className="plain-page">
      <div className="container plain-page-inner">
        <Link href="/" className="wordmark" aria-label={site.name}>
          <Wordmark className="wordmark-svg" />
        </Link>
        <article className="legal">
          <h1 className="h2">{privacy.title}</h1>
          <p className="lead plain-page-body">{privacy.intro}</p>
          {privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <Link href="/" className="button plain-page-link">
            {privacy.back}
          </Link>
        </article>
      </div>
    </main>
  );
}
