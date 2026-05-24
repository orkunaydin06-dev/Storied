import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const { data: recording, error } = await supabase
    .from('recordings')
    .select('id, day_number, recording_number, duration_seconds, waveform_peaks, upload_status, feedback_status, edge_case_type, created_at, feedback(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !recording) {
    return Response.json({ error: { code: 'NOT_FOUND' } }, { status: 404 });
  }

  return Response.json({ data: recording });
}
