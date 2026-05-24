'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('reveal-hidden');
          el.classList.add('reveal-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <section
      ref={sectionRef}
      className="max-w-2xl mx-auto px-4 py-16 md:py-24 border-t border-border-subtle reveal-hidden"
    >
      <p className="font-sans text-sm text-fg-muted mb-1">Not ready to start?</p>
      <h3 className="font-serif text-2xl text-fg-primary mb-4">
        Leave your email.
      </h3>
      <p className="font-sans text-sm text-fg-muted mb-8 leading-relaxed">
        {"We'll send a free 7-day storytelling primer — one short lesson a day,"}
        {' '}drawn from the same methods as the full practice. No spam. No sales.
        Just craft.
      </p>

      {state === 'done' ? (
        <p className="font-sans text-sm text-fg-primary animate-fade-in">
          Day 1 of the primer arrives tomorrow.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
            className="flex-1 bg-bg-secondary/60 backdrop-blur-sm border-border-visible focus:border-accent-warm/60 transition-colors duration-200"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={state === 'loading'}
            className="shrink-0"
          >
            {state === 'loading' ? 'Sending...' : 'Send the primer'}
          </Button>
        </form>
      )}

      {state === 'error' && (
        <p className="font-sans text-xs text-error mt-3">
          Something went wrong. Try again.
        </p>
      )}
    </section>
  );
}
