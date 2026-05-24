import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// Supabase service-role client for admin writes
async function getServiceClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = await getServiceClient();

  const email = session.customer_details?.email;
  const stripeCustomerId =
    typeof session.customer === 'string' ? session.customer : null;
  const amountCents = session.amount_total ?? 2900;
  const tier = (session.metadata?.tier ?? 'founding') as string;

  // Record the purchase — user_id linked later after auth
  await supabase.from('purchases').insert({
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : null,
    stripe_customer_id: stripeCustomerId,
    amount_cents: amountCents,
    currency: session.currency ?? 'usd',
    pricing_tier: tier,
    status: 'completed',
    completed_at: new Date().toISOString(),
  });

  // If a user with this email already exists, link them
  if (email) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      await supabase
        .from('users')
        .update({
          stripe_customer_id: stripeCustomerId,
          paid_at: new Date().toISOString(),
          amount_paid_cents: amountCents,
          pricing_tier: tier,
        })
        .eq('id', existingUser.id);

      await supabase
        .from('purchases')
        .update({ user_id: existingUser.id })
        .eq('stripe_session_id', session.id);
    }
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const supabase = await getServiceClient();

  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
  if (!paymentIntentId) return;

  await supabase
    .from('purchases')
    .update({
      status: 'refunded',
      refunded_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntentId);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Webhook configuration missing', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object as Stripe.Charge);
      break;
  }

  return new Response('ok', { status: 200 });
}
