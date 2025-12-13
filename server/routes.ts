import type { Express } from "express";
import { createServer, type Server } from "http";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { sendVerificationEmail } from "./sendgridClient";
import { db } from "./db";
import { verificationCodes, donorSessions } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 digits"),
});

const sessionIdSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post('/api/donor/send-code', async (req, res) => {
    try {
      const result = emailSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      const { email } = result.data;

      const code = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await db.delete(verificationCodes).where(eq(verificationCodes.email, email));
      await db.insert(verificationCodes).values({ email, code, expiresAt });

      console.log(`Verification code for ${email}: ${code}`);

      try {
        await sendVerificationEmail(email, code);
        console.log(`Verification email sent to ${email}`);
      } catch (emailError: any) {
        console.error('Failed to send verification email:', emailError);
      }

      res.json({ success: true, message: 'Verification code sent' });
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  });

  app.post('/api/donor/verify-code', async (req, res) => {
    try {
      const result = verifyCodeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Valid email and 6-digit code are required' });
      }
      const { email, code } = result.data;

      console.log(`Verifying code for ${email}: ${code}`);

      const allCodes = await db.select()
        .from(verificationCodes)
        .where(eq(verificationCodes.email, email));
      
      console.log(`Found ${allCodes.length} codes for email:`, allCodes.map(c => ({
        code: c.code,
        expiresAt: c.expiresAt,
        now: new Date(),
        isExpired: c.expiresAt <= new Date()
      })));

      const [verification] = await db.select()
        .from(verificationCodes)
        .where(and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.code, code),
          gt(verificationCodes.expiresAt, new Date())
        ));

      if (!verification) {
        console.log('No valid verification found');
        return res.status(400).json({ error: 'Invalid or expired code' });
      }

      await db.delete(verificationCodes).where(eq(verificationCodes.email, email));

      const stripe = await getUncachableStripeClient();
      const customers = await stripe.customers.list({ email, limit: 1 });
      const stripeCustomerId = customers.data[0]?.id || null;

      const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const [session] = await db.insert(donorSessions)
        .values({ email, stripeCustomerId, expiresAt: sessionExpiresAt })
        .returning();

      res.json({ success: true, sessionId: session.id, hasStripeAccount: !!stripeCustomerId });
    } catch (error: any) {
      console.error('Error verifying code:', error);
      res.status(500).json({ error: 'Failed to verify code' });
    }
  });

  app.get('/api/donor/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      res.json({ email: session.email, stripeCustomerId: session.stripeCustomerId });
    } catch (error: any) {
      console.error('Error fetching session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  app.get('/api/donor/donations/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      if (!session.stripeCustomerId) {
        return res.json({ subscriptions: [], charges: [], hasStripeAccount: false });
      }

      const stripe = await getUncachableStripeClient();
      
      const subscriptions = await stripe.subscriptions.list({
        customer: session.stripeCustomerId,
        status: 'all',
      });

      const charges = await stripe.charges.list({
        customer: session.stripeCustomerId,
        limit: 20,
      });

      res.json({
        hasStripeAccount: true,
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          amount: sub.items.data[0]?.price?.unit_amount || 0,
          interval: sub.items.data[0]?.price?.recurring?.interval,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        })),
        charges: charges.data.map(charge => ({
          id: charge.id,
          amount: charge.amount,
          status: charge.status,
          created: charge.created,
          description: charge.description,
        })),
      });
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: 'Failed to fetch donation history' });
    }
  });

  app.post('/api/donor/create-portal-session', async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session || !session.stripeCustomerId) {
        return res.status(401).json({ error: 'Invalid session or no Stripe account' });
      }

      const stripe = await getUncachableStripeClient();
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: session.stripeCustomerId,
        return_url: `${req.protocol}://${req.get('host')}/manage-donation`,
      });

      res.json({ url: portalSession.url });
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: 'Failed to create portal session' });
    }
  });

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
      const { amount, frequency, email, name, duration, successUrl, cancelUrl } = req.body;

      if (!amount || !email || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const stripe = await getUncachableStripeClient();
      const amountInCents = Math.round(amount * 100);

      if (frequency === 'monthly') {
        const subscriptionData: any = {};
        
        if (duration && duration !== 'ongoing') {
          const months = parseInt(duration);
          if ([3, 6, 12].includes(months)) {
            const now = new Date();
            const originalDay = now.getDate();
            const cancelDate = new Date(now);
            cancelDate.setMonth(cancelDate.getMonth() + months);
            
            if (cancelDate.getDate() !== originalDay) {
              cancelDate.setDate(0);
            }
            subscriptionData.cancel_at = Math.floor(cancelDate.getTime() / 1000);
          }
        }

        const durationLabel = duration && duration !== 'ongoing' ? ` (${duration} months)` : '';
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          customer_email: email,
          subscription_data: Object.keys(subscriptionData).length > 0 ? subscriptionData : undefined,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Monthly Donation to Klara Project',
                  description: `$${amount}/month recurring donation${durationLabel}`,
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
            duration: duration || 'ongoing',
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
