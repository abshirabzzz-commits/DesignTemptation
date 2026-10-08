import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, ArrowRight } from "lucide-react";
import { REVIEWS } from "@/data/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Client Testimonials & Reviews",
  description:
    "Read client perspectives and testimonials on residential and commercial architectural and interior commissions with DESIGN TEMPTATION.",
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Client Testimonials & Reviews | DESIGN TEMPTATION",
    description:
      "Read client perspectives and testimonials on residential and commercial architectural and interior commissions with DESIGN TEMPTATION.",
    url: "/reviews",
    images: [
      {
        url: "/images/hero/hero-main.jpg",
        width: 1920,
        height: 1080,
        alt: "DESIGN TEMPTATION Client Testimonials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Testimonials & Reviews | DESIGN TEMPTATION",
    description:
      "Read client perspectives and testimonials on residential and commercial architectural and interior commissions with DESIGN TEMPTATION.",
    images: ["/images/hero/hero-main.jpg"],
  },
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-22 sm:pt-30 lg:pt-32 pb-14 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          {/* Page Heading */}
          <div className="border-b border-[#ECE7DF] pb-5 sm:pb-8 space-y-2 sm:space-y-3">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              CLIENT TESTIMONIALS · PREVIEW
            </p>
            <h1 className="font-serif text-[32px] sm:text-4xl lg:text-5xl text-[#171615] font-light tracking-tight">
              REVIEWS &amp; COMMENDATIONS
            </h1>
            <p className="max-w-xl text-[15.5px] sm:text-base text-[#5A5752] font-light leading-relaxed">
              Sample presentation layout for client reviews and commendations. Verified client testimonials will be published upon authorization.
            </p>
          </div>

          {/* Client Preview Notice */}
          <div className="p-4 sm:p-5 bg-[#F4F1EA] border border-[#ECE7DF] text-xs sm:text-[13px] text-[#5A5752] leading-relaxed">
            <span className="font-semibold text-[#171615] uppercase tracking-wider text-[11px] block mb-0.5">
              Client Preview Notice
            </span>
            The testimonials presented below are demonstration items illustrating layout and typography. Genuine client testimonials will be published upon direct authorization.
          </div>

          {/* Reviews List */}
          <div className="space-y-4 sm:space-y-6">
            {REVIEWS.map((review) => (
              <article
                key={review.id}
                className="p-5 sm:p-7 bg-white border border-[#ECE7DF] space-y-3.5 hover:border-[#171615]/35 hover:shadow-[0_6px_20px_rgba(23,22,21,0.04)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#171615]">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#171615] stroke-[#171615]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8C877E] font-mono tracking-wider uppercase bg-[#FAF8F5] px-2 py-0.5 border border-[#ECE7DF]">
                    Sample Preview
                  </span>
                </div>

                <blockquote className="font-serif text-base sm:text-lg lg:text-xl text-[#171615] font-light leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="pt-3 border-t border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-medium tracking-wide uppercase text-[#171615] text-[11px] sm:text-xs">
                    {review.clientName}
                  </span>
                  <span className="text-[#8C877E] font-light text-[11px] sm:text-xs">
                    {review.projectType}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Action CTA */}
          <div className="p-6 sm:p-10 bg-[#171615] text-[#FAF8F5] text-center space-y-3 sm:space-y-4 border border-[#171615]">
            <h2 className="font-serif text-xl sm:text-3xl font-light">
              Begin Your Commission
            </h2>
            <p className="text-xs sm:text-sm text-[#DFD9CF]/80 max-w-md mx-auto">
              Our studio welcomes inquiries for bespoke residential and commercial transformations.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-primary-light group"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
