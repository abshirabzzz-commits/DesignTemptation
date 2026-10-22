"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  Package,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function AccountMenu({ mobile = false }: { mobile?: boolean }) {
  const { user, isAuthenticated, cartCount, wishlistCount, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalBadge = cartCount + wishlistCount;

  if (mobile) {
    if (!isAuthenticated) {
      return (
        <div className="space-y-2 pt-2 border-t border-[#ECE7DF]">
          <p className="text-[10px] tracking-[0.25em] text-[#8C877E] uppercase font-semibold">
            Customer Account
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="py-2.5 px-3 border border-[#171615] text-[11px] font-semibold tracking-wider uppercase text-[#171615] hover:bg-[#171615] hover:text-[#FAF8F5] transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("signup")}
              className="py-2.5 px-3 bg-[#171615] text-[11px] font-semibold tracking-wider uppercase text-[#FAF8F5] hover:bg-[#32302D] transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 pt-3 border-t border-[#ECE7DF]">
        <div className="flex items-center justify-between pb-1">
          <div>
            <p className="text-xs font-serif text-[#171615]">
              {user?.full_name || user?.email}
            </p>
            <p className="text-[10px] text-[#8C877E] truncate">{user?.email}</p>
          </div>
          {user?.is_staff && (
            <span className="text-[9px] uppercase tracking-wider bg-[#171615] text-white px-2 py-0.5">
              Staff
            </span>
          )}
        </div>

        <nav className="flex flex-col space-y-1 text-xs uppercase tracking-wider text-[#32302D]">
          <Link
            href="/account/orders"
            className="flex items-center justify-between py-2 border-b border-[#ECE7DF]/50 hover:text-[#171615]"
          >
            <span className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-between py-2 border-b border-[#ECE7DF]/50 hover:text-[#171615]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Cart</span>
            </span>
            {cartCount > 0 && (
              <span className="text-[10px] bg-[#171615] text-white px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center justify-between py-2 border-b border-[#ECE7DF]/50 hover:text-[#171615]"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              <span>My Wishlist</span>
            </span>
            {wishlistCount > 0 && (
              <span className="text-[10px] bg-[#8C877E] text-white px-1.5 py-0.2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/account/profile"
            className="flex items-center justify-between py-2 border-b border-[#ECE7DF]/50 hover:text-[#171615]"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Profile &amp; Settings</span>
            </span>
          </Link>
          {user?.is_staff && (
            <Link
              href="/admin-dashboard"
              className="flex items-center justify-between py-2 border-b border-[#ECE7DF]/50 text-amber-900 font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 py-2 text-left text-red-700 hover:text-red-900 pt-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    );
  }

  // Desktop Navigation Account Menu
  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isAuthenticated ? "Customer account menu" : "Sign in or register"}
        className="relative h-[38px] px-2.5 sm:px-3 border border-[#DFD9CF] hover:border-[#171615] bg-[#FAF8F5] text-[#171615] flex items-center gap-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615] cursor-pointer"
      >
        <UserIcon className="w-4 h-4 stroke-[1.5]" />
        {isAuthenticated && (
          <span className="text-[11px] uppercase tracking-wider font-medium max-w-[80px] truncate hidden xl:inline-block">
            {user?.first_name || "Account"}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 text-[#8C877E] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {/* Indicator dot if active cart or wishlist */}
        {totalBadge > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#171615] rounded-full ring-2 ring-[#FAF8F5]" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#FAF8F5] border border-[#ECE7DF] shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          {!isAuthenticated ? (
            <div className="p-3 space-y-2">
              <div className="pb-2 border-b border-[#ECE7DF]">
                <p className="font-serif text-sm text-[#171615]">Design Temptation</p>
                <p className="text-[10px] text-[#8C877E]">Atelier Client Services</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal("signin");
                }}
                className="w-full text-center py-2 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-wider uppercase hover:bg-[#32302D] transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal("signup");
                }}
                className="w-full text-center py-2 border border-[#DFD9CF] text-[#171615] text-[11px] font-semibold tracking-wider uppercase hover:bg-white transition-colors cursor-pointer"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal("signin");
                }}
                className="w-full text-center py-1.5 text-[10px] uppercase tracking-wider text-[#8C877E] hover:text-[#171615] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Google Sign-in</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Account Header */}
              <div className="px-4 py-2.5 border-b border-[#ECE7DF] bg-white/50">
                <p className="font-serif text-sm text-[#171615] font-normal truncate">
                  {user?.full_name || "Client Account"}
                </p>
                <p className="text-[10px] text-[#8C877E] truncate">{user?.email}</p>
                {user?.is_staff && (
                  <span className="inline-block mt-1 text-[9px] uppercase tracking-widest bg-[#171615] text-white px-2 py-0.5">
                    Studio Staff
                  </span>
                )}
              </div>

              {/* Menu Links */}
              <div className="py-1 uppercase tracking-wider text-[11px]">
                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-[#F3EFEA] text-[#171615] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-3.5 h-3.5 text-[#8C877E]" />
                    <span>My Orders</span>
                  </span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-[#F3EFEA] text-[#171615] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#8C877E]" />
                    <span>My Cart</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-[#171615] text-white text-[10px] px-1.5 py-0.2 rounded-full font-sans">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-[#F3EFEA] text-[#171615] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-3.5 h-3.5 text-[#8C877E]" />
                    <span>My Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-[#8C877E] text-white text-[10px] px-1.5 py-0.2 rounded-full font-sans">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/account/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-[#F3EFEA] text-[#171615] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Settings className="w-3.5 h-3.5 text-[#8C877E]" />
                    <span>Profile &amp; Settings</span>
                  </span>
                </Link>

                {user?.is_staff && (
                  <Link
                    href="/admin-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-amber-50 text-amber-900 font-semibold border-t border-[#ECE7DF] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Admin Dashboard</span>
                    </span>
                  </Link>
                )}
              </div>

              {/* Logout Button */}
              <div className="border-t border-[#ECE7DF] pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-700 hover:bg-red-50 text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
