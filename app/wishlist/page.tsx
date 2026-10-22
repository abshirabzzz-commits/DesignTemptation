"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { WishlistItem } from "@/types";
import { formatINR } from "@/data/content";
import {
  apiGetWishlist,
  apiRemoveWishlistItem,
  apiAddToCart,
} from "@/lib/api";
import { Heart, ShoppingBag, Trash2, CheckCircle2 } from "lucide-react";

export default function WishlistPage() {
  const { isAuthenticated, openAuthModal, refreshCart, refreshWishlist } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadWishlist = async () => {
    setIsLoading(true);
    const res = await apiGetWishlist();
    if (res.success && Array.isArray(res.data)) {
      setItems(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemove = async (itemId: number, productName: string) => {
    const res = await apiRemoveWishlistItem(itemId);
    if (res.success) {
      await loadWishlist();
      await refreshWishlist();
      setActionSuccess(`Removed ${productName} from your wishlist.`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleAddToCart = async (productSlug: string, productName: string) => {
    const res = await apiAddToCart(productSlug, 1);
    if (res.success) {
      await refreshCart();
      setActionSuccess(`Added ${productName} to your cart.`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
          {/* Header Title */}
          <div className="space-y-2 border-b border-[#ECE7DF] pb-6">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              Private Curation
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
              Your Saved Wishlist
            </h1>
          </div>

          {actionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {!isAuthenticated ? (
            <div className="p-12 text-center border border-[#ECE7DF] bg-white space-y-4 max-w-lg mx-auto">
              <Heart className="w-8 h-8 text-[#8C877E] mx-auto stroke-[1.2]" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#171615]">Sign in to view your wishlist</h2>
                <p className="text-xs text-[#5A5752] font-light">
                  Save limited studio editions, sculpted furniture, and bespoke lighting to your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="btn-primary !h-11 text-xs font-semibold tracking-[0.16em] uppercase px-8"
              >
                Sign In / Register
              </button>
            </div>
          ) : isLoading ? (
            <div className="py-20 text-center text-xs text-[#8C877E] uppercase tracking-widest">
              <span className="inline-block w-4 h-4 border-2 border-[#171615]/30 border-t-[#171615] rounded-full animate-spin mr-2 align-middle" />
              Loading your saved pieces...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center border border-[#ECE7DF] bg-white space-y-4 max-w-lg mx-auto">
              <Heart className="w-8 h-8 text-[#8C877E] mx-auto stroke-[1.2]" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#171615]">Your wishlist is empty</h2>
                <p className="text-xs text-[#5A5752] font-light">
                  Browse our portfolio and collection pieces to curate your favorite items.
                </p>
              </div>
              <Link
                href="/products"
                className="btn-primary inline-flex items-center justify-center !h-11 text-xs font-semibold tracking-[0.16em] uppercase px-8"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#ECE7DF] overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] bg-[#ECE7DF] overflow-hidden">
                    <Image
                      src={item.product_details.image}
                      alt={item.product_details.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] tracking-widest uppercase text-[#8C877E]">
                        {item.product_details.category}
                      </p>
                      <Link
                        href={`/products/${item.product_details.slug}`}
                        className="font-serif text-lg text-[#171615] hover:underline block"
                      >
                        {item.product_details.name}
                      </Link>
                      <p className="text-xs font-medium text-[#171615]">
                        {formatINR(item.product_details.numericPrice || 0)}
                      </p>
                      {item.product_details.material && (
                        <p className="text-[11px] text-[#5A5752] font-light truncate">
                          {item.product_details.material}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#ECE7DF] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(
                            item.product_details.slug,
                            item.product_details.name
                          )
                        }
                        className="btn-primary !h-9 text-[11px] font-semibold tracking-wider uppercase flex-1 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item.id, item.product_details.name)
                        }
                        className="p-2 border border-[#ECE7DF] text-[#8C877E] hover:text-red-700 hover:border-red-300 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
