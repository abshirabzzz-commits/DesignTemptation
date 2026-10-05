import React from "react";
import { PHILOSOPHY_POINTS } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function DesignPhilosophy() {
  return (
    <section id="philosophy" className="py-24 sm:py-32 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16 sm:space-y-20">
        <SectionHeading
          eyebrow="Foundations"
          title="DESIGN PHILOSOPHY"
          description="Four enduring principles guiding every spatial intervention, from initial structural sketches to custom material finishes."
        />

        {/* Numbered Editorial Grid - Not Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 border-t border-[#ECE7DF] pt-12">
          {PHILOSOPHY_POINTS.map((item) => (
            <div
              key={item.number}
              className="group space-y-4 pt-2 transition-all duration-300"
            >
              <div className="flex items-baseline justify-between border-b border-[#ECE7DF] pb-4 group-hover:border-[#171615] transition-colors">
                <span className="font-serif text-3xl sm:text-4xl text-[#8C877E] group-hover:text-[#171615] transition-colors font-light">
                  {item.number}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C877E]">
                  Principle
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <h3 className="font-serif text-xl sm:text-2xl text-[#171615] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#8C877E]">
                  {item.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
