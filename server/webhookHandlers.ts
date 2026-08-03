import Stripe from "stripe";
import { getStripeClient, getStripeWebhookSecret } from "./stripeClient";
import {
  trackDonation,
  findDealBySubscriptionId,
  updateDealStage,
  incrementLifetimeDonations,
  HUBSPOT_IDS,
} from "./hubspotClient";
import {
  sendOwnerNotificationEmail,
  sendUserConfirmationEmail,
} from "./sendgridClient";

export class WebhookHandlers {
  static async processWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. " +
          "Ensure webhook route is registered BEFORE app.use(express.json()).",
      );
    }

    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    console.log(`Stripe webhook received: ${event.type} (${event.id})`);
    await WebhookHandlers.handleEvent(event);
    return event;
  }

  private static async handleEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      // ── Donation deal creation moved here from thank-you page ──────────────
      case "checkout.session.completed": {
        console.log("Processing checkout.session.completed webhook");
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata || {};

        const donorEmail = meta.donor_email || session.customer_email;

        try {
          await trackDonation({
            email: donorEmail,
            donorName: meta.donor_name || "Valued Donor",
            amount: session.amount_total || 0,
            donationType:
              meta.donation_type === "monthly" ? "monthly" : "one-time",
            duration: meta.duration,
            phone: meta.donor_phone || "",
            stripeSessionId: session.id,
            stripeSubscriptionId:
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription?.id,
            stripeCustomerId:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.id,
          });
          console.log(`HubSpot deal created via webhook for ${donorEmail}`);
        } catch (err: any) {
          console.error("Webhook: trackDonation failed:", err.message);
        }
        const amountFormatted = `$${((session.amount_total || 0) / 100).toFixed(2)}`;
        const donorName = meta.donor_name || "Valued Donor";
        const isMonthly = meta.donation_type === "monthly";

        // Only send these here for one-time; monthly is handled in invoice.paid
        if (!isMonthly) {
          try {
            await sendUserConfirmationEmail({
              toEmail: !donorEmail ? session.customer_email : donorEmail,
              toName: donorName,
              eventType: "one_time_donation",
              extraDetails: {
                Amount: amountFormatted,
                "Session ID": session.id,
              },
            });
          } catch (e: any) {
            console.error(
              "Failed to send one-time donor confirmation email:",
              e.message,
            );
          }

          try {
            await sendOwnerNotificationEmail({
              eventType: "donation",
              contactEmail: !donorEmail ? session.customer_email : donorEmail,
              details: {
                Email: !donorEmail ? session.customer_email : donorEmail,
                Name: donorName,
                Amount: amountFormatted,
                Type: "One-time",
                ...(meta.donor_phone ? { Phone: meta.donor_phone } : {}),
                "Session ID": session.id,
              },
            });
          } catch (e: any) {
            console.error(
              "Failed to send one-time owner notification:",
              e.message,
            );
          }
        }
        break;
      }

      // ── Recurring renewal ──────────────────────────────────────────────────
      // case "invoice.paid": {
      //   const invoice = event.data.object as Stripe.Invoice;
      //   const inv = invoice as any; // SDK version missing subscription typing
      //   const subscriptionId: string | undefined =
      //     typeof inv.subscription === "string"
      //       ? inv.subscription
      //       : inv.subscription?.id;

      //   if (!subscriptionId) break;
      //   if (invoice.billing_reason !== "subscription_cycle") break;

      //   const dealId = await findDealBySubscriptionId(subscriptionId);
      //   if (dealId) {
      //     await updateDealStage(dealId, HUBSPOT_IDS.STAGE_RECURRING_RENEWED, {
      //       subscription_status: "active",
      //     });
      //   }

      //   const customerEmail = invoice.customer_email ?? undefined;
      //   if (customerEmail) {
      //     await incrementLifetimeDonations(customerEmail, invoice.amount_paid);
      //   }

      //   console.log(
      //     `invoice.paid: updated deal for subscription ${subscriptionId}`,
      //   );
      //   break;
      // }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const inv = invoice as any;
        // const invoice = event.data.object as Stripe.Invoice;
        // const inv = invoice as any;

        // Pull duration from subscription metadata
        console.log("🚀 ~ WebhookHandlers ~ handleEvent ~ inv:", inv);
        console.log(
          "🚀 ~ WebhookHandlers ~ handleEvent ~ inv.parent?.subscription_details?.metadata:",
          inv.parent?.subscription_details?.metadata,
        );
        console.log(
          "🚀 ~ WebhookHandlers ~ handleEvent ~ inv.parent?.subscription_details:",
          inv.parent?.subscription_details,
        );
        const subscriptionMeta =
          inv.subscription_details?.metadata ||
          inv.parent?.subscription_details?.metadata ||
          {};
        console.log(
          "🚀 ~ WebhookHandlers ~ handleEvent ~ subscriptionMeta:",
          subscriptionMeta,
        );
        const duration: string | undefined = subscriptionMeta.duration;
        console.log("🚀 ~ WebhookHandlers ~ handleEvent ~ duration:", duration);
        const subscriptionId: string | undefined =
          typeof inv.subscription === "string"
            ? inv.subscription
            : (inv.subscription?.id ??
              inv.parent?.subscription_details?.subscription ??
              undefined);
        console.log(
          `invoice.paid event received. subscriptionId: ${subscriptionId}, billing_reason: ${invoice.billing_reason}`,
        );
        if (!subscriptionId) break;

        // Allow both initial subscription payment AND renewals
        const isInitialPayment =
          invoice.billing_reason === "subscription_create";
        const isRenewal = invoice.billing_reason === "subscription_cycle";

        if (!isInitialPayment && !isRenewal) {
          console.log(
            `invoice.paid: skipping billing_reason=${invoice.billing_reason}`,
          );
          break;
        }

        const customerEmail = invoice.customer_email ?? undefined;

        if (isRenewal) {
          // Update existing deal stage + increment lifetime total
          const dealId = await findDealBySubscriptionId(subscriptionId);
          if (dealId) {
            await updateDealStage(dealId, HUBSPOT_IDS.STAGE_RECURRING_RENEWED, {
              subscription_status: "active",
            });
            console.log(
              `invoice.paid: deal ${dealId} updated to Recurring Renewed`,
            );
          } else {
            console.warn(
              `invoice.paid: no deal found for subscription ${subscriptionId}`,
            );
          }

          if (customerEmail) {
            await incrementLifetimeDonations(
              customerEmail,
              invoice.amount_paid,
            );
          }
        }

        // Send renewal/payment confirmation email to donor
        if (customerEmail) {
          try {
            const amountFormatted = `$${(invoice.amount_paid / 100).toFixed(2)}`;
            await sendUserConfirmationEmail({
              toEmail: customerEmail,
              toName: invoice.customer_name || "Valued Donor",
              eventType: isRenewal
                ? "recurring_payment"
                : "subscription_created",
              extraDetails: {
                Amount: amountFormatted,
                "Invoice ID": invoice.id,
              },
            });
          } catch (e: any) {
            console.error(
              "Failed to send invoice.paid donor email:",
              e.message,
            );
          }

          // Owner notification
          try {
            await sendOwnerNotificationEmail({
              eventType: "donation",
              contactEmail: customerEmail,
              details: {
                Email: customerEmail,
                Amount: `$${(invoice.amount_paid / 100).toFixed(2)}`,
                Type: isRenewal ? "Recurring renewal" : "Subscription created",
                ...(duration ? { Duration: duration } : {}),
                "Subscription ID": subscriptionId,
                "Invoice ID": invoice.id,
              },
            });
          } catch (e: any) {
            console.error(
              "Failed to send invoice.paid owner notification:",
              e.message,
            );
          }
        }

        console.log(
          `invoice.paid: processed ${invoice.billing_reason} for subscription ${subscriptionId}`,
        );
        break;
      }
      // ── Payment failure ────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const inv = invoice as any;
        const subscriptionId: string | undefined =
          typeof inv.subscription === "string"
            ? inv.subscription
            : (inv.subscription?.id ??
              inv.parent?.subscription_details?.subscription ??
              undefined);

        if (subscriptionId) {
          const dealId = await findDealBySubscriptionId(subscriptionId);
          if (dealId) {
            await updateDealStage(dealId, HUBSPOT_IDS.STAGE_PAYMENT_FAILED, {
              subscription_status: "failed",
            });
          }
        }

        const failEmail = invoice.customer_email || "Unknown";
        try {
          await sendOwnerNotificationEmail({
            eventType: "payment_failed",
            contactEmail: failEmail,
            details: {
              Email: failEmail,
              "Invoice ID": invoice.id,
              Amount: `$${((invoice.amount_due || 0) / 100).toFixed(2)}`,
              "Subscription ID": subscriptionId || "N/A",
            },
          });
        } catch (e: any) {
          console.error(
            "Failed to send payment failure notification:",
            e.message,
          );
        }
        break;
      }

      // ── Subscription cancelled ─────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const dealId = await findDealBySubscriptionId(subscription.id);
        if (dealId) {
          await updateDealStage(dealId, HUBSPOT_IDS.STAGE_RECURRING_CANCELLED, {
            subscription_status: "cancelled",
          });
        }
        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "charge.succeeded":
        // Handled via checkout.session.completed / invoice.paid
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}

