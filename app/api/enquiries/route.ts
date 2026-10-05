import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8000/api/enquiries/";

/**
 * GET /api/enquiries/
 * Public access is strictly forbidden to protect sensitive client contact details.
 * Admin review is performed via the secure Django backend/admin interface.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized. Enquiry records are private and protected.",
    },
    { status: 403 }
  );
}

/**
 * POST /api/enquiries/
 * Proxies enquiry submissions directly to the Django REST API backend.
 * Handles validation errors, file uploads, and server communication.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let djangoRes: Response;

    if (contentType.includes("multipart/form-data")) {
      const incomingFormData = await request.formData();
      const outgoingFormData = new FormData();

      for (const [key, value] of incomingFormData.entries()) {
        if (key === "reference_images" && value instanceof File) {
          if (value.size > 0) {
            outgoingFormData.append(key, value, value.name);
          }
        } else if (typeof value === "string") {
          const trimmed = value.trim();
          if (trimmed.length > 0) {
            outgoingFormData.append(key, trimmed);
          }
        }
      }

      djangoRes = await fetch(DJANGO_API_URL, {
        method: "POST",
        body: outgoingFormData,
      });
    } else {
      const json = await request.json();
      djangoRes = await fetch(DJANGO_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
    }

    const data = await djangoRes.json().catch(() => null);

    if (!djangoRes.ok) {
      return NextResponse.json(
        data || {
          success: false,
          message: "Something went wrong. Please try again.",
        },
        { status: djangoRes.status }
      );
    }

    return NextResponse.json(data, { status: djangoRes.status });
  } catch (error) {
    console.error("Enquiry API proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
