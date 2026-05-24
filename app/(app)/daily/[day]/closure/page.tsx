import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';
import { Button } from '@/components/ui/button';

export default async function ClosurePage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ r1Id?: string; r2Id?: string }>;
}) {
  const { day: dayParam } = await params;
  const { r1Id, r2Id } = await searchParams;
  const dayNumber = parseInt(dayParam, 10);
  if (isNaN(dayNumber) || !r1Id || !r2Id) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const day = getDayContent(dayNumber);
  if (!day) notFound();

  // Fetch both recordings for duration calc
  const [{ data: r1 }, { data: r2 }] = await Promise.all([
    supabase.from('recordings').select('duration_seconds').eq('id', r1Id).eq('user_id', user.id).single(),
    supabase.from('recordings').select('duration_seconds').eq('id', r2Id).eq('user_id', user.id).single(),
  ]);

  if (!r1 || !r2) notFound();

  // Fetch feedback for both recordings
  const [{ data: fb1 }, { data: fb2 }] = await Promise.all([
    supabase.from('feedback').select('score_overall').eq('recording_id', r1Id).maybeSingle(),
    supabase.from('feedback').select('score_overall, narrative, carry_forward, tomorrow_preview').eq('recording_id', r2Id).maybeSingle(),
  ]);

  // Fetch user streak
  const { data: profile } = await supabase
    .from('users')
    .select('streak_days, first_name')
    .eq('id', user.id)
    .single();

  const pointsMoved = fb1 && fb2 ? fb2.score_overall - fb1.score_overall : null;
  const totalMinutes = Math.round((r1.duration_seconds + r2.duration_seconds) / 60);
  const carryForward = fb2?.carry_forward ?? day.closureMessage;
  const whatChanged = fb2?.narrative ?? null;
  const tomorrowPreview = fb2?.tomorrow_preview ?? null;
  const streak = profile?.streak_days ?? 1;
  const nextDay = getDayContent(dayNumber + 1);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full animate-fade-in">

        {/* Day complete header */}
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-8 text-center">
          Day {dayNumber} complete
        </p>

        {/* Score movement */}
        {pointsMoved !== null && (
          <div className="text-center mb-10">
            <p className="font-serif text-3xl text-fg-primary leading-snug">
              {pointsMoved > 0
                ? `You moved ${pointsMoved} point${pointsMoved !== 1 ? 's' : ''} in ${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}.`
                : `You held steady across ${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''} of practice.`}
            </p>
            {pointsMoved > 0 && (
              <p className="font-sans text-sm text-fg-muted mt-3">
                That is the kind of movement that compounds.
              </p>
            )}
          </div>
        )}

        <hr className="border-border-subtle mb-10" />

        {/* What changed */}
        {whatChanged && (
          <>
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
                What changed
              </p>
              <p className="font-serif text-base text-fg-primary leading-relaxed">
                {whatChanged}
              </p>
            </div>
            <hr className="border-border-subtle mb-10" />
          </>
        )}

        {/* Carry forward */}
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
            What to carry forward
          </p>
          <p className="font-serif text-base text-fg-primary leading-relaxed">
            {carryForward}
          </p>
        </div>

        <hr className="border-border-subtle mb-10" />

        {/* Streak + tomorrow */}
        <div className="mb-12 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="font-sans text-sm text-fg-muted">Streak</span>
            <span className="font-mono text-sm text-fg-primary">
              {streak} day{streak !== 1 ? 's' : ''}
            </span>
          </div>
          {(tomorrowPreview ?? nextDay) && dayNumber < 30 && (
            <div className="flex justify-between items-baseline gap-6">
              <span className="font-sans text-sm text-fg-muted flex-shrink-0">Tomorrow</span>
              <span className="font-sans text-sm text-fg-subtle text-right">
                {tomorrowPreview ?? `Day ${dayNumber + 1} — ${nextDay?.shortTitle}`}
              </span>
            </div>
          )}
        </div>

        {/* Save button */}
        <Link href="/dashboard">
          <Button size="lg" className="w-full">
            Save Day {dayNumber}
          </Button>
        </Link>

      </div>
    </div>
  );
}
