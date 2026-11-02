import { footer, meta, site } from "@/content/copy";

/** schema.org data for search engines. Facts from the brief only. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    founder: { "@type": "Person", name: site.owner },
    description: meta.description,
    areaServed: "GB",
    address: {
      "@type": "PostalAddress",
      streetAddress: footer.postal.street,
      addressLocality: footer.postal.locality,
      postalCode: footer.postal.postalCode,
      addressRegion: footer.postal.region,
      addressCountry: footer.postal.country,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
