"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export function CalculatorCTA() {
  return (
    <section className="py-14 sm:py-16 bg-[#FAF8F5] border-t border-[#ECE7DF]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="bg-[#171615] text-[#FAF8F5] p-8 sm:p-10 lg:p-12 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border border-[#171615]">
          {/* Subtle architectural background texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Left Content */}
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#DFD9CF]/70 font-medium">
              <Calculator className="w-3.5 h-3.5 text-[#DFD9CF]" />
              <span>Cost Estimator</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#FAF8F5] tracking-tight">
              Plan Your Project
            </h2>

            <p className="text-sm sm:text-base text-[#DFD9CF]/80 font-light leading-relaxed">
              Get a quick estimate based on your project type, area and design preferences.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="relative z-10 shrink-0">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#FAF8F5] text-[#171615] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white active:bg-[#DFD9CF] transition-colors group"
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
