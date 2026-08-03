import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";
dotenv.config();

async function testSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_SENDER_EMAIL;
  const toEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  console.log("🚀 ~ testSendGrid ~ toEmail:", toEmail)

  if (!apiKey || !fromEmail || !toEmail) {
    console.error(
      "❌ Missing env vars. Check SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL, OWNER_NOTIFICATION_EMAIL",
    );
    process.exit(1);
  }

  sgMail.setApiKey(apiKey);

  console.log(`Sending test email from ${fromEmail} to ${toEmail}...`);

  try {
    await sgMail.send({
      to: toEmail,
      from: { email: fromEmail, name: "The Klara Project" },
      subject: "✅ SendGrid Test — Klara Project",
      text: "If you see this, SendGrid is configured correctly.",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#243A5E">✅ SendGrid is working</h2>
          <p>API Key: ${apiKey.substring(0, 10)}…</p>
          <p>From: ${fromEmail}</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>`,
    });
    console.log("✅ Test email sent successfully. Check your inbox.");
  } catch (error: any) {
    console.error("❌ SendGrid error:");
    console.error("Status:", error?.code);
    console.error("Message:", error?.message);
    if (error?.response?.body?.errors) {
      console.error(
        "Errors:",
        JSON.stringify(error.response.body.errors, null, 2),
      );
    }
  }
}

testSendGrid();
// how can i test the prd listed funcitonalities one by one please provide clear steps