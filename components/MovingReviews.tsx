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
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F4F1EA] border-b border-[#ECE7DF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#ECE7DF] pb-4">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              TESTIMONIALS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#171615] tracking-tight">
              Client Perspectives
            </h2>
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#8C877E] transition-colors py-1 group self-start sm:self-auto"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Container */}
      <div
        className="w-full relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Soft edge masking gradients for editorial continuity */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 z-10 bg-gradient-to-r from-[#F4F1EA] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 z-10 bg-gradient-to-l from-[#F4F1EA] to-transparent pointer-events-none" />

        <div
          className="animate-marquee flex gap-6 pl-4 sm:pl-8"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {marqueeReviews.map((rev, index) => (
            <article
              key={`${rev.id}-${index}`}
              className="w-[300px] sm:w-[360px] lg:w-[400px] shrink-0 p-6 sm:p-7 bg-[#FAF8F5] border border-[#ECE7DF] flex flex-col justify-between space-y-4 select-none hover:border-[#171615]/30 transition-colors"
            >
              {/* Star Rating */}
              <div
                className="flex items-center gap-1 text-[#171615]"
                aria-label={`Rated ${rev.rating} out of 5 stars`}
              >
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#171615] stroke-[#171615]"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review Quote */}
              <blockquote className="font-serif text-base sm:text-lg text-[#171615] font-light leading-relaxed">
                &ldquo;{rev.quote}&rdquo;
              </blockquote>

              {/* Client Info with Monogram Avatar */}
              <div className="pt-3 border-t border-[#ECE7DF] flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#171615] text-[#FAF8F5] text-[10px] font-mono flex items-center justify-center shrink-0">
                  {rev.clientName.charAt(0)}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <p className="font-sans text-xs tracking-wider uppercase font-medium text-[#171615] truncate">
                    {rev.clientName}
                  </p>
                  <p className="text-[11px] text-[#8C877E] font-light truncate">
                    {rev.projectType}
                    {rev.location ? ` · ${rev.location}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#8C877E] tracking-widest uppercase pt-6">
        (Sample Testimonials · Real Commissions)
      </p>
    </section>
  );
}
