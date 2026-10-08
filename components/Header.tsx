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
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-[68px] sm:h-[68px] flex items-center justify-between">
          {/* Brand Identity Block: [Logo Icon] | DESIGN TEMPTATION / INTERIORS & ARCHITECTURE */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] shrink-0"
            aria-label="DESIGN TEMPTATION - INTERIORS & ARCHITECTURE - Homepage"
          >
            {/* Official Logo: uploaded asset, natural blend, no background box */}
            <div className="relative flex items-center justify-center shrink-0 w-[36px] sm:w-[38px] lg:w-[40px] h-[32px] sm:h-[34px] lg:h-[36px]">
              <Image
                src={BRAND.logo}
                alt="DESIGN TEMPTATION"
                width={354}
                height={297}
                priority
                className="w-full h-full object-contain shrink-0"
              />
            </div>

            {/* Thin subtle vertical divider: tightly spaced */}
            <div
              className="h-6.5 sm:h-7 w-[1px] bg-[#DFD9CF] shrink-0 self-center ml-2.5 sm:ml-4 mr-2.5 sm:mr-4"
              aria-hidden="true"
            />

            {/* Brand Text Block */}
            <div className="flex flex-col justify-center select-none">
              <span className="font-sans text-[14px] sm:text-[14px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[#171615] leading-[1.12]">
                DESIGN TEMPTATION
              </span>
              <span className="font-sans text-[11px] sm:text-[8.5px] lg:text-[9px] font-medium tracking-[0.18em] sm:tracking-[0.24em] uppercase text-[#8C877E] leading-tight pt-0.5 sm:pt-1">
                INTERIORS &amp; ARCHITECTURE
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
              className="btn-primary !h-[38px] !min-h-[38px] !px-4.5 lg:!px-5 text-[11px] font-semibold tracking-[0.14em]"
            >
              START A PROJECT
            </Link>
          </div>

          {/* Mobile Menu Button - Accessible touch target */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 -mr-1.5 min-h-[48px] min-w-[48px] flex items-center justify-center text-[#171615] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] active:scale-95 transition-transform cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 stroke-[2]" />
            ) : (
              <Menu className="w-7 h-7 stroke-[2]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 bg-[#FAF8F5] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:hidden flex flex-col justify-between pt-22 pb-8 px-6 overflow-y-auto ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="space-y-6 pt-2">
          <p className="text-[11px] tracking-[0.25em] text-[#8C877E] uppercase font-semibold">
            Navigation
          </p>
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {MOBILE_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl text-[#171615] hover:text-[#8C877E] transition-colors duration-200 flex items-center justify-between py-2 border-b border-[#ECE7DF]/70"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#8C877E] stroke-[1.5]" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#ECE7DF] mt-6">
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary w-full !h-12 text-xs font-semibold tracking-[0.16em]"
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
