"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { OrderRecord } from "@/types";
import { formatINR } from "@/data/content";
import { apiGetMyOrders } from "@/lib/api";
import { Package, Clock, MapPin, ArrowRight, RefreshCw } from "lucide-react";

export default function MyOrdersPage() {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    const res = await apiGetMyOrders();
    if (res.success && Array.isArray(res.data)) {
      setOrders(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-900 border-blue-200";
      case "Processing":
        return "bg-indigo-50 text-indigo-900 border-indigo-200";
      case "Shipped":
        return "bg-purple-50 text-purple-900 border-purple-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-900 border-emerald-200";
      case "Cancelled":
        return "bg-stone-100 text-stone-600 border-stone-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#ECE7DF] pb-6 gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
                Client History
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
                My Studio Orders
              </h1>
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={loadOrders}
                disabled={isLoading}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C877E] hover:text-[#171615] transition-colors self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh Status</span>
              </button>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="p-12 text-center border border-[#ECE7DF] bg-white space-y-4 max-w-lg mx-auto">
              <Package className="w-8 h-8 text-[#8C877E] mx-auto stroke-[1.2]" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#171615]">Sign in to track your acquisitions</h2>
                <p className="text-xs text-[#5A5752] font-light">
                  View order progress, white-glove delivery milestones, and historical references.
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
              Retrieving studio order history...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center border border-[#ECE7DF] bg-white space-y-4 max-w-lg mx-auto">
              <Package className="w-8 h-8 text-[#8C877E] mx-auto stroke-[1.2]" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#171615]">No orders placed yet</h2>
                <p className="text-xs text-[#5A5752] font-light">
                  When you acquire collection pieces, your order reference and real-time status updates will appear here.
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
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#ECE7DF] p-6 sm:p-7 space-y-5"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECE7DF]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold tracking-wider text-[#171615]">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 border font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C877E] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[11px] uppercase tracking-wider text-[#8C877E]">Order Total</p>
                      <p className="text-base font-semibold text-[#171615]">
                        {formatINR(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Order Product Body */}
                  <div className="flex gap-4 sm:gap-6 items-start">
                    {order.product_details?.image && (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#ECE7DF] shrink-0 overflow-hidden">
                        <Image
                          src={order.product_details.image}
                          alt={order.product_details.name || "Product image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                        {order.product_details?.category || "Studio Piece"}
                      </p>
                      <h3 className="font-serif text-lg text-[#171615]">
                        {order.product_details?.name || "Collection Acquisition"}
                      </h3>
                      <div className="text-xs text-[#5A5752] flex gap-4">
                        <span>Quantity: <strong>{order.quantity}</strong></span>
                        <span>Unit: <strong>{formatINR(order.unit_price)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Destination Information */}
                  <div className="pt-3 border-t border-[#ECE7DF] text-xs text-[#5A5752] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#8C877E] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Delivery Destination</span>
                      </p>
                      <p className="font-light text-[#171615]">
                        {order.delivery_address}, {order.city}, {order.state} - {order.postal_code}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#8C877E] font-medium">
                        Recipient &amp; Contact
                      </p>
                      <p className="font-light text-[#171615]">
                        {order.customer_name} &bull; {order.customer_phone}
                      </p>
                      {order.notes && (
                        <p className="text-[11px] text-[#8C877E] italic">
                          Notes: &ldquo;{order.notes}&rdquo;
                        </p>
                      )}
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
