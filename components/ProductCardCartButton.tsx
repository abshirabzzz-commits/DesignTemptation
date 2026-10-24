"use client";

import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface ProductCardCartButtonProps {
  slug: string;
  name: string;
  className?: string;
  compact?: boolean;
}

export function ProductCardCartButton({
  slug,
  name,
  className = "",
  compact = false,
}: ProductCardCartButtonProps) {
  const { addToCart } = useAuth();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await addToCart(slug, 1, name);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 min-h-[36px] sm:min-h-0 cursor-pointer ${className}`}
        aria-label={`Add ${name} to cart`}
      >
        {justAdded ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">In Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.14em] font-medium text-[#171615] hover:text-[#5A5752] transition-colors py-1 cursor-pointer ${className}`}
      aria-label={`Add ${name} to cart`}
    >
      {justAdded ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700">Added</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cart</span>
        </>
      )}
    </button>
  );
}
