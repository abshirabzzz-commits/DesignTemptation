import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { BRAND, FOOTER_NAV_ITEMS } from "@/data/content";

export function Footer() {
  return (
    <footer className="bg-[#FAF8F5] text-[#171615] border-t border-[#ECE7DF] pt-12 sm:pt-14 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10 sm:space-y-12">
        {/* Top Tier: Logo Brand & Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Brand Presentation */}
          <div className="sm:col-span-2 md:col-span-5 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mix-blend-multiply shrink-0">
                <Image
                  src={BRAND.logo}
                  alt="DESIGN TEMPTATION Interiors & Architecture"
                  fill
                  sizes="(max-width: 640px) 52px, 64px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[15px] sm:text-sm font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-[#171615] leading-tight">
                  DESIGN TEMPTATION
                </span>
                <span className="font-sans text-[11px] sm:text-[9.5px] lg:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] text-[#8C877E] uppercase leading-tight pt-0.5 sm:pt-1">
                  INTERIORS &amp; ARCHITECTURE
                </span>
              </div>
            </div>
            <p className="max-w-sm text-[14.5px] sm:text-[13px] text-[#5A5752] font-light leading-relaxed">
              Bespoke architecture and interior curation. Crafting enduring private spaces through
              tactile materiality, natural diurnal light, and spatial clarity.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="sm:col-span-1 md:col-span-3 space-y-3 sm:space-y-4 pt-1 sm:pt-0">
            <p className="text-xs sm:text-[11px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#8C877E] font-semibold sm:font-medium">
              Navigation
            </p>
            <ul className="space-y-1 sm:space-y-2 text-[13px] sm:text-xs tracking-wider uppercase font-medium">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="editorial-link inline-block py-1.5 sm:py-0.5 text-[#32302D] hover:text-[#171615] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier & Inquiries Column */}
          <div className="sm:col-span-1 md:col-span-4 space-y-3 sm:space-y-4 pt-1 sm:pt-0">
            <p className="text-xs sm:text-[11px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#8C877E] font-semibold sm:font-medium">
              Studio &amp; Inquiries
            </p>
            <div className="space-y-1 text-[14px] sm:text-xs text-[#5A5752] font-light leading-relaxed">
              <p className="text-[#171615] font-medium">{BRAND.address.street}</p>
              <p>{BRAND.address.locality}</p>
              <p>{BRAND.address.city}, {BRAND.address.state} {BRAND.address.postalCode}</p>
              <p>{BRAND.address.country}</p>
              <div className="pt-1.5">
                <a
                  href={BRAND.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link text-[13px] sm:text-xs uppercase tracking-wider text-[#171615] font-semibold inline-flex items-center gap-1 py-1"
                >
                  <span>View on Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[#8C877E] pt-1">Private commissions by appointment</p>
            </div>

            {/* Social Channels */}
            <div className="pt-2 sm:pt-3">
              <p className="text-xs sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#8C877E] font-semibold sm:font-normal mb-1.5">
                Editorial Channels
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[13px] sm:text-xs text-[#8C877E]">
                <span className="hover:text-[#171615] transition-colors cursor-default">Instagram</span>
                <span className="text-[#DFD9CF]">•</span>
                <span className="hover:text-[#171615] transition-colors cursor-default">Pinterest</span>
                <span className="text-[#DFD9CF]">•</span>
                <span className="hover:text-[#171615] transition-colors cursor-default">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Legal & Back to Top */}
        <div className="pt-6 sm:pt-8 border-t border-[#ECE7DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] sm:text-xs text-[#8C877E] font-light">
          <p className="text-center sm:text-left">© 2026 DESIGN TEMPTATION. All rights reserved.</p>

          <div className="flex items-center gap-5 sm:gap-6">
            <span className="hidden sm:inline">Interiors &amp; Architecture</span>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-xs font-medium text-[#171615] hover:text-[#8C877E] transition-colors py-1"
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
