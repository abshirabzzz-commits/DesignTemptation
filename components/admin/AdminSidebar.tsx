"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  ShoppingBag,
  Inbox,
  Users,
  MessageSquareQuote,
  Briefcase,
  Sliders,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { AuthUser } from "@/types";

export type AdminTab =
  | "overview"
  | "projects"
  | "products"
  | "orders"
  | "enquiries"
  | "customers"
  | "reviews"
  | "services"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  user: AuthUser | null;
  onLogout: () => void;
  counts?: {
    projects?: number;
    products?: number;
    orders?: number;
    enquiries?: number;
    customers?: number;
    reviews?: number;
    services?: number;
  };
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  user,
  onLogout,
  counts = {},
}: AdminSidebarProps) {
  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban, count: counts.projects },
    { id: "products", label: "Products", icon: Package, count: counts.products },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: counts.orders },
    { id: "enquiries", label: "Enquiries", icon: Inbox, count: counts.enquiries },
    { id: "customers", label: "Customers", icon: Users, count: counts.customers },
    { id: "reviews", label: "Reviews", icon: MessageSquareQuote, count: counts.reviews },
    { id: "services", label: "Services", icon: Briefcase, count: counts.services },
    { id: "settings", label: "Website Settings", icon: Sliders },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-[#ECE7DF] flex flex-col justify-between shrink-0">
      <div className="space-y-6 p-5 sm:p-6">
        {/* Atelier Brand Identification */}
        <div className="space-y-2 border-b border-[#ECE7DF] pb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-800" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-900 font-semibold">
              Executive Atelier
            </span>
          </div>
          <div className="font-serif text-lg tracking-wider text-[#171615] font-light">
            DESIGN TEMPTATION
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
            Client Management Console
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#171615] text-[#FAF8F5] font-medium shadow-sm"
                    : "text-[#5A5752] hover:text-[#171615] hover:bg-[#FAF8F5]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#FAF8F5]" : "text-[#8C877E]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-[#FAF8F5]" : "bg-[#ECE7DF] text-[#5A5752]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Quick Links */}
      <div className="p-5 sm:p-6 border-t border-[#ECE7DF] space-y-4 bg-[#FAF8F5]/60">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">Signed In Curator</p>
          <p className="text-xs font-medium text-[#171615] truncate">{user?.full_name || user?.email || "Staff Admin"}</p>
          <p className="text-[10px] text-[#8C877E] truncate">{user?.email || ""}</p>
        </div>

        <div className="pt-2 border-t border-[#ECE7DF]/60 space-y-2">
          <a
            href="https://designtemptation.onrender.com/admin/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#5A5752] hover:text-[#171615] transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <span>Django Admin</span>
            </span>
            <ExternalLink className="w-3 h-3 text-[#8C877E]" />
          </a>

          <Link
            href="/"
            className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#5A5752] hover:text-[#171615] transition-colors py-1"
          >
            <span>Public Website</span>
            <ChevronRight className="w-3 h-3 text-[#8C877E]" />
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 transition-colors py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
