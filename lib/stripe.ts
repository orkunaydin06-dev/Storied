import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const FOUNDING_CUSTOMER_LIMIT = 50;
const STANDARD_CUSTOMER_LIMIT = 200;

export type PricingTier = 'founding' | 'standard' | 'premium';

export function getPriceId(tier: PricingTier): string {
  const map: Record<PricingTier, string> = {
    founding: process.env.STRIPE_PRICE_ID_FOUNDING!,
    standard: process.env.STRIPE_PRICE_ID_STANDARD!,
    premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
  };
  return map[tier];
}

export function getTierFromCustomerCount(count: number): PricingTier {
  if (count < FOUNDING_CUSTOMER_LIMIT) return 'founding';
  if (count < STANDARD_CUSTOMER_LIMIT) return 'standard';
  return 'premium';
}

export function getPriceDisplay(tier: PricingTier): string {
  const map: Record<PricingTier, string> = {
    founding: '$29',
    standard: '$39',
    premium: '$49',
  };
  return map[tier];
}
