"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] sm:h-screen sm:min-h-screen flex items-center justify-center sm:items-end sm:justify-start overflow-hidden pt-20 sm:pt-28 pb-12 sm:pb-16 lg:pb-20">
      {/* Background Hero Image with natural, photographic editorial clarity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="Serene double-height warm minimalist living interior with limestone and timber architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.01]"
        />
        {/* Subtle architectural scrim ensuring crisp text readability while keeping the photography luminous */}
        <div className="absolute inset-0 bg-[#171615]/30 sm:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/75 via-[#171615]/30 via-40% to-[#171615]/25 sm:from-[#171615]/55 sm:via-[#171615]/14 sm:via-26% sm:to-transparent" />
      </div>

      {/* Hero Content Container - Center-aligned on mobile, bottom-left on desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-[#FAF8F5]">
        <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto sm:mx-0 text-center sm:text-left flex flex-col items-center sm:items-start space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Primary Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
            className="w-full text-center sm:text-left font-serif text-[35px] sm:text-[44px] md:text-5xl lg:text-[62px] xl:text-[68px] font-light tracking-tight leading-[1.12] sm:leading-[1.04] text-[#FAF8F5]"
          >
            Spaces Designed
            <br />
            <span className="italic font-normal">Around You.</span>
          </motion.h1>

          {/* Short Supporting Editorial Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
            className="w-full max-w-[340px] sm:max-w-lg lg:max-w-xl text-center sm:text-left text-[16px] sm:text-base text-[#DFD9CF] font-light leading-relaxed mx-auto sm:mx-0"
          >
            Thoughtful interiors shaped by light, material and the way you live.
          </motion.p>

          {/* Dual Action CTAs - Centered & balanced on mobile, horizontal on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3.5 pt-3 sm:pt-2 w-full sm:w-auto mx-auto sm:mx-0"
          >
            {/* Primary CTA */}
            <a
              href="#projects"
              className="btn-primary-light group w-full max-w-[280px] sm:w-auto !h-[48px] sm:!h-[44px] px-6 text-[14px] sm:text-xs uppercase tracking-[0.14em] font-semibold justify-center text-center shadow-sm"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>

            {/* Secondary CTA */}
            <Link
              href="/contact"
              className="btn-secondary-light group w-full max-w-[280px] sm:w-auto !h-[48px] sm:!h-[44px] px-6 text-[14px] sm:text-xs uppercase tracking-[0.14em] font-semibold sm:font-medium justify-center text-center backdrop-blur-xs"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
