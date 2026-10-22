import { AuthUser, CartItem, WishlistItem, OrderRecord } from "@/types";

const DJANGO_URL = (process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

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

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${DJANGO_URL}${cleanEndpoint}`;

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
    return {
      success: false,
      message: error?.message || "Network error communicating with studio service.",
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
// Cart API Calls
// ---------------------------------------------------------------------------
export async function apiGetCart() {
  return apiFetch<{
    count: number;
    total_items: number;
    total_amount: number;
    currency: string;
    items: CartItem[];
  }>(`/api/cart/`);
}

export async function apiAddToCart(productSlug: string, quantity: number = 1) {
  return apiFetch<{ data: CartItem }>(`/api/cart/`, {
    method: "POST",
    body: JSON.stringify({ product_slug: productSlug, quantity }),
  });
}

export async function apiUpdateCartItem(itemId: number, quantity: number) {
  return apiFetch<{ data: CartItem }>(`/api/cart/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function apiRemoveCartItem(itemId: number) {
  return apiFetch(`/api/cart/${itemId}/`, {
    method: "DELETE",
  });
}

export async function apiClearCart() {
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
