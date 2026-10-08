import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCostCalculator } from "@/components/ProjectCostCalculator";

export const metadata: Metadata = {
  title: "Project Investment Calculator",
  description:
    "Estimate preliminary investment ranges for residential interior design, architecture, and turnkey execution projects with DESIGN TEMPTATION in Bengaluru.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: {
    title: "Project Investment Calculator | DESIGN TEMPTATION",
    description:
      "Estimate preliminary investment ranges for residential interior design, architecture, and turnkey execution projects with DESIGN TEMPTATION in Bengaluru.",
    url: "/calculator",
    images: [
      {
        url: "/images/hero/hero-main.jpg",
        width: 1920,
        height: 1080,
        alt: "DESIGN TEMPTATION Project Investment Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Investment Calculator | DESIGN TEMPTATION",
    description:
      "Estimate preliminary investment ranges for residential interior design, architecture, and turnkey execution projects with DESIGN TEMPTATION in Bengaluru.",
    images: ["/images/hero/hero-main.jpg"],
  },
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Content */}
      <main className="flex-1 pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Breadcrumb / Back Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors group py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* Page Title & Subtitle */}
          <div className="border-b border-[#ECE7DF] pb-3.5 sm:pb-6 space-y-1.5 sm:space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#171615] text-[#FAF8F5] text-[11px] tracking-[0.25em] uppercase font-medium">
              <Calculator className="w-3 h-3" />
              <span>Investment Estimation</span>
            </div>
            <h1 className="font-serif text-[32px] sm:text-4xl lg:text-5xl text-[#171615] font-light tracking-tight">
              Project Cost Calculator
            </h1>
            <p className="max-w-2xl text-[15.5px] sm:text-base text-[#5A5752] font-light leading-relaxed">
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
