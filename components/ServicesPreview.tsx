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
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              DISCIPLINES
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#171615]">
              Services
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 group self-start sm:self-auto"
          >
            <span>View Services</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Clean Editorial Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
          {services.map((service) => (
            <Link
              key={service.number}
              href={service.href}
              className="group p-4 sm:p-6 bg-white border border-[#ECE7DF] hover:border-[#171615]/40 transition-all duration-300 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE7DF]/80">
                  <span className="font-mono text-xs tracking-widest text-[#8C877E] font-medium">
                    {service.number}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8C877E] group-hover:text-[#171615] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-light tracking-wide pt-2 group-hover:text-[#5A5752] transition-colors">
                  {service.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
