import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

export default async function TeachingPage({
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
      <div className="max-w-lg w-full">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-8">
          {day.methodologyName.toUpperCase()}
        </p>

        <blockquote className="font-serif text-xl md:text-2xl text-fg-primary leading-relaxed mb-8 whitespace-pre-line">
          {day.miniTeaching}
        </blockquote>

        <div className="mt-12 text-center">
          <Link href={`/daily/${dayNumber}/record-1`}>
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              <Mic className="w-4 h-4" aria-hidden="true" />
              Start recording
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
