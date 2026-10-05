"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import { TRANSFORMATION_SHOWCASE } from "@/data/content";
import { TransformationItem } from "@/types";

interface BeforeAfterProps {
  data?: TransformationItem;
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
  projectName?: string;
  location?: string;
  description?: string;
}

export function BeforeAfter({
  data = TRANSFORMATION_SHOWCASE,
  beforeImage = data.beforeImage,
  afterImage = data.afterImage,
  beforeAlt = data.beforeAlt ?? "Interior space before renovation with raw unfinished structure",
  afterAlt = data.afterAlt ?? "Completed interior space with refined materials, custom joinery, and warm lighting",
  projectName = data.projectName,
  location = data.location,
  description = data.description,
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [afterError, setAfterError] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if pointer capture was already released
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <section
      id="transformation"
      aria-label="Before and After Transformation"
      className="py-14 sm:py-20 lg:py-24 bg-[#FAF8F5] border-b border-[#ECE7DF]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-10">
        {/* 2. Section Heading: Editorial Polish */}
        <div className="space-y-2 border-b border-[#ECE7DF] pb-5">
          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
            TRANSFORMATION
          </p>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Before &amp; After
            </h2>
            <p className="max-w-md text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
              See how thoughtful planning, material selection and design transform a space.
            </p>
          </div>
        </div>

        {/* 4. Interactive Before/After Visual Canvas */}
        <div className="space-y-4">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-label="Before and after transformation comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] max-h-[480px] overflow-hidden bg-[#ECE7DF] select-none cursor-ew-resize focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] touch-none shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#ECE7DF]"
          >
            {/* 1. AFTER Image (Full background layer) */}
            <div className="absolute inset-0">
              {!afterError ? (
                <Image
                  src={afterImage}
                  alt={afterAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  onError={() => setAfterError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F4F1EA] text-xs text-[#8C877E]">
                  After Renovation View
                </div>
              )}
              {/* AFTER Label - stays visible in top-right */}
              <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 px-2.5 py-1 bg-[#171615]/85 backdrop-blur-[2px] text-[10px] font-sans tracking-[0.2em] uppercase text-[#FAF8F5] pointer-events-none z-10">
                AFTER
              </div>
            </div>

            {/* 2. BEFORE Image (Clipped overlay layer) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              {!beforeError ? (
                <Image
                  src={beforeImage}
                  alt={beforeAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  onError={() => setBeforeError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#ECE7DF] text-xs text-[#8C877E]">
                  Before Renovation View
                </div>
              )}
              {/* BEFORE Label - stays visible in top-left */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 px-2.5 py-1 bg-[#FAF8F5]/90 backdrop-blur-[2px] text-[10px] font-sans tracking-[0.2em] uppercase text-[#171615] pointer-events-none z-10">
                BEFORE
              </div>
            </div>

            {/* 3. Slider Divider Line & Small Architectural Handle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#FAF8F5] pointer-events-none z-20 shadow-[0_0_8px_rgba(0,0,0,0.35)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-[#171615] border-2 border-[#FAF8F5] rounded-full flex items-center justify-center text-[#FAF8F5] shadow-md">
                <MoveHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Understated Interaction Prompt */}
          <p className="text-center text-[10px] sm:text-[11px] text-[#8C877E] tracking-wider font-light">
            Drag slider or use arrow keys to inspect the architectural transformation
          </p>
        </div>

        {/* 6. Desktop & Mobile Project Information (Positioned below the visual) */}
        <div className="pt-2 border-t border-[#ECE7DF] flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C877E] font-medium">
              <span>{projectName}</span>
              <span>•</span>
              <span>{location}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
              {description}
            </p>
          </div>

          {/* 11. Subtle secondary text link to /projects */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 group"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
