import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function StudioSection() {
  return (
    <section id="studio" className="py-24 sm:py-32 bg-[#F4F1EA] border-y border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Studio Atelier Image */}
          <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[1.1/1] w-full overflow-hidden bg-[#ECE7DF] shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
            <Image
              src="/images/studio/studio-atelier.jpg"
              alt="DESIGN TEMPTATION material atelier with stone samples, architectural plans, and natural light"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3 py-1.5 bg-[#FAF8F5]/90 backdrop-blur-sm text-[11px] font-sans tracking-[0.2em] uppercase text-[#171615]">
              Atelier & Material Studies
            </div>
          </div>

          {/* Right: Studio Editorial Statement */}
          <div className="lg:col-span-6 space-y-8 lg:pl-6">
            <div className="space-y-4">
              <p className="text-[11px] font-sans tracking-[0.28em] uppercase font-medium text-[#8C877E]">
                STUDIO
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] leading-[1.15]">
                Designing interiors
                <br />
                <span className="italic font-normal">with intention.</span>
              </h2>
            </div>

            <div className="space-y-5 text-[15.5px] sm:text-base text-[#5A5752] font-light leading-relaxed">
              <p>
                At DESIGN TEMPTATION, we believe true luxury is quiet. It lives in the unhurried
                dialogue between structural clarity, honest materiality, and the choreography of
                natural daylight across a room.
              </p>
              <p>
                Founded on architectural rigor, our studio conceives private residential
                villas and bespoke environments with architectural discipline. We bypass fleeting trends in pursuit of
                spaces that feel timeless on the day of completion—and even richer twenty years
                later.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#philosophy"
                className="btn-primary group"
              >
                <span>Discover the Studio</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Subtle Atelier Key Facts */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#ECE7DF]">
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#8C877E] block mb-1">
                  Discipline
                </span>
                <span className="font-serif text-lg text-[#171615]">
                  Architecture & Interiors
                </span>
              </div>
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#8C877E] block mb-1">
                  Studio Location
                </span>
                <span className="font-serif text-lg text-[#171615]">
                  Bengaluru, Karnataka
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
