import type { Express } from "express";
import { createServer, type Server } from "http";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get('/api/stripe/config', async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: any) {
      console.error('Error getting Stripe config:', error);
      res.status(500).json({ error: 'Failed to get Stripe configuration' });
    }
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { amount, frequency, email, name, successUrl, cancelUrl } = req.body;

      if (!amount || !email || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const stripe = await getUncachableStripeClient();
      const amountInCents = Math.round(amount * 100);

      if (frequency === 'monthly') {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          customer_email: email,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Monthly Donation to Klara Project',
                  description: `$${amount}/month recurring donation`,
                },
                unit_amount: amountInCents,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            donor_name: name,
            donor_email: email,
            donation_type: 'monthly',
            amount: amount.toString(),
          },
          success_url: successUrl || `${req.protocol}://${req.get('host')}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/donate`,
        });

        res.json({ url: session.url, sessionId: session.id });
      } else {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          customer_email: email,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'One-Time Donation to Klara Project',
                  description: `$${amount} donation`,
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            },
          ],
          metadata: {
            donor_name: name,
            donor_email: email,
            donation_type: 'one-time',
            amount: amount.toString(),
          },
          success_url: successUrl || `${req.protocol}://${req.get('host')}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/donate`,
        });

        res.json({ url: session.url, sessionId: session.id });
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });

  app.get('/api/checkout-session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      res.json({
        status: session.status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      });
    } catch (error: any) {
      console.error('Error retrieving checkout session:', error);
      res.status(500).json({ error: 'Failed to retrieve session' });
    }
  });

  return httpServer;
}
