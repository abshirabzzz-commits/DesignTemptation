"use client";

import React from "react";
import { PROCESS_STEPS } from "@/data/content";

export function ProcessSection() {
  return (
    <section id="process" className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="space-y-1 border-b border-[#ECE7DF] pb-4">
          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
            METHODOLOGY
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
            Our Process
          </h2>
        </div>

        {/* 4 Premium Process Cards with Consistent Height and Subtle Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="group p-5 sm:p-7 bg-[#FAF8F5] border border-[#ECE7DF] flex flex-col justify-between min-h-0 sm:min-h-[200px] transition-all duration-300 hover:border-[#171615]/30 hover:bg-[#F4F1EA]/50 hover:-translate-y-0.5"
            >
              <div>
                <span className="font-mono text-xs tracking-widest text-[#8C877E] block pb-4 border-b border-[#ECE7DF]/80">
                  {step.step}
                </span>

                <h3 className="font-serif text-lg sm:text-xl font-light text-[#171615] tracking-wide pt-4 group-hover:text-[#5A5752] transition-colors">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed pt-3">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
