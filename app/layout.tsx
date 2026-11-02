import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { StructuredData } from "@/components/ui/StructuredData";
import { meta, site } from "@/content/copy";
import "./globals.css";

// The guideline's two families: Inter for headings, Manrope for text.
// next/font self-hosts both at build time, so visitors make no request to Google.
const inter = Inter({ subsets: ["latin"], weight: "variable", display: "swap", variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], weight: "variable", display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: meta.title,
  description: meta.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: meta.title,
    description: meta.description,
    locale: site.locale,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: meta.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [{ url: "/og.png", alt: meta.ogAlt }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBFBFB",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <StructuredData />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
