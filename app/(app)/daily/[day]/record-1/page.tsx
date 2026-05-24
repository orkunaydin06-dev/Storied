import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDayContent } from '@/data/curriculum/days';
import { RecordingScreen } from './RecordingScreen';

export default async function Record1Page({
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
    <RecordingScreen
      dayNumber={dayNumber}
      recordingNumber={1}
      targetSeconds={day.targetSeconds}
      nextPath={`/daily/${dayNumber}/processing?r=1`}
    />
  );
}
