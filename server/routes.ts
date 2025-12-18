import type { Express } from "express";
import { createServer, type Server } from "http";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { sendVerificationEmail, sendDonationThankYouEmail } from "./sendgridClient";
import { trackNewsletterSignup, trackDonation, trackWhitePaperDownload, trackPageVisit, updateCommunicationConsent } from "./hubspotClient";
import { db } from "./db";
import { verificationCodes, donorSessions } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";
import { moderateRateLimiter, lightRateLimiter, eventFriendlyRateLimiter } from "./rateLimiter";

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

  app.post('/api/donor/send-code', eventFriendlyRateLimiter, async (req, res) => {
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

  app.post('/api/donor/verify-code', eventFriendlyRateLimiter, async (req, res) => {
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
        subscriptions: subscriptions.data.map((sub: any) => ({
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

  app.post('/api/create-checkout-session', eventFriendlyRateLimiter, async (req, res) => {
    try {
      const { amount, frequency, email, name, phone, duration, successUrl, cancelUrl, communicationConsent, recaptchaToken } = req.body;

      if (!amount || !email || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Verify reCAPTCHA token
      if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
        try {
          const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
            { method: 'POST' }
          );
          const recaptchaData = await recaptchaResponse.json();
          
          if (!recaptchaData.success || recaptchaData.score < 0.5) {
            console.log(`reCAPTCHA failed: success=${recaptchaData.success}, score=${recaptchaData.score}`);
            return res.status(400).json({ error: 'Security verification failed. Please try again.' });
          }
          console.log(`reCAPTCHA passed: score=${recaptchaData.score}`);
        } catch (recaptchaError) {
          console.error('reCAPTCHA verification error:', recaptchaError);
          // Continue without blocking if reCAPTCHA service is down
        }
      }

      const stripe = await getUncachableStripeClient();
      const amountInCents = Math.round(amount * 100);

      // Check for existing customer with this email
      let customerId: string | undefined;
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
        console.log(`Reusing existing Stripe customer ${customerId} for ${email}`);
      } else {
        // Create new customer
        const newCustomer = await stripe.customers.create({
          email: email,
          name: name,
          phone: phone || undefined,
          metadata: {
            source: 'klara_project_website',
          },
        });
        customerId = newCustomer.id;
        console.log(`Created new Stripe customer ${customerId} for ${email}`);
      }

      if (frequency === 'monthly') {
        const durationLabel = duration && duration !== 'ongoing' ? ` (${duration} months)` : '';
        
        // Build subscription_data with metadata for fixed-term donations
        const subscriptionData: any = {
          metadata: {
            duration: duration || 'ongoing',
            donor_name: name,
          }
        };
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          customer: customerId,
          subscription_data: subscriptionData,
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
            donor_phone: phone || '',
            donation_type: 'monthly',
            amount: amount.toString(),
            duration: duration || 'ongoing',
            communication_consent: communicationConsent ? 'true' : 'false',
          },
          success_url: successUrl || `${req.protocol}://${req.get('host')}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/donate`,
        });

        res.json({ url: session.url, sessionId: session.id });
      } else {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          customer: customerId,
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
            donor_phone: phone || '',
            donation_type: 'one-time',
            amount: amount.toString(),
            communication_consent: communicationConsent ? 'true' : 'false',
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

  app.get('/api/donor/receipt/:sessionId/:chargeId', async (req, res) => {
    try {
      const { sessionId, chargeId } = req.params;
      
      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session || !session.stripeCustomerId) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      const stripe = await getUncachableStripeClient();
      const charge = await stripe.charges.retrieve(chargeId);

      if (charge.customer !== session.stripeCustomerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const receiptData = {
        chargeId: charge.id,
        amount: charge.amount,
        date: new Date(charge.created * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        email: session.email,
        status: charge.status,
        paymentMethod: charge.payment_method_details?.card?.brand 
          ? `${charge.payment_method_details.card.brand} ending in ${charge.payment_method_details.card.last4}`
          : 'Card',
      };

      res.json(receiptData);
    } catch (error: any) {
      console.error('Error fetching receipt:', error);
      res.status(500).json({ error: 'Failed to fetch receipt' });
    }
  });

  app.get('/api/donor/ytd-statement/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session || !session.stripeCustomerId) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      const stripe = await getUncachableStripeClient();
      
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const startTimestamp = Math.floor(startOfYear.getTime() / 1000);

      const charges = await stripe.charges.list({
        customer: session.stripeCustomerId,
        limit: 100,
        created: { gte: startTimestamp },
      });

      const successfulCharges = charges.data.filter(c => c.status === 'succeeded');
      const totalAmount = successfulCharges.reduce((sum, c) => sum + c.amount, 0);

      const statementData = {
        year: currentYear,
        email: session.email,
        totalAmount,
        donations: successfulCharges.map(c => ({
          id: c.id,
          date: new Date(c.created * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          amount: c.amount,
        })),
        generatedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      res.json(statementData);
    } catch (error: any) {
      console.error('Error generating YTD statement:', error);
      res.status(500).json({ error: 'Failed to generate statement' });
    }
  });

  // Update recurring donation amount
  app.patch('/api/donor/subscription/:subscriptionId', eventFriendlyRateLimiter, async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const { sessionId, newAmount } = req.body;
      
      if (!sessionId || !newAmount || typeof newAmount !== 'number' || newAmount < 1) {
        return res.status(400).json({ error: 'Valid session ID and amount (minimum $1) required' });
      }

      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session || !session.stripeCustomerId) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      const stripe = await getUncachableStripeClient();
      
      // Verify this subscription belongs to the customer
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (subscription.customer !== session.stripeCustomerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const subscriptionItem = subscription.items.data[0];
      if (!subscriptionItem) {
        return res.status(400).json({ error: 'No subscription item found' });
      }

      const amountInCents = Math.round(newAmount * 100);

      // Create a new price for the updated amount
      // We create inline price_data with product_data to avoid issues with inactive products
      const newPrice = await stripe.prices.create({
        currency: 'usd',
        unit_amount: amountInCents,
        recurring: {
          interval: subscriptionItem.price.recurring?.interval || 'month',
        },
        product_data: {
          name: 'Monthly Donation to Klara Project',
        },
      });

      // Update the subscription with the new price
      await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscriptionItem.id,
          price: newPrice.id,
        }],
        proration_behavior: 'create_prorations',
      });

      console.log(`Subscription ${subscriptionId} updated to $${newAmount}/month`);
      res.json({ success: true, newAmount });
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: error.message || 'Failed to update donation amount' });
    }
  });

  // Cancel recurring donation
  app.post('/api/donor/subscription/:subscriptionId/cancel', eventFriendlyRateLimiter, async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const { sessionId, confirmed } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      if (!confirmed) {
        return res.status(400).json({ error: 'Cancellation must be confirmed' });
      }

      const [session] = await db.select()
        .from(donorSessions)
        .where(and(
          eq(donorSessions.id, sessionId),
          gt(donorSessions.expiresAt, new Date())
        ));

      if (!session || !session.stripeCustomerId) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      const stripe = await getUncachableStripeClient();
      
      // Verify this subscription belongs to the customer
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (subscription.customer !== session.stripeCustomerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Cancel at period end (graceful cancellation)
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      console.log(`Subscription ${subscriptionId} set to cancel at period end`);
      res.json({ success: true, cancelAtPeriodEnd: true });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ error: error.message || 'Failed to cancel donation' });
    }
  });

  app.post('/api/send-donation-thank-you', async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.status !== 'complete') {
        return res.status(400).json({ error: 'Session not complete' });
      }

      const metadata = session.metadata || {};
      const donorName = metadata.donor_name || 'Valued Donor';
      const donorEmail = metadata.donor_email || session.customer_email;
      const donationType = metadata.donation_type || 'one-time';
      const duration = metadata.duration;
      const communicationConsent = metadata.communication_consent === 'true';
      
      if (!donorEmail) {
        return res.status(400).json({ error: 'No email found for session' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      await sendDonationThankYouEmail({
        donorName,
        donorEmail,
        amount: session.amount_total || 0,
        isRecurring: donationType === 'monthly',
        duration,
        date: new Date(),
        manageUrl: `${baseUrl}/manage-donation`,
      });

      // Set cancel_at for fixed-term subscriptions
      if (donationType === 'monthly' && duration && duration !== 'ongoing' && session.subscription) {
        const months = parseInt(duration);
        if ([3, 6, 12].includes(months)) {
          try {
            const subscriptionId = typeof session.subscription === 'string' 
              ? session.subscription 
              : session.subscription.id;
            
            const now = new Date();
            const originalDay = now.getDate();
            const cancelDate = new Date(now);
            cancelDate.setMonth(cancelDate.getMonth() + months);
            
            // Handle month overflow (e.g., Jan 31 + 1 month = Feb 28)
            if (cancelDate.getDate() !== originalDay) {
              cancelDate.setDate(0);
            }
            
            await stripe.subscriptions.update(subscriptionId, {
              cancel_at: Math.floor(cancelDate.getTime() / 1000),
            });
            console.log(`Set subscription ${subscriptionId} to cancel at ${cancelDate.toISOString()}`);
          } catch (cancelError: any) {
            console.error('Error setting fixed-term cancellation:', cancelError);
          }
        }
      }

      // Track donation in HubSpot
      try {
        await trackDonation({
          email: donorEmail,
          donorName,
          amount: session.amount_total || 0,
          donationType: donationType === 'monthly' ? 'monthly' : 'one-time',
          duration,
        });
        
        // Update communication consent in HubSpot only if explicitly set in metadata
        if (metadata.communication_consent !== undefined) {
          await updateCommunicationConsent(donorEmail, communicationConsent);
        }
      } catch (hubspotError: any) {
        console.error('HubSpot tracking error:', hubspotError);
      }

      console.log(`Thank you email sent to ${donorEmail}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error sending thank you email:', error);
      res.status(500).json({ error: 'Failed to send thank you email' });
    }
  });

  // Newsletter signup endpoint with HubSpot tracking
  app.post('/api/newsletter/subscribe', moderateRateLimiter, async (req, res) => {
    try {
      const result = emailSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      const { email } = result.data;

      // Track in HubSpot
      try {
        await trackNewsletterSignup(email);
      } catch (hubspotError: any) {
        console.error('HubSpot newsletter tracking error:', hubspotError);
      }

      console.log(`Newsletter subscription: ${email}`);
      res.json({ success: true, message: 'Successfully subscribed to newsletter' });
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ error: 'Failed to subscribe to newsletter' });
    }
  });

  // White paper download tracking endpoint
  app.post('/api/whitepaper/download', moderateRateLimiter, async (req, res) => {
    try {
      const result = emailSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      const { email } = result.data;

      // Track in HubSpot
      try {
        await trackWhitePaperDownload(email);
      } catch (hubspotError: any) {
        console.error('HubSpot white paper tracking error:', hubspotError);
      }

      console.log(`White paper download: ${email}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error tracking white paper download:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Track page visits for returning visitors
  app.post('/api/track-visit', lightRateLimiter, async (req, res) => {
    try {
      const { visitorId, page, email } = req.body;
      
      if (!visitorId || !page) {
        return res.status(400).json({ error: 'Visitor ID and page are required' });
      }

      try {
        await trackPageVisit({ visitorId, page, email });
      } catch (hubspotError: any) {
        console.error('HubSpot page visit tracking error:', hubspotError);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error tracking page visit:', error);
      res.status(500).json({ error: 'Failed to track visit' });
    }
  });

  return httpServer;
}
