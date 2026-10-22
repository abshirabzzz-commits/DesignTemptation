"use client";

import React, { useState } from "react";
import { ProductItem } from "@/types";
import { formatINR } from "@/data/content";
import { ArrowUpRight, CheckCircle2, AlertCircle, Plus, Minus, ShieldCheck, Truck, ShoppingBag, Heart } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { apiAddToCart, apiToggleWishlist, getStoredToken } from "@/lib/api";

interface ProductOrderSectionProps {
  product: ProductItem;
}

export function ProductOrderSection({ product }: ProductOrderSectionProps) {
  const { user, isAuthenticated, openAuthModal, refreshCart, refreshWishlist } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Form inputs
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Pre-fill fields from authenticated user
  React.useEffect(() => {
    if (user) {
      if (user.full_name) setCustomerName(user.full_name);
      if (user.email) setCustomerEmail(user.email);
      if (user.profile) {
        if (user.profile.phone) setCustomerPhone(user.profile.phone);
        if (user.profile.delivery_address) setDeliveryAddress(user.profile.delivery_address);
        if (user.profile.city) setCity(user.profile.city);
        if (user.profile.state) setState(user.profile.state);
        if (user.profile.postal_code) setPostalCode(user.profile.postal_code);
      }
    }
  }, [user]);

  const unitPrice = product.numericPrice || 0;

  const totalPrice = unitPrice * quantity;
  const formattedTotal = formatINR(totalPrice);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isAuthenticated) {
      setServerError("Please log in or create an account to place your order.");
      openAuthModal("signin", "Please log in or create an account to place your order.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setServerError(null);

    try {
      const payload = {
        product_slug: product.slug,
        quantity,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        city,
        state,
        postal_code: postalCode,
        notes,
        _hp_website: honeypot,
      };

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = getStoredToken();
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setServerError(data.message || "Unable to place order. Please check the provided information.");
        setIsSubmitting(false);
        return;
      }

      setOrderSuccess({
        orderNumber: data.orderNumber || "DT-ORD-CONFIRMED",
        totalAmount: formattedTotal,
      });
      setIsSubmitting(false);
    } catch {
      setServerError("Network error communicating with order service. Please try again or email concierge@designtemptation.com directly.");
      setIsSubmitting(false);
    }
  };

  if (!product.available) {
    return (
      <div className="pt-4 space-y-3">
        <div className="p-4 bg-[#F4F1EA] border border-[#ECE7DF] text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-[#8C877E] font-medium">
            Currently Unavailable
          </p>
          <p className="text-xs text-[#5A5752] font-light pt-1">
            This limited edition piece has completed its current studio production run.
          </p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="pt-4 space-y-4">
        <div className="p-6 bg-white border border-[#171615] space-y-4 text-left">
          <div className="flex items-center gap-2.5 text-[#171615]">
            <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
            <h3 className="font-serif text-lg font-normal">Acquisition Request Confirmed</h3>
          </div>

          <p className="text-xs text-[#5A5752] font-light leading-relaxed">
            Thank you for selecting <strong className="text-[#171615] font-medium">{product.name}</strong>. Your order has been registered under studio reference:
          </p>

          <div className="p-3 bg-[#FAF8F5] border border-[#ECE7DF] font-mono text-sm font-semibold text-[#171615] tracking-wider text-center">
            {orderSuccess.orderNumber}
          </div>

          <div className="space-y-1.5 text-xs text-[#5A5752] font-light border-t border-[#ECE7DF] pt-3">
            <div className="flex justify-between">
              <span>Pieces:</span>
              <span className="text-[#171615] font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Value (INR):</span>
              <span className="text-[#171615] font-semibold">{orderSuccess.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-800 font-medium">Pending Concierge Review</span>
            </div>
          </div>

          <p className="text-[11px] text-[#8C877E] leading-relaxed pt-1">
            Our atelier concierge will reach out to <span className="text-[#171615]">{customerEmail}</span> and <span className="text-[#171615]">{customerPhone}</span> to confirm architectural site access, transport schedule, and official invoice.
          </p>

          <button
            type="button"
            onClick={() => {
              setOrderSuccess(null);
              setIsOpen(false);
            }}
            className="w-full mt-2 py-2.5 border border-[#171615] text-[#171615] text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-[#FAF8F5] transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-4">
      {/* Primary Order & Cart Actions */}
      {cartFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{cartFeedback}</span>
        </div>
      )}

      {!isOpen ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#171615] text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#32302D] transition-colors shadow-sm"
          >
            <span>Direct Acquisition — {product.price}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                const res = await apiAddToCart(product.slug, 1);
                if (res.success) {
                  await refreshCart();
                  setCartFeedback(`Added ${product.name} to your cart.`);
                  setTimeout(() => setCartFeedback(null), 3000);
                }
              }}
              className="py-3 px-4 border border-[#171615] text-[#171615] text-xs font-semibold tracking-wider uppercase hover:bg-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!isAuthenticated) {
                  openAuthModal("signin");
                  return;
                }
                const res = await apiToggleWishlist(product.slug);
                if (res.success) {
                  await refreshWishlist();
                  setCartFeedback(res.message || "Updated wishlist.");
                  setTimeout(() => setCartFeedback(null), 3000);
                }

              }}
              className="py-3 px-4 border border-[#DFD9CF] text-[#5A5752] hover:text-[#171615] hover:border-[#171615] text-xs font-semibold tracking-wider uppercase hover:bg-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#8C877E] text-center tracking-wide">
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#8C877E]" /> Insured White-Glove Freight
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C877E]" /> Verified Studio Edition
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 bg-white border border-[#ECE7DF] space-y-5 text-left">
          <div className="flex items-baseline justify-between border-b border-[#ECE7DF] pb-3">
            <div>
              <h3 className="font-serif text-lg text-[#171615] font-light">Acquisition Request</h3>
              <p className="text-[11px] text-[#8C877E] uppercase tracking-wider">{product.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] uppercase tracking-wider text-[#8C877E] hover:text-[#171615]"
            >
              Cancel
            </button>
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Quantity Selector & Live Total */}
          <div className="p-3.5 bg-[#FAF8F5] border border-[#ECE7DF] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Select Quantity</span>
              <div className="flex items-center border border-[#ECE7DF] bg-white">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-1.5 text-[#171615] hover:bg-[#FAF8F5] disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1 font-mono text-sm font-semibold text-[#171615]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="p-1.5 text-[#171615] hover:bg-[#FAF8F5] disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-baseline justify-between border-t border-[#ECE7DF]/80 pt-2 text-xs">
              <span className="text-[#8C877E]">Total Value:</span>
              <span className="text-base font-semibold text-[#171615] tabular-nums font-sans">
                {formattedTotal}
              </span>
            </div>
            <p className="text-[10px] text-[#8C877E] text-right">
              Includes white-glove transport &amp; installation inside India
            </p>
          </div>

          {/* Honeypot anti-spam trap */}
          <input
            type="text"
            name="_hp_website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Contact Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Elena Vance"
                className="w-full px-3 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
              />
              {errors.customer_name && (
                <p className="text-[10px] text-red-600 mt-1">{errors.customer_name[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. elena@example.com"
                  className="w-full px-3 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
                />
                {errors.customer_email && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.customer_email[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
                />
                {errors.customer_phone && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.customer_phone[0]}</p>
                )}
              </div>
            </div>

            {/* Delivery Fields */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                Delivery Address *
              </label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Apartment/Villa number, Building/Street, Area"
                className="w-full px-3 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615] resize-none"
              />
              {errors.delivery_address && (
                <p className="text-[10px] text-red-600 mt-1">{errors.delivery_address[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="560001"
                  className="w-full px-2.5 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8C877E] mb-1">
                Commission Notes / Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Specific elevator access dimensions, weekend delivery preference"
                className="w-full px-3 py-2 text-xs border border-[#ECE7DF] bg-white text-[#171615] focus:outline-none focus:border-[#171615]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#ECE7DF] space-y-2.5">
            {!isAuthenticated && (
              <div className="p-3 bg-[#FAF8F5] border border-[#ECE7DF] text-xs text-[#5A5752] flex items-center justify-between">
                <span>Please log in or create an account to place your order.</span>
                <button
                  type="button"
                  onClick={() => openAuthModal("signin", "Please log in or create an account to place your order.")}
                  className="text-[11px] uppercase tracking-wider text-[#171615] font-semibold underline underline-offset-2 ml-2 shrink-0"
                >
                  Sign In
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#32302D] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Submitting Order Request..." : `Confirm Order Request (${formattedTotal})`}
            </button>
            <p className="text-[10.5px] text-[#8C877E] text-center leading-relaxed">
              No online payment collected now. Our studio concierge verifies availability and issues an official proforma invoice.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
