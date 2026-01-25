// SendGrid integration for sending transactional emails
import sgMail from '@sendgrid/mail';

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
    const apiKey = getRequiredEnv('SENDGRID_API_KEY');
    fromEmail = getRequiredEnv('SENDGRID_SENDER_EMAIL');
    sgMail.setApiKey(apiKey);
    initialized = true;
  }
}

// Get SendGrid client - safe to cache since env vars don't change at runtime
export function getSendGridClient() {
  initializeSendGrid();
  return {
    client: sgMail,
    fromEmail: fromEmail
  };
}

// For backwards compatibility with existing async code
export async function getUncachableSendGridClient() {
  return getSendGridClient();
}

export async function sendVerificationEmail(toEmail: string, code: string): Promise<void> {
  const { client, fromEmail } = getSendGridClient();

  const msg = {
    to: toEmail,
    from: { email: fromEmail, name: 'The Klara Project' },
    subject: 'Your Klara Project Verification Code',
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

export async function sendDonationThankYouEmail(details: DonationDetails): Promise<void> {
  const { client, fromEmail } = getSendGridClient();

  const formattedAmount = `$${(details.amount / 100).toFixed(2)}`;
  const formattedDate = details.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const donationType = details.isRecurring
    ? details.duration && details.duration !== 'ongoing'
      ? `Monthly (${details.duration} months)`
      : 'Monthly (ongoing)'
    : 'One-time';

  const msg = {
    to: details.donorEmail,
    from: { email: fromEmail, name: 'The Klara Project' },
    subject: 'Thank You for Your Donation to The Klara Project',
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
