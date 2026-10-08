import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FAQS } from "@/data/faqs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about DESIGN TEMPTATION's interior design, architecture, turnkey execution, process, and project pricing.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | DESIGN TEMPTATION",
    description:
      "Find answers to common questions about DESIGN TEMPTATION's interior design, architecture, turnkey execution, process, and project pricing.",
    type: "website",
    url: "/faq",
    images: [
      {
        url: "/images/hero/hero-main.jpg",
        width: 1920,
        height: 1080,
        alt: "DESIGN TEMPTATION Frequently Asked Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | DESIGN TEMPTATION",
    description:
      "Find answers to common questions about DESIGN TEMPTATION's interior design, architecture, turnkey execution, process, and project pricing.",
    images: ["/images/hero/hero-main.jpg"],
  },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10 sm:space-y-14">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          {/* Page Heading */}
          <div className="border-b border-[#ECE7DF] pb-6 space-y-3">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              CLIENT ASSISTANCE & OVERVIEW
            </p>
            <h1 className="font-serif text-[32px] sm:text-5xl lg:text-6xl text-[#171615] font-light tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="max-w-xl text-[15.5px] sm:text-base text-[#5A5752] font-light leading-relaxed">
              Clear answers regarding our architectural methodology, engagement timelines, and turnkey interior commissions.
            </p>
          </div>

          {/* Interactive FAQ Client */}
          <FAQClient faqs={FAQS} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
