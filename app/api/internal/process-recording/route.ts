import { createServiceRoleClient } from '@/lib/supabase/service-role';
import OpenAI from 'openai';
import { z } from 'zod';

const schema = z.object({ recordingId: z.string().uuid() });

export async function POST(req: Request) {
  // Verify internal secret
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

  const { recordingId } = parsed.data;
  const admin = createServiceRoleClient();

  // Fetch recording
  const { data: recording, error: fetchErr } = await admin
    .from('recordings')
    .select('*, users(first_name, email)')
    .eq('id', recordingId)
    .single();

  if (fetchErr || !recording) {
    return Response.json({ error: 'Recording not found' }, { status: 404 });
  }

  // Mark as processing
  await admin.from('recordings').update({ feedback_status: 'processing' }).eq('id', recordingId);

  try {
    // Download audio from storage
    const { data: audioData, error: downloadErr } = await admin.storage
      .from('recordings')
      .download(recording.storage_path);

    if (downloadErr || !audioData) throw new Error('Failed to download audio');

    // Transcribe with Whisper
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const file = new File([audioData], `recording.${recording.mime_type.includes('mp4') ? 'mp4' : 'webm'}`, {
      type: recording.mime_type,
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'verbose_json',
    });

    const transcript = transcription.text ?? '';
    // Whisper verbose_json returns full names ('english', 'turkish') — normalize to ISO 639-1
    const rawLang = (transcription.language ?? 'en').toLowerCase();
    const LANG_MAP: Record<string, string> = {
      english: 'en', turkish: 'tr', spanish: 'es', french: 'fr',
      german: 'de', italian: 'it', portuguese: 'pt', dutch: 'nl',
      russian: 'ru', japanese: 'ja', chinese: 'zh', arabic: 'ar',
      korean: 'ko', hindi: 'hi', polish: 'pl', swedish: 'sv',
    };
    const language = LANG_MAP[rawLang] ?? rawLang;
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;

    // Update recording with transcript
    await admin.from('recordings').update({
      transcript,
      transcript_language: language,
      transcript_word_count: wordCount,
      transcription_completed_at: new Date().toISOString(),
    }).eq('id', recordingId);

    // Trigger feedback generation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    await fetch(`${baseUrl}/api/internal/generate-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': process.env.CRON_SECRET ?? '',
      },
      body: JSON.stringify({ recordingId }),
    });

    return Response.json({ data: { ok: true } });
  } catch (err) {
    console.error('[process-recording] Error:', err);
    await admin.from('recordings').update({ feedback_status: 'failed' }).eq('id', recordingId);
    return Response.json({ error: 'Processing failed' }, { status: 500 });
  }
}
