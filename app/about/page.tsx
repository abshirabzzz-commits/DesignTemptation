import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Compass, Layers, Sun, Scale, HeartHandshake } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";
import { BRAND } from "@/data/content";

export const metadata: Metadata = {
  title: "About the Studio",
  description:
    "Discover DESIGN TEMPTATION, an architectural and interior design atelier in Bengaluru crafting enduring residential and commercial spaces through light, materiality, and spatial clarity.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About the Studio | DESIGN TEMPTATION",
    description:
      "A design practice dedicated to residential serenity, architectural discipline, and tactile honesty. Located in Bengaluru, Karnataka, India.",
    url: "/about",
    images: [
      {
        url: "/images/studio/studio-atelier.jpg",
        width: 1600,
        height: 900,
        alt: "DESIGN TEMPTATION Atelier & Material Archive in Bengaluru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About the Studio | DESIGN TEMPTATION",
    description:
      "A design practice dedicated to residential serenity, architectural discipline, and tactile honesty. Located in Bengaluru, Karnataka, India.",
    images: ["/images/studio/studio-atelier.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-20 sm:space-y-28">
          {/* Breadcrumb / Back Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* 1. STUDIO INTRODUCTION                                       */}
          {/* ============================================================ */}
          <section className="space-y-12">
            <div className="border-b border-[#ECE7DF] pb-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171615] text-[#FAF8F5] text-[11px] tracking-[0.25em] uppercase font-medium">
                <span>The Atelier Story</span>
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#171615] font-light leading-[1.08] tracking-tight">
                  DESIGN TEMPTATION
                </h1>
                <p className="font-sans text-xs sm:text-sm tracking-[0.24em] uppercase text-[#8C877E] pt-1">
                  INTERIORS & ARCHITECTURE
                </p>
              </div>
              <p className="max-w-3xl text-base sm:text-lg text-[#5A5752] font-light leading-relaxed pt-2">
                DESIGN TEMPTATION is an interior design and architecture studio dedicated to crafting
                thoughtful, unhurried environments. Founded on architectural rigor and tactile honesty,
                we shape private residences, penthouses, and bespoke commercial spaces through natural diurnal
                light, honest materiality, and spatial clarity.
              </p>
            </div>

            {/* Atelier Photography Feature */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-[#ECE7DF] border border-[#ECE7DF]">
              <Image
                src="/images/studio/studio-atelier.jpg"
                alt="DESIGN TEMPTATION design studio atelier, material archive and spatial drawings"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3.5 py-1.5 bg-[#FAF8F5]/90 backdrop-blur-sm text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase text-[#171615]">
                Atelier & Material Archive • Bengaluru
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. OUR APPROACH                                              */}
          {/* ============================================================ */}
          <section className="space-y-10 sm:space-y-12">
            <div className="space-y-3">
              <p className="text-[11px] font-sans tracking-[0.26em] uppercase text-[#8C877E] font-medium">
                Methodology
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615]">
                Our Approach
              </h2>
              <p className="max-w-2xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
                Every commission begins with deep listening and disciplined inquiry. We bridge the gap
                between conceptual architectural vision and the physical craftsmanship of execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Approach 1: Interior Design */}
              <div className="p-7 sm:p-8 bg-white border border-[#ECE7DF] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8C877E]">
                    <span className="font-mono tracking-widest">01</span>
                    <Compass className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Interior Design</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    We approach interiors as sculptural volumes rather than decorated surfaces. Bespoke
                    millwork, tailored lighting schemes, and curated loose furnishings are composed into
                    a seamless sanctuary that feels both grounded and deeply personal.
                  </p>
                </div>
              </div>

              {/* Approach 2: Architecture */}
              <div className="p-7 sm:p-8 bg-white border border-[#ECE7DF] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8C877E]">
                    <span className="font-mono tracking-widest">02</span>
                    <Scale className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Architecture</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    Our architectural work is rooted in structural discipline, site topography, and climatic
                    context. We design massing that embraces diurnal natural light, creates passive ventilation,
                    and dissolves boundaries between indoor living and surrounding landscapes.
                  </p>
                </div>
              </div>

              {/* Approach 3: Material Selection */}
              <div className="p-7 sm:p-8 bg-white border border-[#ECE7DF] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8C877E]">
                    <span className="font-mono tracking-widest">03</span>
                    <Layers className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Material Selection</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    We celebrate authentic, tactile materials that age with grace. Honed travertine, raw
                    linens, fluted European oak, hand-applied lime plasters, and blackened metals are chosen
                    for their sensory richness and enduring durability over decades.
                  </p>
                </div>
              </div>

              {/* Approach 4: Spatial Planning */}
              <div className="p-7 sm:p-8 bg-white border border-[#ECE7DF] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8C877E]">
                    <span className="font-mono tracking-widest">04</span>
                    <Sun className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Spatial Planning</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    Flow and proportion govern our spatial plans. By eliminating visual clutter and prioritizing
                    intuitive circulation, we establish generous sightlines and unhindered movement that brings
                    an enduring sense of order and tranquility.
                  </p>
                </div>
              </div>

              {/* Approach 5: Client Requirements */}
              <div className="p-7 sm:p-8 bg-white border border-[#ECE7DF] space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8C877E]">
                    <span className="font-mono tracking-widest">05</span>
                    <HeartHandshake className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Client Alignment & Collaboration</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    We view every project as an intimate atelier partnership. Rather than imposing rigid dogmas,
                    we distill our clients&apos; daily routines, cultural contexts, and long-term aspirations into
                    an architectural identity that resonates authentically with how they live, host, and recharge.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. DESIGN PHILOSOPHY                                         */}
          {/* ============================================================ */}
          <section className="space-y-10 sm:space-y-12">
            <div className="border-t border-[#ECE7DF] pt-12 sm:pt-16 space-y-3">
              <p className="text-[11px] font-sans tracking-[0.26em] uppercase text-[#8C877E] font-medium">
                Ethos
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615]">
                Design Philosophy
              </h2>
              <p className="max-w-2xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
                Quiet luxury is not an aesthetic veneer; it is the natural consequence of purposeful proportion,
                honest textures, and functional integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Pillar 1: Functionality */}
              <div className="space-y-3 p-6 bg-[#F4F1EA] border border-[#ECE7DF]">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] font-medium block">
                  Principle 01
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#171615]">Functionality First</h4>
                <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                  A beautiful room that fails to serve everyday needs quickly loses its charm. We engineer
                  storage, ergonomics, and acoustic comfort so spaces work seamlessly behind the scenes.
                </p>
              </div>

              {/* Pillar 2: Thoughtful Spaces */}
              <div className="space-y-3 p-6 bg-[#F4F1EA] border border-[#ECE7DF]">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] font-medium block">
                  Principle 02
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#171615]">Thoughtful Spaces</h4>
                <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                  Spaces designed with intention evoke calmness. We carve moments for morning coffee, evening
                  reflection, and shared dinners with deliberate orientation toward light and views.
                </p>
              </div>

              {/* Pillar 3: Material & Light */}
              <div className="space-y-3 p-6 bg-[#F4F1EA] border border-[#ECE7DF]">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] font-medium block">
                  Principle 03
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#171615]">Material & Light</h4>
                <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                  Sunlight is our primary building material. We compose textures to catch shifting daylight—from
                  the morning glow on lime wash to warm raking rays across textured stones.
                </p>
              </div>

              {/* Pillar 4: Proportion & Scale */}
              <div className="space-y-3 p-6 bg-[#F4F1EA] border border-[#ECE7DF]">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] font-medium block">
                  Principle 04
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#171615]">Proportion & Balance</h4>
                <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                  We balance volumetric weight, ceiling datum lines, and negative space to achieve classical
                  harmony rendered with modern architectural restraint.
                </p>
              </div>

              {/* Pillar 5: Lifestyle */}
              <div className="space-y-3 p-6 bg-[#F4F1EA] border border-[#ECE7DF] sm:col-span-2 lg:col-span-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] font-medium block">
                  Principle 05
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#171615]">Lifestyle & Longevity</h4>
                <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                  We bypass short-lived trends in favor of enduring design languages. Our environments grow
                  richer with age, gracefully adapting to evolving family life and generational milestones.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. SERVICES OVERVIEW                                         */}
          {/* ============================================================ */}
          <section className="space-y-10 sm:space-y-12">
            <div className="border-t border-[#ECE7DF] pt-12 sm:pt-16 space-y-3">
              <p className="text-[11px] font-sans tracking-[0.26em] uppercase text-[#8C877E] font-medium">
                Disciplines
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615]">
                Services Overview
              </h2>
              <p className="max-w-2xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
                From initial schematic concept to white-glove site delivery, we provide unified multidisciplinary oversight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Service 1 */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-[#ECE7DF] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE7DF] mb-4">
                    <Image
                      src="/images/services/service-residential.jpg"
                      alt="Residential interior design by DESIGN TEMPTATION"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Interior Design</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    Comprehensive residential and boutique interior curation. Encompasses custom millwork
                    detailing, bespoke joinery, finish schedules, lighting architecture, and art curation.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#ECE7DF]/60">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#171615] editorial-link"
                  >
                    <span>Explore Services</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Service 2 */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-[#ECE7DF] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE7DF] mb-4">
                    <Image
                      src="/images/services/service-architecture.jpg"
                      alt="Architectural master planning by DESIGN TEMPTATION"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Architecture</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    Ground-up structural master planning, structural reconfiguration, building envelope design,
                    and facade detailing engineered to synthesize with surrounding environments.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#ECE7DF]/60">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#171615] editorial-link"
                  >
                    <span>Explore Services</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Service 3 */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-[#ECE7DF] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE7DF] mb-4">
                    <Image
                      src="/images/services/service-turnkey.jpg"
                      alt="Turnkey project delivery by DESIGN TEMPTATION"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-[#171615]">Turnkey Execution</h3>
                  <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
                    Single-point project governance. We manage vendor bidding, material procurement, artisan
                    site supervision, quality verification, and handover with seamless accountability.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#ECE7DF]/60">
                  <Link
                    href="/calculator"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#171615] editorial-link"
                  >
                    <span>Estimate Investment</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 5. STUDIO / LOCATION                                         */}
          {/* ============================================================ */}
          <section className="space-y-8">
            <div className="border-t border-[#ECE7DF] pt-12 sm:pt-16 space-y-3">
              <p className="text-[11px] font-sans tracking-[0.26em] uppercase text-[#8C877E] font-medium">
                Official Location
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#171615]">
                Our Studio Atelier
              </h2>
            </div>

            <div className="p-8 sm:p-10 bg-white border border-[#ECE7DF] max-w-2xl space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C877E] pb-1">
                  <MapPin className="w-4 h-4 stroke-[1.5] text-[#171615]" />
                  <span>Headquarters & Material Atelier</span>
                </div>
                <h3 className="font-sans text-sm font-semibold tracking-[0.16em] uppercase text-[#171615]">
                  {BRAND.name}
                </h3>
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#8C877E]">
                  {BRAND.tagline}
                </p>
              </div>

              <address className="not-italic text-sm sm:text-base text-[#32302D] font-light leading-relaxed border-t border-[#ECE7DF] pt-4 space-y-0.5">
                <p className="font-normal text-[#171615]">101, Halasahalli Rd,</p>
                <p>Kavery Nagar,</p>
                <p>Bengaluru,</p>
                <p>Karnataka 560087,</p>
                <p>India</p>
              </address>

              <div className="pt-2">
                <a
                  href={BRAND.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary group"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View on Google Maps</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ============================================================ */}
      {/* 6. FINAL CTA                                                 */}
      {/* "Have a project in mind?" "Let's create something thoughtful together." [Start a Project] -> /contact */}
      {/* ============================================================ */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
