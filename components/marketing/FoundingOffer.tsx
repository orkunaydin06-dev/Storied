'use client';

import Link from 'next/link';

export function FoundingOffer() {
  return (
    <section className="max-w-md mx-auto px-6 py-12">
      <div className="space-y-2 text-center mb-8">
        <span className="text-[10px] font-bold tracking-[0.4em] text-accent-warm uppercase">
          Founding Storytellers
        </span>
      </div>

      <div
        className="rounded-2xl p-7 border border-accent-warm/20"
        style={{
          background: 'rgba(19,28,42,0.6)',
          boxShadow: '0 0 40px rgba(217,160,91,0.06)',
        }}
      >
        <h2 className="font-heading text-2xl text-fg-primary mb-3">
          $29 — for the first 50 customers.
        </h2>
        <p className="text-fg-muted text-sm mb-2">After that, $39. After 200 customers, $49.</p>
        <p className="text-fg-muted text-sm mb-7">
          The practice is the same. The price is the only thing that changes.
        </p>

        <Link
          href="/welcome"
          className="block w-full py-5 rounded-2xl font-bold text-black text-center hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{
            background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
            backgroundSize: '200% auto',
            animation: 'shimmer 3s linear infinite',
            boxShadow: '0 15px 40px rgba(217,160,91,0.25)',
          }}
        >
          Begin your practice — $29
        </Link>

        <p className="text-[10px] text-fg-muted text-center mt-4 tracking-[0.15em] uppercase">
          One-time payment. No subscription. Yours forever.
        </p>
      </div>
    </section>
  );
}
