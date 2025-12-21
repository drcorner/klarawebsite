import Stripe from 'stripe';

// Environment variable validation
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Cached Stripe client (safe to cache since env vars don't change at runtime)
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = getRequiredEnv('STRIPE_SECRET_KEY');
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }
  return stripeClient;
}

// For backwards compatibility with existing code that uses async pattern
export async function getUncachableStripeClient(): Promise<Stripe> {
  return getStripeClient();
}

export function getStripePublishableKey(): string {
  return getRequiredEnv('STRIPE_PUBLISHABLE_KEY');
}

// Async version for backwards compatibility
export async function getStripePublishableKeyAsync(): Promise<string> {
  return getStripePublishableKey();
}

export function getStripeSecretKey(): string {
  return getRequiredEnv('STRIPE_SECRET_KEY');
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET');
}
