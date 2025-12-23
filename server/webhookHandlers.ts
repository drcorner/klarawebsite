import Stripe from 'stripe';
import { getStripeClient, getStripeWebhookSecret } from './stripeClient';

export class WebhookHandlers {
  /**
   * Process incoming Stripe webhook events with signature verification.
   *
   * To set up webhooks in Stripe Dashboard:
   * 1. Go to Developers → Webhooks
   * 2. Add endpoint: https://yourdomain.com/api/stripe/webhook
   * 3. Select events: checkout.session.completed, customer.subscription.*, invoice.paid, charge.succeeded
   * 4. Copy the Signing Secret to STRIPE_WEBHOOK_SECRET env var
   */
  static async processWebhook(payload: Buffer, signature: string): Promise<Stripe.Event> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    // Log the event for debugging
    console.log(`Stripe webhook received: ${event.type} (${event.id})`);

    // Handle specific event types
    await WebhookHandlers.handleEvent(event);

    return event;
  }

  /**
   * Handle specific Stripe event types.
   * Add custom logic here for different event types.
   */
  private static async handleEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout completed: ${session.id}, customer: ${session.customer_email}`);
        // The thank-you page handles sending emails, so we just log here
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription created: ${subscription.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice paid: ${invoice.id}, amount: ${invoice.amount_paid}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment failed: ${invoice.id}`);
        // You could send a notification email here
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge succeeded: ${charge.id}, amount: ${charge.amount}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
