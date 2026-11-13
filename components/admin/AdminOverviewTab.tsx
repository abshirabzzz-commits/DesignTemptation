"use client";

import React from "react";
import Link from "next/link";
import {
  FolderKanban,
  Package,
  ShoppingBag,
  Inbox,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatINR } from "@/data/content";
import { AdminOverviewData, OrderRecord } from "@/types";

interface AdminOverviewTabProps {
  data: AdminOverviewData | null;
  isLoading: boolean;
  onNavigateTab: (tab: any) => void;
  onSelectOrder: (order: OrderRecord) => void;
  onSelectEnquiry: (enquiry: any) => void;
}

export function AdminOverviewTab({
  data,
  isLoading,
  onNavigateTab,
  onSelectOrder,
  onSelectEnquiry,
}: AdminOverviewTabProps) {
  if (isLoading && !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#171615] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-[#8C877E]">
          Loading Atelier Metrics &amp; Operations...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {
    total_projects: 0,
    total_products: 0,
    total_orders: 0,
    pending_orders: 0,
    total_enquiries: 0,
    pending_enquiries: 0,
    total_customers: 0,
    gross_revenue: 0,
  };

  const recentOrders = data?.recent_orders || [];
  const recentEnquiries = data?.recent_enquiries || [];
  const recentActivities = data?.recent_activities || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Summary Banner */}
      <div className="bg-white border border-[#ECE7DF] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-amber-800">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
              Live Atelier Status
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171615] font-light">
            Studio Operational Command
          </h2>
          <p className="text-xs text-[#5A5752] font-light leading-relaxed">
            Real-time portfolio commissions, curated product acquisitions, client enquiries, and customer accounts operating on production database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab("projects")}
            className="px-4 py-2.5 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors"
          >
            Manage Projects
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("products")}
            className="px-4 py-2.5 border border-[#ECE7DF] bg-white text-xs uppercase tracking-wider text-[#171615] hover:bg-[#FAF8F5] transition-colors"
          >
            Manage Products
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div
          onClick={() => onNavigateTab("projects")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Total Projects</span>
            <FolderKanban className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{stats.total_projects}</p>
          <p className="text-[10px] text-[#8C877E]">Architectural &amp; interior commissions</p>
        </div>

        {/* Total Products */}
        <div
          onClick={() => onNavigateTab("products")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Curated Objects</span>
            <Package className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{stats.total_products}</p>
          <p className="text-[10px] text-[#8C877E]">Furnishings &amp; luminaires</p>
        </div>

        {/* Total Orders & Pending */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Customer Orders</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{stats.total_orders}</p>
            {stats.pending_orders > 0 && (
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 border border-amber-200">
                {stats.pending_orders} pending
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#8C877E]">Acquisitions logged</p>
        </div>

        {/* Gross Revenue */}
        <div className="bg-white border border-[#ECE7DF] p-5 space-y-1.5">
          <div className="flex items-center justify-between text-[#8C877E]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Total Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#171615] truncate">
            {formatINR(stats.gross_revenue)}
          </p>
          <p className="text-[10px] text-[#8C877E]">Gross acquisition value (INR)</p>
        </div>

        {/* Total Enquiries */}
        <div
          onClick={() => onNavigateTab("enquiries")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Client Inquiries</span>
            <Inbox className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{stats.total_enquiries}</p>
            {stats.pending_enquiries > 0 && (
              <span className="text-[10px] uppercase tracking-wider text-blue-800 font-semibold bg-blue-50 px-1.5 py-0.5 border border-blue-200">
                {stats.pending_enquiries} new
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#8C877E]">Architecture &amp; turnkey requests</p>
        </div>

        {/* Registered Customers */}
        <div
          onClick={() => onNavigateTab("customers")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Registered Clients</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#171615]">{stats.total_customers}</p>
          <p className="text-[10px] text-[#8C877E]">Customer atelier accounts</p>
        </div>

        {/* Quick Action: Reviews */}
        <div
          onClick={() => onNavigateTab("reviews")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Client Reviews</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#171615]">Manage</p>
          <p className="text-[10px] text-[#8C877E]">Approve, feature &amp; moderate</p>
        </div>

        {/* Quick Action: Settings */}
        <div
          onClick={() => onNavigateTab("settings")}
          className="bg-white border border-[#ECE7DF] p-5 space-y-1.5 hover:border-[#171615] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C877E] group-hover:text-[#171615]">
            <span className="text-[10px] uppercase tracking-wider font-medium">Studio Settings</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[#171615]">Branding</p>
          <p className="text-[10px] text-[#8C877E]">Contact, hero &amp; metadata</p>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders + Activity & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Orders */}
        <div className="bg-white border border-[#ECE7DF] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-3">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg text-[#171615] font-light">Recent Orders</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">Latest acquisitions</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("orders")}
              className="text-xs uppercase tracking-wider text-[#171615] hover:underline font-medium"
            >
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#8C877E]">No studio orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-[#ECE7DF]">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors px-2 cursor-pointer group"
                >
                  <div className="space-y-0.5 min-w-0 pr-4">
                    <p className="font-mono text-xs font-medium text-[#171615] group-hover:text-amber-900">
                      {order.order_number}
                    </p>
                    <p className="text-[11px] text-[#5A5752] truncate">
                      {order.customer_name} &bull; {order.product_details?.name || "Product piece"}
                    </p>
                    <p className="text-[10px] text-[#8C877E]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-[#171615] font-sans">
                      {formatINR(order.total_amount)}
                    </p>
                    <span
                      className={`inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                        order.status === "Pending"
                          ? "bg-amber-50 text-amber-900 border-amber-200"
                          : order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                          : "bg-[#FAF8F5] text-[#171615] border-[#ECE7DF]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Inquiries & Activity Feed */}
        <div className="space-y-6">
          {/* Recent Enquiries */}
          <div className="bg-white border border-[#ECE7DF] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-3">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg text-[#171615] font-light">Recent Inquiries</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">Client commissions</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("enquiries")}
                className="text-xs uppercase tracking-wider text-[#171615] hover:underline font-medium"
              >
                View All
              </button>
            </div>

            {recentEnquiries.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#8C877E]">No project enquiries received yet.</p>
            ) : (
              <div className="divide-y divide-[#ECE7DF]">
                {recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    onClick={() => onSelectEnquiry(enq)}
                    className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors px-2 cursor-pointer group"
                  >
                    <div className="space-y-0.5 min-w-0 pr-4">
                      <p className="text-xs font-medium text-[#171615] group-hover:text-amber-900">
                        {enq.full_name}
                      </p>
                      <p className="text-[11px] text-[#5A5752] truncate">
                        {enq.project_type} ({enq.property_type}) &bull; {enq.project_location}
                      </p>
                      <p className="text-[10px] text-[#8C877E]">
                        Budget: {enq.budget_range || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                        enq.status === "New"
                          ? "bg-blue-50 text-blue-900 border-blue-200"
                          : enq.status === "Completed"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                          : "bg-[#FAF8F5] text-[#171615] border-[#ECE7DF]"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          {recentActivities.length > 0 && (
            <div className="bg-white border border-[#ECE7DF] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#ECE7DF] pb-3">
                <Activity className="w-4 h-4 text-[#8C877E]" />
                <h3 className="font-serif text-lg text-[#171615] font-light">Recent Activity Stream</h3>
              </div>
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171615] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#171615]">{act.title}</p>
                      <p className="text-[11px] text-[#5A5752] leading-relaxed">{act.description}</p>
                      <p className="text-[10px] text-[#8C877E] pt-0.5">
                        {new Date(act.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
