import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
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
  const greeting = getGreeting(firstName);

  // Get the day's methodology name for subtitle
  const methodologyNames: Record<number, string> = {
    1: "Aristotle's Foundations", 2: "Aristotle's Foundations", 3: "Aristotle's Foundations",
    4: "Aristotle's Foundations", 5: "Aristotle's Foundations", 6: "Aristotle's Foundations",
    7: "Pixar's Story Spine", 8: "Pixar's Story Spine", 9: "Pixar's Story Spine",
    10: "Pixar's Story Spine", 11: "Pixar's Story Spine", 12: "Pixar's Story Spine",
    13: "Hero's Journey", 14: "Hero's Journey", 15: "Hero's Journey",
    16: "Hero's Journey", 17: "Hero's Journey", 18: "Hero's Journey",
    19: "Cicero's Rhetoric", 20: "Cicero's Rhetoric", 21: "Cicero's Rhetoric",
    22: "Cicero's Rhetoric", 23: "Cicero's Rhetoric", 24: "Cicero's Rhetoric",
  };
  const methodName = methodologyNames[currentDay] ?? "Synthesis";

  if (currentDay > 30) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-6 py-20 animate-fade-in">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[0.4em] text-accent-warm uppercase">Day 30 Complete</p>
          <h2 className="font-heading text-4xl">All 30 days done.</h2>
        </div>
        <Link
          href="/graduation"
          className="py-5 px-8 rounded-2xl font-bold text-black hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', boxShadow: '0 15px 40px rgba(217,160,91,0.2)' }}
        >
          View your graduation
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 px-6 py-8 animate-fade-in max-w-sm mx-auto w-full">
      {/* Greeting + day info */}
      <div className="space-y-2">
        <p className="text-fg-muted text-lg">{greeting}</p>
        <div className="flex flex-col items-center gap-1 opacity-60">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Day {currentDay} of 30</span>
          {weekTheme && <span className="text-xs">Week {week}: {weekTheme}</span>}
        </div>
      </div>

      {/* Gradient divider */}
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border-subtle/50 to-transparent" />

      {/* Main content */}
      <div className="space-y-8 w-full">
        <div className="space-y-4">
          <h2 className="font-heading text-4xl tracking-tight leading-tight">
            {isComplete ? `Day ${currentDay} is ready.` : "Today's practice\nis ready."}
          </h2>
          {!isComplete && (
            <p className="text-accent-warm/60 text-sm font-medium" style={{ animation: 'breathe 3s ease-in-out infinite' }}>
              {methodName} — 12 mins
            </p>
          )}
          {isComplete && (
            <p className="text-[10px] font-bold tracking-[0.3em] text-accent-warm uppercase">
              Day {currentDay - 1} complete
            </p>
          )}
        </div>

        <Link
          href={`/daily/${currentDay}`}
          className="w-full py-5 rounded-2xl font-bold text-black flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', boxShadow: '0 15px 40px rgba(217,160,91,0.2)' }}
        >
          Begin Day {currentDay}
        </Link>
      </div>

      {/* Gradient divider */}
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border-subtle/50 to-transparent" />

      {/* Streak dots */}
      {streak > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.3em] text-fg-muted uppercase">
            Streak: {streak} {streak === 1 ? 'Day' : 'Days'}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(streak + 2, 7) }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i < streak ? '#d9a05b' : 'rgba(255,255,255,0.1)',
                  boxShadow: i < streak ? '0 0 8px rgba(229,173,79,0.5)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
