import React from "react";
import Link from "next/link";
import { ArrowLeft, Star, ArrowRight } from "lucide-react";
import { REVIEWS } from "@/data/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12 sm:space-y-16">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          {/* Page Heading */}
          <div className="border-b border-[#ECE7DF] pb-6 space-y-3">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              CLIENT TESTIMONIALS
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-light">
              REVIEWS & COMMENDATIONS
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
              Perspectives from private homeowners and patrons on their architectural and interior commissions with DESIGN TEMPTATION.
            </p>
          </div>

          {/* Reviews List */}
          <div className="space-y-8 sm:space-y-10">
            {REVIEWS.map((review) => (
              <article
                key={review.id}
                className="p-6 sm:p-8 bg-[#F4F1EA] border border-[#ECE7DF] space-y-4"
              >
                <div className="flex items-center gap-1 text-[#171615]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#171615] stroke-[#171615]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="font-serif text-lg sm:text-xl text-[#171615] font-light leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="pt-2 border-t border-[#ECE7DF]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-medium tracking-wide uppercase text-[#171615]">
                    {review.clientName}
                  </span>
                  <span className="text-[#8C877E] font-light">
                    {review.projectType}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Action CTA */}
          <div className="p-8 bg-[#171615] text-[#FAF8F5] text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-light">
              Begin Your Commission
            </h2>
            <p className="text-xs sm:text-sm text-[#DFD9CF]/80 max-w-md mx-auto">
              Our studio welcomes inquiries for bespoke residential and commercial transformations.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF8F5] text-[#171615] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#FAF8F5]/90 transition-colors"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
