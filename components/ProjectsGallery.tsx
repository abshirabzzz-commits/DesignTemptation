"use client";

import React, { useState, useMemo } from "react";
import { Project } from "@/types";
import { PROJECT_CATEGORIES } from "@/data/content";
import { ProjectCard } from "@/components/ProjectCard";

interface ProjectsGalleryProps {
  initialProjects: Project[];
}

export function ProjectsGallery({ initialProjects }: ProjectsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return initialProjects;
    }
    return initialProjects.filter(
      (project) => project.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, initialProjects]);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Category Filter Tabs (Minimal, editorial, non-oversized) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-[#ECE7DF] pb-4">
        {PROJECT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const count =
            category === "All"
              ? initialProjects.length
              : initialProjects.filter(
                  (p) => p.category.toLowerCase() === category.toLowerCase()
                ).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 text-xs tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#171615] text-[#FAF8F5] font-medium"
                  : "bg-transparent text-[#8C877E] hover:text-[#171615] hover:bg-[#ECE7DF]/50"
              }`}
            >
              <span>{category}</span>
              <span className={`ml-1.5 text-[10px] ${isActive ? "text-[#FAF8F5]/70" : "text-[#8C877E]"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Editorial Grid (Medium-sized, balanced 3-column / 2-column layout) */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={idx < 3}
              aspectRatioClass="aspect-[16/11]"
              index={idx}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-[#ECE7DF] bg-[#FAF8F5]">
          <p className="font-serif text-xl text-[#171615] font-light">
            No projects found in this category.
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className="mt-4 text-xs uppercase tracking-[0.16em] font-medium text-[#8C877E] hover:text-[#171615] underline underline-offset-4"
          >
            Show All Projects
          </button>
        </div>
      )}
    </div>
  );
}
