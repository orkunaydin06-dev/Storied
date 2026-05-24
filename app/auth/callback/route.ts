import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const sessionId = searchParams.get('session_id');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user row exists in public.users
      const adminClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const email = data.user.email ?? '';
      const firstName =
        data.user.user_metadata?.given_name ??
        data.user.user_metadata?.name?.split(' ')[0] ??
        null;

      await adminClient.from('users').upsert(
        {
          id: data.user.id,
          email,
          first_name: firstName,
        },
        { onConflict: 'id', ignoreDuplicates: false }
      );

      // Link any pending purchase to this user
      if (sessionId || email) {
        let query = adminClient
          .from('purchases')
          .update({ user_id: data.user.id })
          .is('user_id', null);

        if (sessionId) {
          query = query.eq('stripe_session_id', sessionId);
        } else if (email) {
          // Try matching by customer email via Stripe customer id lookup
          // For now, look for purchases created in last 24h with no user_id
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          query = query.gt('created_at', yesterday).eq('status', 'completed');
        }

        await query;

        // Update user payment status if they have a completed purchase
        const { data: purchase } = await adminClient
          .from('purchases')
          .select('amount_cents, pricing_tier, stripe_customer_id, completed_at')
          .eq('user_id', data.user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (purchase) {
          await adminClient
            .from('users')
            .update({
              paid_at: purchase.completed_at,
              amount_paid_cents: purchase.amount_cents,
              pricing_tier: purchase.pricing_tier,
              stripe_customer_id: purchase.stripe_customer_id,
            })
            .eq('id', data.user.id);
        }
      }

      // New user → /begin, returning user → /dashboard
      const { data: userData } = await adminClient
        .from('users')
        .select('has_completed_welcome, current_day, paid_at')
        .eq('id', data.user.id)
        .single();

      // Auto-grant beta access if not yet paid and beta mode is on
      if (!userData?.paid_at && process.env.BETA_ACCESS_CODE) {
        await adminClient.from('users').update({
          paid_at: new Date().toISOString(),
          amount_paid_cents: 0,
          pricing_tier: 'beta',
        }).eq('id', data.user.id);

        await adminClient.from('purchases').upsert({
          user_id: data.user.id,
          stripe_session_id: `beta_${data.user.id}`,
          status: 'completed',
          amount_cents: 0,
          pricing_tier: 'beta',
          completed_at: new Date().toISOString(),
        }, { onConflict: 'stripe_session_id', ignoreDuplicates: true });
      }

      const isNew = !userData?.has_completed_welcome;
      const base = process.env.NEXT_PUBLIC_APP_URL ?? origin;
      return NextResponse.redirect(`${base}${isNew ? '/begin' : '/dashboard'}`);
    }
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? origin;
  return NextResponse.redirect(`${base}/welcome?error=auth_failed`);
}
