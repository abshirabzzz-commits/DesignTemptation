"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/data/content";
import { ProjectCard } from "@/components/ProjectCard";
import { getDjangoBaseUrl } from "@/lib/api";
import { Project } from "@/types";

export function ProjectShowcase() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(() => getFeaturedProjects());

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const baseUrl = getDjangoBaseUrl();
        const res = await fetch(`${baseUrl}/api/projects/?featured=true`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setFeaturedProjects(
              data.map((p: any) => ({
                id: String(p.id),
                slug: p.slug,
                title: p.title,
                location: p.location,
                category: p.category,
                propertyType: p.property_type,
                year: p.year,
                area: p.area,
                shortDescription: p.short_description,
                description: p.description,
                designApproach: p.design_approach,
                coverImage: p.cover_image,
                galleryImages: p.gallery || [],
                scope: [
                  "Spatial Master Planning",
                  "Interior Architecture",
                  "Custom Millwork & Joinery Details",
                ],
                featured: p.featured,
                image: p.cover_image,
                imageAlt: p.title,
                aspectRatio: "horizontal" as const,
                createdAt: p.created_at,
              }))
            );
          }
        }
      } catch {
        // keep static fallback
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="projects" className="py-12 sm:py-18 lg:py-22 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-12">
        {/* Section Heading with Editorial Polish */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#ECE7DF] pb-4">
          <div className="space-y-1">
            <p className="text-xs sm:text-[11px] font-sans tracking-[0.22em] sm:tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              PORTFOLIO
            </p>
            <h2 className="font-serif text-[32px] sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Selected Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] sm:text-xs uppercase tracking-[0.16em] font-semibold sm:font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1.5 min-h-[40px] sm:min-h-0 group self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Balanced Editorial 3-Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
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

        {/* Bottom Secondary Action Button */}
        <div className="text-center pt-2">
          <Link
            href="/projects"
            className="btn-secondary group w-full max-w-[320px] sm:w-auto inline-flex justify-center mx-auto"
          >
            <span>Explore Complete Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
