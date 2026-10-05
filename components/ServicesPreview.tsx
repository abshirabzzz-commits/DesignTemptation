"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function ServicesPreview() {
  const services = [
    {
      number: "01",
      title: "Interior Design",
      description: "Bespoke spatial curation, custom millwork, and tactile materiality for private residences.",
      href: "/services",
    },
    {
      number: "02",
      title: "Architecture",
      description: "Harmonious structural volumes, light-wells, and seamless indoor-outdoor connections.",
      href: "/services",
    },
    {
      number: "03",
      title: "Turnkey Execution",
      description: "Artisanal procurement, master craftsmanship coordination, and complete project delivery.",
      href: "/services",
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#ECE7DF] pb-4">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              DISCIPLINES
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#171615]">
              Services
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#8C877E] transition-colors group self-start sm:self-auto"
          >
            <span>View Services</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Clean Editorial List */}
        <div className="divide-y divide-[#ECE7DF] border-y border-[#ECE7DF]">
          {services.map((service) => (
            <Link
              key={service.number}
              href={service.href}
              className="group py-5 sm:py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-3 transition-colors duration-200 hover:bg-[#F4F1EA]/60 px-3 -mx-3"
            >
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="text-xs font-mono text-[#8C877E] tracking-widest shrink-0">
                  {service.number}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#171615] group-hover:text-[#5A5752] transition-colors tracking-wide font-light">
                  {service.title}
                </h3>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pl-10 md:pl-0">
                <p className="text-xs sm:text-sm text-[#5A5752] font-light max-w-md">
                  {service.description}
                </p>
                <ArrowUpRight className="w-4 h-4 text-[#8C877E] group-hover:text-[#171615] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
