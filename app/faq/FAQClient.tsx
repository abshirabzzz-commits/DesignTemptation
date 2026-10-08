"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { FAQItem, FAQ_CATEGORIES, FAQCategory } from "@/data/faqs";

interface FAQClientProps {
  faqs: FAQItem[];
}

export function FAQClient({ faqs }: FAQClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === "All") return faqs;
    return faqs.filter((faq) => faq.category === selectedCategory);
  }, [faqs, selectedCategory]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Category Filter Navigation */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-[#ECE7DF] pb-4">
        {FAQ_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          const count =
            category === "All"
              ? faqs.length
              : faqs.filter((f) => f.category === category).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs uppercase tracking-[0.16em] px-3.5 py-2 transition-all min-h-[40px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] ${
                isActive
                  ? "bg-[#171615] text-[#FAF8F5] font-medium"
                  : "bg-transparent text-[#5A5752] hover:text-[#171615] hover:bg-[#ECE7DF]/40"
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-[10px] ${
                  isActive ? "text-[#DFD9CF]/70" : "text-[#8C877E]"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3 sm:space-y-3.5">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          const contentId = `faq-full-panel-${faq.id}`;
          const buttonId = `faq-full-btn-${faq.id}`;

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
                onClick={() => toggle(faq.id)}
                className="w-full min-h-[50px] p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] cursor-pointer"
              >
                <div className="space-y-1 pr-2">
                  <span className="block text-xs sm:text-[10px] font-sans tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#8C877E] font-medium">
                    {faq.category}
                  </span>
                  <span
                    className={`block font-serif text-[18px] sm:text-xl transition-colors leading-snug ${
                      isOpen
                        ? "text-[#171615] font-normal"
                        : "text-[#171615] font-light group-hover:text-[#5A5752]"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                <span
                  className={`shrink-0 mt-1 sm:mt-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 ${
                    isOpen
                      ? "border-[#171615] bg-[#171615] text-[#FAF8F5]"
                      : "border-[#ECE7DF] text-[#5A5752] group-hover:border-[#8C877E]"
                  }`}
                >
                  <Plus
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ease-out ${
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
                <p className="text-[14.5px] sm:text-sm text-[#5A5752] font-light leading-relaxed max-w-3xl">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atelier Consultation Inquiry Prompt */}
      <div className="p-6 sm:p-10 bg-[#F4F1EA] border border-[#ECE7DF] flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[#8C877E] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#8C877E]" />
            <span>Personalized Guidance</span>
          </div>
          <h2 className="font-serif text-[22px] sm:text-3xl text-[#171615] font-light">
            Have a project with distinct requirements?
          </h2>
          <p className="text-[14.5px] sm:text-sm text-[#5A5752] font-light leading-relaxed">
            Every architectural and interior commission begins with a conversation.
            Share your project parameters with our studio for tailored insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/calculator"
            className="btn-secondary"
          >
            <span>Cost Calculator</span>
          </Link>
          <Link
            href="/contact"
            className="btn-primary group"
          >
            <span>Contact Atelier</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
