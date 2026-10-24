import { AuthUser, CartItem, WishlistItem, OrderRecord } from "@/types";
import { PRODUCTS } from "@/data/content";

export function getDjangoBaseUrl(): string {
  // 1. If explicit environment variable is defined, normalize it
  const envUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;
  if (envUrl && envUrl.trim()) {
    let trimmed = envUrl.trim().replace(/\/+$/, "");
    if (trimmed.endsWith("/api")) {
      trimmed = trimmed.slice(0, -4);
    }
    // If running in browser on a live/remote host, reject localhost to prevent mixed-content failures
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host !== "localhost" && host !== "127.0.0.1") {
        if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
          return "https://designtemptation.onrender.com";
        }
      }
    }
    return trimmed;
  }

  // 2. In browser runtime: check hostname
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Only fall back to local Django if the visitor is running on localhost/127.0.0.1
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://127.0.0.1:8000";
    }
    return "https://designtemptation.onrender.com";
  }

  // 3. Server-side runtime: if in production or on Vercel, use deployed Render API
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://designtemptation.onrender.com";
  }

  // 4. Local development default
  return "http://127.0.0.1:8000";
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dt_auth_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("dt_auth_token", token);
  } else {
    localStorage.removeItem("dt_auth_token");
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; errors?: any; [key: string]: any }> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Token ${token}`;
  }

  const baseUrl = getDjangoBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || data.detail || `Request failed with status ${res.status}`,
        errors: data.errors || data,
        status: res.status,
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error: any) {
    const isNetworkFailure = error?.message === "Failed to fetch" || error?.name === "TypeError";
    const helpfulMessage = isNetworkFailure
      ? "Unable to reach studio servers. Please check your network connection or try again shortly."
      : error?.message || "Network error communicating with studio service.";
    return {
      success: false,
      message: helpfulMessage,
    };
  }
}

// ---------------------------------------------------------------------------
// Authentication API Calls
// ---------------------------------------------------------------------------
export async function apiRegister(payload: { name: string; email: string; password: string; phone?: string }) {
  return apiFetch<{ token: string; user: AuthUser }>(`/api/auth/register/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiLogin(payload: { email: string; password: string }) {
  return apiFetch<{ token: string; user: AuthUser }>(`/api/auth/login/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGoogleAuth(credential: string) {
  return apiFetch<{ token: string; user: AuthUser }>(`/api/auth/google/`, {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export async function apiLogout() {
  return apiFetch(`/api/auth/logout/`, {
    method: "POST",
  });
}

export async function apiGetMe() {
  return apiFetch<{ user: AuthUser }>(`/api/auth/me/`);
}

export async function apiUpdateProfile(payload: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  delivery_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}) {
  return apiFetch<{ user: AuthUser }>(`/api/auth/profile/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiRequestPasswordReset(email: string) {
  return apiFetch(`/api/auth/password-reset/`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function apiConfirmPasswordReset(payload: { uid: string; token: string; new_password: string }) {
  return apiFetch(`/api/auth/password-reset-confirm/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Cart API Calls & Guest Cart Persistence
// ---------------------------------------------------------------------------
const GUEST_CART_KEY = "dt_guest_cart";

interface LocalGuestItem {
  id: number;
  product_slug: string;
  quantity: number;
}

export function getGuestCart(): LocalGuestItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setGuestCart(items: LocalGuestItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function clearGuestCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

export async function syncGuestCartToServer() {
  const token = getStoredToken();
  if (!token) return;

  const guestItems = getGuestCart();
  if (!guestItems || guestItems.length === 0) return;

  for (const item of guestItems) {
    try {
      await apiFetch(`/api/cart/`, {
        method: "POST",
        body: JSON.stringify({ product_slug: item.product_slug, quantity: item.quantity }),
      });
    } catch {
      // Continue syncing remaining items
    }
  }
  clearGuestCart();
}

export async function apiGetCart() {
  const token = getStoredToken();
  if (!token) {
    return {
      success: true,
      count: 0,
      total_items: 0,
      total_amount: 0,
      currency: "INR",
      items: [],
    };
  }

  return apiFetch<{
    count: number;
    total_items: number;
    total_amount: number;
    currency: string;
    items: CartItem[];
  }>(`/api/cart/`);
}

export async function apiAddToCart(productSlug: string, quantity: number = 1) {
  const token = getStoredToken();
  if (!token) {
    return {
      success: false,
      message: "Please sign in to add items to your cart.",
    };
  }

  return apiFetch<{ data: CartItem }>(`/api/cart/`, {
    method: "POST",
    body: JSON.stringify({ product_slug: productSlug, quantity }),
  });
}

export async function apiUpdateCartItem(itemId: number, quantity: number) {
  const token = getStoredToken();
  if (!token) {
    return { success: false, message: "Please sign in to update cart items." };
  }

  return apiFetch<{ data: CartItem }>(`/api/cart/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function apiRemoveCartItem(itemId: number) {
  const token = getStoredToken();
  if (!token) {
    return { success: false, message: "Please sign in to remove cart items." };
  }

  return apiFetch(`/api/cart/${itemId}/`, {
    method: "DELETE",
  });
}

export async function apiClearCart() {
  const token = getStoredToken();
  if (!token) {
    clearGuestCart();
    return { success: true };
  }

  return apiFetch(`/api/cart/clear/`, {
    method: "POST",
  });
}

// ---------------------------------------------------------------------------
// Wishlist API Calls
// ---------------------------------------------------------------------------
export async function apiGetWishlist() {
  return apiFetch<WishlistItem[]>(`/api/wishlist/`);
}

export async function apiToggleWishlist(productSlug: string) {
  return apiFetch<{ in_wishlist: boolean; message: string }>(`/api/wishlist/toggle/`, {
    method: "POST",
    body: JSON.stringify({ product_slug: productSlug }),
  });
}

export async function apiRemoveWishlistItem(itemId: number) {
  return apiFetch(`/api/wishlist/${itemId}/`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Orders API Calls
// ---------------------------------------------------------------------------
export async function apiGetMyOrders() {
  return apiFetch<{ count: number; data: OrderRecord[] }>(`/api/orders/my-orders/`);
}

export async function apiGetAdminOrders(params: { status?: string; search?: string } = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All") query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const qStr = query.toString();
  return apiFetch<OrderRecord[]>(`/api/orders/${qStr ? `?${qStr}` : ""}`);
}

export async function apiUpdateOrderStatus(orderId: number, newStatus: string) {
  return apiFetch<OrderRecord>(`/api/orders/${orderId}/`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
  });
}

export async function apiGetAdminEnquiries() {
  return apiFetch<any[]>(`/api/enquiries/`);
}

export async function apiUpdateEnquiryStatus(enquiryId: number, newStatus: string) {
  return apiFetch<any>(`/api/enquiries/${enquiryId}/`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
  });
}
