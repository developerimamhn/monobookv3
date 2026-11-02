import { deliverables, footer, meta, site } from "@/content/copy";

const id = (name: string) => `${site.url}/#${name}`;

/*
 * schema.org graph for search engines. Organization rather than a LocalBusiness
 * type: the studio is in Bangladesh and serves the UK by email, with no premises
 * to visit. The Eric Dahl quote stays page text only; review markup on your own
 * site is self-serving under Google's rules.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": id("organization"),
        name: site.name,
        alternateName: "MonoBook",
        url: `${site.url}/`,
        email: site.email,
        description: meta.description,
        logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
        image: `${site.url}/og.png`,
        areaServed: { "@type": "Country", name: "United Kingdom", identifier: "GB" },
        address: {
          "@type": "PostalAddress",
          streetAddress: footer.postal.street,
          addressLocality: footer.postal.locality,
          postalCode: footer.postal.postalCode,
          addressRegion: footer.postal.region,
          addressCountry: footer.postal.countryCode,
        },
        contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: site.email, areaServed: "GB", availableLanguage: "en-GB" },
        employee: { "@id": id("owner") },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Brand identity",
          itemListElement: deliverables.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.name, description: item.body },
          })),
        },
      },
      { "@type": "Person", "@id": id("owner"), name: site.owner, jobTitle: "Owner", email: site.email, worksFor: { "@id": id("organization") } },
      { "@type": "WebSite", "@id": id("website"), url: `${site.url}/`, name: site.name, inLanguage: "en-GB", publisher: { "@id": id("organization") } },
    ],
  };
  // "<" is escaped so no string in the copy can close the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
