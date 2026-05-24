import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { z } from 'zod';

// ─── Guard: development only ─────────────────────────────────────────────────
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not available' }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ dayNumber: z.number().int().min(1).max(30) }).safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid dayNumber' }, { status: 400 });

  const { dayNumber } = parsed.data;
  const admin = createServiceRoleClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3003';

  const r1Transcript = getTranscript(dayNumber, 1);
  const r2Transcript = getTranscript(dayNumber, 2);
  const wordCount1 = r1Transcript.split(/\s+/).filter(Boolean).length;
  const wordCount2 = r2Transcript.split(/\s+/).filter(Boolean).length;
  const now = new Date().toISOString();

  // ── R1: insert recording with transcript ───────────────────────────────────
  const { data: r1, error: r1Err } = await admin
    .from('recordings')
    .upsert({
      user_id: user.id,
      day_number: dayNumber,
      recording_number: 1,
      storage_path: `${user.id}/dev-seed/day-${String(dayNumber).padStart(2, '0')}/r1.webm`,
      duration_seconds: 62,
      file_size_bytes: 48000,
      mime_type: 'audio/webm',
      upload_status: 'uploaded',
      feedback_status: 'pending',
      transcript: r1Transcript,
      transcript_language: 'en',
      transcript_word_count: wordCount1,
      transcription_completed_at: now,
    }, { onConflict: 'user_id,day_number,recording_number' })
    .select('id')
    .single();

  if (r1Err || !r1) {
    return Response.json({ error: `R1 insert failed: ${r1Err?.message}` }, { status: 500 });
  }

  // Delete stale feedback from previous seed run
  await admin.from('feedback').delete().eq('recording_id', r1.id);

  // Generate real AI feedback for R1 (synchronous — we await the full response)
  const r1FbRes = await fetch(`${baseUrl}/api/internal/generate-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-cron-secret': process.env.CRON_SECRET ?? '' },
    body: JSON.stringify({ recordingId: r1.id }),
  });

  if (!r1FbRes.ok) {
    const err = await r1FbRes.text().catch(() => '');
    return Response.json({ error: `R1 feedback failed (${r1FbRes.status}): ${err}` }, { status: 500 });
  }

  // ── R2: insert recording with revised transcript ───────────────────────────
  const { data: r2, error: r2Err } = await admin
    .from('recordings')
    .upsert({
      user_id: user.id,
      day_number: dayNumber,
      recording_number: 2,
      storage_path: `${user.id}/dev-seed/day-${String(dayNumber).padStart(2, '0')}/r2.webm`,
      duration_seconds: 67,
      file_size_bytes: 52000,
      mime_type: 'audio/webm',
      upload_status: 'uploaded',
      feedback_status: 'pending',
      transcript: r2Transcript,
      transcript_language: 'en',
      transcript_word_count: wordCount2,
      transcription_completed_at: now,
    }, { onConflict: 'user_id,day_number,recording_number' })
    .select('id')
    .single();

  if (r2Err || !r2) {
    return Response.json({ error: `R2 insert failed: ${r2Err?.message}` }, { status: 500 });
  }

  await admin.from('feedback').delete().eq('recording_id', r2.id);

  const r2FbRes = await fetch(`${baseUrl}/api/internal/generate-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-cron-secret': process.env.CRON_SECRET ?? '' },
    body: JSON.stringify({ recordingId: r2.id }),
  });

  if (!r2FbRes.ok) {
    const err = await r2FbRes.text().catch(() => '');
    return Response.json({ error: `R2 feedback failed (${r2FbRes.status}): ${err}` }, { status: 500 });
  }

  // ── Update user state ──────────────────────────────────────────────────────
  await admin.from('users').update({
    current_day: dayNumber,
    last_practice_date: new Date().toISOString().split('T')[0],
    streak_days: dayNumber,
  }).eq('id', user.id);

  return Response.json({
    data: {
      r1Id: r1.id,
      r2Id: r2.id,
      dayNumber,
      links: {
        question:   `/daily/${dayNumber}/question`,
        record1:    `/daily/${dayNumber}/record-1`,
        feedback:   `/daily/${dayNumber}/feedback?recordingId=${r1.id}`,
        revise:     `/daily/${dayNumber}/revise?recordingId=${r1.id}`,
        record2:    `/daily/${dayNumber}/record-2?r1Id=${r1.id}`,
        compare:    `/daily/${dayNumber}/compare?recordingId=${r2.id}&r1Id=${r1.id}`,
        closure:    `/daily/${dayNumber}/closure?r1Id=${r1.id}&r2Id=${r2.id}`,
        dashboard:  '/dashboard',
        archive:    '/archive',
      },
    },
  });
}

