import type { MetadataRoute } from "next";
import { site } from "@/content/copy";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "MonoBook",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFBFB",
    theme_color: "#FBFBFB",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
