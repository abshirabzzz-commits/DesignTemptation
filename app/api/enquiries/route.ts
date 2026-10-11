import { NextRequest, NextResponse } from "next/server";
import { sendEnquiryEmail, EnquiryEmailPayload } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Valid allowed selection values matching domain entities
 */
const VALID_PROJECT_TYPES = [
  "Interior Design",
  "Architecture",
  "Turnkey Execution",
  "Other",
];

const VALID_PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Office",
  "Shop",
  "Other",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server-side input validation and sanitization
 * Ensures no malformed data is forwarded or processed.
 */
function validateAndSanitize(
  fields: Record<string, string>,
  file: File | null
): {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitized: {
    fullName: string;
    email: string;
    phone: string;
    projectType: string;
    propertyType: string;
    projectLocation: string;
    projectArea?: string;
    budgetRange?: string;
    requirements: string;
  };
} {
  const errors: Record<string, string[]> = {};
  const sanitized: Partial<EnquiryEmailPayload> = {};

  // 1. Full Name
  const fullName = (fields.full_name || "").trim();
  if (!fullName) {
    errors.full_name = ["Full name is required."];
  } else if (fullName.length > 255) {
    errors.full_name = ["Full name cannot exceed 255 characters."];
  } else {
    sanitized.fullName = fullName;
  }

  // 2. Email Address
  const email = (fields.email || "").trim().toLowerCase();
  if (!email) {
    errors.email = ["Email address is required."];
  } else if (!EMAIL_REGEX.test(email) || email.length > 255) {
    errors.email = ["Please enter a valid email address."];
  } else {
    sanitized.email = email;
  }

  // 3. Phone / WhatsApp
  const rawPhone = (fields.phone || "").trim();
  const digits = rawPhone.replace(/\D/g, "");
  if (!rawPhone) {
    errors.phone = ["Phone / WhatsApp number is required."];
  } else if (digits.length < 10 || digits.length > 15) {
    errors.phone = [
      "Please enter a valid 10–15 digit phone or WhatsApp number.",
    ];
  } else {
    sanitized.phone = rawPhone;
  }

  // 4. Project Type
  const projectType = (fields.project_type || "").trim();
  if (!projectType || !VALID_PROJECT_TYPES.includes(projectType)) {
    errors.project_type = ["Please select a valid project type."];
  } else {
    sanitized.projectType = projectType;
  }

  // 5. Property Type
  const propertyType = (fields.property_type || "").trim();
  if (!propertyType || !VALID_PROPERTY_TYPES.includes(propertyType)) {
    errors.property_type = ["Please select a valid property type."];
  } else {
    sanitized.propertyType = propertyType;
  }

  // 6. Project Location
  const projectLocation = (fields.project_location || "").trim();
  if (!projectLocation) {
    errors.project_location = ["Project location is required."];
  } else if (projectLocation.length > 255) {
    errors.project_location = ["Project location cannot exceed 255 characters."];
  } else {
    sanitized.projectLocation = projectLocation;
  }

  // 7. Optional Area
  if (fields.project_area && fields.project_area.trim()) {
    const area = fields.project_area.trim();
    const num = parseFloat(area);
    if (!isNaN(num) && num > 0) {
      sanitized.projectArea = area;
    }
  }

  // 8. Optional Budget Range
  if (fields.budget_range && fields.budget_range.trim()) {
    sanitized.budgetRange = fields.budget_range.trim();
  }

  // 9. Requirements / Scope
  const requirements = (fields.requirements || "").trim();
  if (!requirements) {
    errors.requirements = ["Please describe your project requirements."];
  } else if (requirements.length < 10) {
    errors.requirements = [
      "Please provide at least 10 characters describing your project.",
    ];
  } else if (requirements.length > 5000) {
    errors.requirements = ["Requirements cannot exceed 5000 characters."];
  } else {
    sanitized.requirements = requirements;
  }

  // 10. File Validation
  if (file && file instanceof File && file.size > 0) {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedExtensions.includes(ext) && !allowedMimeTypes.includes(file.type)) {
      errors.reference_images = [
        "Please upload an image in JPG, JPEG, PNG, or WEBP format.",
      ];
    } else if (file.size > 15 * 1024 * 1024) {
      errors.reference_images = ["File size cannot exceed 15MB."];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: sanitized as {
      fullName: string;
      email: string;
      phone: string;
      projectType: string;
      propertyType: string;
      projectLocation: string;
      projectArea?: string;
      budgetRange?: string;
      requirements: string;
    },
  };
}

