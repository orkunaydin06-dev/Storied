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
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-fg-primary mb-1">Your recordings</h1>
        <p className="text-sm text-fg-muted">Private. Yours. Always.</p>
      </div>

      {days.length === 0 ? (
        <p className="text-sm text-fg-muted">No recordings yet. Complete your first practice to see it here.</p>
      ) : (
        <div className="space-y-3">
          {days.map((day) => {
            const dayRecs = byDay[day] ?? [];
            const r1 = dayRecs.find((r) => r.recording_number === 1);
            const r2 = dayRecs.find((r) => r.recording_number === 2);
            const score1 = (r1?.feedback as { score_overall: number }[] | undefined)?.[0]?.score_overall;
            const score2 = (r2?.feedback as { score_overall: number }[] | undefined)?.[0]?.score_overall;

            return (
              <div
                key={day}
                className="border border-border-subtle rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ background: 'rgba(19,28,42,0.5)' }}
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-fg-muted mb-1">Day {day}</p>
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
                    className="text-sm text-accent-warm hover:text-accent-warm-hover transition-colors flex-shrink-0"
                  >
                    View feedback
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-border-subtle/50 space-y-4">
        <a href="/api/user/export" className="block text-sm text-fg-muted hover:text-fg-primary transition-colors">
          Export all recordings (ZIP)
        </a>
        <Link href="/settings" className="block text-sm text-error hover:opacity-80 transition-opacity">
          Delete everything
        </Link>
      </div>
    </div>
  );
}
