import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PRODUCTS, BRAND } from "@/data/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Visual Column */}
            <div className="lg:col-span-7 relative aspect-square sm:aspect-[4/3] w-full bg-[#ECE7DF] overflow-hidden">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Spec & Inquiry Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3 border-b border-[#ECE7DF] pb-6">
                <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
                  {product.category}
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
                  {product.name}
                </h1>
                <p className="text-xl font-sans text-[#171615] tracking-wide pt-1">
                  {product.price}
                </p>
              </div>

              {/* Specifications */}
              <div className="space-y-3 text-xs sm:text-sm text-[#5A5752] font-light">
                <div className="flex justify-between py-2 border-b border-[#ECE7DF]/60">
                  <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Material</span>
                  <span className="text-[#171615] font-normal">{product.material}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#ECE7DF]/60">
                  <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Dimensions</span>
                  <span className="text-[#171615] font-normal">{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#ECE7DF]/60">
                  <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Production</span>
                  <span className="text-[#171615] font-normal">Limited Studio Edition</span>
                </div>
              </div>

              {/* Acquisition CTA */}
              <div className="pt-4 space-y-3">
                <a
                  href={`mailto:${BRAND.email}?subject=Acquisition%20Inquiry%20-%20${encodeURIComponent(product.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#171615] text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#32302D] transition-colors"
                >
                  <span>Inquire for Acquisition</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <p className="text-[11px] text-[#8C877E] text-center tracking-wide">
                  Lead times & international freight calculated per commission
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
