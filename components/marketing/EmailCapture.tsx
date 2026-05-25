'use client';

import { useState } from 'react';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('loading');
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <section className="max-w-md mx-auto px-6 py-12 border-t border-border-subtle/50">
      <p className="text-fg-muted text-sm mb-1">Not ready to start?</p>
      <h3 className="font-heading text-2xl text-fg-primary mb-4">Leave your email.</h3>
      <p className="text-fg-muted text-sm mb-8 leading-relaxed">
        {"We'll send a free 7-day storytelling primer — one short lesson a day. No spam. No sales. Just craft."}
      </p>

      {state === 'done' ? (
        <p className="text-sm text-fg-primary animate-fade-in">Day 1 of the primer arrives tomorrow.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-4 rounded-2xl border border-border-visible bg-bg-secondary/40 text-fg-primary placeholder:text-fg-subtle focus:border-accent-warm/50 focus:ring-1 focus:ring-accent-warm/20 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full py-4 rounded-2xl border border-border-visible text-fg-primary font-medium hover:border-accent-warm/40 hover:bg-bg-secondary transition-all disabled:opacity-50"
          >
            {state === 'loading' ? 'Sending...' : 'Send the primer'}
          </button>
        </form>
      )}

      {state === 'error' && (
        <p className="text-xs text-error mt-3">Something went wrong. Try again.</p>
      )}
    </section>
  );
}
