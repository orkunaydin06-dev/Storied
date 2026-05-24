'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export function FoundingOffer() {
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

  return (
    <section
      ref={sectionRef}
      className="max-w-2xl mx-auto px-4 py-16 md:py-24 border-t border-border-subtle text-center reveal-hidden"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
        Founding storytellers
      </p>
      <div className="ink-divider mb-10" />

      {/* Card */}
      <div
        className="relative rounded-2xl px-8 py-10 md:px-12 md:py-12 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(28,49,72,0.8) 0%, rgba(20,37,54,0.9) 100%)',
          border: '1px solid rgba(232,181,71,0.2)',
          boxShadow: '0 0 40px rgba(232,181,71,0.06), 0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Subtle amber corner glow */}
        <div
          className="absolute -bottom-12 -right-12 w-48 h-48 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,181,71,0.1) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          aria-hidden="true"
        />

        <h2 className="relative font-serif text-3xl md:text-4xl text-fg-primary mb-5">
          $29 — for the first 50 customers.
        </h2>

        <p className="relative font-sans text-sm text-fg-muted mb-1">
          After that, $39. After 200 customers, $49.
        </p>
        <p className="relative font-sans text-sm text-fg-muted mb-10">
          The practice is the same. The price is the only thing that changes.
        </p>

        <Button size="lg" onClick={() => window.location.href = '/welcome'}>
          Begin your practice — $29
        </Button>

        <p className="relative font-sans text-xs text-fg-subtle mt-5">
          One-time payment. No subscription. 30-day practice, yours forever.
        </p>
      </div>
    </section>
  );
}
