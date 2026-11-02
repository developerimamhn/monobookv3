import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Logo";
import { notFound, site } from "@/content/copy";

export const metadata: Metadata = {
  title: `${notFound.title} | MonoBook`,
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div className="container not-found-inner">
        <Link href="/" className="wordmark" aria-label={site.name}>
          <Wordmark className="wordmark-svg" />
        </Link>
        <div>
          <h1 className="h2">{notFound.title}</h1>
          <p className="lead not-found-body">{notFound.body}</p>
          <Link href="/" className="button not-found-link">
            {notFound.link}
          </Link>
        </div>
      </div>
    </main>
  );
}
