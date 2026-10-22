import { AuthUser, CartItem, WishlistItem, OrderRecord } from "@/types";
import { PRODUCTS } from "@/data/content";

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
    const localItems = getGuestCart();
    const items: CartItem[] = [];
    let total_amount = 0;
    let total_items = 0;

    for (const lItem of localItems) {
      const prod = PRODUCTS.find((p) => p.slug === lItem.product_slug);
      if (prod) {
        const subtotal = (prod.numericPrice || 0) * lItem.quantity;
        total_amount += subtotal;
        total_items += lItem.quantity;
        items.push({
          id: lItem.id,
          product: 0,
          product_details: {
            id: prod.id,
            slug: prod.slug,
            name: prod.name,
            category: prod.category,
            price: prod.price,
            numericPrice: prod.numericPrice,
            image: prod.image,
            imageAlt: prod.imageAlt,
            dimensions: prod.dimensions,
            material: prod.material,
            description: prod.description,
            featured: prod.featured,
            available: prod.available,
            createdAt: "",
          },
          quantity: lItem.quantity,
          subtotal,
          created_at: "",
          updated_at: "",
        });
      }
    }

    return {
      success: true,
      count: items.length,
      total_items,
      total_amount,
      currency: "INR",
      items,
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
    const localItems = getGuestCart();
    const existing = localItems.find((i) => i.product_slug === productSlug);
    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + quantity);
    } else {
      localItems.push({
        id: Date.now(),
        product_slug: productSlug,
        quantity: Math.min(10, quantity),
      });
    }
    setGuestCart(localItems);
    return { success: true };
  }

  return apiFetch<{ data: CartItem }>(`/api/cart/`, {
    method: "POST",
    body: JSON.stringify({ product_slug: productSlug, quantity }),
  });
}

export async function apiUpdateCartItem(itemId: number, quantity: number) {
  const token = getStoredToken();
  if (!token) {
    const localItems = getGuestCart();
    const item = localItems.find((i) => i.id === itemId);
    if (item) {
      item.quantity = Math.min(10, Math.max(1, quantity));
      setGuestCart(localItems);
    }
    return { success: true };
  }

  return apiFetch<{ data: CartItem }>(`/api/cart/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function apiRemoveCartItem(itemId: number) {
  const token = getStoredToken();
  if (!token) {
    const localItems = getGuestCart().filter((i) => i.id !== itemId);
    setGuestCart(localItems);
    return { success: true };
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
