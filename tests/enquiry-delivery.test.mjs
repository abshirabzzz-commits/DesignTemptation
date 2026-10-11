import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Contact Form Enquiry Delivery & Validation Suite", () => {
  const validPayload = {
    full_name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 98765 43210",
    project_type: "Interior Design",
    property_type: "Apartment",
    project_location: "Indiranagar, Bengaluru",
    project_area: "2400",
    budget_range: "₹25–50 Lakhs",
    requirements:
      "Comprehensive interior restructuring for 3BHK penthouse including bespoke woodwork and lighting layout.",
  };

  // ===========================================================================
  // 1. INVALID INPUT VALIDATION TESTS
  // ===========================================================================
  describe("Input Validation & Sanitization", () => {
    it("should reject empty submission with 400 and field errors", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors);
      assert.ok(data.errors.full_name);
      assert.ok(data.errors.email);
      assert.ok(data.errors.phone);
      assert.ok(data.errors.project_type);
      assert.ok(data.errors.property_type);
      assert.ok(data.errors.project_location);
      assert.ok(data.errors.requirements);
    });

    it("should reject malformed email address with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validPayload,
          email: "not-an-email-at-all",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.email);
    });

    it("should reject invalid phone numbers (< 10 digits) with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validPayload,
          phone: "12345",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.phone);
    });

    it("should reject requirements with less than 10 characters with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validPayload,
          requirements: "Too short",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.requirements);
    });

    it("should reject invalid project type with 400", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validPayload,
          project_type: "Space Station Design",
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.errors.project_type);
    });
  });

  // ===========================================================================
  // 2. MISSING CONFIGURATION / PROVIDER FAILURE TESTS
  // ===========================================================================
  describe("Missing Provider Configuration Safety", () => {
    it("should safely return 503 and direct contact instructions when email credentials are not set", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });

      // Since RESEND_API_KEY is unset in the default environment, delivery must not claim success
      assert.equal(res.status, 503);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.message, /enquiries@designtemptation\.com/);
    });

    it("should never expose internal stack traces or secrets in response", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });

      const text = await res.text();
      assert.doesNotMatch(text, /node_modules/i);
      assert.doesNotMatch(text, /ECONNREFUSED/i);
      assert.doesNotMatch(text, /at Object\./i);
      assert.doesNotMatch(text, /RESEND_API_KEY/i);
    });
  });

  // ===========================================================================
  // 3. GET ROUTE PRIVACY
  // ===========================================================================
  describe("Privacy & Access Control", () => {
    it("should block public GET access with 403 Forbidden", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "GET",
      });

      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.success, false);
    });

    it("should silently absorb spam bots when honeypot trap field is populated", async () => {
      const res = await fetch(`${BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validPayload,
          _hp_website: "https://spam-bot-automated.com",
        }),
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
    });
  });
});
