"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { CartItem } from "@/types";
import { formatINR } from "@/data/content";
import {
  apiGetCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  getStoredToken,
} from "@/lib/api";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const { isAuthenticated, openAuthModal, refreshCart, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Checkout modal / state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{
    orderNumber: string;
    totalAmount: string;
  } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Delivery info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const loadCart = async () => {
    setIsLoading(true);
    const res = await apiGetCart();
    if (res.success && res.items) {
      setItems(res.items);
      setTotalAmount(res.total_amount || 0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCart();
    if (isAuthenticated && user) {
      setName(user.full_name || "");
      setEmail(user.email || "");
      if (user.profile) {
        setPhone(user.profile.phone || "");
        setAddress(user.profile.delivery_address || "");
        if (user.profile.city) setCity(user.profile.city);
        if (user.profile.state) setState(user.profile.state);
        if (user.profile.postal_code) setPostalCode(user.profile.postal_code);
      }
    }
  }, [isAuthenticated, user]);

  const handleQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > 10) return;

    setIsUpdating(item.id);
    const res = await apiUpdateCartItem(item.id, newQty);
    if (res.success) {
      await loadCart();
      await refreshCart();
    }
    setIsUpdating(null);
  };

  const handleRemove = async (itemId: number) => {
    setIsUpdating(itemId);
    const res = await apiRemoveCartItem(itemId);
    if (res.success) {
      await loadCart();
      await refreshCart();
    }
    setIsUpdating(null);
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to empty your cart?")) {
      await apiClearCart();
      await loadCart();
      await refreshCart();
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutSubmitting || items.length === 0) return;

    if (!isAuthenticated) {
      setCheckoutError("Please log in or create an account to place your order.");
      openAuthModal("signin", "Please log in or create an account to place your order.");
      return;
    }

    setCheckoutSubmitting(true);
    setCheckoutError(null);

    try {
      // Process acquisitions for items in cart
      // Place order for primary cart item through server route with trusted backend computation
      const primaryItem = items[0];
      const payload = {
        product_slug: primaryItem.product_details.slug,
        quantity: primaryItem.quantity,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        city,
        state,
        postal_code: postalCode,
        notes: notes ? `${notes} [Batch acquisition: ${items.length} piece(s)]` : `[Batch acquisition: ${items.length} piece(s)]`,
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
        setCheckoutError(data.message || "Failed to process acquisition order.");
        setCheckoutSubmitting(false);
        return;
      }

      // Clear cart on success
      await apiClearCart();
      await refreshCart();

      setCheckoutSuccess({
        orderNumber: data.orderNumber,
        totalAmount: formatINR(totalAmount),
      });
      setCheckoutSubmitting(false);
    } catch {
      setCheckoutError("Network error while submitting order. Please contact studio concierge directly.");
      setCheckoutSubmitting(false);
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
              Atelier Acquisition
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
              Your Curated Cart
            </h1>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-xs text-[#8C877E] uppercase tracking-widest">
              <span className="inline-block w-4 h-4 border-2 border-[#171615]/30 border-t-[#171615] rounded-full animate-spin mr-2 align-middle" />
              Loading your curated pieces...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center border border-[#ECE7DF] bg-white space-y-4 max-w-lg mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#8C877E] mx-auto stroke-[1.2]" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#171615]">Your cart is empty</h2>
                <p className="text-xs text-[#5A5752] font-light">
                  Explore our limited studio collection or sign in to access your saved pieces.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  href="/products"
                  className="btn-primary inline-flex items-center justify-center !h-11 text-xs font-semibold tracking-[0.16em] uppercase px-8"
                >
                  Explore Collection
                </Link>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => openAuthModal("signin")}
                    className="py-2.5 px-6 border border-[#171615] text-[#171615] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-[#FAF8F5]"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider text-[#8C877E] pb-2 border-b border-[#ECE7DF]">
                  <span>Collection Pieces ({items.length})</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-[#ECE7DF] border-b border-[#ECE7DF]">
                  {items.map((item) => (
                    <div key={item.id} className="py-5 flex gap-4 sm:gap-6 items-center">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#ECE7DF] shrink-0 overflow-hidden">
                        <Image
                          src={item.product_details.image}
                          alt={item.product_details.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                          {item.product_details.category}
                        </p>
                        <Link
                          href={`/products/${item.product_details.slug}`}
                          className="font-serif text-base sm:text-lg text-[#171615] hover:underline"
                        >
                          {item.product_details.name}
                        </Link>
                        <p className="text-xs font-sans text-[#171615] font-medium">
                          {formatINR(item.product_details.numericPrice || 0)}
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center border border-[#ECE7DF] bg-white">
                            <button
                              type="button"
                              disabled={isUpdating === item.id || item.quantity <= 1}
                              onClick={() => handleQuantity(item, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#F3EFEA] text-[#171615] disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isUpdating === item.id || item.quantity >= 10}
                              onClick={() => handleQuantity(item, 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#F3EFEA] text-[#171615] disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            disabled={isUpdating === item.id}
                            onClick={() => handleRemove(item.id)}
                            className="text-xs text-[#8C877E] hover:text-red-700 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#8C877E] uppercase tracking-wider">Subtotal</p>
                        <p className="text-sm font-semibold text-[#171615]">
                          {formatINR(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs text-[#5A5752] font-light">
                  <ShieldCheck className="w-4 h-4 text-[#8C877E]" />
                  <span>White-glove delivery &amp; installation coordinated upon order review.</span>
                </div>
              </div>

              {/* Order Summary & Checkout Card */}
              <div className="lg:col-span-5 bg-white border border-[#ECE7DF] p-6 sm:p-7 space-y-6">
                <div className="space-y-2 border-b border-[#ECE7DF] pb-4">
                  <h2 className="font-serif text-xl text-[#171615]">Order Summary</h2>
                  <p className="text-xs text-[#8C877E]">Prices are in Indian Rupees (INR ₹).</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#5A5752]">
                    <span>Items Subtotal</span>
                    <span className="font-medium text-[#171615]">{formatINR(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#5A5752]">
                    <span>White-Glove Transport</span>
                    <span className="text-[#8C877E] italic">Calculated upon concierge review</span>
                  </div>
                  <div className="border-t border-[#ECE7DF] pt-3 flex justify-between text-sm font-semibold text-[#171615]">
                    <span>Estimated Total</span>
                    <span>{formatINR(totalAmount)}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <div className="space-y-3">
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
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setCheckoutError("Please log in or create an account to place your order.");
                          openAuthModal("signin", "Please log in or create an account to place your order.");
                          return;
                        }
                        setIsCheckingOut(true);
                      }}
                      className="btn-primary w-full !h-12 text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Delivery Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2 border-t border-[#ECE7DF]">
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#171615]">
                      Delivery &amp; Contact Information
                    </p>

                    {checkoutError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{checkoutError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">
                          Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">
                        Delivery Street Address
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">State</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">PIN</label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-[#5A5752] block">
                        Special Instructions / Notes
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Elevator access available"
                        className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs"
                      />
                    </div>

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

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="py-2.5 px-3 border border-[#ECE7DF] text-xs uppercase tracking-wider hover:bg-[#FAF8F5]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={checkoutSubmitting}
                        className="btn-primary flex-1 !h-11 text-xs font-semibold tracking-[0.16em] uppercase disabled:opacity-50"
                      >
                        {checkoutSubmitting ? "Placing Order..." : "Confirm Studio Acquisition"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Checkout Success Modal */}
          {checkoutSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-[#FAF8F5] border border-[#ECE7DF] p-8 max-w-md w-full space-y-6 text-center shadow-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto stroke-[1.5]" />
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C877E] font-medium">
                    Order Confirmed
                  </p>
                  <h2 className="font-serif text-2xl text-[#171615]">Acquisition Received</h2>
                  <p className="text-xs text-[#5A5752] font-light">
                    Your acquisition reference is <span className="font-mono font-medium text-[#171615]">{checkoutSuccess.orderNumber}</span>. Our atelier concierge will contact you to coordinate white-glove transport.
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#ECE7DF] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8C877E]">Total Order Amount:</span>
                    <span className="font-medium text-[#171615]">{checkoutSuccess.totalAmount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/account/orders"
                    className="btn-primary flex-1 !h-10 text-xs font-semibold tracking-wider uppercase flex items-center justify-center"
                  >
                    View My Orders
                  </Link>
                  <Link
                    href="/products"
                    className="py-2 px-4 border border-[#ECE7DF] text-xs uppercase tracking-wider hover:bg-white flex items-center justify-center"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
