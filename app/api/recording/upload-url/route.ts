import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { z } from 'zod';

const schema = z.object({
  dayNumber: z.number().int().min(1).max(30),
  recordingNumber: z.union([z.literal(1), z.literal(2)]),
  mimeType: z.string(),
  filename: z.string(),
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

  const { dayNumber, recordingNumber, mimeType, filename } = parsed.data;
  const storagePath = `${user.id}/${filename}`;

  // Use service role for DB write — user is already validated above via getUser()
  const admin = createServiceRoleClient();

  // Upsert so retries after a failed upload don't hit the unique constraint
  const { data: recording, error } = await admin
    .from('recordings')
    .upsert(
      {
        user_id: user.id,
        day_number: dayNumber,
        recording_number: recordingNumber,
        storage_path: storagePath,
        duration_seconds: 0,
        file_size_bytes: 0,
        mime_type: mimeType,
        upload_status: 'pending',
        feedback_status: 'pending',
      },
      { onConflict: 'user_id,day_number,recording_number' }
    )
    .select('id')
    .single();

  if (error || !recording) {
    return Response.json({ error: { code: 'SERVER_ERROR', message: error?.message } }, { status: 500 });
  }

  // Get signed upload URL — use service role so storage RLS isn't blocked by expired user JWT
  const { data: signed, error: signErr } = await admin.storage
    .from('recordings')
    .createSignedUploadUrl(storagePath, { upsert: true });

  if (signErr || !signed) {
    return Response.json({ error: { code: 'SERVER_ERROR', message: signErr?.message } }, { status: 500 });
  }

  return Response.json({
    data: { signedUrl: signed.signedUrl, recordingId: recording.id, storagePath },
  });
}
