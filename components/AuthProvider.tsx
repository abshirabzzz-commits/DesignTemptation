"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types";
import {
  apiGetMe,
  apiLogin,
  apiRegister,
  apiGoogleAuth,
  apiLogout,
  apiUpdateProfile,
  apiGetCart,
  apiGetWishlist,
  getStoredToken,
  setStoredToken,
  syncGuestCartToServer,
} from "@/lib/api";

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

  const openAuthModal = useCallback((tab: "signin" | "signup" | "forgot" = "signin", message?: string) => {
    setAuthModalTab(tab);
    setAuthModalMessage(message || null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMessage(null);
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

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    if (res.success && res.token && res.user) {
      setStoredToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthModalMessage(null);
      await syncGuestCartToServer();
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
      }}
    >
      {children}
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
