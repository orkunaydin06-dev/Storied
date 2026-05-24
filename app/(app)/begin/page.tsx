import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BeginClient } from './BeginClient';

export default async function BeginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/welcome');

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, current_day, paid_at')
    .eq('id', user.id)
    .single();

  // If not paid, redirect to welcome
  if (!profile?.paid_at) {
    redirect('/welcome');
  }

  // If already started, go to dashboard
  if (profile?.current_day && profile.current_day > 0) {
    redirect('/dashboard');
  }

  return <BeginClient firstName={profile?.first_name ?? null} />;
}
