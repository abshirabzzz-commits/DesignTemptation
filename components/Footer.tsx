import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { BRAND, NAV_ITEMS } from "@/data/content";

export function Footer() {
  return (
    <footer className="bg-[#FAF8F5] text-[#171615] border-t border-[#ECE7DF] pt-12 sm:pt-14 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-10 sm:space-y-12">
        {/* Top Tier: Logo Brand & Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Presentation */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 mix-blend-multiply shrink-0">
                <Image
                  src={BRAND.logo}
                  alt="DESIGN TEMPTATION Interiors & Architecture"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-sm font-semibold tracking-[0.24em] text-[#171615] leading-tight">
                  DESIGN TEMPTATION
                </span>
                <span className="font-sans text-[10px] tracking-[0.2em] text-[#8C877E] uppercase leading-tight pt-0.5">
                  INTERIORS & ARCHITECTURE
                </span>
              </div>
            </div>
            <p className="max-w-sm text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
              Bespoke architecture and interior curation. Crafting enduring private spaces through
              tactile materiality, natural diurnal light, and spatial clarity.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#8C877E] font-medium">
              Navigation
            </p>
            <ul className="space-y-2.5 text-xs tracking-wider uppercase">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="editorial-link text-[#32302D] hover:text-[#171615] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier & Inquiries Column */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#8C877E] font-medium">
              Studio & Inquiries
            </p>
            <div className="space-y-1.5 text-xs text-[#5A5752] font-light">
              <p className="text-[#171615] font-medium">{BRAND.address.street}</p>
              <p>{BRAND.address.locality}</p>
              <p>{BRAND.address.city}, {BRAND.address.state} {BRAND.address.postalCode}</p>
              <p>{BRAND.address.country}</p>
              <div className="pt-1">
                <a
                  href={BRAND.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link text-[11px] uppercase tracking-wider text-[#171615] font-medium inline-flex items-center gap-1"
                >
                  <span>View on Google Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[#8C877E] pt-1">Private commissions by appointment</p>
            </div>

            {/* Social Channels */}
            <div className="pt-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8C877E] mb-2">
                Editorial Channels
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-[#8C877E]">
                <span>Instagram</span>
                <span className="text-[#DFD9CF]">•</span>
                <span>Pinterest</span>
                <span className="text-[#DFD9CF]">•</span>
                <span>LinkedIn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Legal & Back to Top */}
        <div className="pt-8 border-t border-[#ECE7DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C877E] font-light">
          <p>© 2026 DESIGN TEMPTATION. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span>Interiors & Architecture</span>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs text-[#171615] hover:text-[#8C877E] transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
