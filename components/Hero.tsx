"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] sm:h-screen sm:min-h-screen flex items-end justify-start overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pb-20">
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
        {/* Very subtle architectural scrim ensuring crisp text readability while keeping the photography luminous */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/60 via-[#171615]/20 via-28% to-transparent sm:from-[#171615]/55 sm:via-[#171615]/14 sm:via-26% sm:to-transparent" />
      </div>

      {/* Hero Content Container - Positioned toward lower-left with generous breathing room */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-[#FAF8F5]">
        <div className="max-w-2xl sm:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Primary Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
            className="font-serif text-[32px] sm:text-[44px] md:text-5xl lg:text-[62px] xl:text-[68px] font-light tracking-tight leading-[1.08] sm:leading-[1.04] text-[#FAF8F5]"
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
            className="max-w-[340px] sm:max-w-lg lg:max-w-xl text-[13px] sm:text-base text-[#DFD9CF]/95 font-light leading-relaxed"
          >
            Thoughtful interiors shaped by light, material and the way you live.
          </motion.p>

          {/* Dual Action CTAs - Refined architectural proportions & subtle borders */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2"
          >
            {/* Primary CTA */}
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 h-[42px] sm:h-[44px] px-6 text-[11px] sm:text-[11.5px] font-medium tracking-[0.16em] uppercase text-[#171615] bg-[#FAF8F5] hover:bg-white active:bg-[#ECE7DF] active:scale-[0.99] transition-all duration-200 border border-[#FAF8F5] group"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>

            {/* Secondary CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-[42px] sm:h-[44px] px-6 text-[11px] sm:text-[11.5px] font-medium tracking-[0.16em] uppercase text-[#FAF8F5] border border-[#FAF8F5]/40 hover:border-[#FAF8F5] hover:bg-[#FAF8F5]/10 active:bg-[#FAF8F5]/20 active:scale-[0.99] transition-all duration-200 group"
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
