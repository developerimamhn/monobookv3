import type { MetadataRoute } from "next";
import { site } from "@/content/copy";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${site.url}/`, lastModified },
    { url: `${site.url}/privacy/`, lastModified },
  ];
}
