import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCostCalculator } from "@/components/ProjectCostCalculator";

export const metadata: Metadata = {
  title: "Project Cost Calculator | DESIGN TEMPTATION",
  description:
    "Estimate your interior design, architecture or turnkey project cost with the DESIGN TEMPTATION project cost calculator.",
  openGraph: {
    title: "Project Cost Calculator | DESIGN TEMPTATION",
    description:
      "Estimate your interior design, architecture or turnkey project cost with the DESIGN TEMPTATION project cost calculator.",
  },
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Content */}
      <main className="flex-1 pt-22 sm:pt-30 lg:pt-32 pb-14 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-10">
          {/* Breadcrumb / Back Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* Page Title & Subtitle */}
          <div className="border-b border-[#ECE7DF] pb-5 sm:pb-8 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#171615] text-[#FAF8F5] text-[10px] tracking-[0.25em] uppercase font-medium">
              <Calculator className="w-3 h-3" />
              <span>Investment Estimation</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#171615] font-light tracking-tight">
              Project Cost Calculator
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
              Get an accurate estimate based on your project requirements and spatial scope.
            </p>
          </div>

          {/* Interactive Calculator Component */}
          <ProjectCostCalculator />
        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
