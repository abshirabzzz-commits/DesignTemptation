import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, formatINR } from "@/data/content";
import { sendOrderNotificationEmail, OrderEmailPayload } from "@/lib/email";
import { getDjangoBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OrderInputFields {
  product_slug: string;
  quantity: number | string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  postal_code: string;
  notes?: string;
  _hp_website?: string;
  website_url?: string;
  _gotcha?: string;
}

/**
 * GET /api/orders/
 * Public access is strictly forbidden to protect client purchase and delivery details.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized. Order records are private and protected.",
    },
    { status: 403 }
  );
}

/**
 * POST /api/orders/
 * Validates product acquisition request, enforces server-side pricing,
 * persists record to Django PostgreSQL backend, and notifies studio concierge.
 */
export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json().catch(() => ({})) as Partial<OrderInputFields>;

    // 1. Enforce authentication: Customers MUST be logged in to place or confirm an order
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in or create an account to place your order.",
        },
        { status: 401 }
      );
    }

    const tokenMatch = authHeader.trim().match(/^(?:Token|Bearer)\s+(.+)$/i);
    if (!tokenMatch || !tokenMatch[1]?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in or create an account to place your order.",
        },
        { status: 401 }
      );
    }

    // 2. Spam protection: silent absorption of honeypot traps
    const honeypot = rawData._hp_website || rawData.website_url || rawData._gotcha;
    if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          orderNumber: "DT-ORD-CONFIRMED",
          message: "Thank you for your order request. Our atelier concierge will contact you shortly.",
        },
        { status: 200 }
      );
    }

    const errors: Record<string, string[]> = {};

    // 2. Validate Product & Server-Side Pricing Lookup
    const productSlug = (rawData.product_slug || "").trim();
    const product = PRODUCTS.find((p) => p.slug === productSlug);

    if (!productSlug || !product) {
      errors.product_slug = ["Please select a valid studio collection piece."];
    } else if (!product.available) {
      errors.product_slug = [`${product.name} is currently not available for acquisition.`];
    }

    // 3. Validate Quantity
    const rawQuantity = Number(rawData.quantity);
    if (!rawQuantity || isNaN(rawQuantity) || !Number.isInteger(rawQuantity) || rawQuantity < 1 || rawQuantity > 10) {
      errors.quantity = ["Quantity must be an integer between 1 and 10 pieces."];
    }
    const quantity = rawQuantity && Number.isInteger(rawQuantity) && rawQuantity >= 1 && rawQuantity <= 10 ? rawQuantity : 1;

    // 4. Validate Customer Details
    const customerName = (rawData.customer_name || "").trim();
    if (!customerName) {
      errors.customer_name = ["Customer full name is required."];
    } else if (customerName.length > 255) {
      errors.customer_name = ["Name cannot exceed 255 characters."];
    }

    const customerEmail = (rawData.customer_email || "").trim().toLowerCase();
    if (!customerEmail) {
      errors.customer_email = ["Email address is required."];
    } else if (!EMAIL_REGEX.test(customerEmail) || customerEmail.length > 255) {
      errors.customer_email = ["Please enter a valid email address."];
    }

    const customerPhone = (rawData.customer_phone || "").trim();
    const digits = customerPhone.replace(/\D/g, "");
    if (!customerPhone) {
      errors.customer_phone = ["Phone / WhatsApp number is required."];
    } else if (digits.length < 10 || digits.length > 15) {
      errors.customer_phone = ["Please enter a valid 10–15 digit phone or WhatsApp number."];
    }

    // 5. Validate Delivery Details
    const deliveryAddress = (rawData.delivery_address || "").trim();
    if (!deliveryAddress) {
      errors.delivery_address = ["Delivery street address is required."];
    }

    const city = (rawData.city || "").trim();
    if (!city) {
      errors.city = ["City is required."];
    }

    const state = (rawData.state || "").trim();
    if (!state) {
      errors.state = ["State / Province is required."];
    }

    const postalCode = (rawData.postal_code || "").trim();
    if (!postalCode) {
      errors.postal_code = ["Postal / PIN code is required."];
    }

    const notes = (rawData.notes || "").trim();

    if (Object.keys(errors).length > 0 || !product) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: "Order validation failed. Please check the highlighted fields.",
        },
        { status: 400 }
      );
    }

    // 6. Server-enforced Pricing (NEVER trust client price or totals)
    const unitPrice = product.numericPrice || 0;
    const totalAmount = unitPrice * quantity;
    const orderNumber = `DT-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 7. Django Persistence Forwarding (PostgreSQL)
    const djangoOrdersUrl = process.env.DJANGO_ORDERS_API_URL || (
      process.env.DJANGO_API_URL
        ? process.env.DJANGO_API_URL.replace(/\/enquiries\/?$/, '/orders/')
        : `${getDjangoBaseUrl()}/api/orders/`
    );

    if (djangoOrdersUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const outgoingHeaders: Record<string, string> = { "Content-Type": "application/json" };
        const authHeader = request.headers.get("authorization");
        if (authHeader) {
          outgoingHeaders["Authorization"] = authHeader;
        }

        const djangoRes = await fetch(djangoOrdersUrl, {
          method: "POST",
          headers: outgoingHeaders,
          body: JSON.stringify({
            order_number: orderNumber,
            product_slug: product.slug,
            quantity,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            delivery_address: deliveryAddress,
            city,
            state,
            postal_code: postalCode,
            notes,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (djangoRes.status === 401 || djangoRes.status === 403) {
          const djangoData = await djangoRes.json().catch(() => ({}));
          return NextResponse.json(
            {
              success: false,
              message: djangoData.message || "Please log in or create an account to place your order.",
              detail: djangoData.detail,
            },
            { status: 401 }
          );
        }
      } catch {
        console.error("Django order persistence proxy unavailable");
      }
    }

    // 8. Transactional Notification Dispatch (Resend SDK)
    const orderEmailPayload: OrderEmailPayload = {
      orderNumber,
      productName: product.name,
      productCategory: product.category,
      quantity,
      unitPrice,
      totalAmount,
      formattedUnitPrice: formatINR(unitPrice),
      formattedTotalAmount: formatINR(totalAmount),
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      city,
      state,
      postalCode,
      notes,
    };

    const emailResult = await sendOrderNotificationEmail(orderEmailPayload);

    // 9. Response handling
    return NextResponse.json(
      {
        success: true,
        orderNumber,
        message: `Thank you for acquiring ${product.name}. Your order reference is ${orderNumber}. Our atelier concierge will contact you to coordinate white-glove transport.`,
        order: {
          orderNumber,
          productName: product.name,
          quantity,
          unitPrice,
          totalAmount,
          formattedTotal: formatINR(totalAmount),
          currency: "INR",
          status: "Pending",
          customerName,
          customerEmail,
        },
        deliveryAlert: emailResult.success ? "NOTIFIED" : "PENDING_CONCIERGE",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred processing your acquisition. Please contact concierge@designtemptation.com directly.",
      },
      { status: 500 }
    );
  }
}
