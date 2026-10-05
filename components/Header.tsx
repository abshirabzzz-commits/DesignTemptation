"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BRAND, DESKTOP_NAV_ITEMS, MOBILE_NAV_ITEMS } from "@/data/content";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out bg-[#FAF8F5] border-b border-[#ECE7DF] ${
          isScrolled
            ? "shadow-[0_2px_16px_rgba(0,0,0,0.03)]"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-[68px] flex items-center justify-between">
          {/* Brand Identity Block: [Logo Icon] | DESIGN TEMPTATION / INTERIORS & ARCHITECTURE */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] shrink-0"
            aria-label="DESIGN TEMPTATION - INTERIORS & ARCHITECTURE - Homepage"
          >
            {/* Official Logo: uploaded asset, natural blend, no background box */}
            <div className="relative flex items-center justify-center shrink-0 overflow-hidden w-[34px] sm:w-[40px] lg:w-[42px] h-[36px] sm:h-[42px] lg:h-[44px]">
              <Image
                src={BRAND.logo}
                alt="DESIGN TEMPTATION"
                width={1024}
                height={383}
                priority
                className="h-full w-auto max-w-none object-contain shrink-0"
              />
            </div>

            {/* Thin subtle vertical divider: tightly spaced (18-24px from logo, 16-22px to text) */}
            <div
              className="h-6 sm:h-7 w-[1px] bg-[#DFD9CF] shrink-0 self-center ml-4 sm:ml-5 mr-3.5 sm:mr-4.5"
              aria-hidden="true"
            />

            {/* Brand Text Block */}
            <div className="flex flex-col justify-center select-none">
              <span className="font-sans text-[12px] sm:text-[13.5px] lg:text-[14px] font-semibold tracking-[0.16em] sm:tracking-[0.18em] uppercase text-[#171615] leading-[1.15]">
                DESIGN TEMPTATION
              </span>
              <span className="font-sans text-[7.5px] sm:text-[8.5px] lg:text-[9px] font-medium tracking-[0.24em] sm:tracking-[0.26em] uppercase text-[#8C877E] leading-tight pt-0.5 sm:pt-1">
                INTERIORS & ARCHITECTURE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-5 lg:space-x-8 text-[12px] lg:text-[13px] tracking-[0.09em] uppercase text-[#32302D] font-normal"
            aria-label="Main Navigation"
          >
            {DESKTOP_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="editorial-link transition-colors duration-200 hover:text-[#171615] py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button - Refined architectural proportions */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-[38px] px-4.5 lg:px-5 text-[11px] font-medium tracking-[0.14em] uppercase text-[#FAF8F5] bg-[#171615] hover:bg-[#32302D] active:scale-[0.99] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615]"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile Menu Button - Accessible touch target */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#171615] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] active:scale-95 transition-transform"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 bg-[#FAF8F5] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:hidden flex flex-col justify-between pt-20 pb-8 px-6 overflow-y-auto ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="space-y-6 pt-2">
          <p className="text-[10px] tracking-[0.25em] text-[#8C877E] uppercase font-medium">
            Navigation
          </p>
          <nav className="flex flex-col space-y-2.5" aria-label="Mobile Navigation">
            {MOBILE_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl text-[#171615] hover:text-[#8C877E] transition-colors duration-200 flex items-center justify-between py-1.5 border-b border-[#ECE7DF]/60"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#8C877E] stroke-[1.25]" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#ECE7DF] mt-6">
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center h-11 px-6 text-xs font-semibold tracking-[0.16em] uppercase text-[#FAF8F5] bg-[#171615] hover:bg-[#32302D] active:scale-[0.98] transition-all"
          >
            START A PROJECT
          </Link>

          <div className="space-y-1 text-xs text-[#8C877E] font-light text-center">
            <p className="tracking-wide">{BRAND.location}</p>
            <p className="tracking-wide">{BRAND.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
