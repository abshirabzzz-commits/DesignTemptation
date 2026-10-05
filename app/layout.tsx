import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://designtemptation.com"),
  title: "DESIGN TEMPTATION | INTERIORS & ARCHITECTURE",
  description:
    "DESIGN TEMPTATION is an interior design and architecture studio shaping thoughtful spaces through light, materiality, and enduring spatial proportion.",
  openGraph: {
    title: "DESIGN TEMPTATION | INTERIORS & ARCHITECTURE",
    description:
      "Interior design and architecture studio shaping thoughtful spaces through light, materiality, and enduring spatial proportion.",
    type: "website",
    siteName: "DESIGN TEMPTATION",
    images: [
      {
        url: "/images/hero/hero-main.jpg",
        width: 1920,
        height: 1080,
        alt: "DESIGN TEMPTATION - INTERIORS & ARCHITECTURE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DESIGN TEMPTATION | INTERIORS & ARCHITECTURE",
    description:
      "Interior design and architecture studio shaping thoughtful spaces through light, materiality, and enduring spatial proportion.",
    images: ["/images/hero/hero-main.jpg"],
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
    "alternateName": "DESIGN TEMPTATION - INTERIORS & ARCHITECTURE",
    "description":
      "DESIGN TEMPTATION is an interior design and architecture studio shaping thoughtful spaces through light, materiality, and enduring spatial proportion.",
    "url": "https://designtemptation.com",
    "logo": "https://designtemptation.com/images/brand/design-temptation-logo.png",
    "image": "https://designtemptation.com/images/hero/hero-main.jpg",
    "telephone": "+91 98200 12345",
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

