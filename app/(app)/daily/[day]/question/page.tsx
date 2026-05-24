import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';
import { Button } from '@/components/ui/button';

export default async function QuestionPage({
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

  const day = getDayContent(dayNumber);
  if (!day) notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="max-w-2xl w-full text-center">
        <h1 className="font-serif text-2xl md:text-4xl text-fg-primary leading-relaxed max-w-xl mx-auto">
          {day.question}
        </h1>

        <p className="font-sans text-sm text-fg-muted mt-8">
          {day.targetSeconds} seconds — beginning, middle, end.
        </p>

        <div className="mt-12">
          <Link href={`/daily/${dayNumber}/teaching`}>
            <Button size="lg">{"I'm ready"}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
