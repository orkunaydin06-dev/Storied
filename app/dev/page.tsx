'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Guard: only accessible in development

type SeedResult = {
  r1Id: string;
  r2Id: string;
  dayNumber: number;
  links: Record<string, string>;
};

export default function DevPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState<number | null>(null);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState('');

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="font-sans text-sm text-fg-subtle">Not found.</p>
      </div>
    );
  }

  async function seedDay(dayNumber: number) {
    setLoading(dayNumber);
    setResult(null);
    setError('');

    const res = await fetch('/api/dev/seed-practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber }),
    });

    const json = await res.json();
    setLoading(null);

    if (!res.ok || json.error) {
      setError(json.error ?? `HTTP ${res.status}`);
      return;
    }

    setResult(json.data);
  }

  const LINK_LABELS: Record<string, string> = {
    question: 'Question',
    record1: 'Record 1',
    feedback: 'Feedback',
    revise: 'Revise',
    record2: 'Record 2',
    compare: 'Compare',
    closure: 'Closure',
    dashboard: 'Dashboard',
    archive: 'Archive',
  };

  return (
    <div className="min-h-screen bg-bg-primary px-6 py-12 max-w-2xl mx-auto">
      <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-2">Dev only</p>
      <h1 className="font-serif text-3xl text-fg-primary mb-2">Test panel</h1>
      <p className="font-sans text-sm text-fg-muted mb-10">
        Seeds a full practice day with real Claude feedback — no microphone needed.
        Transcripts are pre-written. Audio files are not created (waveforms and
        playback will be empty, everything else is real).
      </p>

      {/* Day grid */}
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">Seed a day</p>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => seedDay(day)}
              disabled={loading !== null}
              className="font-mono text-sm border border-border-subtle rounded-lg py-2 hover:border-accent-warm hover:text-accent-warm transition-colors duration-200 disabled:opacity-40"
            >
              {loading === day ? '…' : day}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 border border-border-subtle rounded-lg bg-bg-secondary">
          <p className="font-mono text-xs text-warning mb-1">Error</p>
          <p className="font-sans text-sm text-fg-muted break-all">{error}</p>
        </div>
      )}

      {/* Result: quick-nav links */}
      {result && (
        <div className="border border-border-subtle rounded-2xl p-6 bg-bg-secondary">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-1">
            Day {result.dayNumber} seeded
          </p>
          <p className="font-sans text-xs text-fg-subtle mb-6">
            R1: <span className="font-mono">{result.r1Id.slice(0, 8)}…</span>
            {'  '}
            R2: <span className="font-mono">{result.r2Id.slice(0, 8)}…</span>
          </p>

          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-3">Jump to</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(result.links).map(([key, path]) => (
              <button
                key={key}
                onClick={() => router.push(path)}
                className="font-sans text-sm border border-border-subtle rounded-lg py-2 px-3 text-left hover:border-accent-warm hover:text-accent-warm transition-colors duration-200"
              >
                {LINK_LABELS[key] ?? key}
              </button>
            ))}
          </div>

          <button
            onClick={() => seedDay(result.dayNumber)}
            disabled={loading !== null}
            className="mt-6 font-mono text-xs text-fg-subtle underline underline-offset-2 hover:text-fg-muted transition-colors disabled:opacity-40"
          >
            Re-seed day {result.dayNumber}
          </button>
        </div>
      )}

      {loading !== null && (
        <div className="mt-8 text-center">
          <p className="font-sans text-sm text-fg-muted">
            Seeding day {loading}… generating AI feedback, this takes ~15 seconds.
          </p>
        </div>
      )}

      {/* Quick links to non-practice screens */}
      <div className="mt-10 pt-8 border-t border-border-subtle">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-3">Other screens</p>
        <div className="flex flex-wrap gap-2">
          {['/dashboard', '/archive', '/settings', '/begin', '/welcome'].map((path) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              className="font-mono text-xs border border-border-subtle rounded-lg py-1.5 px-3 hover:border-accent-warm hover:text-accent-warm transition-colors duration-200"
            >
              {path}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
