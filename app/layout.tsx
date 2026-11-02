import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { StructuredData } from "@/components/ui/StructuredData";
import { meta, site } from "@/content/copy";
import "./globals.css";

/*
 * The two typefaces from the MonoBook brand guideline (Figma, pages 14 and 15):
 * Inter for headings and brand areas, Manrope for paragraphs and short text.
 * Both are open source (SIL OFL) variable fonts. next/font self-hosts them at
 * build time, so there is no request to Google from the visitor's browser and
 * no layout shift (size-adjusted fallbacks).
 */
const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: meta.title,
  description: meta.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
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
    images: ["/og.png"],
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
