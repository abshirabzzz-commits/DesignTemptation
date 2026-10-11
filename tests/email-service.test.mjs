import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sendEnquiryEmail,
  isEmailConfigured,
  isMockDeliveryEnabled,
} from "../lib/email.ts";

describe("Resend Email Service Unit Suite", () => {
  const samplePayload = {
    fullName: "Elena Vance",
    email: "elena@example.com",
    phone: "+91 9988776655",
    projectType: "Interior Design",
    propertyType: "Villa",
    projectLocation: "Bengaluru",
    requirements:
      "Detailed architectural interior consultation for private villa.",
  };

  it("should detect when email configuration is missing", () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.ENQUIRY_TO_EMAIL;
    delete process.env.ENQUIRY_FROM_EMAIL;
    delete process.env.ENQUIRY_MOCK_DELIVERY;

    assert.equal(isEmailConfigured(), false);
  });

  it("should fail safely with MISSING_CONFIGURATION when credentials are unset", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.ENQUIRY_TO_EMAIL;
    delete process.env.ENQUIRY_FROM_EMAIL;
    delete process.env.ENQUIRY_MOCK_DELIVERY;

    const result = await sendEnquiryEmail(samplePayload);
    assert.equal(result.success, false);
    assert.equal(result.error, "MISSING_CONFIGURATION");
  });

  it("should simulate delivery when ENQUIRY_MOCK_DELIVERY is true without real API calls", async () => {
    process.env.ENQUIRY_MOCK_DELIVERY = "true";

    assert.equal(isMockDeliveryEnabled(), true);

    const result = await sendEnquiryEmail(samplePayload);
    assert.equal(result.success, true);
    assert.equal(result.isMocked, true);
    assert.match(result.messageId, /^mock_resend_/);

    delete process.env.ENQUIRY_MOCK_DELIVERY;
  });

  it("should handle Resend client rejection properly", async () => {
    delete process.env.ENQUIRY_MOCK_DELIVERY;
    process.env.RESEND_API_KEY = "mock_key";
    process.env.ENQUIRY_TO_EMAIL = "mock_to@example.com";
    process.env.ENQUIRY_FROM_EMAIL = "mock_from@example.com";

    // Mock Resend client returning an API error
    const mockClient = {
      emails: {
        send: async () => ({
          data: null,
          error: { message: "Domain not verified on Resend" },
        }),
      },
    };

    const result = await sendEnquiryEmail(samplePayload, mockClient);
    assert.equal(result.success, false);
    assert.equal(result.error, "Domain not verified on Resend");

    delete process.env.RESEND_API_KEY;
    delete process.env.ENQUIRY_TO_EMAIL;
    delete process.env.ENQUIRY_FROM_EMAIL;
  });

  it("should handle successful Resend client response with messageId", async () => {
    delete process.env.ENQUIRY_MOCK_DELIVERY;
    process.env.RESEND_API_KEY = "mock_key";
    process.env.ENQUIRY_TO_EMAIL = "mock_to@example.com";
    process.env.ENQUIRY_FROM_EMAIL = "mock_from@example.com";

    // Mock Resend client returning a successful response
    const mockClient = {
      emails: {
        send: async () => ({
          data: { id: "msg_abc123456789" },
          error: null,
        }),
      },
    };

    const result = await sendEnquiryEmail(samplePayload, mockClient);
    assert.equal(result.success, true);
    assert.equal(result.messageId, "msg_abc123456789");

    delete process.env.RESEND_API_KEY;
    delete process.env.ENQUIRY_TO_EMAIL;
    delete process.env.ENQUIRY_FROM_EMAIL;
  });
});