/**
 * GET /api/enquiries/
 * Public access is strictly forbidden to protect sensitive client contact details.
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
 * Dual-pipeline enquiry submission handler:
 * 1. Validates and sanitizes payload server-side.
 * 2. Attempts persistent storage forwarding if DJANGO_API_URL is configured.
 * 3. Delivers formatted inquiry to studio team via Resend SDK.
 * 4. Fails safely and informs user if delivery cannot be verified.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const rawFields: Record<string, string> = {};
    let attachedFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key === "reference_images" && value instanceof File) {
          if (value.size > 0) {
            attachedFile = value;
          }
        } else if (typeof value === "string") {
          rawFields[key] = value;
        }
      }
    } else {
      const json = await request.json().catch(() => ({}));
      for (const [key, value] of Object.entries(json)) {
        if (typeof value === "string") {
          rawFields[key] = value;
        } else if (value !== null && value !== undefined) {
          rawFields[key] = String(value);
        }
      }
    }

    // Spam protection: check honeypot trap field (silent success to bots without dispatching)
    const honeypot = rawFields["_hp_website"] || rawFields["website_url"] || rawFields["_gotcha"];
    if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Thank you for your enquiry. We will review your project and get in touch shortly.",
        },
        { status: 200 }
      );
    }

    // 1. Server-side validation
    const validation = validateAndSanitize(rawFields, attachedFile);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
          message: "Validation failed. Please correct the highlighted errors.",
        },
        { status: 400 }
      );
    }

    // 2. Prepare email payload
    let emailAttachment: { filename: string; content: Buffer } | null = null;
    if (attachedFile) {
      try {
        const arrayBuffer = await attachedFile.arrayBuffer();
        emailAttachment = {
          filename: attachedFile.name,
          content: Buffer.from(arrayBuffer),
        };
      } catch {
        // Attachment parsing failure, proceed without breaking main message
      }
    }

    const emailPayload: EnquiryEmailPayload = {
      ...validation.sanitized,
      attachment: emailAttachment,
    };

    // 3. Database persistence forwarding (if Django backend is configured)
    const djangoApiUrl = process.env.DJANGO_API_URL;
    if (djangoApiUrl) {
      try {
        const outgoingFormData = new FormData();
        outgoingFormData.append("full_name", validation.sanitized.fullName);
        outgoingFormData.append("email", validation.sanitized.email);
        outgoingFormData.append("phone", validation.sanitized.phone);
        outgoingFormData.append("project_type", validation.sanitized.projectType);
        outgoingFormData.append("property_type", validation.sanitized.propertyType);
        outgoingFormData.append("project_location", validation.sanitized.projectLocation);
        if (validation.sanitized.projectArea) {
          outgoingFormData.append("project_area", validation.sanitized.projectArea);
        }
        if (validation.sanitized.budgetRange) {
          outgoingFormData.append("budget_range", validation.sanitized.budgetRange);
        }
        outgoingFormData.append("requirements", validation.sanitized.requirements);
        if (attachedFile) {
          outgoingFormData.append("reference_images", attachedFile, attachedFile.name);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(djangoApiUrl, {
          method: "POST",
          body: outgoingFormData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch {
        // Django connection error or timeout: log failure class only, do not expose PII
        console.error("Django persistence proxy unavailable");
      }
    }

    // 4. Primary Delivery: Dispatch via Resend SDK
    const emailResult = await sendEnquiryEmail(emailPayload);

    if (emailResult.success) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Thank you for contacting DESIGN TEMPTATION. Your project enquiry has been received. Our team will review your requirements and get back to you.",
        },
        { status: 201 }
      );
    }

    // 5. Handle missing configuration or provider delivery rejection
    // NEVER claim success when delivery did not occur
    if (emailResult.error === "MISSING_CONFIGURATION") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enquiry delivery service is pending final email configuration. Please contact our atelier directly at enquiries@designtemptation.com to discuss your project.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "We were unable to deliver your enquiry via our automated service. Please contact our studio directly at enquiries@designtemptation.com.",
      },
      { status: 503 }
    );
  } catch {
    // Top-level catch: Do not expose stack traces or internal details
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong processing your request. Please contact enquiries@designtemptation.com directly.",
      },
      { status: 500 }
    );
  }
}
