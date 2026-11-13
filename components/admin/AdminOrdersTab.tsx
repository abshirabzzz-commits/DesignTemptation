"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { OrderRecord } from "@/types";
import { formatINR } from "@/data/content";
import { AdminConfirmModal } from "./AdminConfirmModal";
import { apiUpdateOrderStatus, apiDeleteOrder } from "@/lib/api";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

interface AdminOrdersTabProps {
  orders: OrderRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onNotification: (type: "success" | "error", message: string) => void;
  initialSelectedOrder?: OrderRecord | null;
}

export function AdminOrdersTab({
  orders,
  isLoading,
  onRefresh,
  onNotification,
  initialSelectedOrder = null,
}: AdminOrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(initialSelectedOrder);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete State
  const [orderToDelete, setOrderToDelete] = useState<OrderRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    const res = await apiUpdateOrderStatus(orderId, newStatus);
    setIsUpdatingStatus(false);

    if (res.success) {
      onNotification("success", `Order #${selectedOrder?.order_number || orderId} status updated to ${newStatus}.`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to update order status.");
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    const res = await apiDeleteOrder(orderToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      onNotification("success", `Order ${orderToDelete.order_number} removed.`);
      setOrderToDelete(null);
      if (selectedOrder?.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to delete order.");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      searchTerm === "" ||
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.city && o.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-[#ECE7DF] pb-5">
        <h2 className="font-serif text-2xl text-[#171615] font-light">
          Client Acquisitions &amp; Orders
        </h2>
        <p className="text-xs text-[#5A5752] font-light">
          Manage product orders, track delivery logistics, and update order statuses in real-time.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by order reference, client, or email..."
            className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2 pl-9 text-xs focus:outline-none focus:border-[#171615]"
          />
          <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#8C877E]" />
          <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#ECE7DF] px-2.5 py-1.5 text-xs text-[#171615] focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Product Piece</th>
              <th className="py-3 px-4">Total (₹)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading customer orders..." : "No matching orders found."}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#171615]">
                    {order.order_number}
                  </td>
                  <td className="py-3.5 px-4 text-[#8C877E]">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#171615]">{order.customer_name}</p>
                    <p className="text-[10px] text-[#8C877E]">{order.customer_email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-[#171615] truncate max-w-[180px]">
                      {order.product_details?.name || `Product #${order.product}`}
                    </p>
                    <p className="text-[10px] text-[#8C877E]">Qty: {order.quantity}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#171615] font-sans">
                    {formatINR(order.total_amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      disabled={isUpdatingStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 border bg-white focus:outline-none cursor-pointer ${
                        order.status === "Pending"
                          ? "border-amber-300 text-amber-900 bg-amber-50/50"
                          : order.status === "Delivered"
                          ? "border-emerald-300 text-emerald-900 bg-emerald-50/50"
                          : order.status === "Cancelled"
                          ? "border-red-300 text-red-900 bg-red-50/50"
                          : "border-[#ECE7DF] text-[#171615]"
                      }`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="text-[11px] uppercase tracking-wider text-[#171615] hover:underline font-medium cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderToDelete(order)}
                      className="text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 p-1 cursor-pointer"
                      title="Delete order"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Complete Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-xl w-full p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                  Acquisition Order Specification
                </p>
                <h3 className="font-serif text-2xl text-[#171615]">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-xs uppercase tracking-wider text-[#8C877E] hover:text-[#171615]"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Status Update Control */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#ECE7DF]">
                <div>
                  <span className="font-medium text-[#171615] uppercase tracking-wider">
                    Order Status:
                  </span>
                  <p className="text-[10px] text-[#8C877E]">
                    Updates immediately sync to client&apos;s &ldquo;My Orders&rdquo; portal
                  </p>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border bg-[#FAF8F5] cursor-pointer"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Specification */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium">
                  Acquired Piece
                </p>
                <div className="flex gap-4 items-center">
                  {selectedOrder.product_details?.image && (
                    <div className="relative w-16 h-16 bg-[#ECE7DF] shrink-0 border border-[#ECE7DF]">
                      <Image
                        src={selectedOrder.product_details.image}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <p className="font-serif text-base text-[#171615]">
                      {selectedOrder.product_details?.name}
                    </p>
                    <p className="text-[11px] text-[#8C877E]">
                      Quantity: {selectedOrder.quantity} &bull; Unit Price: {formatINR(selectedOrder.unit_price)}
                    </p>
                    <p className="text-xs font-semibold text-[#171615] font-sans">
                      Total Amount: {formatINR(selectedOrder.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium">
                  Client Contact Information
                </p>
                <p className="text-[#171615] font-medium">{selectedOrder.customer_name}</p>
                <p className="text-[#5A5752]">Email: {selectedOrder.customer_email}</p>
                <p className="text-[#5A5752]">Phone: {selectedOrder.customer_phone}</p>
              </div>

              {/* Delivery Address */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8C877E]" />
                  <span>Delivery Street Address</span>
                </p>
                <p className="text-[#171615] font-light">
                  {selectedOrder.delivery_address}
                </p>
                <p className="text-[#171615] font-light">
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}
                </p>
                {selectedOrder.notes && (
                  <p className="pt-2 text-[11px] text-[#8C877E] italic border-t border-[#ECE7DF]/60">
                    Commission Notes: &ldquo;{selectedOrder.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#171615] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#32302D] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(orderToDelete)}
        title="Delete Customer Order?"
        message={`Are you sure you want to permanently delete order "${orderToDelete?.order_number}" placed by ${orderToDelete?.customer_name}?`}
        confirmLabel="Permanently Delete Order"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
}
