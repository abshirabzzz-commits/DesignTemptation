import { Resend } from "resend";

export interface EnquiryEmailPayload {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  propertyType: string;
  projectLocation: string;
  projectArea?: string;
  budgetRange?: string;
  requirements: string;
  attachment?: {
    filename: string;
    content: Buffer;
  } | null;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isMocked?: boolean;
}

/**
 * Checks whether server environment variables have the required Resend configuration.
 */
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
    (process.env.ENQUIRY_TO_EMAIL || "enquiriesdesigntemptation@gmail.com") &&
    process.env.ENQUIRY_FROM_EMAIL
  );
}

/**
 * Checks whether mock delivery is enabled for local dev / testing.
 */
export function isMockDeliveryEnabled(): boolean {
  return process.env.ENQUIRY_MOCK_DELIVERY === "true";
}

/**
 * HTML escaper to prevent injection inside email templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Dispatches a formatted enquiry email using the official Resend SDK.
 * Supports injected mock client or mock mode for local testing without real sends.
 */
export async function sendEnquiryEmail(
  payload: EnquiryEmailPayload,
  injectedClient?: Resend
): Promise<EmailDeliveryResult> {
  // 1. Mock delivery mode for automated test suites and local sandboxing
  if (isMockDeliveryEnabled()) {
    return {
      success: true,
      messageId: `mock_resend_${Date.now()}`,
      isMocked: true,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ENQUIRY_TO_EMAIL || "enquiriesdesigntemptation@gmail.com";
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL;

  // 2. Check for missing configuration
  if (!apiKey || !toEmail || !fromEmail) {
    return {
      success: false,
      error: "MISSING_CONFIGURATION",
    };
  }

  const resend = injectedClient || new Resend(apiKey);

  try {
    const subject = `New Project Enquiry: ${payload.fullName} (${payload.projectType})`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171615; line-height: 1.6;">
        <h2 style="border-bottom: 2px solid #171615; padding-bottom: 8px; margin-top: 0; font-size: 20px; font-weight: 500;">
          DESIGN TEMPTATION — New Project Enquiry
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 180px; color: #8C877E;">Client Name:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #171615;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Phone / WhatsApp:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Project Type:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.projectType)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Property Type:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.propertyType)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Project Location:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.projectLocation)}</td>
          </tr>
          ${payload.projectArea ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Approximate Area:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.projectArea)} sq.ft</td>
          </tr>` : ""}
          ${payload.budgetRange ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #8C877E;">Budget Range:</td>
            <td style="padding: 8px 0; color: #171615;">${escapeHtml(payload.budgetRange)}</td>
          </tr>` : ""}
        </table>

        <div style="margin-top: 24px; padding: 16px; background-color: #FAF8F5; border-left: 3px solid #171615;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C877E;">
            Project Requirements / Brief:
          </h4>
          <p style="margin: 0; white-space: pre-wrap; color: #171615; font-size: 14px;">${escapeHtml(payload.requirements)}</p>
        </div>

        <p style="margin-top: 32px; font-size: 11px; color: #8C877E; text-align: center; border-top: 1px solid #ECE7DF; padding-top: 16px;">
          This enquiry was submitted via the official DESIGN TEMPTATION online portfolio.
        </p>
      </div>
    `;

    const sendOptions: {
      from: string;
      to: string[];
      replyTo: string;
      subject: string;
      html: string;
      attachments?: { filename: string; content: Buffer }[];
    } = {
      from: fromEmail,
      to: [toEmail],
      replyTo: payload.email,
      subject,
      html: htmlContent,
    };

    if (payload.attachment) {
      sendOptions.attachments = [
        {
          filename: payload.attachment.filename,
          content: payload.attachment.content,
        },
      ];
    }

    const { data, error } = await resend.emails.send(sendOptions);

    if (error || !data?.id) {
      return {
        success: false,
        error: error?.message || "PROVIDER_REJECTED",
      };
    }

    return {
      success: true,
      messageId: data.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "TRANSMISSION_ERROR";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export interface OrderEmailPayload {
  orderNumber: string;
  productName: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  formattedUnitPrice: string;
  formattedTotalAmount: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  postalCode: string;
  notes?: string;
}

/**
 * Dispatches a formatted order notification email to the studio team.
 */
export async function sendOrderNotificationEmail(
  payload: OrderEmailPayload,
  injectedClient?: Resend
): Promise<EmailDeliveryResult> {
  // 1. Mock delivery mode for automated test suites and local sandboxing
  if (isMockDeliveryEnabled()) {
    return {
      success: true,
      messageId: `mock_resend_order_${Date.now()}`,
      isMocked: true,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ENQUIRY_TO_EMAIL || "enquiriesdesigntemptation@gmail.com";
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL;

  // 2. Check for missing configuration
  if (!apiKey || !toEmail || !fromEmail) {
    return {
      success: false,
      error: "MISSING_CONFIGURATION",
    };
  }

  const resend = injectedClient || new Resend(apiKey);

  try {
    const subject = `New Product Order: ${payload.orderNumber} — ${payload.productName} (${payload.customerName})`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #171615; line-height: 1.6; border: 1px solid #ECE7DF; padding: 24px; background-color: #FAF8F5;">
        <h2 style="border-bottom: 2px solid #171615; padding-bottom: 10px; margin-top: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.05em;">
          DESIGN TEMPTATION — New Studio Order
        </h2>

        <div style="background-color: #FFFFFF; border: 1px solid #ECE7DF; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #8C877E; width: 140px;">Order Reference:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #171615;">${escapeHtml(payload.orderNumber)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8C877E;">Piece Acquired:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #171615;">${escapeHtml(payload.productName)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8C877E;">Category:</td>
              <td style="padding: 6px 0; color: #171615;">${escapeHtml(payload.productCategory)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8C877E;">Quantity:</td>
              <td style="padding: 6px 0; color: #171615;">${payload.quantity} piece${payload.quantity > 1 ? 's' : ''}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8C877E;">Unit Price:</td>
              <td style="padding: 6px 0; color: #171615;">${escapeHtml(payload.formattedUnitPrice)}</td>
            </tr>
            <tr style="border-top: 1px solid #ECE7DF;">
              <td style="padding: 10px 0 6px 0; font-weight: 700; color: #171615;">Total (INR):</td>
              <td style="padding: 10px 0 6px 0; font-size: 16px; font-weight: 700; color: #171615;">${escapeHtml(payload.formattedTotalAmount)}</td>
            </tr>
          </table>
        </div>

        <h3 style="font-size: 15px; font-weight: 600; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.1em; color: #8C877E;">
          Customer & Delivery Logistics
        </h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; background-color: #FFFFFF; border: 1px solid #ECE7DF; padding: 16px;">
          <tr>
            <td style="padding: 8px 12px; color: #8C877E; width: 140px;">Customer Name:</td>
            <td style="padding: 8px 12px; color: #171615; font-weight: 500;">${escapeHtml(payload.customerName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #8C877E;">Email Address:</td>
            <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(payload.customerEmail)}" style="color: #171615;">${escapeHtml(payload.customerEmail)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #8C877E;">Phone / WhatsApp:</td>
            <td style="padding: 8px 12px; color: #171615;">${escapeHtml(payload.customerPhone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #8C877E;">Delivery Address:</td>
            <td style="padding: 8px 12px; color: #171615;">
              ${escapeHtml(payload.deliveryAddress)}<br />
              ${escapeHtml(payload.city)}, ${escapeHtml(payload.state)} — ${escapeHtml(payload.postalCode)}, India
            </td>
          </tr>
          ${payload.notes ? `
          <tr>
            <td style="padding: 8px 12px; color: #8C877E; vertical-align: top;">Commission Notes:</td>
            <td style="padding: 8px 12px; color: #171615; white-space: pre-wrap;">${escapeHtml(payload.notes)}</td>
          </tr>` : ""}
        </table>

        <p style="margin-top: 24px; font-size: 11px; color: #8C877E; text-align: center; border-top: 1px solid #ECE7DF; padding-top: 16px;">
          This order was submitted via DESIGN TEMPTATION online studio. Contact customer to coordinate white-glove transport and final invoice.
        </p>
      </div>
    `;

    const sendOptions = {
      from: fromEmail,
      to: [toEmail],
      replyTo: payload.customerEmail,
      subject,
      html: htmlContent,
    };

    const { data, error } = await resend.emails.send(sendOptions);

    if (error || !data?.id) {
      return {
        success: false,
        error: error?.message || "PROVIDER_REJECTED",
      };
    }

    return {
      success: true,
      messageId: data.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "TRANSMISSION_ERROR";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
