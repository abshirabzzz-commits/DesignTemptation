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
    <article className="group flex flex-col space-y-3.5">
      {/* Product Visual Container with balanced aspect ratio */}
      <Link
        href={`/products/${prod.slug}`}
        className="block relative aspect-[4/3] sm:aspect-[16/12] lg:aspect-[4/3] w-full overflow-hidden bg-[#ECE7DF] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615]"
        aria-label={`View ${prod.name}`}
      >
        {hasImage ? (
          <Image
            src={prod.image}
            alt={prod.imageAlt || prod.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F4F1EA] border border-[#ECE7DF]">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8C877E]">
              {prod.category}
            </span>
            <span className="font-serif text-base text-[#171615] font-light pt-1">
              {prod.name}
            </span>
            {prod.material && (
              <span className="text-[11px] text-[#8C877E] font-light pt-1 italic">
                {prod.material}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Product Metadata & Action */}
      <div className="flex-1 flex flex-col justify-between space-y-3 pt-1 border-b border-[#ECE7DF] pb-4">
        <div className="space-y-1">
          {/* Category */}
          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#8C877E] font-medium">
            {prod.category}
          </p>

          {/* Product Name */}
          <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-light group-hover:text-[#5A5752] transition-colors leading-snug">
            <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
          </h3>
        </div>

        {/* Price & View Action */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-sans text-sm sm:text-base font-medium text-[#171615] tracking-wide tabular-nums">
            {displayPrice}
          </span>
          <Link
            href={`/products/${prod.slug}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] group-hover:text-[#5A5752] transition-colors py-1"
          >
            <span>View Product</span>
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
      className="py-14 sm:py-20 lg:py-24 bg-[#FAF8F5] border-b border-[#ECE7DF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10 sm:space-y-12">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#ECE7DF] pb-5">
          <div className="space-y-1.5 max-w-xl">
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              STUDIO COLLECTION
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed pt-1">
              Thoughtfully selected pieces to complement considered interiors.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#8C877E] transition-colors group self-start sm:self-auto py-1"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Desktop Grid / 1-Column Mobile Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {featuredProducts.map((prod) => (
            <FeaturedProductCard key={prod.id} prod={prod} />
          ))}
        </div>

        {/* Bottom CTA Link (Subtle) */}
        <div className="text-center pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-2 group"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
