"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutPreview() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="studio" className="py-14 sm:py-18 lg:py-20 bg-[#FAF8F5] border-y border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Strong Studio / Atelier Image with priority loading & fallback */}
          <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] max-h-[360px] sm:max-h-none w-full overflow-hidden bg-[#ECE7DF]">
            {!imageError ? (
              <Image
                src="/images/studio/studio-atelier.jpg"
                alt="DESIGN TEMPTATION interior studio atelier and materiality archives"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.02]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F4F1EA]">
                <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#8C877E]">
                  Studio Atelier
                </span>
                <span className="font-serif text-lg text-[#171615] font-light pt-1">
                  Materiality &amp; Architectural Archives
                </span>
              </div>
            )}
          </div>

          {/* Right: Short Editorial Studio Teaser */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 lg:pl-4">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              DESIGN TEMPTATION
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#171615] leading-[1.2] tracking-tight">
              Thoughtful interiors and architecture shaped around how you live.
            </h2>

            <p className="text-sm sm:text-base text-[#5A5752] font-light leading-relaxed max-w-lg">
              Founded on architectural discipline, DESIGN TEMPTATION crafts bespoke private residences
              and curated environments through natural diurnal light, enduring materiality, and spatial clarity.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 group"
              >
                <span>Discover Our Studio</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
