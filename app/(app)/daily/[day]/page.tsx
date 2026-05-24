import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDayContent } from '@/data/curriculum/days';
import { getGreeting } from '@/lib/utils';

export default async function DailyGreetingPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = await params;
  const dayNumber = parseInt(dayParam, 10);

  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, current_day')
    .eq('id', user.id)
    .single();

  if (!profile || profile.current_day === 0) redirect('/begin');

  const dayContent = getDayContent(dayNumber);
  if (!dayContent) notFound();

  const greeting = getGreeting(profile.first_name ?? null);
  const week = dayContent.week;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="max-w-sm w-full text-center">
        <h1 className="font-serif text-2xl text-fg-primary mb-2">{greeting}</h1>

        <div className="mt-8 mb-12">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-1">
            Day {dayNumber} of 30
          </p>
          <p className="font-sans text-sm text-fg-muted">
            Week {week}: {dayContent.methodologyName}
          </p>
        </div>

        <Link href={`/daily/${dayNumber}/question`}>
          <Button size="lg" className="w-full">
            {"Begin today's practice"}
          </Button>
        </Link>

        <p className="font-sans text-xs text-fg-subtle mt-6">8–10 minutes</p>
      </div>
    </div>
  );
}
