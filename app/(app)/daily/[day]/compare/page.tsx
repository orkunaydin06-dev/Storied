import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { WaveformStatic } from '@/components/recording/WaveformStatic';
import { FinishDayButton } from './FinishDayButton';

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ recordingId?: string; r1Id?: string }>;
}) {
  const { day: dayParam } = await params;
  const { recordingId: r2Id, r1Id } = await searchParams;
  const dayNumber = parseInt(dayParam, 10);
  if (isNaN(dayNumber) || !r2Id || !r1Id) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const [{ data: r1 }, { data: r2 }] = await Promise.all([
    supabase.from('recordings').select('id, duration_seconds, waveform_peaks, storage_path').eq('id', r1Id).eq('user_id', user.id).single(),
    supabase.from('recordings').select('id, duration_seconds, waveform_peaks, storage_path').eq('id', r2Id).eq('user_id', user.id).single(),
  ]);

  if (!r1 || !r2) notFound();

  const [{ data: fb1 }, { data: fb2 }, { data: url1 }, { data: url2 }] = await Promise.all([
    supabase.from('feedback').select('*').eq('recording_id', r1Id).maybeSingle(),
    supabase.from('feedback').select('*').eq('recording_id', r2Id).maybeSingle(),
    supabase.storage.from('recordings').createSignedUrl(r1.storage_path, 900),
    supabase.storage.from('recordings').createSignedUrl(r2.storage_path, 900),
  ]);

  const metrics = fb1 && fb2
    ? [
        { name: 'Clarity', r1: fb1.score_clarity, r2: fb2.score_clarity },
        { name: 'Structure', r1: fb1.score_structure, r2: fb2.score_structure },
        { name: 'Delivery', r1: fb1.score_delivery, r2: fb2.score_delivery },
        { name: 'Depth', r1: fb1.score_depth, r2: fb2.score_depth },
        { name: 'Impact', r1: fb1.score_impact, r2: fb2.score_impact },
        { name: 'Authenticity', r1: fb1.score_authenticity, r2: fb2.score_authenticity },
      ]
    : [];

  const peaks1 = (r1.waveform_peaks ?? []).map((p: number) => p / 100);
  const peaks2 = (r2.waveform_peaks ?? []).map((p: number) => p / 100);

  const overallDelta = fb1 && fb2 ? fb2.score_overall - fb1.score_overall : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-8 text-center">
        Recording 1 vs Recording 2
      </p>

      {/* Waveforms */}
      <div className="space-y-4 mb-10">
        {url1?.signedUrl && (
          <WaveformStatic
            peaks={peaks1}
            audioUrl={url1.signedUrl}
            label="R1"
            durationSeconds={r1.duration_seconds}
          />
        )}
        {url2?.signedUrl && (
          <WaveformStatic
            peaks={peaks2}
            audioUrl={url2.signedUrl}
            label="R2"
            durationSeconds={r2.duration_seconds}
          />
        )}
      </div>

      <hr className="border-border-subtle mb-8" />

      {/* Score deltas */}
      {metrics.length > 0 && (
        <div className="space-y-3 mb-10">
          <div className="grid grid-cols-4 gap-2 mb-2">
            <span className="font-mono text-xs text-fg-subtle col-span-1"></span>
            <span className="font-mono text-xs text-fg-subtle text-right">R1</span>
            <span className="font-mono text-xs text-fg-subtle text-right">R2</span>
            <span className="font-mono text-xs text-fg-subtle text-right">Δ</span>
          </div>
          {metrics.map((m) => {
            const delta = m.r2 - m.r1;
            return (
              <div key={m.name} className="grid grid-cols-4 gap-2 items-baseline">
                <span className="font-sans text-sm text-fg-muted">{m.name}</span>
                <span className="font-mono text-sm text-fg-subtle text-right">{m.r1}</span>
                <span className="font-mono text-sm text-fg-primary text-right">{m.r2}</span>
                <span
                  className="font-mono text-sm text-right"
                  style={{ color: delta >= 0 ? 'var(--color-success)' : 'var(--color-warning)' }}
                >
                  {delta >= 0 ? '+' : ''}{delta}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Overall */}
      {fb1 && fb2 && (
        <div className="text-center py-8 border-t border-b border-border-subtle mb-10">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-muted mb-3">Overall</p>
          <div className="font-mono text-4xl tabular-nums">
            <span className="text-fg-subtle">{fb1.score_overall}</span>
            <span className="mx-3 text-fg-subtle">→</span>
            <span className="text-fg-primary">{fb2.score_overall}</span>
          </div>
          <div
            className="font-mono text-2xl mt-2"
            style={{ color: overallDelta >= 0 ? 'var(--color-success)' : 'var(--color-warning)' }}
          >
            {overallDelta >= 0 ? '▲' : '▼'} {Math.abs(overallDelta)}
          </div>
        </div>
      )}

      {/* Closure narrative — explains WHY scores changed */}
      {fb2?.narrative && (
        <>
          <hr className="border-border-subtle mb-10" />
          <article className="font-serif text-lg text-fg-primary leading-relaxed mb-10">
            {fb2.narrative}
          </article>
        </>
      )}

      {/* What to carry forward */}
      {fb2?.carry_forward && (
        <div className="mb-10 border-t border-border-subtle pt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">What to carry forward</p>
          <p className="font-serif text-lg text-fg-primary leading-relaxed">{fb2.carry_forward}</p>
        </div>
      )}

      {/* Tomorrow preview */}
      {fb2?.tomorrow_preview && (
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-2">Tomorrow</p>
          <p className="font-sans text-sm text-fg-muted">{fb2.tomorrow_preview}</p>
        </div>
      )}

      <FinishDayButton dayNumber={dayNumber} r1Id={r1Id!} r2Id={r2Id!} />
    </div>
  );
}
