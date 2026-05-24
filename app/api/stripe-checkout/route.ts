import { NextResponse } from 'next/server';
import { stripe, getTierFromCustomerCount, getPriceId } from '@/lib/stripe';

// Determine current pricing tier from number of paying customers
async function getCurrentTier() {
  try {
    const customers = await stripe.customers.list({ limit: 1 });
    const count = customers.data.length;
    return getTierFromCustomerCount(count);
  } catch {
    return 'founding' as const;
  }
}

export async function POST() {
  try {
    const tier = await getCurrentTier();
    const priceId = getPriceId(tier);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? 'https://storied.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?cancelled=true`,
      metadata: {
        product: 'storied-storytelling-30-day',
        tier,
      },
      customer_creation: 'always',
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Could not create checkout session.' } },
      { status: 500 }
    );
  }
}
