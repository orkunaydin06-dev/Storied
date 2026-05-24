import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const { data: recordings } = await supabase
    .from('recordings')
    .select('id, day_number, recording_number, duration_seconds, created_at, waveform_peaks, feedback(score_overall)')
    .eq('user_id', user.id)
    .order('day_number', { ascending: true })
    .order('recording_number', { ascending: true });

  // Group by day
  const byDay: Record<number, typeof recordings> = {};
  for (const r of recordings ?? []) {
    if (!byDay[r.day_number]) byDay[r.day_number] = [];
    byDay[r.day_number]!.push(r);
  }
  const days = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="font-serif text-2xl text-fg-primary mb-2">Your recordings</h1>
        <p className="font-sans text-sm text-fg-subtle">Private. Yours. Always.</p>
      </div>

      {days.length === 0 ? (
        <p className="font-sans text-sm text-fg-muted">No recordings yet. Complete your first practice to see it here.</p>
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const dayRecs = byDay[day] ?? [];
            const r1 = dayRecs.find((r) => r.recording_number === 1);
            const r2 = dayRecs.find((r) => r.recording_number === 2);
            const score1 = (r1?.feedback as { score_overall: number }[] | undefined)?.[0]?.score_overall;
            const score2 = (r2?.feedback as { score_overall: number }[] | undefined)?.[0]?.score_overall;

            return (
              <div
                key={day}
                className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-1">
                    Day {day}
                  </p>
                  {(score1 !== undefined || score2 !== undefined) && (
                    <p className="font-mono text-sm text-fg-muted">
                      {score1 !== undefined && `R1: ${score1}`}
                      {score1 !== undefined && score2 !== undefined && ' → '}
                      {score2 !== undefined && `R2: ${score2}`}
                    </p>
                  )}
                </div>
                {r1 && (
                  <Link
                    href={`/daily/${day}/feedback?recordingId=${r1.id}`}
                    className="font-sans text-sm text-accent-warm hover:text-accent-warm-hover transition-colors duration-200 underline-offset-4 underline flex-shrink-0"
                  >
                    View feedback
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-border-subtle space-y-4">
        <a
          href="/api/user/export"
          className="block font-sans text-sm text-fg-muted hover:text-fg-primary transition-colors duration-200 underline-offset-4 hover:underline"
        >
          Export all recordings (ZIP)
        </a>
        <Link
          href="/settings"
          className="block font-sans text-sm text-error hover:opacity-80 transition-opacity duration-200"
        >
          Delete everything
        </Link>
      </div>
    </div>
  );
}
