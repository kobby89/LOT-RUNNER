import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

/**
 * How much of the quoted total we ask as a deposit before we place any
 * real bid on the customer's behalf. Flat percentage kept in one place
 * so it's easy to tune later (e.g. higher % for first-time customers).
 */
export const DEPOSIT_PERCENT = 0.2; // 20%

export function depositAmountCents(quotedTotal: number) {
  return Math.round(quotedTotal * DEPOSIT_PERCENT * 100);
}