// import Stripe from 'stripe';
// import { getStripeClient, getStripeWebhookSecret } from './stripeClient';

// export class WebhookHandlers {
//   /**
//    * Process incoming Stripe webhook events with signature verification.
//    *
//    * To set up webhooks in Stripe Dashboard:
//    * 1. Go to Developers → Webhooks
//    * 2. Add endpoint: https://yourdomain.com/api/stripe/webhook
//    * 3. Select events: checkout.session.completed, customer.subscription.*, invoice.paid, charge.succeeded
//    * 4. Copy the Signing Secret to STRIPE_WEBHOOK_SECRET env var
//    */
//   static async processWebhook(payload: Buffer, signature: string): Promise<Stripe.Event> {
//     if (!Buffer.isBuffer(payload)) {
//       throw new Error(
//         'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
//         'Received type: ' + typeof payload + '. ' +
//         'This usually means express.json() parsed the body before reaching this handler. ' +
//         'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
//       );
//     }

//     const stripe = getStripeClient();
//     const webhookSecret = getStripeWebhookSecret();

//     // Verify the webhook signature
//     const event = stripe.webhooks.constructEvent(
//       payload,
//       signature,
//       webhookSecret
//     );

//     // Log the event for debugging
//     console.log(`Stripe webhook received: ${event.type} (${event.id})`);

