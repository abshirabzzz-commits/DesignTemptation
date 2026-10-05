"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { REVIEWS } from "@/data/content";

export function MovingReviews() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate reviews array to create an infinite, seamless loop
  const marqueeReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-12 sm:py-18 lg:py-20 bg-[#F7F5F0] border-b border-[#ECE7DF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#ECE7DF] pb-4">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              TESTIMONIALS
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#171615] tracking-tight">
              Client Perspectives
            </h2>
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 group self-start sm:self-auto"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Container */}
      <div
        className="w-full max-w-full relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Soft edge masking gradients for editorial continuity */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-16 z-10 bg-gradient-to-r from-[#F7F5F0] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-16 z-10 bg-gradient-to-l from-[#F7F5F0] to-transparent pointer-events-none" />

        <div
          className="animate-marquee flex gap-4 sm:gap-6 pl-4 sm:pl-8"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {marqueeReviews.map((rev, index) => (
            <article
              key={`${rev.id}-${index}`}
              className="w-[270px] sm:w-[340px] lg:w-[380px] shrink-0 p-4 sm:p-6 bg-white border border-[#ECE7DF] flex flex-col justify-between space-y-3.5 select-none hover:border-[#171615]/30 transition-colors"
            >
              {/* Star Rating */}
              <div
                className="flex items-center gap-1 text-[#171615]"
                aria-label={`Rated ${rev.rating} out of 5 stars`}
              >
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#171615] stroke-[#171615]"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review Quote */}
              <blockquote className="font-serif text-sm sm:text-base text-[#171615] font-light leading-relaxed line-clamp-4">
                &ldquo;{rev.quote}&rdquo;
              </blockquote>

              {/* Client Info with Monogram Avatar */}
              <div className="pt-2.5 border-t border-[#ECE7DF]/80 flex items-center gap-2.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#171615] text-[#FAF8F5] text-[10px] font-mono flex items-center justify-center shrink-0">
                  {rev.clientName.charAt(0)}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <p className="font-sans text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-[#171615] truncate">
                    {rev.clientName}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#8C877E] font-light truncate">
                    {rev.projectType}
                    {rev.location ? ` · ${rev.location}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#8C877E] tracking-widest uppercase pt-5">
        (Sample Testimonials · Real Commissions)
      </p>
    </section>
  );
}
