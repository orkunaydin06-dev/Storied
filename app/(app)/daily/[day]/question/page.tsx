import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';

export default async function QuestionPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayParam } = await params;
  const dayNumber = parseInt(dayParam, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const day = getDayContent(dayNumber);
  if (!day) notFound();

  const week = Math.ceil(dayNumber / 6);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col px-6 py-8 max-w-md mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-8">
        <span className="text-[10px] font-bold tracking-[0.3em] text-fg-muted uppercase">
          Day {dayNumber} · Week {week}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-heading text-2xl text-fg-primary mb-6 leading-snug">
        {day.shortTitle}
      </h1>

      <div className="h-px bg-gradient-to-r from-transparent via-border-subtle/50 to-transparent mb-6" />

      {/* Question */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-[0.3em] text-accent-warm uppercase mb-3">
          {"Today's Question"}
        </p>
        <p className="font-heading text-xl text-fg-primary leading-relaxed">
          {day.question}
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-auto space-y-3 pt-8">
        <Link
          href={`/daily/${dayNumber}/teaching`}
          className="w-full py-5 rounded-2xl font-bold text-black flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{
            background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
            backgroundSize: '200% auto',
            animation: 'shimmer 3s linear infinite',
            boxShadow: '0 15px 40px rgba(217,160,91,0.2)',
          }}
        >
          Read the method
        </Link>
        <Link
          href={`/daily/${dayNumber}/record-1`}
          className="w-full py-4 rounded-2xl text-center text-xs font-bold tracking-[0.2em] text-fg-muted uppercase hover:text-fg-primary transition-colors"
        >
          Skip to recording
        </Link>
      </div>
    </div>
  );
}
