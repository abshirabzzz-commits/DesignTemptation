import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SERVICES } from "@/data/content";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-20 sm:space-y-28">
          {/* Header & Breadcrumb */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Homepage</span>
            </Link>

            <div className="border-b border-[#ECE7DF] pb-8 space-y-3">
              <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
                OUR SERVICES
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#171615] font-light leading-[1.08]">
                Design & Architecture
                <br />
                <span className="italic font-normal">for Every Space.</span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed pt-2">
                Provisional service disciplines encompassing residential architecture, private villa interiors,
                commercial hospitality, and master turnkey execution.
              </p>
            </div>
          </div>

          {/* Service Disciplines In-Depth */}
          <div className="space-y-20">
            {SERVICES.map((service, idx) => (
              <div
                key={service.id}
                id={service.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-12 border-t border-[#ECE7DF] ${
                  idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image side */}
                <div
                  className={`lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#ECE7DF] shadow-[0_12px_40px_rgba(0,0,0,0.03)] ${
                    idx % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#FAF8F5]/90 backdrop-blur-sm text-[10px] font-mono tracking-widest text-[#171615]">
                    DISCIPLINE 0{idx + 1}
                  </div>
                </div>

                {/* Content side */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    idx % 2 === 1 ? "lg:order-1 lg:pr-8" : "lg:pl-8"
                  }`}
                >
                  <div className="space-y-2">
                    <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#8C877E] font-medium">
                      {service.subtitle}
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
                    {service.description}
                  </p>

                  {service.disciplines && (
                    <div className="space-y-2.5 pt-2">
                      <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8C877E]">
                        Key Engagements
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#32302D]">
                        {service.disciplines.map((d) => (
                          <div key={d} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#8C877E]" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#32302D] transition-colors group"
                    >
                      <span>Enquire Regarding {service.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Commissioning Banner */}
          <div className="bg-[#F4F1EA] p-8 sm:p-12 border border-[#ECE7DF] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#171615]">Looking for a bespoke scope?</h3>
              <p className="text-xs sm:text-sm text-[#5A5752] font-light">
                Our atelier handles tailored international commissions combining architectural and interior disciplines.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#171615] text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.16em] hover:bg-[#32302D] transition-colors shrink-0"
            >
              <span>Commence A Dialogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
