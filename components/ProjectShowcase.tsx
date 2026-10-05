"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/data/content";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectShowcase() {
  const featuredProjects = getFeaturedProjects();

  return (
    <section id="projects" className="py-16 sm:py-20 lg:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-14">
        {/* Section Heading with Editorial Polish */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#ECE7DF] pb-5">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              PORTFOLIO
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Selected Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#8C877E] transition-colors py-1 group self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Balanced Editorial 3-Project Grid (Medium-sized, photography-focused) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {featuredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={true}
              aspectRatioClass="aspect-[16/11]"
              index={idx}
            />
          ))}
        </div>

        {/* Bottom Editorial Link */}
        <div className="text-center pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-2 group"
          >
            <span>Explore Complete Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
