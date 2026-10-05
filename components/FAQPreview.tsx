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
      className="py-16 sm:py-20 bg-[#FAF8F5] border-t border-[#ECE7DF]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
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
            Answers to some common questions about our design process and services.
          </p>
        </div>

        {/* 3 Accordion Questions */}
        <div className="divide-y divide-[#ECE7DF] border-y border-[#ECE7DF]">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-preview-panel-${faq.id}`;
            const buttonId = `faq-preview-btn-${faq.id}`;

            return (
              <div key={faq.id} className="py-4 sm:py-5">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(index)}
                  className="w-full min-h-[44px] flex items-center justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] px-1 transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg text-[#171615] group-hover:text-[#5A5752] transition-colors">
                    {faq.question}
                  </span>
                  <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-[#ECE7DF] group-hover:border-[#171615] transition-colors">
                    <Plus
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-[#5A5752] transition-transform duration-200 ease-out ${
                        isOpen ? "rotate-45 text-[#171615]" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    isOpen ? "max-h-96 opacity-100 pt-3 pb-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed px-1 pr-6 sm:pr-10">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All FAQs Link/Button */}
        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2.5 px-6 py-3 border border-[#171615] text-[#171615] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#171615] hover:text-[#FAF8F5] transition-all group"
          >
            <span>VIEW ALL FAQs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
