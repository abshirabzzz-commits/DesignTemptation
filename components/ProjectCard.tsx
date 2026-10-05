"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  aspectRatioClass?: string;
  index?: number;
}

export function ProjectCard({
  project,
  priority = false,
  aspectRatioClass = "aspect-[16/11]",
  index,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = project.coverImage || project.image;
  const imageAlt = project.imageAlt || `${project.title} - ${project.location}`;
  const descriptionText = project.shortDescription || project.description;

  const hasValidImage = Boolean(imageSrc && imageSrc.trim().length > 0 && !imageError);

  return (
    <article className="group flex flex-col space-y-4">
      {/* Visual Image Block */}
      <Link
        href={`/projects/${project.slug}`}
        className={`block relative ${aspectRatioClass} w-full overflow-hidden bg-[#ECE7DF] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615]`}
        aria-label={`View project ${project.title}`}
      >
        {hasValidImage ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F4F1EA] border border-[#ECE7DF]">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8C877E]">
              {project.category}
            </span>
            <span className="font-serif text-lg text-[#171615] font-light pt-1">
              {project.title}
            </span>
          </div>
        )}

        {index !== undefined && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FAF8F5]/90 backdrop-blur-[2px] text-[10px] font-mono tracking-widest text-[#171615]">
            0{index + 1}
          </div>
        )}
      </Link>

      {/* Project Metadata & Typography */}
      <div className="flex-1 flex flex-col justify-between space-y-3 pt-1 border-b border-[#ECE7DF] pb-4">
        <div className="space-y-2">
          {/* Category & Location */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C877E] font-medium">
            <span>{project.category}</span>
            <span className="text-[#8C877E]/80">{project.location}</span>
          </div>

          {/* Project Title */}
          <h3 className="font-serif text-xl sm:text-2xl text-[#171615] font-light leading-snug group-hover:text-[#5A5752] transition-colors">
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>

          {/* Short Description */}
          {descriptionText && (
            <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed line-clamp-2 pt-0.5">
              {descriptionText}
            </p>
          )}
        </div>

        {/* View Project Action */}
        <div className="pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] group-hover:text-[#5A5752] transition-colors"
          >
            <span>View Project</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
