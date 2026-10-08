import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PRODUCTS, BRAND } from "@/data/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Curated Objects & Furnishings",
  description:
    "Limited edition architectural furnishings, luminaires, and monolithic stone works designed by DESIGN TEMPTATION and crafted by master artisans.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Curated Objects & Furnishings | DESIGN TEMPTATION",
    description:
      "Limited edition architectural furnishings, luminaires, and monolithic stone works designed by DESIGN TEMPTATION and crafted by master artisans.",
    url: "/products",
    images: [
      {
        url: "/images/products/product-console-table.jpg",
        width: 1200,
        height: 1200,
        alt: "DESIGN TEMPTATION Curated Living Objects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Objects & Furnishings | DESIGN TEMPTATION",
    description:
      "Limited edition architectural furnishings, luminaires, and monolithic stone works designed by DESIGN TEMPTATION and crafted by master artisans.",
    images: ["/images/products/product-console-table.jpg"],
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-22 sm:pt-30 lg:pt-32 pb-14 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-12">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          <div className="border-b border-[#ECE7DF] pb-5 sm:pb-8 space-y-2 sm:space-y-3">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#8C877E] font-medium">
              Curated Editions
            </p>
            <h1 className="font-serif text-[32px] sm:text-4xl lg:text-5xl text-[#171615] font-light tracking-tight">
              OBJECTS &amp; BESPOKE PIECES
            </h1>
            <p className="max-w-xl text-[15.5px] sm:text-base text-[#5A5752] font-light leading-relaxed">
              Limited production architectural furnishings, cast luminaires, and monolithic stone
              works designed by DESIGN TEMPTATION and crafted by master artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white border border-[#ECE7DF] p-3.5 sm:p-5 space-y-3.5 hover:border-[#171615]/35 hover:shadow-[0_8px_24px_rgba(23,22,21,0.06)] active:scale-[0.995] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full bg-[#ECE7DF] overflow-hidden group">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                  </Link>
                  <div className="space-y-1 pt-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-serif text-lg text-[#171615] hover:text-[#5A5752] transition-colors leading-snug">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h2>
                      <span className="text-sm text-[#171615] font-semibold font-sans shrink-0 tabular-nums">{product.price}</span>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-[#8C877E] font-medium">{product.category}</p>
                    <p className="text-[13px] sm:text-xs text-[#5A5752] pt-0.5 font-light">
                      {product.material} • {product.dimensions}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#ECE7DF]">
                  <a
                    href={`mailto:${BRAND.email}?subject=Acquisition%20Inquiry%20-%20${encodeURIComponent(
                      product.name
                    )}`}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.14em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 min-h-[36px] sm:min-h-0"
                  >
                    <span>Acquire Piece</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F4F1EA] p-6 sm:p-10 lg:p-12 border border-[#ECE7DF] text-center max-w-2xl mx-auto space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl text-[#171615]">Bespoke Object Commissions</h3>
            <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
              Custom dimensions, alternative stone selections (Carrara, Travertine, Grigio Carnico)
              and bespoke finishes are available upon private commission.
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${BRAND.email}?subject=Bespoke%20Object%20Commission`}
                className="btn-primary group"
              >
                <span>Request Material Swatches</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
