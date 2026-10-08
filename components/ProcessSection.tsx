"use client";

import React from "react";
import { PROCESS_STEPS } from "@/data/content";

export function ProcessSection() {
  return (
    <section id="process" className="py-12 sm:py-18 bg-[#FAF8F5] border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="space-y-1 border-b border-[#ECE7DF] pb-4">
          <p className="text-xs sm:text-[11px] font-sans tracking-[0.22em] sm:tracking-[0.28em] uppercase text-[#8C877E] font-medium">
            METHODOLOGY
          </p>
          <h2 className="font-serif text-[32px] sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
            Our Process
          </h2>
        </div>

        {/* 4 Premium Process Cards with Compact Mobile Height and Surface Contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="group p-5 sm:p-6 bg-white border border-[#ECE7DF] flex flex-col justify-between transition-all duration-300 hover:border-[#171615]/40 hover:shadow-[0_8px_20px_rgba(23,22,21,0.05)] active:scale-[0.99] space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
                  <span className="font-mono text-xs tracking-widest text-[#171615] font-semibold bg-[#FAF8F5] px-2 py-0.5 border border-[#ECE7DF]">
                    {step.step}
                  </span>
                  <span className="text-xs sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8C877E] font-medium">
                    Phase
                  </span>
                </div>

                <h3 className="font-serif text-[21px] sm:text-xl font-light text-[#171615] tracking-wide pt-3 group-hover:text-[#5A5752] transition-colors leading-snug">
                  {step.title}
                </h3>
              </div>

              <p className="text-[15.5px] sm:text-[13px] text-[#5A5752] font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
