import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { StructuredData } from "@/components/ui/StructuredData";
import { meta, site } from "@/content/copy";
import "./globals.css";

/*
 * Hanken Grotesk: an open source (SIL OFL) grotesque sans, so it is free to
 * license and self-host. It is neutral and calm at display sizes, stays clear
 * at 18px body size, and ships as one variable file. next/font self-hosts it
 * at build time, so there is no request to Google from the visitor's browser
 * and no layout shift (size-adjusted fallback).
 */
const grotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-grotesk",
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
  themeColor: "#FAFAF8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={grotesk.variable}>
      <body>
        <StructuredData />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
