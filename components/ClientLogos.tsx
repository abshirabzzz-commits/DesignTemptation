"use client";

import React from "react";
import { CLIENT_LOGOS } from "@/data/content";

export function ClientLogos() {
  return (
    <section className="py-8 sm:py-10 bg-[#FAF8F5] border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-center text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase font-semibold text-[#8C877E] mb-6">
          SELECTED CLIENTS
        </p>

        {/* Single horizontal row of client logo placeholders */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 flex-wrap opacity-70">
          {CLIENT_LOGOS.map((client) => (
            <div
              key={client.id}
              className="text-center group py-1"
            >
              <span className="font-serif text-xs sm:text-sm tracking-[0.18em] text-[#32302D] uppercase group-hover:text-[#171615] transition-colors whitespace-nowrap">
                {client.name}
              </span>
              <span className="block text-[8px] sm:text-[9px] font-sans tracking-widest text-[#8C877E] uppercase pt-0.5">
                {client.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
