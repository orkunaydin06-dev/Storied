'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

interface SettingsClientProps {
  email: string;
  firstName: string | null;
  currentDay: number;
  streakDays: number;
  joinedAt: string | null;
}

export function SettingsClient({
  email,
  firstName,
  currentDay,
  streakDays,
  joinedAt,
}: SettingsClientProps) {
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/welcome');
  }

  async function handleDeleteAccount() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    const res = await fetch('/api/user/me', { method: 'DELETE' });
    if (res.ok) {
      await handleSignOut();
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <h1 className="font-serif text-2xl text-fg-primary mb-10">Settings</h1>

      <Section title="Account">
        <InfoRow label="Email" value={email} />
        {firstName && <InfoRow label="Name" value={firstName} />}
        {joinedAt && <InfoRow label="Joined" value={joinedAt} />}
      </Section>

      <Section title="Privacy">
        <p className="font-sans text-sm text-fg-muted leading-relaxed mb-6">
          Your recordings are private. We never share them, never use them to train AI, never analyze them for marketing.
        </p>
        <a
          href="/api/user/export"
          className="block font-sans text-sm text-fg-muted hover:text-fg-primary transition-colors duration-200 mb-3 underline-offset-4 hover:underline"
        >
          Export my data
        </a>
        <button
          onClick={handleDeleteAccount}
          className="block font-sans text-sm text-error hover:opacity-80 transition-opacity duration-200"
        >
          {deleteConfirm ? 'Tap again to confirm — this starts a 7-day grace period' : 'Delete my account'}
        </button>
      </Section>

      <Section title="Practice">
        <InfoRow label="Current day" value={`${currentDay} of 30`} />
        <InfoRow label="Streak" value={`${streakDays} ${streakDays === 1 ? 'day' : 'days'}`} />

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-4 font-sans text-xs text-fg-subtle hover:text-fg-muted transition-colors duration-200"
        >
          {showAdvanced ? 'Hide advanced' : 'Show advanced'}
        </button>

        {showAdvanced && (
          <button
            className="mt-3 block font-sans text-sm text-error hover:opacity-80 transition-opacity duration-200"
            onClick={() => {
              if (confirm('Reset your journey? Your recordings stay in the archive, but progress resets to Day 1.')) {
                fetch('/api/user/me', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ current_day: 1, streak_days: 0 }),
                }).then(() => router.refresh());
              }
            }}
          >
            Reset my journey
          </button>
        )}
      </Section>

      <div className="pt-8 border-t border-border-subtle">
        <button
          onClick={handleSignOut}
          className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 pb-10 border-b border-border-subtle">
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-5">{title}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className="font-sans text-sm text-fg-muted">{label}</span>
      <span className="font-sans text-sm text-fg-primary">{value}</span>
    </div>
  );
}
