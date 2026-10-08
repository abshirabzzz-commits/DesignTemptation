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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#ECE7DF] pb-4">
          <div className="space-y-1">
            <p className="text-xs sm:text-[11px] font-sans tracking-[0.22em] sm:tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              DISCIPLINES
            </p>
            <h2 className="font-serif text-[32px] sm:text-3xl lg:text-4xl font-light text-[#171615]">
              Services
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[13px] sm:text-xs uppercase tracking-[0.16em] font-semibold sm:font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1.5 min-h-[40px] sm:min-h-0 group self-start sm:self-auto"
          >
            <span>View Services</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Clean Editorial Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => (
            <Link
              key={service.number}
              href={service.href}
              className="group p-5 sm:p-7 bg-white border border-[#ECE7DF] hover:border-[#171615]/40 hover:shadow-[0_8px_24px_rgba(23,22,21,0.06)] active:scale-[0.99] transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#ECE7DF]">
                  <span className="font-mono text-[13px] sm:text-xs tracking-widest text-[#8C877E] font-medium group-hover:text-[#171615] transition-colors">
                    {service.number}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8C877E] group-hover:text-[#171615] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="font-serif text-[22px] sm:text-2xl text-[#171615] font-light tracking-wide group-hover:text-[#5A5752] transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-[15.5px] sm:text-[13px] text-[#5A5752] font-light leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ECE7DF] flex items-center justify-between text-[13px] sm:text-[11.5px] uppercase tracking-[0.16em] font-semibold sm:font-medium text-[#171615] group-hover:text-[#5A5752] transition-colors min-h-[38px] sm:min-h-0">
                <span>Explore Scope</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
