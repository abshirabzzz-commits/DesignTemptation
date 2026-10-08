"use client";

import React, { useEffect, useRef, useState } from "react";
import { STATISTICS } from "@/data/content";
import { StatItem } from "@/types";

function StatCounter({ stat, isInView }: { stat: StatItem; isInView: boolean }) {
  const target = stat.numericValue ?? (parseInt(stat.value.replace(/\D/g, ""), 10) || 0);
  const [count, setCount] = useState<number>(target);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setCount(target);
        return;
      }
    }

    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 1200; // 1.2s smooth count

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      // Ensure zero is never displayed on screen
      setCount(Math.max(1, Math.floor(easeOut * target)));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, target]);

  return (
    <div className="flex items-baseline justify-center">
      <span className="font-serif text-[36px] sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight tabular-nums">
        {count}
      </span>
      <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#8C877E] font-light ml-0.5">
        {stat.suffix ?? "+"}
      </span>
    </div>
  );
}

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Trigger immediately if already within viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      aria-label="Studio Statistics & Milestones"
      ref={containerRef}
      className="py-8 sm:py-14 lg:py-16 bg-[#F7F5F0] border-y border-[#ECE7DF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Editorial layout: 4 columns single balanced row on desktop (lg:grid-cols-4), clean 2x2 grid on mobile without horizontal scrolling */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATISTICS.map((stat, idx) => {
            const isRightBorderMobile = idx % 2 === 0;
            const isBottomBorderMobile = idx < 2;
            const isRightBorderDesktop = idx < 3;

            return (
              <div
                key={stat.id}
                className={`py-4 sm:py-7 px-3 sm:px-6 text-center flex flex-col justify-center space-y-1 transition-colors duration-300 border-[#ECE7DF] ${
                  isRightBorderMobile ? "border-r" : ""
                } ${isBottomBorderMobile ? "border-b" : ""} ${
                  isRightBorderDesktop ? "lg:border-r" : "lg:border-r-0"
                } lg:border-b-0`}
              >
                <StatCounter stat={stat} isInView={isInView} />
                <p className="text-[12px] sm:text-[11px] font-sans tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#8C877E] font-semibold sm:font-medium leading-tight sm:leading-relaxed">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
