'use client';

import { useState } from 'react';

export function ExemplarTab({
  recordingId,
  initialExemplar,
}: {
  recordingId: string;
  initialExemplar: string | null;
}) {
  const [exemplar, setExemplar] = useState<string | null>(initialExemplar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recording/exemplar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId }),
      });
      const { data, error: err } = await res.json();
      if (err || !data?.exemplar) throw new Error(err ?? 'Generation failed');
      setExemplar(data.exemplar);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!exemplar) {
    return (
      <div className="mb-12 text-center py-8">
        <p className="font-sans text-sm text-fg-muted mb-6 max-w-xs mx-auto leading-relaxed">
          See your story retold through this week&apos;s framework — fully structured, every beat in place.
        </p>
        {error && <p className="font-sans text-xs text-error mb-4">{error}</p>}
        <button
          onClick={generate}
          disabled={loading}
          className="font-sans text-sm text-accent-warm border border-accent-warm/40 rounded-lg px-6 py-3 hover:bg-accent-warm/10 transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Generating (~20s)...' : 'Generate example'}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-6">
        Your story — told through the framework
      </p>
      <div className="font-serif text-xl text-fg-primary leading-relaxed whitespace-pre-line">
        {exemplar}
      </div>
      <p className="font-sans text-xs text-fg-subtle mt-8 leading-relaxed">
        This is your story, retold through the framework. Use it as a reference — not a script.
      </p>
    </div>
  );
}
