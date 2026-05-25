'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParticleBg } from '@/components/ui/ParticleBg';

interface BeginClientProps {
  firstName: string | null;
}

export function BeginClient({ firstName }: BeginClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  async function handleBegin() {
    await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_day: 1, has_completed_welcome: true }),
    });
    router.push('/daily/1');
  }

  return (
    <div className="relative min-h-screen bg-bg-primary text-fg-primary overflow-hidden flex flex-col items-center justify-center px-8 text-center">
      <ParticleBg opacity={0.15} speed={320} />
      <div className="relative z-10 w-full max-w-sm space-y-12 animate-fade-in">
        <div className="space-y-6">
          <h1 className="font-heading text-4xl lg:text-5xl tracking-tight leading-tight">
            {firstName ? `${firstName}, you&apos;ve read the books.` : "You&apos;ve read the books."}
            <br /><span className="opacity-80">Now you do the work.</span>
          </h1>
          <div className="flex flex-col items-center gap-1.5 pt-4">
            <span className="text-[10px] font-bold tracking-[0.4em] text-accent-warm uppercase">Day 1 of 30</span>
            <span className="text-xs text-fg-muted">{"Week 1: Aristotle's Structure and Conflict"}</span>
          </div>
        </div>
        <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-border-subtle to-transparent mx-auto" />
        <div className="space-y-5">
          <p className="text-fg-muted text-lg">Ten minutes. Begin when ready.</p>
          <button onClick={handleBegin} className="w-full py-5 rounded-2xl font-bold text-black hover:scale-[1.02] active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', boxShadow: '0 15px 40px rgba(217,160,91,0.2)' }}>
            Begin Day 1
          </button>
          <button onClick={() => setShowModal(true)} className="text-xs font-bold tracking-[0.2em] text-fg-muted uppercase hover:text-fg-primary transition-colors">
            What to expect
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(9,14,23,0.9)' }} onClick={() => setShowModal(false)}>
          <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 max-w-sm w-full animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <p className="font-heading text-xl text-fg-primary mb-6">Each day is the same shape:</p>
            <ol className="text-sm text-fg-muted space-y-3 leading-relaxed">
              <li>{"1. A question, drawn from the day's method."}</li>
              <li>2. You record your first answer.</li>
              <li>3. The AI gives you specific, honest feedback.</li>
              <li>4. You record once more, revised.</li>
              <li>5. You hear the difference.</li>
            </ol>
            <p className="text-sm text-fg-muted mt-6">Eight to twelve minutes. Daily.</p>
            <button className="w-full mt-8 py-4 rounded-2xl font-bold text-black" onClick={() => setShowModal(false)} style={{ background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
