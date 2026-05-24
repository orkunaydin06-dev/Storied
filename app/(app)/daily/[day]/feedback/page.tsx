import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ScoreBars } from '@/components/feedback/ScoreBars';
import { WaveformStatic } from '@/components/recording/WaveformStatic';

async function FeedbackContent({
  dayNumber,
  recordingId,
}: {
  dayNumber: number;
  recordingId: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const { data: recording } = await supabase
    .from('recordings')
    .select('id, day_number, recording_number, duration_seconds, waveform_peaks, storage_path, feedback_status')
    .eq('id', recordingId)
    .eq('user_id', user.id)
    .single();

  if (!recording) notFound();

  const { data: fb } = await supabase
    .from('feedback')
    .select('score_clarity, score_structure, score_delivery, score_depth, score_impact, score_authenticity, score_overall, narrative, revision_prompt, carry_forward')
    .eq('recording_id', recordingId)
    .single();

  if (!fb) notFound();

  const scores = [
    { name: 'Clarity', value: fb.score_clarity },
    { name: 'Structure', value: fb.score_structure },
    { name: 'Delivery', value: fb.score_delivery },
    { name: 'Depth', value: fb.score_depth },
    { name: 'Impact', value: fb.score_impact },
    { name: 'Authenticity', value: fb.score_authenticity },
  ];

  // Get signed audio URL
  const { data: signedData } = await supabase.storage
    .from('recordings')
    .createSignedUrl(recording.storage_path, 900);

  const audioUrl = signedData?.signedUrl ?? '';
  const peaks = (recording.waveform_peaks ?? []).map((p: number) => p / 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      {/* Playback */}
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
          Your first recording
        </p>
        {audioUrl && (
          <WaveformStatic
            peaks={peaks}
            audioUrl={audioUrl}
            durationSeconds={recording.duration_seconds}
          />
        )}
      </div>

      <hr className="border-border-subtle mb-10" />

      {/* Scores */}
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-6">
          Your Day {dayNumber} baseline
        </p>
        <ScoreBars scores={scores} />
        <div className="mt-6 pt-6 border-t border-border-subtle flex items-baseline justify-between">
          <span className="font-sans text-base text-fg-muted">Overall</span>
          <span className="font-mono text-4xl text-accent-warm tabular-nums">
            {fb.score_overall}
            <span className="text-fg-subtle text-2xl">/100</span>
          </span>
        </div>
      </div>

      <hr className="border-border-subtle mb-10" />

      {/* Narrative */}
      <article className="font-serif text-lg text-fg-primary leading-relaxed prose-storied mb-10">
        {fb.narrative}
      </article>

      <div className="mt-12">
        <Link href={`/daily/${dayNumber}/revise?recordingId=${recordingId}`}>
          <Button size="lg" className="w-full md:w-auto">
            Continue to revise
          </Button>
        </Link>

        <div className="mt-6 text-center md:text-left">
          <Link
            href={`/daily/${dayNumber}/record-1`}
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Re-do first recording
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function FeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ recordingId?: string }>;
}) {
  const { day: dayParam } = await params;
  const { recordingId } = await searchParams;
  const dayNumber = parseInt(dayParam, 10);

  if (isNaN(dayNumber) || !recordingId) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <FeedbackContent dayNumber={dayNumber} recordingId={recordingId} />
    </Suspense>
  );
}
