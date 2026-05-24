import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const BETA_CODE = process.env.BETA_ACCESS_CODE ?? 'STORIED_BETA';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code || code.trim().toUpperCase() !== BETA_CODE.toUpperCase()) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Grant beta access — set paid_at if not already set
  const { data: profile } = await admin
    .from('users')
    .select('paid_at')
    .eq('id', user.id)
    .single();

  if (!profile?.paid_at) {
    await admin.from('users').update({
      paid_at: new Date().toISOString(),
      amount_paid_cents: 0,
      pricing_tier: 'beta',
    }).eq('id', user.id);

    // Log a beta purchase record
    await admin.from('purchases').insert({
      user_id: user.id,
      stripe_session_id: `beta_${user.id}`,
      status: 'completed',
      amount_cents: 0,
      pricing_tier: 'beta',
      completed_at: new Date().toISOString(),
    }).select().single();
  }

  return NextResponse.json({ ok: true });
}
