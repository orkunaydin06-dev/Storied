import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  dayNumber: z.number().int().min(1).max(30),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: { code: 'INVALID_INPUT' } }, { status: 400 });

  const { dayNumber } = parsed.data;
  const today = new Date().toISOString().split('T')[0];

  // Read current streak to calculate new value
  const { data: profile } = await supabase
    .from('users')
    .select('last_practice_date, streak_days')
    .eq('id', user.id)
    .single();

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastDate = profile?.last_practice_date;
  const newStreak = lastDate === yesterday
    ? (profile?.streak_days ?? 0) + 1  // consecutive day
    : lastDate === today
    ? (profile?.streak_days ?? 1)       // already practiced today (re-submit), keep
    : 1;                                // gap — reset to 1

  const { error } = await supabase
    .from('users')
    .update({
      current_day: Math.min(dayNumber + 1, 30),
      last_practice_date: today,
      streak_days: newStreak,
    })
    .eq('id', user.id);

  if (error) return Response.json({ error: { code: 'SERVER_ERROR' } }, { status: 500 });

  return Response.json({ data: { ok: true, streak: newStreak } });
}
