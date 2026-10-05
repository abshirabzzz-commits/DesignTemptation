import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PROJECTS } from "@/data/content";
import { ProjectsGallery } from "@/components/ProjectsGallery";

export const metadata: Metadata = {
  title: "Our Projects | DESIGN TEMPTATION",
  description:
    "A selection of spaces shaped through thoughtful design, material, light and functionality. Explore residential, architectural, and turnkey commissions by DESIGN TEMPTATION.",
  openGraph: {
    title: "Our Projects | DESIGN TEMPTATION",
    description:
      "A selection of spaces shaped through thoughtful design, material, light and functionality.",
    url: "/projects",
    images: [
      {
        url: "/images/projects/project-01-horizontal.jpg",
        width: 1600,
        height: 1100,
        alt: "DESIGN TEMPTATION Architectural Portfolio",
      },
    ],
  },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
          {/* Breadcrumb Navigation */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Elegant Page Header */}
          <div className="border-b border-[#ECE7DF] pb-8 space-y-3">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              PORTFOLIO
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171615] font-light leading-[1.1] tracking-tight">
              Our Projects
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed pt-2">
              A selection of spaces shaped through thoughtful design, material, light and functionality.
            </p>
          </div>

          {/* Interactive Filterable Projects Grid */}
          <ProjectsGallery initialProjects={PROJECTS} />

          {/* Bottom Commissioning CTA */}
          <section className="bg-[#171615] text-[#FAF8F5] p-8 sm:p-12 lg:p-14 border border-[#ECE7DF] flex flex-col md:flex-row md:items-center justify-between gap-8 mt-16">
            <div className="space-y-2 max-w-xl">
              <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#DFD9CF]">
                COMMISSIONING
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF8F5]">
                Have a project in mind?
              </h2>
              <p className="text-xs sm:text-sm text-[#DFD9CF]/80 font-light leading-relaxed">
                We accept commissions across Bengaluru and pan-India for private residences, architectural developments, and bespoke turnkey execution.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FAF8F5] text-[#171615] text-xs font-medium uppercase tracking-[0.16em] hover:bg-[#FAF8F5]/90 transition-colors shrink-0 group"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
