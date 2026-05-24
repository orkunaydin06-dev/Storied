import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export default async function GraduationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, current_day, paid_at')
    .eq('id', user.id)
    .single();

  if (!profile?.paid_at) redirect('/welcome');
  if (!profile?.current_day || profile.current_day < 30) redirect('/dashboard');

  // Fetch day 30 feedback
  const { data: recording } = await supabase
    .from('recordings')
    .select('id, feedback(*)')
    .eq('user_id', user.id)
    .eq('day_number', 30)
    .eq('recording_number', 1)
    .single();

  type GradFeedback = {
    graduation_narrative: string | null;
    what_changed_most: string | null;
    what_stayed_strongest: string | null;
    score_overall: number | null;
  };

  const fb = (recording?.feedback as unknown[])?.[0] as GradFeedback | undefined;
  const firstName = profile.first_name ?? 'you';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 animate-fade-in">
      <div className="max-w-lg w-full text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-6">
          Day 30 complete
        </p>

        <h1 className="font-serif text-3xl md:text-4xl text-fg-primary mb-6 leading-tight">
          Thirty days. Thirty stories.
        </h1>

        <p className="font-sans text-base text-fg-muted mb-12 leading-relaxed">
          {firstName.charAt(0).toUpperCase() + firstName.slice(1)}, you finished what most people never start.
        </p>

        {fb?.graduation_narrative && (
          <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 mb-8 text-left">
            <p className="font-serif text-lg text-fg-primary leading-relaxed whitespace-pre-line">
              {fb.graduation_narrative}
            </p>
          </div>
        )}

        {fb?.what_changed_most && (
          <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 mb-4 text-left">
            <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-3">
              What changed most
            </p>
            <p className="font-sans text-sm text-fg-muted leading-relaxed">
              {fb.what_changed_most}
            </p>
          </div>
        )}

        {fb?.what_stayed_strongest && (
          <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 mb-12 text-left">
            <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-3">
              What stayed strongest
            </p>
            <p className="font-sans text-sm text-fg-muted leading-relaxed">
              {fb.what_stayed_strongest}
            </p>
          </div>
        )}

        {fb?.score_overall !== null && fb?.score_overall !== undefined && (
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-12">
            Final score: {fb.score_overall} / 100
          </p>
        )}

        <div className="flex flex-col items-center gap-4">
          <Link href="/archive">
            <Button size="lg">Review your journey</Button>
          </Link>
          <Link
            href="/settings"
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Account settings
          </Link>
        </div>
      </div>
    </div>
  );
}
