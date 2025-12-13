// SendGrid integration for sending transactional emails
import sgMail from '@sendgrid/mail';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableSendGridClient() {
  const {apiKey, email} = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

export async function sendVerificationEmail(toEmail: string, code: string): Promise<void> {
  const { client, fromEmail } = await getUncachableSendGridClient();
  
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Your Klara Project Verification Code',
    text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FAF8F5; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1E4D4A; font-family: 'Source Serif 4', Georgia, serif; margin-bottom: 20px;">
            Klara Project
          </h1>
          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 20px;">
            Your verification code is:
          </p>
          <div style="background-color: #1E4D4A; color: #FAF8F5; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin-bottom: 20px;">
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
          The Klara Project - Clarity for Christians in the Age of AI
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
  const { client, fromEmail } = await getUncachableSendGridClient();
  
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
    from: fromEmail,
    subject: 'Thank You for Your Donation to The Klara Project',
    text: `Dear ${details.donorName},

Thank you for your generous ${donationType.toLowerCase()} donation of ${formattedAmount} to The Klara Project!

Your support helps us equip Christians with practical resources for engaging thoughtfully with AI and technology.

DONATION DETAILS - KEEP FOR YOUR RECORDS
-----------------------------------------
Date: ${formattedDate}
Amount: ${formattedAmount}
Type: ${donationType}
Donor: ${details.donorName}
Email: ${details.donorEmail}

TAX INFORMATION
-----------------------------------------
The Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, donations will be tax-deductible retroactive to our date of incorporation. We will notify you when approval is received. Please retain this email for your records.

MANAGE YOUR DONATION
-----------------------------------------
You can manage your donation at any time - increase, decrease, or cancel - by visiting:
${details.manageUrl}

With gratitude,
The Klara Project Team

"Clarity for Christians in the Age of AI"
`,
    html: `
      <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FAF8F5; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1E4D4A; font-family: 'Source Serif 4', Georgia, serif; margin-bottom: 20px;">
            Thank You for Your Generosity
          </h1>
          
          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 20px;">
            Dear ${details.donorName},
          </p>
          
          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 20px;">
            Thank you for your generous <strong>${donationType.toLowerCase()}</strong> donation of 
            <strong style="color: #1E4D4A;">${formattedAmount}</strong> to The Klara Project!
          </p>
          
          <p style="color: #2D2A27; font-size: 16px; margin-bottom: 30px;">
            Your support helps us equip Christians with practical resources for engaging thoughtfully with AI and technology.
          </p>
          
          <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #1E4D4A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 2px solid #C9A962; padding-bottom: 8px;">
              Donation Details - Keep for Your Records
            </h2>
            <table style="width: 100%; color: #2D2A27; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                <td style="padding: 8px 0; color: #1E4D4A; font-weight: bold;">${formattedAmount}</td>
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
              The Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, donations will be tax-deductible retroactive to our date of incorporation. We will notify you when approval is received. Please retain this email for your records.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${details.manageUrl}" style="display: inline-block; background-color: #1E4D4A; color: #FAF8F5; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">
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
          The Klara Project - "Clarity for Christians in the Age of AI"
        </p>
      </div>
    `,
  };

  await client.send(msg);
}
