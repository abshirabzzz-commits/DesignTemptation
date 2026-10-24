"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { AuthUser } from "@/types";
import {
  apiGetMe,
  apiLogin,
  apiRegister,
  apiGoogleAuth,
  apiLogout,
  apiUpdateProfile,
  apiGetCart,
  apiAddToCart,
  apiGetWishlist,
  getStoredToken,
  setStoredToken,
  syncGuestCartToServer,
} from "@/lib/api";

export interface PendingCartItem {
  slug: string;
  quantity: number;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  cartCount: number;
  wishlistCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; errors?: any }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string; errors?: any }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ success: boolean; message?: string; errors?: any }>;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup" | "forgot";
  authModalMessage: string | null;
  openAuthModal: (tab?: "signin" | "signup" | "forgot", message?: string) => void;
  closeAuthModal: () => void;
  addToCart: (productSlug: string, quantity?: number, productName?: string) => Promise<{ success: boolean; message?: string; requiresAuth?: boolean }>;
  cartFeedback: string | null;
  clearCartFeedback: () => void;
  pendingCartItem: PendingCartItem | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null);

  const [pendingCartItem, setPendingCartItem] = useState<PendingCartItem | null>(null);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const isAddingRef = useRef(false);

  const clearCartFeedback = useCallback(() => {
    setCartFeedback(null);
  }, []);

  const openAuthModal = useCallback((tab: "signin" | "signup" | "forgot" = "signin", message?: string) => {
    setAuthModalTab(tab);
    setAuthModalMessage(message || null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMessage(null);
    // User cancelled authentication: discard pending cart addition
    setPendingCartItem(null);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!getStoredToken()) {
      setCartCount(0);
      return;
    }
    const res = await apiGetCart();
    if (res.success && res.total_items !== undefined) {
      setCartCount(res.total_items);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    if (!getStoredToken()) {
      setWishlistCount(0);
      return;
    }
    const res = await apiGetWishlist();
    if (res.success && Array.isArray(res.data)) {
      setWishlistCount(res.data.length);
    }
  }, []);

  // Helper to execute pending cart addition immediately following successful authentication
  const executePendingCartAddition = useCallback(async () => {
    if (!pendingCartItem) return;
    const itemToAdd = pendingCartItem;
    // Clear pendingCartItem immediately to prevent duplicate additions
    setPendingCartItem(null);

    try {
      const res = await apiAddToCart(itemToAdd.slug, itemToAdd.quantity);
      if (res.success) {
        const msg = `Added ${itemToAdd.name || "piece"} to your cart.`;
        setCartFeedback(msg);
        setTimeout(() => setCartFeedback(null), 5000);
      }
    } catch {
      // Continue gracefully
    }
  }, [pendingCartItem]);

  // Initial authentication check
  useEffect(() => {
    async function loadUser() {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiGetMe();
        if (res.success && res.user) {
          setUser(res.user);
          await Promise.all([refreshCart(), refreshWishlist()]);
        } else {
          setStoredToken(null);
          setUser(null);
        }
      } catch {
        setStoredToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [refreshCart, refreshWishlist]);

  const addToCart = useCallback(async (productSlug: string, quantity: number = 1, productName?: string) => {
    if (isAddingRef.current) {
      return { success: false, message: "Addition in progress..." };
    }

    const token = getStoredToken();
    if (!token || !user) {
      // Remember selected product and quantity while authentication is in progress
      setPendingCartItem({ slug: productSlug, quantity, name: productName });
      openAuthModal("signin", "Please sign in or create an atelier account to add items to your cart.");
      return { success: false, requiresAuth: true };
    }

    isAddingRef.current = true;
    try {
      const res = await apiAddToCart(productSlug, quantity);
      if (res.success) {
        await refreshCart();
        const successMsg = `Added ${productName || "piece"} to your cart.`;
        setCartFeedback(successMsg);
        setTimeout(() => setCartFeedback(null), 4000);
        return { success: true, message: successMsg };
      }
      return { success: false, message: res.message || "Failed to add piece to cart." };
    } finally {
      isAddingRef.current = false;
    }
  }, [user, openAuthModal, refreshCart]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    if (res.success && res.token && res.user) {
      setStoredToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthModalMessage(null);
      await syncGuestCartToServer();
      await executePendingCartAddition();
      await Promise.all([refreshCart(), refreshWishlist()]);
      return { success: true };
    }
    return {
      success: false,
      message: res.message || "Invalid email or password.",
      errors: res.errors,
    };
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await apiRegister({ name, email, password, phone });
    if (res.success && res.token && res.user) {
      setStoredToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthModalMessage(null);
      await syncGuestCartToServer();
      await executePendingCartAddition();
      await Promise.all([refreshCart(), refreshWishlist()]);
      return { success: true };
    }
    return {
      success: false,
      message: res.message || "Registration failed. Please check the fields.",
      errors: res.errors,
    };
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await apiGoogleAuth(credential);
    if (res.success && res.token && res.user) {
      setStoredToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthModalMessage(null);
      await syncGuestCartToServer();
      await executePendingCartAddition();
      await Promise.all([refreshCart(), refreshWishlist()]);
      return { success: true };
    }
    return {
      success: false,
      message: res.message || "Google authentication failed.",
    };
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore network errors on logout
    }
    setStoredToken(null);
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    setPendingCartItem(null);
    setCartFeedback(null);
  };

  const updateProfile = async (data: any) => {
    const res = await apiUpdateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true, message: res.message };
    }
    return {
      success: false,
      message: res.message || "Failed to update profile.",
      errors: res.errors,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        cartCount,
        wishlistCount,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshCart,
        refreshWishlist,
        isAuthModalOpen,
        authModalTab,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        addToCart,
        cartFeedback,
        clearCartFeedback,
        pendingCartItem,
      }}
    >
      {children}

      {/* Floating Studio Notification Toast for Cart Confirmations */}
      {cartFeedback && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-[#171615] text-[#FAF8F5] px-4 sm:px-5 py-3.5 shadow-2xl border border-[#32302D] flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-2.5 text-xs font-medium tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cartFeedback}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/cart"
              className="text-[11px] uppercase tracking-wider underline hover:text-[#ECE7DF] transition-colors"
            >
              View Cart
            </Link>
            <button
              type="button"
              onClick={clearCartFeedback}
              className="text-[#8C877E] hover:text-[#FAF8F5] p-1 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
