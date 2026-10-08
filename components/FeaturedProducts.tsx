"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts, formatINR } from "@/data/content";
import { ProductItem } from "@/types";

function FeaturedProductCard({ prod }: { prod: ProductItem }) {
  const [hasError, setHasError] = useState(false);
  const hasImage = Boolean(prod.image && prod.image.trim().length > 0 && !hasError);

  const displayPrice = prod.numericPrice
    ? formatINR(prod.numericPrice)
    : prod.price;

  return (
    <article className="group flex flex-col bg-white border border-[#ECE7DF] p-3.5 sm:p-5 hover:border-[#171615]/35 hover:shadow-[0_8px_24px_rgba(23,22,21,0.06)] active:scale-[0.995] transition-all duration-300">
      {/* Product Visual Container with balanced aspect ratio */}
      <Link
        href={`/products/${prod.slug}`}
        className="block relative aspect-[4/3] w-full overflow-hidden bg-[#ECE7DF] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615]"
        aria-label={`View ${prod.name}`}
      >
        {hasImage ? (
          <Image
            src={prod.image}
            alt={prod.imageAlt || prod.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#F4F1EA] border border-[#ECE7DF]">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8C877E]">
              {prod.category}
            </span>
            <span className="font-serif text-sm sm:text-base text-[#171615] font-light pt-1">
              {prod.name}
            </span>
            {prod.material && (
              <span className="text-[10px] text-[#8C877E] font-light pt-0.5 italic">
                {prod.material}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Product Metadata & Action */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5 pt-3.5">
        <div className="space-y-1">
          {/* Category */}
          <p className="text-xs sm:text-[11px] font-sans tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#8C877E] font-medium">
            {prod.category}
          </p>

          {/* Product Name */}
          <h3 className="font-serif text-[20px] sm:text-lg text-[#171615] font-light group-hover:text-[#5A5752] transition-colors leading-snug">
            <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
          </h3>
        </div>

        {/* Price & View Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ECE7DF]">
          <span className="font-sans text-base font-semibold text-[#171615] tracking-wide tabular-nums">
            {displayPrice}
          </span>
          <Link
            href={`/products/${prod.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] sm:text-xs uppercase tracking-[0.16em] font-semibold sm:font-medium text-[#171615] group-hover:text-[#5A5752] transition-colors py-1.5 min-h-[42px] sm:min-h-0"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  // Empty state handling
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="products"
      aria-label="Studio Collection & Featured Products"
      className="py-12 sm:py-18 lg:py-22 bg-[#FAF8F5] border-b border-[#ECE7DF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#ECE7DF] pb-4">
          <div className="space-y-1 max-w-xl">
            <p className="text-xs sm:text-[11px] font-sans tracking-[0.22em] sm:tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              STUDIO COLLECTION
            </p>
            <h2 className="font-serif text-[32px] sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Featured Products
            </h2>
            <p className="text-[15.5px] sm:text-sm text-[#5A5752] font-light leading-relaxed pt-0.5">
              Thoughtfully selected pieces to complement considered interiors.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[13px] sm:text-xs uppercase tracking-[0.16em] font-semibold sm:font-medium text-[#171615] hover:text-[#5A5752] transition-colors group self-start sm:self-auto py-1.5 min-h-[40px] sm:min-h-0"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Desktop Grid / 1-Column Mobile Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((prod) => (
            <FeaturedProductCard key={prod.id} prod={prod} />
          ))}
        </div>

        {/* Bottom CTA Link (Subtle secondary button) */}
        <div className="text-center pt-2">
          <Link
            href="/products"
            className="btn-secondary group w-full max-w-[320px] sm:w-auto inline-flex justify-center mx-auto"
          >
            <span>Explore Complete Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
