"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { HOMEPAGE_FAQS } from "@/data/faqs";

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-preview-heading"
      className="py-12 sm:py-18 bg-[#FAF8F5] border-t border-[#ECE7DF]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase font-semibold text-[#8C877E]">
            INQUIRIES & CLARITY
          </p>
          <h2
            id="faq-preview-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#171615] tracking-tight"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
            Answers to common queries regarding architectural scopes and commissions.
          </p>
        </div>

        {/* Compact Accordion Questions */}
        <div className="space-y-2.5 sm:space-y-3">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-preview-panel-${faq.id}`;
            const buttonId = `faq-preview-btn-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`border transition-all duration-200 ${
                  isOpen
                    ? "bg-white border-[#171615]/40"
                    : "bg-white/80 border-[#ECE7DF] hover:border-[#8C877E]/60"
                }`}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(index)}
                  className="w-full min-h-[44px] p-3 sm:p-4 flex items-center justify-between gap-3 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] cursor-pointer"
                >
                  <span className="font-serif text-sm sm:text-base text-[#171615] group-hover:text-[#5A5752] transition-colors leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${
                      isOpen
                        ? "border-[#171615] bg-[#171615] text-[#FAF8F5]"
                        : "border-[#ECE7DF] text-[#5A5752]"
                    }`}
                  >
                    <Plus
                      aria-hidden="true"
                      className={`w-3 h-3 transition-transform duration-200 ease-out ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-200 ease-out px-3 sm:px-4 ${
                    isOpen
                      ? "max-h-96 opacity-100 pb-3.5 pt-1 border-t border-[#ECE7DF]/60"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All FAQs Secondary Action Button */}
        <div className="text-center pt-1">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#171615]/30 hover:border-[#171615] text-[#171615] text-[11px] sm:text-xs uppercase tracking-[0.16em] font-medium transition-all group active:scale-[0.98]"
          >
            <span>VIEW ALL FAQs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
