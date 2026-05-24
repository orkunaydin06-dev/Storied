import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { StructureBreakdown } from '@/components/feedback/StructureBreakdown';
import { Mic } from 'lucide-react';
import { ExemplarTab } from './ExemplarTab';

export default async function RevisePage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ recordingId?: string; tab?: string }>;
}) {
  const { day: dayParam } = await params;
  const { recordingId, tab } = await searchParams;
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
    .select('narrative, revision_prompt, structure_breakdown, exemplar')
    .eq('recording_id', recordingId)
    .maybeSingle() as {
      data: {
        narrative: string;
        revision_prompt: string | null;
        structure_breakdown: {
          framework: string;
          elements: Array<{ name: string; status: string; score: string; note: string; revision_tip?: string }>;
        } | null;
        exemplar: string | null;
      } | null;
    };

  const revisionPrompt = fb?.revision_prompt ?? fb?.narrative ?? '';
  const breakdown = fb?.structure_breakdown;
  const activeTab = tab === 'example' ? 'example' : 'revision';

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-8">
        Before recording 2
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-10 border-b border-border-subtle">
        <Link
          href={`/daily/${dayNumber}/revise?recordingId=${recordingId}&tab=revision`}
          className={`font-sans text-sm pb-3 px-1 border-b-2 transition-colors duration-200 ${
            activeTab === 'revision'
              ? 'border-accent-warm text-fg-primary'
              : 'border-transparent text-fg-muted hover:text-fg-primary'
          }`}
        >
          Micro-revision
        </Link>
        <Link
          href={`/daily/${dayNumber}/revise?recordingId=${recordingId}&tab=example`}
          className={`font-sans text-sm pb-3 px-1 border-b-2 ml-4 transition-colors duration-200 ${
            activeTab === 'example'
              ? 'border-accent-warm text-fg-primary'
              : 'border-transparent text-fg-muted hover:text-fg-primary'
          }`}
        >
          How it could be told
        </Link>
      </div>

      {activeTab === 'revision' ? (
        <>
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
        </>
      ) : (
        <ExemplarTab recordingId={recordingId} initialExemplar={fb?.exemplar ?? null} />
      )}

      <div className="text-center mt-4">
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
