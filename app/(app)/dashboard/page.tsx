import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getWeekTheme } from '@/data/curriculum/days';
import { getGreeting } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/welcome');

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, current_day, streak_days, last_practice_date, paid_at')
    .eq('id', user.id)
    .single();

  if (!profile?.paid_at) redirect('/welcome');
  if (!profile?.current_day || profile.current_day === 0) redirect('/begin');

  const currentDay = profile.current_day;
  const week = Math.ceil(currentDay / 6);
  const weekTheme = getWeekTheme(week);
  const firstName = profile.first_name ?? null;
  const streak = profile.streak_days ?? 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const isComplete = profile.last_practice_date === todayStr;

  const startedDaysAgo = (() => {
    if (!profile.last_practice_date) return null;
    const diff = Math.floor(
      (Date.now() - new Date(profile.last_practice_date).getTime()) / 86400000
    );
    return diff;
  })();

  const greeting = getGreeting(firstName);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <p className="font-sans text-base text-fg-muted mb-1">{greeting}</p>

        <div className="mt-6 mb-2">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
            Day {currentDay} of 30
          </p>
          {weekTheme && (
            <p className="font-sans text-sm text-fg-muted mt-1">
              Week {week}: {weekTheme}
            </p>
          )}
        </div>

        <div className="my-12 border-t border-border-subtle" />

        {isComplete ? (
          <div>
            <p className="font-serif text-2xl text-fg-primary mb-3">
              Day {currentDay} complete.
            </p>
            {currentDay < 30 && (
              <p className="font-sans text-sm text-fg-muted">
                Day {currentDay + 1} unlocks tomorrow.
              </p>
            )}
            {currentDay === 30 && (
              <Link href="/graduation">
                <Button className="mt-6">View your graduation</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-fg-primary mb-10">
              {"Today's practice is ready."}
            </h1>
            <Link href={`/daily/${currentDay}`}>
              <Button size="lg">Begin Day {currentDay}</Button>
            </Link>
          </>
        )}

        <div className="mt-20 pt-10 border-t border-border-subtle space-y-1.5">
          {streak > 0 && (
            <p className="font-mono text-xs text-fg-muted">
              Streak: {streak} {streak === 1 ? 'day' : 'days'}
            </p>
          )}
          {startedDaysAgo !== null && startedDaysAgo > 0 && (
            <p className="font-mono text-xs text-fg-subtle">
              Started {startedDaysAgo} {startedDaysAgo === 1 ? 'day' : 'days'} ago
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
