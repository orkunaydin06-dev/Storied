import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { StructureBreakdown } from '@/components/feedback/StructureBreakdown';
import { Mic } from 'lucide-react';

export default async function RevisePage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ recordingId?: string }>;
}) {
  const { day: dayParam } = await params;
  const { recordingId } = await searchParams;
  const dayNumber = parseInt(dayParam, 10);
  if (isNaN(dayNumber) || !recordingId) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const { data: recording } = await supabase
    .from('recordings')
    .select('id')
    .eq('id', recordingId)
    .eq('user_id', user.id)
    .single();

  if (!recording) notFound();

  const { data: fb } = await supabase
    .from('feedback')
    .select('narrative, revision_prompt, structure_breakdown')
    .eq('recording_id', recordingId)
    .maybeSingle() as {
      data: {
        narrative: string;
        revision_prompt: string | null;
        structure_breakdown: {
          framework: string;
          elements: Array<{ name: string; status: string; score: string; note: string; revision_tip?: string }>;
        } | null;
      } | null;
    };

  const revisionPrompt = fb?.revision_prompt ?? fb?.narrative ?? '';
  const breakdown = fb?.structure_breakdown;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-8">
        Your micro-revision for Recording 2
      </p>

      <div className="font-serif text-xl text-fg-primary leading-relaxed whitespace-pre-line mb-12">
        {revisionPrompt}
      </div>

      {breakdown && (
        <div className="mb-12 border-t border-border-subtle pt-10">
          <StructureBreakdown
            framework={breakdown.framework}
            elements={breakdown.elements}
          />
        </div>
      )}

      <div className="text-center">
        <Link href={`/daily/${dayNumber}/record-2?r1Id=${recordingId}`}>
          <Button size="lg" className="flex items-center gap-2 mx-auto">
            <Mic className="w-4 h-4" aria-hidden="true" />
            Record again
          </Button>
        </Link>
      </div>
    </div>
  );
}
