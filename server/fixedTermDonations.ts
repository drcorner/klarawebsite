// Fixed-term monthly donations (3, 6 or 12 months).
//
// Donors who pick a fixed term should be charged exactly that many times.
// We do that by setting `cancel_at` on the Stripe subscription to the moment
// the next charge after the last paid month would happen.
import Stripe from "stripe";

export const FIXED_TERM_MONTHS = [3, 6, 12] as const;

/** Returns the term length in months, or null for ongoing / unknown. */
export function getFixedTermMonths(
  duration: string | undefined | null,
): number | null {
  if (!duration) return null;
  const months = parseInt(duration, 10);
  return (FIXED_TERM_MONTHS as readonly number[]).includes(months)
    ? months
    : null;
}

/**
 * Adds `months` calendar months to a Unix timestamp, in UTC, keeping the
 * time of day. If the day does not exist in the target month (for example
 * Jan 31 + 1 month), it uses the last day of that month. This matches how
 * Stripe schedules monthly billing from the billing cycle anchor, so the
 * cancellation lands exactly on the would-be next charge and no extra
 * charge or partial-month credit is created.
 */
export function addMonthsUtc(unixSeconds: number, months: number): number {
  const start = new Date(unixSeconds * 1000);
  const day = start.getUTCDate();
  const target = new Date(start.getTime());
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return Math.floor(target.getTime() / 1000);
}

/** When a fixed-term subscription should end, or null if it is not fixed-term. */
export function computeFixedTermCancelAt(
  subscription: Stripe.Subscription,
): number | null {
  const months = getFixedTermMonths(subscription.metadata?.duration);
  if (!months) return null;
  const anchor = subscription.billing_cycle_anchor || subscription.start_date;
  return addMonthsUtc(anchor, months);
}

export type FixedTermResult =
  | { action: "not_fixed_term" }
  | { action: "already_ending"; cancelAt: number }
  | { action: "inactive"; status: string }
  | { action: "term_already_over"; cancelAt: number }
  | { action: "set_cancel_at"; cancelAt: number };

/**
 * Sets `cancel_at` on a fixed-term subscription if it is missing.
 * Safe to call more than once (webhook retries). Does not touch ongoing
 * subscriptions, ones already scheduled to end, or ones whose term has
 * already passed (those need a person to decide on cancelling and refunds).
 */
export async function ensureFixedTermCancellation(
  stripe: Stripe,
  subscription: Stripe.Subscription,
): Promise<FixedTermResult> {
  const cancelAt = computeFixedTermCancelAt(subscription);
  if (cancelAt === null) return { action: "not_fixed_term" };

  if (subscription.cancel_at || subscription.cancel_at_period_end) {
    return {
      action: "already_ending",
      cancelAt: subscription.cancel_at ?? cancelAt,
    };
  }
  if (!["active", "trialing", "past_due"].includes(subscription.status)) {
    return { action: "inactive", status: subscription.status };
  }
  if (cancelAt <= Math.floor(Date.now() / 1000)) {
    return { action: "term_already_over", cancelAt };
  }

  await stripe.subscriptions.update(subscription.id, {
    cancel_at: cancelAt,
    proration_behavior: "none",
  });
  return { action: "set_cancel_at", cancelAt };
}
