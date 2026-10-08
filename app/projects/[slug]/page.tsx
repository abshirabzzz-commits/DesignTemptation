import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PROJECTS, getProjectBySlug } from "@/data/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { SITE_URL } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const metaDescription =
    project.shortDescription ||
    project.description ||
    `${project.title} — Architectural and interior design commission in ${project.location} by DESIGN TEMPTATION.`;

  const coverImg = project.coverImage || project.image;

  return {
    title: project.title,
    description: metaDescription,
    openGraph: {
      title: `${project.title} | DESIGN TEMPTATION`,
      description: metaDescription,
      url: `/projects/${project.slug}`,
      images: [
        {
          url: coverImg,
          width: 1600,
          height: 1100,
          alt: project.imageAlt || project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | DESIGN TEMPTATION`,
      description: metaDescription,
      images: [coverImg],
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const coverImg = project.coverImage || project.image;
  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [coverImg];

  // Discover other related projects (excluding current)
  const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.shortDescription || project.description,
    image: `${SITE_URL}${coverImg}`,
    genre: project.category,
    locationCreated: {
      "@type": "Place",
      name: project.location,
    },
    creator: {
      "@type": "Organization",
      name: "DESIGN TEMPTATION",
      url: SITE_URL,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E]">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 hover:text-[#171615] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Projects</span>
            </Link>
            <span>/</span>
            <span className="text-[#171615] font-medium truncate max-w-[200px] sm:max-w-none">
              {project.title}
            </span>
          </div>

          {/* Project Header */}
          <div className="border-b border-[#ECE7DF] pb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#8C877E] font-medium">
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.location}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>

            <h1 className="font-serif text-[32px] sm:text-5xl lg:text-6xl text-[#171615] font-light leading-[1.1] tracking-tight">
              {project.title}
            </h1>

            {project.shortDescription && (
              <p className="max-w-3xl text-base sm:text-lg text-[#5A5752] font-light leading-relaxed pt-2">
                {project.shortDescription}
              </p>
            )}
          </div>

          {/* 1. Project Hero Image (Balanced, medium-sized, non-fullscreen) */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[560px] w-full overflow-hidden bg-[#ECE7DF]">
            <Image
              src={coverImg}
              alt={project.imageAlt || project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* 9. Relevant Project Information Metadata Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#ECE7DF] bg-[#FAF8F5]">
            <div className="space-y-1">
              <p className="text-[11px] sm:text-[11px] font-sans tracking-[0.22em] uppercase text-[#8C877E] font-medium">
                Location
              </p>
              <p className="font-serif text-base sm:text-lg text-[#171615] font-light">
                {project.location}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] sm:text-[11px] font-sans tracking-[0.22em] uppercase text-[#8C877E] font-medium">
                Category
              </p>
              <p className="font-serif text-base sm:text-lg text-[#171615] font-light">
                {project.category}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] sm:text-[11px] font-sans tracking-[0.22em] uppercase text-[#8C877E] font-medium">
                Property Type
              </p>
              <p className="font-serif text-base sm:text-lg text-[#171615] font-light">
                {project.propertyType || "Private Commission"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] sm:text-[11px] font-sans tracking-[0.22em] uppercase text-[#8C877E] font-medium">
                Built-Up Area / Year
              </p>
              <p className="font-serif text-base sm:text-lg text-[#171615] font-light">
                {project.area ? `${project.area} · ` : ""}{project.year}
              </p>
            </div>
          </div>

          {/* 6. Description & 8. Design Approach / Concept */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-4">
            {/* Left Column: Design Approach & Scope */}
            <div className="lg:col-span-5 space-y-8">
              {project.designApproach && (
                <div className="space-y-3">
                  <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.24em] uppercase text-[#8C877E] font-medium">
                    01 · DESIGN APPROACH & CONCEPT
                  </p>
                  <h2 className="font-serif text-2xl text-[#171615] font-light">
                    Sensory Restraint & Light
                  </h2>
                  <p className="text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
                    {project.designApproach}
                  </p>
                </div>
              )}

              {project.scope && project.scope.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#ECE7DF]">
                  <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.24em] uppercase text-[#8C877E] font-medium">
                    02 · SCOPE & DISCIPLINES
                  </p>
                  <ul className="space-y-2.5 pt-1">
                    {project.scope.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5A5752] font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#171615] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Full Narrative Description */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.24em] uppercase text-[#8C877E] font-medium">
                03 · SPATIAL NARRATIVE
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171615] font-light leading-snug">
                Materiality conceived for enduring living.
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
                <p>{project.description}</p>
                <p>
                  Every junction was coordinated directly with our master joiners and stonemasons to eliminate superfluous trims, allowing the architectural purity of stone, warm wood, and diurnal daylight to take precedence.
                </p>
              </div>
            </div>
          </div>

          {/* 7. Image Gallery */}
          {gallery.length > 1 && (
            <div className="space-y-4 pt-8 border-t border-[#ECE7DF]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 border-b border-[#ECE7DF] pb-2.5">
                <div className="space-y-0.5">
                  <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.24em] uppercase text-[#8C877E] font-medium">
                    GALLERY
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-light tracking-tight">
                    Visual Monograph
                  </h3>
                </div>
                <p className="text-[11px] text-[#8C877E] font-light">
                  {gallery.length} Archival Photographs
                </p>
              </div>

              {/* Gallery Grid (Compact, restrained editorial presentation) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {gallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE7DF] group"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${project.title} detail photograph 0${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-[#FAF8F5]/90 backdrop-blur-[2px] text-[9px] font-mono tracking-widest text-[#171615]">
                      0{i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. Suggested CTA */}
          <section className="bg-[#171615] text-[#FAF8F5] p-8 sm:p-12 lg:p-14 border border-[#ECE7DF] flex flex-col md:flex-row md:items-center justify-between gap-8 mt-16">
            <div className="space-y-2 max-w-xl">
              <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#DFD9CF]">
                COMMISSIONING
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF8F5]">
                Have a project in mind?
              </h2>
              <p className="text-xs sm:text-sm text-[#DFD9CF]/80 font-light leading-relaxed">
                Consult with our studio about residential architecture, interior restructuring, or complete turnkey realization.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FAF8F5] text-[#171615] text-xs font-medium uppercase tracking-[0.16em] hover:bg-[#FAF8F5]/90 transition-colors group"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-[#FAF8F5]/30 text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.16em] hover:border-[#FAF8F5] transition-colors"
              >
                <span>All Projects</span>
              </Link>
            </div>
          </section>

          {/* Explore Other Projects Navigation */}
          {otherProjects.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-[#ECE7DF]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.24em] uppercase text-[#8C877E] font-medium">
                  EXPLORE FURTHER
                </p>
                <Link
                  href="/projects"
                  className="text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#8C877E] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {otherProjects.map((item) => (
                  <Link
                    key={item.id}
                    href={`/projects/${item.slug}`}
                    className="group space-y-2 block"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE7DF]">
                      <Image
                        src={item.coverImage || item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="pt-1">
                      <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                        {item.category}
                      </p>
                      <h4 className="font-serif text-lg text-[#171615] group-hover:text-[#5A5752] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
