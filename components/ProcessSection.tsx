"use client";

import React from "react";
import { PROCESS_STEPS } from "@/data/content";

export function ProcessSection() {
  return (
    <section id="process" className="py-12 sm:py-18 bg-[#FAF8F5] border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="space-y-1 border-b border-[#ECE7DF] pb-4">
          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
            METHODOLOGY
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
            Our Process
          </h2>
        </div>

        {/* 4 Premium Process Cards with Compact Mobile Height and Surface Contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="group p-4 sm:p-6 bg-white border border-[#ECE7DF] flex flex-col justify-between transition-all duration-300 hover:border-[#171615]/40"
            >
              <div>
                <span className="font-mono text-xs tracking-widest text-[#8C877E] block pb-2.5 border-b border-[#ECE7DF]/80 font-medium">
                  {step.step}
                </span>

                <h3 className="font-serif text-base sm:text-lg font-light text-[#171615] tracking-wide pt-2.5 group-hover:text-[#5A5752] transition-colors">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed pt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
