"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section id="contact" className="relative py-12 sm:py-20 lg:py-24 overflow-hidden bg-[#171615] text-[#FAF8F5]">
      {/* Background Atmosphere Image with Restrained Editorial Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta/cta-atmosphere.jpg"
          alt="Serene living space with textured materials and afternoon sunlight"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-[#171615]/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-4 sm:space-y-6">
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#FAF8F5]">
          Have a project in mind?
        </h2>

        <p className="max-w-md mx-auto text-xs sm:text-base text-[#DFD9CF]/85 font-light leading-relaxed">
          Let&apos;s create something thoughtful together.
        </p>

        <div className="pt-1 sm:pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 h-11 px-7 text-xs font-semibold tracking-[0.16em] uppercase text-[#171615] bg-[#FAF8F5] hover:bg-white active:bg-[#ECE7DF] active:scale-[0.98] transition-all group shadow-sm"
          >
            <span>START A PROJECT</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#DFD9CF]/60 pt-1">
          Bengaluru Atelier • Global Commissions
        </p>
      </div>
    </section>
  );
}
