"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export function CalculatorCTA() {
  return (
    <section className="py-10 sm:py-16 bg-[#FAF8F5] border-t border-[#ECE7DF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-[#171615] text-[#FAF8F5] p-5 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-8 border border-[#171615]">
          {/* Subtle architectural background texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Left Content */}
          <div className="relative z-10 max-w-xl space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-[11px] tracking-[0.22em] sm:tracking-[0.25em] uppercase text-[#DFD9CF]/70 font-medium">
              <Calculator className="w-3.5 h-3.5 text-[#DFD9CF]" />
              <span>Cost Estimator</span>
            </div>

            <h2 className="font-serif text-[31px] sm:text-3xl lg:text-4xl font-light text-[#FAF8F5] tracking-tight">
              Plan Your Project
            </h2>

            <p className="text-[15.5px] sm:text-sm text-[#DFD9CF]/80 font-light leading-relaxed">
              Get an accurate estimate based on your project type, area and design preferences.
            </p>
          </div>

          {/* Right Action Button (Primary CTA) */}
          <div className="relative z-10 shrink-0 pt-1 md:pt-0">
            <Link
              href="/calculator"
              className="w-full sm:w-auto btn-primary-light group text-[14px] sm:text-xs tracking-wider uppercase font-semibold !h-12 sm:!h-11 justify-center"
            >
              <span>CALCULATE ESTIMATE</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
