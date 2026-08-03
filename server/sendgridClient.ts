// SendGrid integration for sending transactional emails
import sgMail from "@sendgrid/mail";

// Environment variable validation
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Initialize SendGrid once at startup
let initialized = false;
let fromEmail: string;

function initializeSendGrid() {
  if (!initialized) {
    const apiKey = getRequiredEnv("SENDGRID_API_KEY");
    fromEmail = getRequiredEnv("SENDGRID_SENDER_EMAIL");
    sgMail.setApiKey(apiKey);
    initialized = true;
  }
}

// Get SendGrid client - safe to cache since env vars don't change at runtime
export function getSendGridClient() {
  initializeSendGrid();
  return {
    client: sgMail,
    fromEmail: fromEmail,
  };
}

// For backwards compatibility with existing async code
export async function getUncachableSendGridClient() {
  return getSendGridClient();
}

export async function sendVerificationEmail(
  toEmail: string,
  code: string,
): Promise<void> {
  const { client, fromEmail } = getSendGridClient();

  const msg = {
    to: toEmail,
    from: { email: fromEmail, name: "The Klara Project" },
    subject: "Your Klara Project Verification Code",
    text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FAF8F5; padding: 30px; border-radius: 8px;">
          <h1 style="color: #243A5E; font-family: 'Source Serif 4', Georgia, serif; margin-bottom: 20px;">
            Klara Project
          </h1>
          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 20px;">
            Your verification code is:
          </p>
          <div style="background-color: #243A5E; color: #FAF8F5; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin-bottom: 20px;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">
            This code will expire in 10 minutes.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you did not request this code, please ignore this email.
          </p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          The Klara Project - Christian Clarity for the AI Age
        </p>
      </div>
    `,
  };

  await client.send(msg);
}

interface DonationDetails {
  donorName: string;
  donorEmail: string;
  amount: number;
  isRecurring: boolean;
  duration?: string;
  date: Date;
  manageUrl: string;
}

export async function sendDonationThankYouEmail(
  details: DonationDetails,
): Promise<void> {
  const { client, fromEmail } = getSendGridClient();

  const formattedAmount = `$${(details.amount / 100).toFixed(2)}`;
  const formattedDate = details.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const donationType = details.isRecurring
    ? details.duration && details.duration !== "ongoing"
      ? `Monthly (${details.duration} months)`
      : "Monthly (ongoing)"
    : "One-time";

  const msg = {
    to: details.donorEmail,
    from: { email: fromEmail, name: "The Klara Project" },
    subject: "Thank You for Your Donation to The Klara Project",
    text: `Dear ${details.donorName},

Thank you for your generous ${donationType.toLowerCase()} donation of ${formattedAmount} to The Klara Project!

Your support helps us equip churches with practical resources for the AI age. Your donation will fund curriculum development, educational grants for students exploring faith and technology, and the infrastructure we need to serve you and our churches well.

DONATION DETAILS - KEEP FOR YOUR RECORDS
-----------------------------------------
Date: ${formattedDate}
Amount: ${formattedAmount}
Type: ${donationType}
Donor: ${details.donorName}
Email: ${details.donorEmail}

TAX INFORMATION
-----------------------------------------
Klara Project, Inc. is a 501(c)(3) tax-exempt organization (EIN: 41-2660092). Your donation is tax-deductible to the full extent allowed by law. No goods or services were provided in exchange for this contribution. Please retain this email as your official donation receipt.

MANAGE YOUR DONATION
-----------------------------------------
You can manage your donation at any time - increase, decrease, or cancel - by visiting:
${details.manageUrl}

With gratitude,
The Klara Project Team

"Christian Clarity for the AI Age"
`,
    html: `
      <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FAF8F5; padding: 30px; border-radius: 8px;">
          <h1 style="color: #243A5E; font-family: 'Source Serif 4', Georgia, serif; margin-bottom: 20px;">
            Thank You for Your Generosity
          </h1>

          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 20px;">
            Dear ${details.donorName},
          </p>

          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 20px;">
            Thank you for your generous <strong>${donationType.toLowerCase()}</strong> donation of
            <strong style="color: #243A5E;">${formattedAmount}</strong> to The Klara Project!
          </p>

          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 30px;">
            Your support helps us equip churches with practical resources for the AI age. Your donation will fund curriculum development, educational grants for students exploring faith and technology, and the infrastructure we need to serve you and our churches well.
          </p>

          <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #243A5E; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 2px solid #C9A962; padding-bottom: 8px;">
              Donation Details - Keep for Your Records
            </h2>
            <table style="width: 100%; color: #2D2A27; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                <td style="padding: 8px 0; color: #243A5E; font-weight: bold;">${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Type:</td>
                <td style="padding: 8px 0;">${donationType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Donor:</td>
                <td style="padding: 8px 0;">${details.donorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${details.donorEmail}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #C9A962; background-color: rgba(201, 169, 98, 0.15); border-left: 4px solid #C9A962; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
            <h3 style="color: #2D2A27; font-size: 14px; margin: 0 0 10px 0;">Tax Information</h3>
            <p style="color: #666; font-size: 13px; margin: 0;">
              Klara Project, Inc. is a 501(c)(3) tax-exempt organization (EIN: 41-2660092). Your donation is tax-deductible to the full extent allowed by law. No goods or services were provided in exchange for this contribution. Please retain this email as your official donation receipt.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${details.manageUrl}" style="display: inline-block; background-color: #243A5E; color: #FAF8F5; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">
              Manage Your Donation
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 10px;">
              Increase, decrease, or cancel your donation at any time
            </p>
          </div>

          <p style="color: #2D2A27; font-size: 16px; margin-top: 30px;">
            With gratitude,<br>
            <strong>The Klara Project Team</strong>
          </p>
        </div>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          The Klara Project - "Christian Clarity for the AI Age"
        </p>
      </div>
    `,
  };

  await client.send(msg);
}

// ─── Owner notification email ─────────────────────────────────────────────────

interface OwnerNotificationDetails {
  eventType:
    | "donation"
    | "newsletter"
    | "whitepaper"
    | "volunteer"
    | "experience"
    | "inquiry"
    | "payment_failed";
  contactName?: string;
  contactEmail: string;
  details: Record<string, string>; // key-value pairs rendered in the email
}

export async function sendOwnerNotificationEmail(
  details: OwnerNotificationDetails,
): Promise<void> {
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  if (!ownerEmail) {
    console.warn(
      "OWNER_NOTIFICATION_EMAIL not set — skipping owner notification",
    );
    return;
  }

  const { client, fromEmail } = getSendGridClient();

  const EVENT_LABELS: Record<string, string> = {
    donation: "💰 New Donation",
    newsletter: "📧 Newsletter Signup",
    whitepaper: "📄 White Paper Download",
    volunteer: "🙋 Volunteer Signup",
    experience: "💬 Experience Submission",
    inquiry: "⛪ Church/Workshop Inquiry",
    payment_failed: "⚠️ Payment Failed",
  };

  const label = EVENT_LABELS[details.eventType] || details.eventType;
  const rows = Object.entries(details.details)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;font-weight:bold;color:#2D2A27;width:40%">${k}</td>` +
        `<td style="padding:6px 0;color:#2D2A27">${v}</td></tr>`,
    )
    .join("");

  const msg = {
    to: ownerEmail,
    from: { email: fromEmail, name: "Klara Project Website" },
    subject: `${label} — ${details.contactName || details.contactEmail}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#243A5E;padding:16px 24px;border-radius:8px 8px 0 0">
          <h2 style="color:#FAF8F5;margin:0;font-size:18px">${label}</h2>
        </div>
        <div style="background:#FAF8F5;padding:24px;border-radius:0 0 8px 8px;border:1px solid #ddd">
          <table style="width:100%">${rows}</table>
          <p style="color:#999;font-size:12px;margin-top:20px">
            Sent by Klara Project website at ${new Date().toLocaleString()}
          </p>
        </div>
      </div>`,
    text: Object.entries(details.details)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  };

  await client.send(msg);
}

interface UserConfirmationDetails {
  toEmail: string;
  toName: string;
  eventType:
    | "newsletter"
    | "volunteer"
    | "experience"
    | "inquiry"
    | "whitepaper"
    | "recurring_payment"
    | "subscription_created"
    | "one_time_donation";
  extraDetails?: Record<string, string>;
}

export async function sendUserConfirmationEmail(
  details: UserConfirmationDetails,
): Promise<void> {
  const { client, fromEmail } = getSendGridClient();

  const CONTENT: Record<
    string,
    { subject: string; heading: string; body: string }
  > = {
    newsletter: {
      subject: "You're subscribed — The Klara Project",
      heading: "Welcome to our mailing list!",
      body: "Thank you for subscribing. You'll receive updates on resources, research, and opportunities to engage with our work equipping churches for the AI age.",
    },
    volunteer: {
      subject: "We received your volunteer interest — The Klara Project",
      heading: "Thank you for your interest in volunteering!",
      body: `We've received your submission and will review your background. Someone from our team will be in touch soon about how you can contribute${details.extraDetails?.Expertise ? ` in the area of <strong>${details.extraDetails.Expertise}</strong>` : ""}.`,
    },
    experience: {
      subject: "We received your submission — The Klara Project",
      heading: "Thank you for sharing!",
      body: "We appreciate you taking the time to share your experience or question with us. We read every submission and may feature it in our media with your permission.",
    },
    inquiry: {
      subject: "We received your inquiry — The Klara Project",
      heading: "Thank you for reaching out!",
      body: `We're excited to hear about your interest in bringing The Klara Project to ${details.extraDetails?.Church && details.extraDetails.Church !== "—" ? `<strong>${details.extraDetails.Church}</strong>` : "your church"}. Someone from our team will follow up with you shortly.`,
    },
    whitepaper: {
      subject: "Your white paper download — The Klara Project",
      heading: "Thank you for your interest!",
      body: "Thank you for downloading our white paper. We hope it equips you and your community to engage thoughtfully with AI from a Christian perspective.",
    },
    recurring_payment: {
      subject: "Your recurring donation was received — The Klara Project",
      heading: "Thank you for your continued support!",
      body: `Your monthly donation of <strong>${details.extraDetails?.Amount || ""}</strong> has been successfully processed. Your ongoing generosity helps us equip churches for the AI age.`,
    },
    subscription_created: {
      subject: "Your monthly donation is active — The Klara Project",
      heading: "Your monthly giving is set up!",
      body: `Your monthly donation of <strong>${details.extraDetails?.Amount || ""}</strong> has been confirmed. Thank you for your commitment to supporting The Klara Project.`,
    },
    one_time_donation: {
      subject: "Your one-time donation was received — The Klara Project",
      heading: "Thank you for your generous gift!",
      body: `Your one-time donation of <strong>${details.extraDetails?.Amount || ""}</strong> has been successfully processed. Your support helps us equip churches for the AI age.`,
    },
  };

  const content = CONTENT[details.eventType];

  const msg = {
    to: details.toEmail,
    from: { email: fromEmail, name: "The Klara Project" },
    subject: content.subject,
    html: `
      <div style="font-family:'IBM Plex Sans',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background-color:#FAF8F5;padding:30px;border-radius:8px">
          <h1 style="color:#243A5E;font-family:'Source Serif 4',Georgia,serif;margin-bottom:20px">
            Klara Project
          </h1>
          <h2 style="color:#243A5E;font-size:20px;margin-bottom:16px">
            ${content.heading}
          </h2>
          <p style="color:#2D2A27;font-size:16px;line-height:1.6;margin-bottom:20px">
            Dear ${details.toName},
          </p>
          <p style="color:#2D2A27;font-size:16px;line-height:1.6;margin-bottom:24px">
            ${content.body}
          </p>
          <div style="border-top:1px solid #ddd;padding-top:20px;margin-top:20px">
            <p style="color:#2D2A27;font-size:15px">
              With gratitude,<br>
              <strong>The Klara Project Team</strong>
            </p>
          </div>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin-top:20px">
          The Klara Project — Christian Clarity for the AI Age
        </p>
      </div>`,
    text: `Dear ${details.toName},\n\n${content.body.replace(/<[^>]+>/g, "")}\n\nWith gratitude,\nThe Klara Project Team`,
  };

  await client.send(msg);
}