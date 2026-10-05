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
      <div className="divide-y divide-[#ECE7DF] border-y border-[#ECE7DF]">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          const contentId = `faq-full-panel-${faq.id}`;
          const buttonId = `faq-full-btn-${faq.id}`;

          return (
            <div key={faq.id} className="py-5 sm:py-6">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggle(faq.id)}
                className="w-full min-h-[44px] flex items-start sm:items-center justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] px-1 transition-colors"
              >
                <div className="space-y-1 pr-2">
                  <span className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#8C877E] font-medium">
                    {faq.category}
                  </span>
                  <span className="block font-serif text-lg sm:text-xl lg:text-2xl text-[#171615] font-light group-hover:text-[#5A5752] transition-colors">
                    {faq.question}
                  </span>
                </div>

                <span className="shrink-0 mt-1 sm:mt-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#ECE7DF] group-hover:border-[#171615] transition-colors">
                  <Plus
                    aria-hidden="true"
                    className={`w-4 h-4 text-[#5A5752] transition-transform duration-200 ease-out ${
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
                  isOpen ? "max-h-96 opacity-100 pt-4 pb-2" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm sm:text-base text-[#5A5752] font-light leading-relaxed px-1 pr-6 sm:pr-12 max-w-3xl">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atelier Consultation Inquiry Prompt */}
      <div className="p-8 sm:p-10 bg-[#F4F1EA] border border-[#ECE7DF] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#8C877E] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#8C877E]" />
            <span>Personalized Guidance</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171615] font-light">
            Have a project with distinct requirements?
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
            Every architectural and interior commission begins with a conversation.
            Share your project parameters with our studio for tailored insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#171615] text-[#171615] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#ECE7DF] transition-colors whitespace-nowrap text-center"
          >
            <span>Cost Calculator</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#171615] text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#32302D] transition-colors whitespace-nowrap text-center group"
          >
            <span>Contact Atelier</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
