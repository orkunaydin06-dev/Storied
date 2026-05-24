import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { callClaude } from '@/lib/claude';
import { buildFeedbackPrompt, type FeedbackResponse } from '@/lib/prompts/feedback';
import { buildComparisonPrompt, type ComparisonResponse } from '@/lib/prompts/comparison';
import { buildGraduationPrompt, type GraduationResponse } from '@/lib/prompts/graduation';
import { getDayContent } from '@/data/curriculum/days';
import { calculateOverallScore } from '@/lib/utils';
import { PROMPT_VERSION } from '@/lib/prompts/master-system';
import { z } from 'zod';

const schema = z.object({ recordingId: z.string().uuid() });

const MODEL_USED = 'claude-sonnet-4-6';

export async function POST(req: Request) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

  const { recordingId } = parsed.data;
  const admin = createServiceRoleClient();

  const { data: recording, error: fetchErr } = await admin
    .from('recordings')
    .select('*, users(first_name, email)')
    .eq('id', recordingId)
    .single();

  if (fetchErr || !recording || !recording.transcript) {
    return Response.json({ error: 'Recording or transcript not found' }, { status: 404 });
  }

  const day = getDayContent(recording.day_number);
  if (!day) return Response.json({ error: 'Day content not found' }, { status: 404 });

  const firstName = (recording.users as { first_name: string | null } | null)?.first_name ?? 'there';

  try {
    // Edge case: too short
    const wordCount = recording.transcript_word_count ?? 0;
    if (recording.duration_seconds < 15 || wordCount < 30) {
      await admin.from('recordings').update({
        feedback_status: 'edge_case',
        edge_case_type: 'too_short',
      }).eq('id', recordingId);

      await admin.from('feedback').upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        score_clarity: 0, score_structure: 0, score_delivery: 0,
        score_depth: 0, score_impact: 0, score_authenticity: 0, score_overall: 0,
        narrative: 'Your recording came in under fifteen seconds — too short to read meaningfully. Stories need time to breathe. Try again, aiming for at least 30 seconds. The question is still waiting.',
        model_used: MODEL_USED,
        prompt_version: PROMPT_VERSION,
      });

      return Response.json({ data: { ok: true, edgeCase: 'too_short' } });
    }

    // Edge case: non-English
    if (recording.transcript_language && recording.transcript_language !== 'en') {
      await admin.from('recordings').update({
        feedback_status: 'edge_case',
        edge_case_type: 'non_english',
      }).eq('id', recordingId);

      await admin.from('feedback').upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        score_clarity: 0, score_structure: 0, score_delivery: 0,
        score_depth: 0, score_impact: 0, score_authenticity: 0, score_overall: 0,
        narrative: `Your recording was in ${recording.transcript_language}. Storied currently works in English only. If you'd like, re-record in English when you're ready.`,
        model_used: MODEL_USED,
        prompt_version: PROMPT_VERSION,
      });

      return Response.json({ data: { ok: true, edgeCase: 'non_english' } });
    }

    // Day 30 graduation
    if (recording.day_number === 30) {
      const { data: d1Recording } = await admin
        .from('recordings')
        .select('id, transcript')
        .eq('user_id', recording.user_id)
        .eq('day_number', 1)
        .eq('recording_number', 1)
        .single();

      const { data: d1FeedbackRow } = d1Recording
        ? await admin.from('feedback').select('score_clarity, score_structure, score_delivery, score_depth, score_impact, score_authenticity, score_overall').eq('recording_id', d1Recording.id).single()
        : { data: null };

      const d1Feedback = d1FeedbackRow as FeedbackResponse['scores'] | null;
      const d1Transcript = d1Recording?.transcript ?? '';

      const gradResult = await callClaude<GraduationResponse>(
        buildGraduationPrompt(d1Transcript, d1Feedback ?? {} as FeedbackResponse['scores'], recording.transcript),
        'graduation'
      );

      const overall = calculateOverallScore(gradResult.scores);

      await admin.from('feedback').upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        score_clarity: gradResult.scores.clarity,
        score_structure: gradResult.scores.structure,
        score_delivery: gradResult.scores.delivery,
        score_depth: gradResult.scores.depth,
        score_impact: gradResult.scores.impact,
        score_authenticity: gradResult.scores.authenticity,
        score_overall: overall,
        narrative: gradResult.graduation_narrative,
        graduation_narrative: gradResult.graduation_narrative,
        what_changed_most: gradResult.what_changed_most,
        what_stayed_strongest: gradResult.what_stayed_strongest,
        model_used: MODEL_USED,
        prompt_version: PROMPT_VERSION,
      });

      await admin.from('recordings').update({ feedback_status: 'ready' }).eq('id', recordingId);
      return Response.json({ data: { ok: true } });
    }

    // Recording 1: primary feedback
    if (recording.recording_number === 1) {
      const prompt = buildFeedbackPrompt(day, firstName, recording.transcript, recording.duration_seconds);
      const result = await callClaude<FeedbackResponse>(prompt, 'feedback');

      const overall = calculateOverallScore(result.scores);

      await admin.from('feedback').upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        score_clarity: result.scores.clarity,
        score_structure: result.scores.structure,
        score_delivery: result.scores.delivery,
        score_depth: result.scores.depth,
        score_impact: result.scores.impact,
        score_authenticity: result.scores.authenticity,
        score_overall: overall,
        narrative: result.narrative,
        revision_prompt: result.revision_prompt ?? null,
        structure_breakdown: result.structure_breakdown,
        exemplar: result.exemplar ?? null,
        model_used: MODEL_USED,
        prompt_version: PROMPT_VERSION,
      });

      await admin.from('recordings').update({ feedback_status: 'ready' }).eq('id', recordingId);
      return Response.json({ data: { ok: true } });
    }

    // Recording 2: comparison feedback
    if (recording.recording_number === 2) {
      // Fetch R1 recording + feedback separately (avoid nested join RLS issues)
      const { data: r1Recording } = await admin
        .from('recordings')
        .select('id, transcript')
        .eq('user_id', recording.user_id)
        .eq('day_number', recording.day_number)
        .eq('recording_number', 1)
        .single();

      const { data: r1Feedback } = r1Recording
        ? await admin
            .from('feedback')
            .select('score_clarity, score_structure, score_delivery, score_depth, score_impact, score_authenticity, score_overall, narrative, revision_prompt')
            .eq('recording_id', r1Recording.id)
            .single()
        : { data: null };

      const r1Scores: FeedbackResponse['scores'] = r1Feedback ? {
        clarity: r1Feedback.score_clarity,
        structure: r1Feedback.score_structure,
        delivery: r1Feedback.score_delivery,
        depth: r1Feedback.score_depth,
        impact: r1Feedback.score_impact,
        authenticity: r1Feedback.score_authenticity,
        overall: r1Feedback.score_overall,
      } : { clarity: 0, structure: 0, delivery: 0, depth: 0, impact: 0, authenticity: 0, overall: 0 };

      const revisionPrompt = r1Feedback?.revision_prompt ?? r1Feedback?.narrative ?? '';

      const prompt = buildComparisonPrompt(
        day,
        r1Recording?.transcript ?? '',
        r1Scores,
        revisionPrompt,
        recording.transcript
      );

      const result = await callClaude<ComparisonResponse>(prompt, 'comparison');
      const overall = calculateOverallScore(result.scores);

      await admin.from('feedback').upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        score_clarity: result.scores.clarity,
        score_structure: result.scores.structure,
        score_delivery: result.scores.delivery,
        score_depth: result.scores.depth,
        score_impact: result.scores.impact,
        score_authenticity: result.scores.authenticity,
        score_overall: overall,
        narrative: result.closure_narrative,
        carry_forward: result.carry_forward,
        tomorrow_preview: result.tomorrow_preview,
        model_used: MODEL_USED,
        prompt_version: PROMPT_VERSION,
      });

      await admin.from('recordings').update({ feedback_status: 'ready' }).eq('id', recordingId);
      return Response.json({ data: { ok: true } });
    }

    return Response.json({ error: 'Unhandled recording type' }, { status: 400 });
  } catch (err) {
    console.error('[generate-feedback] Error:', err);
    await admin.from('recordings').update({ feedback_status: 'failed' }).eq('id', recordingId);
    return Response.json({ error: 'Feedback generation failed' }, { status: 500 });
  }
}
