import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from './SettingsClient';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/welcome');

  const { data: profile } = await supabase
    .from('users')
    .select('email, first_name, current_day, streak_days, created_at')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/welcome');

  const joinedAt = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <SettingsClient
      email={profile.email}
      firstName={profile.first_name}
      currentDay={profile.current_day ?? 0}
      streakDays={profile.streak_days ?? 0}
      joinedAt={joinedAt}
    />
  );
}
