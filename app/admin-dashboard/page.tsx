"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { OrderRecord } from "@/types";
import { formatINR } from "@/data/content";
import {
  apiGetAdminOrders,
  apiUpdateOrderStatus,
  apiGetAdminEnquiries,
  apiUpdateEnquiryStatus,
} from "@/lib/api";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  Lock,
  RefreshCw,
  TrendingUp,
  Inbox,
  Package,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "enquiries">("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setNotification(null);

    const [ordersRes, enquiriesRes] = await Promise.all([
      apiGetAdminOrders({ status: statusFilter, search: orderSearch }),
      apiGetAdminEnquiries(),
    ]);

    if (ordersRes.success) {
      if (Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      } else if (Array.isArray(ordersRes)) {
        setOrders(ordersRes);
      }
    }
    if (enquiriesRes.success) {
      if (Array.isArray(enquiriesRes.data)) {
        setEnquiries(enquiriesRes.data);
      } else if (Array.isArray(enquiriesRes)) {
        setEnquiries(enquiriesRes);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    const res = await apiUpdateOrderStatus(orderId, newStatus);
    setIsUpdatingStatus(false);

    if (res.success) {
      setNotification({
        type: "success",
        message: `Order status updated to ${newStatus}.`,
      });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      await loadData();
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({
        type: "error",
        message: res.message || "Failed to update order status.",
      });
    }
  };

  const handleEnquiryStatusChange = async (enquiryId: number, newStatus: string) => {
    const res = await apiUpdateEnquiryStatus(enquiryId, newStatus);
    if (res.success) {
      setNotification({
        type: "success",
        message: `Enquiry status updated to ${newStatus}.`,
      });
      await loadData();
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // KPI Computations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalEnquiriesCount = enquiries.length;

  if (!isAuthenticated || !user?.is_staff) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
        <Header />
        <main className="flex-1 pt-32 pb-24 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-[#ECE7DF] p-8 text-center space-y-5">
            <Lock className="w-10 h-10 text-[#8C877E] mx-auto stroke-[1.2]" />
            <div className="space-y-1.5">
              <h1 className="font-serif text-2xl text-[#171615]">Administrator Access Required</h1>
              <p className="text-xs text-[#5A5752] font-light">
                This dashboard is strictly restricted to authenticated Design Temptation staff and curators.
              </p>
            </div>
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="btn-primary w-full !h-11 text-xs font-semibold tracking-wider uppercase"
              >
                Staff Sign In
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-amber-900 bg-amber-50 p-2 border border-amber-200">
                  Signed in as <strong>{user?.email}</strong>, which does not have staff permissions.
                </p>
                <Link
                  href="/"
                  className="inline-block text-xs uppercase tracking-wider text-[#8C877E] hover:text-[#171615]"
                >
                  Return to Homepage
                </Link>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#ECE7DF] pb-6 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-900 font-semibold">
                  Studio Administration
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
                Executive Atelier Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#ECE7DF] bg-white text-xs uppercase tracking-wider text-[#171615] hover:bg-[#FAF8F5] transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <a
                href="https://designtemptation.onrender.com/admin/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors"
              >
                <span>Django Admin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Feedback Notification */}
          {notification && (
            <div
              className={`p-3 text-xs flex items-center gap-2 border ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* KPI Analytics Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-[#ECE7DF] p-5 space-y-1">
              <div className="flex items-center justify-between text-[#8C877E]">
                <span className="text-[10px] uppercase tracking-wider font-medium">Total Orders</span>
                <Package className="w-4 h-4" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{totalOrdersCount}</p>
              <p className="text-[10px] text-[#8C877E]">Acquisitions logged</p>
            </div>

            <div className="bg-white border border-[#ECE7DF] p-5 space-y-1">
              <div className="flex items-center justify-between text-[#8C877E]">
                <span className="text-[10px] uppercase tracking-wider font-medium">Pending Review</span>
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl text-amber-900">{pendingOrdersCount}</p>
              <p className="text-[10px] text-amber-800">Requires concierge contact</p>
            </div>

            <div className="bg-white border border-[#ECE7DF] p-5 space-y-1">
              <div className="flex items-center justify-between text-[#8C877E]">
                <span className="text-[10px] uppercase tracking-wider font-medium">Gross Acquisition</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl text-[#171615] truncate">
                {formatINR(totalRevenue)}
              </p>
              <p className="text-[10px] text-[#8C877E]">Total volume in INR</p>
            </div>

            <div className="bg-white border border-[#ECE7DF] p-5 space-y-1">
              <div className="flex items-center justify-between text-[#8C877E]">
                <span className="text-[10px] uppercase tracking-wider font-medium">Project Inquiries</span>
                <Inbox className="w-4 h-4" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{totalEnquiriesCount}</p>
              <p className="text-[10px] text-[#8C877E]">Architecture &amp; interiors</p>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-[#ECE7DF] text-xs uppercase tracking-[0.16em]">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`py-3 px-6 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "border-[#171615] text-[#171615]"
                  : "border-transparent text-[#8C877E] hover:text-[#171615]"
              }`}
            >
              Customer Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              className={`py-3 px-6 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "enquiries"
                  ? "border-[#171615] text-[#171615]"
                  : "border-transparent text-[#8C877E] hover:text-[#171615]"
              }`}
            >
              Project Enquiries ({enquiries.length})
            </button>
          </div>

          {/* TAB 1: CUSTOMER ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order #, client name, or email..."
                    className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2 pl-9 text-xs focus:outline-none focus:border-[#171615]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-2.5" />
                </form>

                <div className="flex items-center gap-2 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#8C877E]" />
                  <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-[#ECE7DF] px-2.5 py-1.5 text-xs text-[#171615] focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
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
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                          No matching studio orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-[#171615]">
                            {order.order_number}
                          </td>
                          <td className="py-3.5 px-4 text-[#8C877E]">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
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
                          <td className="py-3.5 px-4 font-semibold text-[#171615]">
                            {formatINR(order.total_amount)}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              disabled={isUpdatingStatus}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 border bg-white focus:outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="text-[11px] uppercase tracking-wider text-[#171615] hover:underline font-medium"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Project &amp; Property</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Budget Range</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DF]">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#8C877E] text-xs">
                        No project enquiries received yet.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3.5 px-4 text-[#8C877E]">
                          {new Date(enq.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#171615]">{enq.full_name}</p>
                          <p className="text-[10px] text-[#8C877E]">
                            {enq.email} &bull; {enq.phone}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-[#171615]">{enq.project_type}</p>
                          <p className="text-[10px] text-[#8C877E]">{enq.property_type}</p>
                        </td>
                        <td className="py-3.5 px-4 text-[#5A5752]">{enq.project_location}</td>
                        <td className="py-3.5 px-4 font-medium text-[#171615]">{enq.budget_range || "N/A"}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={enq.status}
                            onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                            className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 border bg-white focus:outline-none cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Complete Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-xl w-full p-7 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                      Order Specification
                    </p>
                    <h2 className="font-serif text-2xl text-[#171615]">
                      {selectedOrder.order_number}
                    </h2>
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
                  {/* Status Selection */}
                  <div className="flex items-center justify-between p-3 bg-white border border-[#ECE7DF]">
                    <span className="font-medium text-[#171615] uppercase tracking-wider">
                      Current Status:
                    </span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border bg-[#FAF8F5]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Product Specification */}
                  <div className="p-4 bg-white border border-[#ECE7DF] space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium">
                      Acquired Product
                    </p>
                    <div className="flex gap-4 items-center">
                      {selectedOrder.product_details?.image && (
                        <div className="relative w-16 h-16 bg-[#ECE7DF] shrink-0">
                          <Image
                            src={selectedOrder.product_details.image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-serif text-base text-[#171615]">
                          {selectedOrder.product_details?.name}
                        </p>
                        <p className="text-[11px] text-[#8C877E]">
                          Quantity: {selectedOrder.quantity} &bull; Unit: {formatINR(selectedOrder.unit_price)}
                        </p>
                        <p className="text-xs font-semibold text-[#171615]">
                          Total: {formatINR(selectedOrder.total_amount)}
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
                      <MapPin className="w-3 h-3" />
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
                    className="btn-primary !h-10 text-xs font-semibold tracking-wider uppercase px-6"
                  >
                    Close
                  </button>
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
