import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Product Order Flow & Validation Suite", () => {
  const validOrderPayload = {
    product_slug: "monolithic-travertine-console",
    quantity: 2,
    customer_name: "Meera Krishnan",
    customer_email: "meera.krishnan@example.com",
    customer_phone: "+91 98450 12345",
    delivery_address: "Penthouse 14B, Kingfisher Towers, Ashok Nagar",
    city: "Bengaluru",
    state: "Karnataka",
    postal_code: "560001",
    notes: "Please call 2 hours prior to scheduled white-glove arrival.",
  };

  // ===========================================================================
  // 1. INPUT VALIDATION TESTS
  // ===========================================================================
  describe("Order Input Validation", () => {
    it("should reject empty order submission with 400 and field errors", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors);
      assert.ok(data.errors.product_slug);
      assert.ok(data.errors.customer_name);
      assert.ok(data.errors.customer_email);
      assert.ok(data.errors.customer_phone);
      assert.ok(data.errors.delivery_address);
    });

    it("should reject nonexistent product slug with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          product_slug: "nonexistent-fantasy-sofa",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.product_slug);
    });

    it("should reject invalid quantity (0, negative, or > 10) with 400", async () => {
      const resZero = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          quantity: 0,
        }),
      });
      assert.equal(resZero.status, 400);

      const resTooLarge = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          quantity: 50,
        }),
      });
      assert.equal(resTooLarge.status, 400);
    });

    it("should reject malformed email with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          customer_email: "not-an-email",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.customer_email);
    });

    it("should reject invalid phone number (< 10 digits) with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          customer_phone: "12345",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.customer_phone);
    });
  });

  // ===========================================================================
  // 2. SERVER-ENFORCED PRICING & ORDER SUCCESS
  // ===========================================================================
  describe("Server-Side Pricing & Order Reference", () => {
    it("should create order with server-computed INR total and return unique reference", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          // Attempt client price tampering
          unitPrice: 10,
          totalAmount: 20,
        }),
      });

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.orderNumber);
      assert.match(data.orderNumber, /^DT-ORD-/);

      // Verify server calculated correct total: 640000 * 2 = 1280000
      assert.equal(data.order.unitPrice, 640000);
      assert.equal(data.order.totalAmount, 1280000);
      assert.equal(data.order.currency, "INR");
      assert.equal(data.order.status, "Pending");
      assert.match(data.order.formattedTotal, /12,80,000/);
    });
  });

  // ===========================================================================
  // 3. PRIVACY & SECURITY
  // ===========================================================================
  describe("Access Control & Anti-Spam", () => {
    it("should block public GET access with 403 Forbidden", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "GET",
      });

      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.success, false);
    });

    it("should silently absorb honeypot spam bots without dispatching", async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOrderPayload,
          _hp_website: "http://spambot-trap.com",
        }),
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
    });
  });
});
