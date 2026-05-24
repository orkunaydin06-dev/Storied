import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';
import { RecordingScreen } from '../record-1/RecordingScreen';

export default async function Record2Page({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ r1Id?: string }>;
}) {
  const { day: dayParam } = await params;
  const { r1Id } = await searchParams;
  const dayNumber = parseInt(dayParam, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const day = getDayContent(dayNumber);
  if (!day) notFound();

  return (
    <RecordingScreen
      dayNumber={dayNumber}
      recordingNumber={2}
      targetSeconds={day.targetSeconds}
      nextPath={`/daily/${dayNumber}/processing?r=2&r1Id=${r1Id}`}
    />
  );
}
