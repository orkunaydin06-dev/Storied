'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HeroWaveform } from './HeroWaveform';

export function Hero() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe-checkout', { method: 'POST' });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 py-32 text-center overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Moon ambient glow — top center */}
        <div
          className="absolute animate-aurora-a"
          style={{
            top: '-20%',
            left: '10%',
            width: '70%',
            height: '70%',
            background: 'radial-gradient(ellipse at center, rgba(100,160,220,0.13) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
        {/* Amber glow — bottom right */}
        <div
          className="absolute animate-aurora-b"
          style={{
            bottom: '-10%',
            right: '-5%',
            width: '55%',
            height: '55%',
            background: 'radial-gradient(ellipse at center, rgba(232,181,71,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: 'linear-gradient(to top, #0b1929 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Content */}
      <p className="relative font-mono text-xs uppercase tracking-widest text-fg-subtle mb-10 animate-fade-in">
        Founding storytellers — $29
      </p>

      <h1
        className="relative font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em] max-w-3xl animate-fade-in"
        style={{
          animationDelay: '100ms',
          background: 'linear-gradient(170deg, #f5f1eb 30%, rgba(232,181,71,0.75) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        The daily practice
        <br />
        <em className="not-italic" style={{ fontStyle: 'italic' }}>of being</em> a storyteller.
      </h1>

      <p
        className="relative font-sans text-base md:text-lg text-fg-muted mt-8 max-w-md leading-relaxed animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        Ten minutes a day. Thirty practices.
        <br />
        The methods you know, finally practiced.
      </p>

      <div
        className="relative mt-12 animate-fade-in"
        style={{ animationDelay: '350ms' }}
      >
        <Button size="lg" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Redirecting...' : 'Begin your practice — $29'}
        </Button>
      </div>

      <p
        className="relative font-sans text-xs text-fg-subtle mt-5 animate-fade-in"
        style={{ animationDelay: '450ms' }}
      >
        One-time payment. No subscription. No auto-charge.
      </p>

      {/* Waveform — below CTA */}
      <div
        className="relative w-full max-w-sm mt-16 animate-fade-in"
        style={{ animationDelay: '600ms' }}
      >
        <HeroWaveform />
      </div>
    </section>
  );
}
