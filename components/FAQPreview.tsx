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
          <p className="text-xs sm:text-[11px] font-sans tracking-[0.22em] sm:tracking-[0.28em] uppercase font-semibold text-[#8C877E]">
            INQUIRIES & CLARITY
          </p>
          <h2
            id="faq-preview-heading"
            className="font-serif text-[32px] sm:text-3xl lg:text-4xl font-light text-[#171615] tracking-tight"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-[15.5px] sm:text-sm text-[#5A5752] font-light leading-relaxed">
            Answers to common queries regarding architectural scopes and commissions.
          </p>
        </div>

        {/* Compact Accordion Questions */}
        <div className="space-y-3 sm:space-y-3.5">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-preview-panel-${faq.id}`;
            const buttonId = `faq-preview-btn-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`border transition-all duration-200 ${
                  isOpen
                    ? "bg-white border-[#171615]/50 shadow-[0_4px_16px_rgba(23,22,21,0.04)]"
                    : "bg-white border-[#ECE7DF] hover:border-[#8C877E]/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                }`}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(index)}
                  className="w-full min-h-[50px] p-4 sm:p-5 flex items-center justify-between gap-3 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] cursor-pointer"
                >
                  <span
                    className={`font-serif text-[18px] sm:text-lg transition-colors leading-snug ${
                      isOpen
                        ? "text-[#171615] font-normal"
                        : "text-[#171615] font-light group-hover:text-[#5A5752]"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "border-[#171615] bg-[#171615] text-[#FAF8F5]"
                        : "border-[#ECE7DF] text-[#5A5752] group-hover:border-[#8C877E]"
                    }`}
                  >
                    <Plus
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-200 ease-out px-4 sm:px-5 ${
                    isOpen
                      ? "max-h-96 opacity-100 pb-4 pt-2 border-t border-[#ECE7DF]"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[15.5px] sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All FAQs Secondary Action Button */}
        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="btn-secondary group w-full max-w-[320px] sm:w-auto inline-flex justify-center mx-auto text-[14px] sm:text-xs !h-[48px] sm:!h-[44px]"
          >
            <span>VIEW ALL FAQs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
