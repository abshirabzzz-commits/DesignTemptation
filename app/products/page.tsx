import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PRODUCTS, BRAND } from "@/data/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          <div className="border-b border-[#ECE7DF] pb-8 space-y-3">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#8C877E] font-medium">
              Curated Editions
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#171615] font-light">
              OBJECTS & BESPOKE PIECES
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
              Limited production architectural furnishings, cast luminaires, and monolithic stone
              works designed by DESIGN TEMPTATION and crafted by master artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="space-y-4">
                <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full bg-[#ECE7DF] overflow-hidden group">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="space-y-1 border-b border-[#ECE7DF] pb-4">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-serif text-xl text-[#171615] hover:text-[#5A5752] transition-colors">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h2>
                    <span className="text-sm text-[#8C877E] font-sans">{product.price}</span>
                  </div>
                  <p className="text-xs text-[#8C877E]">{product.category}</p>
                  <p className="text-xs text-[#5A5752] pt-1">
                    {product.material} • {product.dimensions}
                  </p>
                  <div className="pt-3">
                    <a
                      href={`mailto:${BRAND.email}?subject=Acquisition%20Inquiry%20-%20${encodeURIComponent(
                        product.name
                      )}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium text-[#171615] hover:text-[#8C877E]"
                    >
                      <span>Acquire / Commission Piece</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F4F1EA] p-8 sm:p-12 border border-[#ECE7DF] text-center max-w-2xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl text-[#171615]">Bespoke Object Commissions</h3>
            <p className="text-sm text-[#5A5752] font-light leading-relaxed">
              Custom dimensions, alternative stone selections (Carrara, Travertine, Grigio Carnico)
              and bespoke finishes are available upon private commission.
            </p>
            <a
              href={`mailto:${BRAND.email}?subject=Bespoke%20Object%20Commission`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-[0.14em] font-medium"
            >
              <span>Request Material Swatches</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
