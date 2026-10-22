import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Frontend Client Authentication & Navigation Suite", () => {
  it("should have cart page accessible", async () => {
    const res = await fetch(`${BASE_URL}/cart`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Cart") || html.includes("cart"));
  });

  it("should have wishlist page accessible", async () => {
    const res = await fetch(`${BASE_URL}/wishlist`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Wishlist") || html.includes("wishlist"));
  });

  it("should have orders page accessible", async () => {
    const res = await fetch(`${BASE_URL}/account/orders`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Orders") || html.includes("orders"));
  });

  it("should have profile page accessible", async () => {
    const res = await fetch(`${BASE_URL}/account/profile`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Profile") || html.includes("profile"));
  });

  it("should have admin dashboard page with staff access control", async () => {
    const res = await fetch(`${BASE_URL}/admin-dashboard`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Administrator") || html.includes("Executive Atelier Dashboard"));
  });

  it("should display sign in access for guests on cart page", async () => {
    const res = await fetch(`${BASE_URL}/cart`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(
      html.includes("Sign In") ||
      html.includes("sign in to access your saved pieces")
    );
  });

  it("should block unauthenticated order checkout API requests with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_slug: "monolithic-travertine-console",
        quantity: 1,
        customer_name: "Guest Shopper",
        customer_email: "guest@example.com",
        customer_phone: "+91 98765 43210",
        delivery_address: "123 Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        postal_code: "560038"
      })
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.equal(data.message, "Please log in or create an account to place your order.");
  });
});
