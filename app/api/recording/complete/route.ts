import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { z } from 'zod';

const schema = z.object({
  recordingId: z.string().uuid(),
  storagePath: z.string(),
  durationSeconds: z.number().positive(),
  fileSizeBytes: z.number().positive(),
  mimeType: z.string(),
  waveformPeaks: z.array(z.number()).max(128).optional(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: { code: 'INVALID_INPUT', details: parsed.error } }, { status: 400 });
  }

  const { recordingId, durationSeconds, fileSizeBytes, mimeType, waveformPeaks } = parsed.data;

  const admin = createServiceRoleClient();

  // Update recording row — reset feedback_status so re-records process fresh
  const { error: updateErr } = await admin
    .from('recordings')
    .update({
      upload_status: 'uploaded',
      duration_seconds: durationSeconds,
      file_size_bytes: fileSizeBytes,
      mime_type: mimeType,
      waveform_peaks: waveformPeaks ?? [],
      feedback_status: 'pending',
      transcript: null,
      transcript_language: null,
      transcript_word_count: null,
      transcription_completed_at: null,
    })
    .eq('id', recordingId)
    .eq('user_id', user.id);

  // Delete any stale feedback from a previous attempt on the same recording slot
  await admin.from('feedback').delete().eq('recording_id', recordingId);

  if (updateErr) {
    return Response.json({ error: { code: 'SERVER_ERROR', message: updateErr.message } }, { status: 500 });
  }

  // Trigger async processing (fire-and-forget)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  fetch(`${baseUrl}/api/internal/process-recording`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-cron-secret': process.env.CRON_SECRET ?? '',
    },
    body: JSON.stringify({ recordingId }),
  }).catch(() => {
    // Non-blocking — client polls for status
  });

  return Response.json({ data: { recordingId } });
}
