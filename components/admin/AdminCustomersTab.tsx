"use client";

import React, { useState } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Shield,
  User,
  X,
  CreditCard,
} from "lucide-react";
import { CustomerRecord, OrderRecord } from "@/types";
import { formatINR } from "@/data/content";
import { apiGetAdminCustomerDetail } from "@/lib/api";

interface AdminCustomersTabProps {
  customers: CustomerRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectOrder?: (order: OrderRecord) => void;
}

export function AdminCustomersTab({
  customers,
  isLoading,
  onRefresh,
  onSelectOrder,
}: AdminCustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleOpenCustomer = async (cust: CustomerRecord) => {
    setSelectedCustomer(cust);
    setIsLoadingDetail(true);
    const res = await apiGetAdminCustomerDetail(cust.id);
    setIsLoadingDetail(false);
    if (res.success && Array.isArray(res.orders)) {
      setCustomerOrders(res.orders);
    } else {
      setCustomerOrders([]);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const s = searchTerm.toLowerCase();
    return (
      searchTerm === "" ||
      c.email.toLowerCase().includes(s) ||
      c.full_name.toLowerCase().includes(s) ||
      (c.phone && c.phone.includes(s)) ||
      (c.city && c.city.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-[#ECE7DF] pb-5">
        <h2 className="font-serif text-2xl text-[#171615] font-light">
          Registered Client Atelier Accounts
        </h2>
        <p className="text-xs text-[#5A5752] font-light">
          Review client contact dossiers, saved shipping coordinates, and cumulative purchase history.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by client name, email, phone, or city..."
          className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2 pl-9 text-xs focus:outline-none focus:border-[#171615]"
        />
        <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-2.5" />
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Client Name &amp; Email</th>
              <th className="py-3 px-4">Phone / WhatsApp</th>
              <th className="py-3 px-4">Primary City</th>
              <th className="py-3 px-4">Registration</th>
              <th className="py-3 px-4 text-center">Acquisitions</th>
              <th className="py-3 px-4 text-right">Cumulative Value</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading customer directory..." : "No registered customers found."}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#171615] font-serif uppercase shrink-0">
                        {cust.full_name ? cust.full_name[0] : cust.email[0]}
                      </div>
                      <div>
                        <p className="font-medium text-[#171615] flex items-center gap-1.5">
                          <span>{cust.full_name}</span>
                          {cust.is_staff && (
                            <span className="text-[9px] uppercase tracking-wider text-amber-900 bg-amber-50 px-1 py-0.2 border border-amber-200">
                              Staff
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-[#8C877E]">{cust.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#5A5752] font-mono">
                    {cust.phone || <span className="text-[#8C877E] italic">&mdash;</span>}
                  </td>
                  <td className="py-3.5 px-4 text-[#5A5752]">
                    {cust.city ? `${cust.city}, ${cust.state || "IN"}` : <span className="text-[#8C877E] italic">&mdash;</span>}
                  </td>
                  <td className="py-3.5 px-4 text-[#8C877E]">
                    {new Date(cust.date_joined).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#ECE7DF] text-[#171615]">
                      {cust.order_count || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#171615] font-sans">
                    {formatINR(cust.total_spent || 0)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenCustomer(cust)}
                      className="text-[11px] uppercase tracking-wider text-[#171615] hover:underline font-medium cursor-pointer"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Profile & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-xl w-full p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                  Client Account Dossier
                </p>
                <h3 className="font-serif text-2xl text-[#171615]">
                  {selectedCustomer.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-xs uppercase tracking-wider text-[#8C877E] hover:text-[#171615]"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Account Summary */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-white border border-[#ECE7DF]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C877E]">Account Email</span>
                  <p className="font-medium text-[#171615] pt-0.5">{selectedCustomer.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C877E]">Phone / WhatsApp</span>
                  <p className="font-medium text-[#171615] pt-0.5">{selectedCustomer.phone || "Not set"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C877E]">Member Since</span>
                  <p className="text-[#5A5752] pt-0.5">
                    {new Date(selectedCustomer.date_joined).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C877E]">Cumulative Volume</span>
                  <p className="font-semibold text-emerald-800 pt-0.5 font-sans">
                    {formatINR(selectedCustomer.total_spent || 0)}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8C877E]" />
                  <span>Default Shipping Destination</span>
                </p>
                {selectedCustomer.delivery_address ? (
                  <>
                    <p className="text-[#171615] font-light leading-relaxed">
                      {selectedCustomer.delivery_address}
                    </p>
                    <p className="text-[#5A5752] font-light">
                      {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.postal_code}
                    </p>
                  </>
                ) : (
                  <p className="text-[#8C877E] italic">No default delivery address configured by customer.</p>
                )}
              </div>

              {/* Customer Order History */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-3">
                <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium">
                    Acquisition Order History ({customerOrders.length})
                  </p>
                  <span className="text-[10px] text-[#8C877E]">Direct client purchases</span>
                </div>

                {isLoadingDetail ? (
                  <p className="py-4 text-center text-[#8C877E]">Loading client order history...</p>
                ) : customerOrders.length === 0 ? (
                  <p className="py-4 text-center text-[#8C877E]">No orders placed by this customer yet.</p>
                ) : (
                  <div className="divide-y divide-[#ECE7DF] max-h-48 overflow-y-auto">
                    {customerOrders.map((ord) => (
                      <div key={ord.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-mono font-medium text-[#171615]">{ord.order_number}</p>
                          <p className="text-[11px] text-[#5A5752]">
                            {ord.product_details?.name} (Qty: {ord.quantity})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#171615] font-sans">{formatINR(ord.total_amount)}</p>
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border bg-[#FAF8F5]">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2 bg-[#171615] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#32302D] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
