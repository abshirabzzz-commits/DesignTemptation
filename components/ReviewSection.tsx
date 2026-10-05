"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { FEATURED_REVIEW } from "@/data/content";

export function ReviewSection() {
  return (
    <section id="reviews" className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-[#ECE7DF]">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-5">
        {/* Rating Stars */}
        <div
          className="flex items-center justify-center gap-1 text-[#171615]"
          aria-label="Rated 5 out of 5 stars"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-[#171615] stroke-[#171615]"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Short Testimonial Quote */}
        <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#171615] font-light leading-relaxed">
          &ldquo;{FEATURED_REVIEW.quote}&rdquo;
        </blockquote>

        {/* Client Name & Project Info */}
        <div className="space-y-0.5 pt-1">
          <p className="font-sans text-xs tracking-[0.16em] uppercase font-medium text-[#171615]">
            {FEATURED_REVIEW.clientName}
          </p>
          <p className="text-xs text-[#8C877E] font-light">
            {FEATURED_REVIEW.projectType}
          </p>
          <p className="text-[10px] text-[#8C877E]/80 tracking-widest uppercase pt-1">
            (Sample Testimonial)
          </p>
        </div>

        {/* View All Reviews Link */}
        <div className="pt-2">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 group"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
