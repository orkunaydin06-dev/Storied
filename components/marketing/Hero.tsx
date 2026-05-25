'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center max-w-md mx-auto">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 border border-accent-warm/20 px-4 py-2 rounded-full mb-6 animate-fade-in"
        style={{ background: 'rgba(217,160,91,0.08)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-warm animate-pulse" />
        <span className="text-[9px] font-bold tracking-[0.3em] text-accent-warm uppercase">
          Founding Storytellers — $29
        </span>
      </div>

      {/* Headline */}
      <h1
        className="font-heading text-5xl leading-[1.1] mb-6 text-fg-primary animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        The daily practice<br />of being a<br />storyteller.
      </h1>

      <p
        className="text-fg-muted text-lg mb-10 leading-relaxed animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        Ten minutes a day. Thirty practices.<br />
        The methods you know, finally practiced.
      </p>

      {/* CTA */}
      <div
        className="w-full animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <Link
          href="/welcome"
          className="w-full py-5 rounded-2xl font-bold text-black text-lg flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{
            background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
            backgroundSize: '200% auto',
            animation: 'shimmer 3s linear infinite',
            boxShadow: '0 20px 50px rgba(217,160,91,0.3)',
          }}
        >
          Begin your practice — $29
        </Link>
      </div>

      <div
        className="flex flex-col items-center gap-6 mt-8 animate-fade-in"
        style={{ animationDelay: '400ms' }}
      >
        <p className="text-[10px] tracking-[0.2em] text-fg-muted uppercase">
          One-time payment. No subscription.
        </p>
        <svg
          className="w-4 h-4 text-accent-warm opacity-40"
          style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
          fill="currentColor" viewBox="0 0 24 24"
        >
          <path d="M12 16.5l-8-8 1.4-1.4L12 13.7l6.6-6.6L20 8.5l-8 8z" />
          <path d="M12 11.5l-8-8 1.4-1.4L12 8.7l6.6-6.6L20 3.5l-8 8z" />
        </svg>
      </div>

      {/* Waveform */}
      <div
        className="flex justify-center gap-1 mt-12 animate-fade-in"
        style={{ animationDelay: '500ms' }}
      >
        {[8, 12, 16, 20, 24, 28, 32, 36, 32, 28, 24, 20, 16, 12, 8].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              height: h,
              background: `rgba(217,160,91,${0.2 + (h / 36) * 0.8})`,
              animation: `waveform-wave ${1.4 + i * 0.05}s ease-in-out infinite alternate`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
