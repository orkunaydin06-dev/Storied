import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { z } from 'zod';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return Response.json({ data: profile });
}

const patchSchema = z.object({
  first_name: z.string().optional(),
  current_day: z.number().int().min(0).max(30).optional(),
  streak_days: z.number().int().min(0).optional(),
  has_completed_welcome: z.boolean().optional(),
  consent_marketing_testimonial: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: { code: 'INVALID_INPUT' } }, { status: 400 });
  }

  const { error } = await supabase.from('users').update(parsed.data).eq('id', user.id);
  if (error) return Response.json({ error: { code: 'SERVER_ERROR' } }, { status: 500 });

  return Response.json({ data: { ok: true } });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const admin = createServiceRoleClient();
  const { error } = await admin
    .from('users')
    .update({ scheduled_for_deletion_at: deletionDate })
    .eq('id', user.id);

  if (error) return Response.json({ error: { code: 'SERVER_ERROR' } }, { status: 500 });

  return Response.json({ data: { scheduledForDeletionAt: deletionDate } });
}