// ─── Pre-written test transcripts ────────────────────────────────────────────
// Each story is ~60-70 words, realistic, worth analyzing.

function getTranscript(day: number, recording: 1 | 2): string {
  const key = `${day}-${recording}` as keyof typeof TRANSCRIPTS;
  return TRANSCRIPTS[key] ?? TRANSCRIPTS[`fallback-${recording}`];
}

const TRANSCRIPTS = {
  // ── Day 1: Ordinary day that turned unforgettable ──────────────────────────
  '1-1': `It was a Tuesday in October. The coffee was still hot when I sat down. I had three meetings, a half-finished brief, nothing unusual. My phone rang at eleven — unknown number. I almost didn't pick up. My sister's voice: "Dad is in the hospital." Three words, no context. My entire morning collapsed into irrelevance. I drove. He was okay. But I still think about that Tuesday. Ordinary mornings don't warn you when they're about to become the ones you remember.`,

  '1-2': `The coffee was still hot when I sat down — 7:43 on a Tuesday. Three meetings, a half-finished brief, a plan to finish by three. My phone rang at 10:52. Unknown number. I almost ignored it. My sister said four words: "Dad is in the hospital." No lead-up, no softening. Four words, and my whole Tuesday became irrelevant. I drove. He was okay. But here is what stayed with me: ordinary mornings do not announce themselves as the ones that matter. That is what makes them dangerous.`,

  // ── Day 2: A disagreement you held your ground in ─────────────────────────
  '2-1': `My co-founder and I had been building for eight months. He wanted to pivot — completely different market. I didn't. We sat in a coffee shop for three hours. He had the data. I had the conviction. At some point he said, "You're being emotional." I said, "Yes. That's how I know I'm right." We didn't resolve it that day. But I held my position. Two months later, the original direction worked. We've never talked about that afternoon since.`,

  '2-2': `Eight months into the company. My co-founder wanted a full pivot. I didn't. We sat in a coffee shop — three hours, no resolution. He had the data. I had the conviction that the data wasn't the whole story. He said, "You're being emotional about this." I said, "Yes. And I'm right." He didn't agree. We didn't shake hands and move on. We just... kept building. Two months later, the original direction proved out. The disagreement was never mentioned again. I think about that sometimes — how much holding your ground looks like stubbornness until it doesn't.`,

  // ── Day 3: The fight inside your own head ─────────────────────────────────
  '3-1': `I had the job offer. Better title, more money, a clear step up. I had forty-eight hours to decide. One voice said: take it, you've earned it. The other said: you're not done here. Both voices were completely rational. I made a pros and cons list — it didn't help. I went for a run. Still didn't help. At 11pm on the second night, I turned down the offer. I still don't know if it was the right call. But I know it was mine.`,

  '3-2': `The offer arrived on a Wednesday. Better title, better money, a clear step forward. Forty-eight hours to decide. The first voice said: this is what you worked for, take it. The second voice said: you're not finished with what you started. Both voices were using the same logic. That's what made it hard — it wasn't fear against ambition, it was ambition against ambition. I turned it down at 11pm on Thursday. I wrote the email before I could change my mind. The fight inside was louder than any conversation I've had out loud.`,

  // ── Day 4-30: fallbacks used for all other days ───────────────────────────
  'fallback-1': `I was twenty-six, working at a company I had outgrown. My manager called me in on a Friday. I thought it was about the project. He said: "We're restructuring your role." I asked what that meant. He said, "It means less." I sat with that word for a long time. Less. I had done everything right — shipped on time, hit the numbers, helped the junior team. Less wasn't a performance issue. It was a signal. I updated my CV that night. Not out of panic. Out of clarity. Some information arrives as a gift, even when it doesn't feel like one.`,

  'fallback-2': `Looking back, the version of that story I told the first time had the right facts but the wrong shape. The moment that mattered wasn't the manager's words — it was the silence after. I sat across from him and didn't say anything. I could have pushed back, asked questions, defended myself. Instead I listened, and in that silence I understood something: this wasn't about performance. This was about fit, and fit goes both ways. I updated my CV that night not because I had to, but because I finally had permission to. That silence was the real story.`,
} as const;
