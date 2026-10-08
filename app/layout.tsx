import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DESIGN TEMPTATION | Interiors & Architecture",
    template: "%s | DESIGN TEMPTATION",
  },
  description:
    "DESIGN TEMPTATION is an interior design and architecture studio in Bengaluru shaping thoughtful residential and commercial spaces through light, materiality, and turnkey execution.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DESIGN TEMPTATION | Interiors & Architecture",
    description:
      "Interior design and architecture studio in Bengaluru shaping thoughtful residential and commercial spaces through light, materiality, and turnkey execution.",
    type: "website",
    siteName: "DESIGN TEMPTATION",
    locale: "en_IN",
    url: SITE_URL,
    images: [
      {
        url: "/images/hero/hero-main.jpg",
        width: 1920,
        height: 1080,
        alt: "DESIGN TEMPTATION — Interiors & Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DESIGN TEMPTATION | Interiors & Architecture",
    description:
      "Interior design and architecture studio in Bengaluru shaping thoughtful residential and commercial spaces through light, materiality, and turnkey execution.",
    images: ["/images/hero/hero-main.jpg"],
  },
  icons: {
    icon: [
      { url: "/images/brand/design-temptation-logo.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/images/brand/design-temptation-logo.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "DESIGN TEMPTATION",
    "alternateName": "DESIGN TEMPTATION — INTERIORS & ARCHITECTURE",
    "description":
      "DESIGN TEMPTATION is an interior design and architecture studio in Bengaluru shaping thoughtful residential and commercial spaces through light, materiality, and turnkey execution.",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/brand/design-temptation-logo.png`,
    "image": `${SITE_URL}/images/hero/hero-main.jpg`,
    "email": "enquiries@designtemptation.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "101, Halasahalli Rd, Kavery Nagar",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560087",
      "addressCountry": "IN"
    },
    "hasMap": "https://maps.app.goo.gl/JMVT86tY1W3Zc6e79?g_st=iw"
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF8F5] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-[#FAF8F5]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