//     // Handle specific event types
//     await WebhookHandlers.handleEvent(event);

//     return event;
//   }

//   /**
//    * Handle specific Stripe event types.
//    * Add custom logic here for different event types.
//    */
//   private static async handleEvent(event: Stripe.Event): Promise<void> {
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object as Stripe.Checkout.Session;
//         console.log(`Checkout completed: ${session.id}, customer: ${session.customer_email}`);
//         // The thank-you page handles sending emails, so we just log here
//         break;
//       }

//       case 'customer.subscription.created': {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log(`Subscription created: ${subscription.id}`);
//         break;
//       }

//       case 'customer.subscription.updated': {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
//         break;
//       }

//       case 'customer.subscription.deleted': {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log(`Subscription cancelled: ${subscription.id}`);
//         break;
//       }

//       case 'invoice.paid': {
//         const invoice = event.data.object as Stripe.Invoice;
//         console.log(`Invoice paid: ${invoice.id}, amount: ${invoice.amount_paid}`);
//         break;
//       }

//       case 'invoice.payment_failed': {
//         const invoice = event.data.object as Stripe.Invoice;
//         console.log(`Invoice payment failed: ${invoice.id}`);
//         // You could send a notification email here
//         break;
//       }

//       case 'charge.succeeded': {
//         const charge = event.data.object as Stripe.Charge;
//         console.log(`Charge succeeded: ${charge.id}, amount: ${charge.amount}`);
//         break;
//       }

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }
//   }
// }
