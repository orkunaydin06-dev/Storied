import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';

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
    <div className="min-h-[calc(100vh-80px)] flex flex-col px-6 py-8 max-w-md mx-auto animate-fade-in">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fg-muted uppercase mb-8">
        {day.methodologyName}
      </p>

      <blockquote className="font-heading text-xl text-fg-primary leading-relaxed mb-auto whitespace-pre-line">
        {day.miniTeaching}
      </blockquote>

      <div className="pt-12">
        <Link
          href={`/daily/${dayNumber}/record-1`}
          className="w-full py-5 rounded-2xl font-bold text-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{
            background: '#d9a05b',
            boxShadow: '0 8px 24px rgba(217,160,91,0.2)',
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm-2-9a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0V6zm7 5a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V20H9v2h6v-2h-2v-2.07A7 7 0 0 0 19 11h-2z"/>
          </svg>
          Start recording
        </Link>
      </div>
    </div>
  );
}
