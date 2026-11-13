"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import {
  AdminOverviewData,
  AdminProjectRecord,
  CustomerRecord,
  OrderRecord,
  AdminReviewRecord,
  AdminServiceRecord,
} from "@/types";
import {
  apiGetAdminOverview,
  apiGetAdminProjects,
  apiGetAdminProducts,
  apiGetAdminOrders,
  apiGetAdminEnquiries,
  apiGetAdminCustomers,
  apiGetAdminReviews,
  apiGetAdminServices,
} from "@/lib/api";
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminProjectsTab } from "@/components/admin/AdminProjectsTab";
import { AdminProductsTab } from "@/components/admin/AdminProductsTab";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";
import { AdminEnquiriesTab } from "@/components/admin/AdminEnquiriesTab";
import { AdminCustomersTab } from "@/components/admin/AdminCustomersTab";
import { AdminReviewsTab } from "@/components/admin/AdminReviewsTab";
import { AdminServicesTab } from "@/components/admin/AdminServicesTab";
import { AdminSettingsTab } from "@/components/admin/AdminSettingsTab";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [reviews, setReviews] = useState<AdminReviewRecord[]>([]);
  const [services, setServices] = useState<AdminServiceRecord[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Selected item passed into tabs (e.g. from Overview or Customer dossier)
  const [selectedOrderForTab, setSelectedOrderForTab] = useState<OrderRecord | null>(null);
  const [selectedEnquiryForTab, setSelectedEnquiryForTab] = useState<any | null>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setNotification(null);

    try {
      const [
        overviewRes,
        projectsRes,
        productsRes,
        ordersRes,
        enquiriesRes,
        customersRes,
        reviewsRes,
        servicesRes,
      ] = await Promise.all([
        apiGetAdminOverview(),
        apiGetAdminProjects(),
        apiGetAdminProducts(),
        apiGetAdminOrders(),
        apiGetAdminEnquiries(),
        apiGetAdminCustomers(),
        apiGetAdminReviews(),
        apiGetAdminServices(),
      ]);

      if (overviewRes && (overviewRes.stats || overviewRes.success)) {
        setOverviewData(overviewRes as unknown as AdminOverviewData);
      } else if (overviewRes?.data?.stats) {
        setOverviewData(overviewRes.data as unknown as AdminOverviewData);
      }

      if (Array.isArray(projectsRes?.data)) {
        setProjects(projectsRes.data);
      } else if (Array.isArray(projectsRes)) {
        setProjects(projectsRes);
      }

      if (Array.isArray(productsRes?.data)) {
        setProducts(productsRes.data);
      } else if (Array.isArray(productsRes)) {
        setProducts(productsRes);
      }

      if (Array.isArray(ordersRes?.data)) {
        setOrders(ordersRes.data);
      } else if (Array.isArray(ordersRes)) {
        setOrders(ordersRes);
      }

      if (Array.isArray(enquiriesRes?.data)) {
        setEnquiries(enquiriesRes.data);
      } else if (Array.isArray(enquiriesRes)) {
        setEnquiries(enquiriesRes);
      }

      if (Array.isArray(customersRes?.data)) {
        setCustomers(customersRes.data);
      } else if (Array.isArray(customersRes)) {
        setCustomers(customersRes);
      }

      if (Array.isArray(reviewsRes?.data)) {
        setReviews(reviewsRes.data);
      } else if (Array.isArray(reviewsRes)) {
        setReviews(reviewsRes);
      }

      if (Array.isArray(servicesRes?.data)) {
        setServices(servicesRes.data);
      } else if (Array.isArray(servicesRes)) {
        setServices(servicesRes);
      }
    } catch (err: any) {
      console.error("Failed to load admin dashboard data:", err);
      showNotification("error", "Error loading atelier operational data. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, loadData]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectOrderFromOverview = (order: OrderRecord) => {
    setSelectedOrderForTab(order);
    setActiveTab("orders");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectEnquiryFromOverview = (enquiry: any) => {
    setSelectedEnquiryForTab(enquiry);
    setActiveTab("enquiries");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Staff Authorization Gate
  if (!isAuthenticated || !user?.is_staff) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
        <Header />
        <main className="flex-1 pt-32 pb-24 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-[#ECE7DF] p-8 text-center space-y-6 shadow-sm">
            <div className="w-12 h-12 bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#171615] stroke-[1.2]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                  Restricted Studio Console
                </span>
              </div>
              <h1 className="font-serif text-2xl text-[#171615]">
                Curator Authorization Required
              </h1>
              <p className="text-xs text-[#5A5752] font-light leading-relaxed">
                This custom admin dashboard is strictly restricted to authenticated Design Temptation executive staff and curators.
              </p>
            </div>

            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="btn-primary w-full !h-11 text-xs font-semibold tracking-wider uppercase cursor-pointer"
              >
                Staff Sign In
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-amber-900 bg-amber-50 p-3 border border-amber-200 space-y-1">
                  <p className="font-medium">Signed in as {user?.email}</p>
                  <p className="text-[11px] text-[#5A5752]">
                    This user account does not have administrator privileges.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className="inline-block text-xs uppercase tracking-wider text-[#171615] hover:underline"
                  >
                    Return to Public Website
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs uppercase tracking-wider text-red-700 hover:underline cursor-pointer"
                  >
                    Sign In with Different Account
                  </button>
                </div>
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

      {/* Top Administration Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ECE7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#171615] hover:bg-[#FAF8F5] cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/admin-dashboard" className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-wider font-light text-[#171615]">
                DESIGN TEMPTATION
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] bg-[#171615] text-[#FAF8F5] px-2 py-0.5 font-medium">
                Admin Atelier
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#ECE7DF] bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#171615] hover:bg-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <a
              href="https://designtemptation.onrender.com/admin/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors"
            >
              <span>Django Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            user={user}
            onLogout={logout}
            counts={{
              projects: projects.length,
              products: products.length,
              orders: orders.length,
              enquiries: enquiries.length,
              customers: customers.length,
              reviews: reviews.length,
              services: services.length,
            }}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="w-72 bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="p-4 border-b border-[#ECE7DF] flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#171615]">
                  Dashboard Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#8C877E] hover:text-[#171615] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                user={user}
                onLogout={logout}
                counts={{
                  projects: projects.length,
                  products: products.length,
                  orders: orders.length,
                  enquiries: enquiries.length,
                  customers: customers.length,
                  reviews: reviews.length,
                  services: services.length,
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 min-w-0">
          {/* Toast Notification Banner */}
          {notification && (
            <div
              className={`mb-6 p-4 text-xs flex items-center justify-between border ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {notification.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-current opacity-70 hover:opacity-100 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB CONTENT SWITCHER */}
          {activeTab === "overview" && (
            <AdminOverviewTab
              data={overviewData}
              isLoading={isLoading}
              onNavigateTab={handleTabChange}
              onSelectOrder={handleSelectOrderFromOverview}
              onSelectEnquiry={handleSelectEnquiryFromOverview}
            />
          )}

          {activeTab === "projects" && (
            <AdminProjectsTab
              projects={projects}
              isLoading={isLoading}
              onRefresh={loadData}
              onNotification={showNotification}
            />
          )}

          {activeTab === "products" && (
            <AdminProductsTab
              products={products}
              isLoading={isLoading}
              onRefresh={loadData}
              onNotification={showNotification}
            />
          )}

          {activeTab === "orders" && (
            <AdminOrdersTab
              orders={orders}
              isLoading={isLoading}
              onRefresh={loadData}
              onNotification={showNotification}
              initialSelectedOrder={selectedOrderForTab}
            />
          )}

          {activeTab === "enquiries" && (
            <AdminEnquiriesTab
              enquiries={enquiries}
              isLoading={isLoading}
              onRefresh={loadData}
              onNotification={showNotification}
              initialSelectedEnquiry={selectedEnquiryForTab}
            />
          )}

          {activeTab === "customers" && (
            <AdminCustomersTab
              customers={customers}
              isLoading={isLoading}
              onRefresh={loadData}
              onSelectOrder={handleSelectOrderFromOverview}
            />
          )}

          {activeTab === "reviews" && (
            <AdminReviewsTab
              reviews={reviews}
              isLoading={isLoading}
              onRefresh={loadData}
              onNotification={showNotification}
            />
          )}

          {activeTab === "services" && (
            <AdminServicesTab
              services={services}
              isLoading={isLoading}
              onRefresh={loadData}
              onNotification={showNotification}
            />
          )}

          {activeTab === "settings" && (
            <AdminSettingsTab onNotification={showNotification} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
