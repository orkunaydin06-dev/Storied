'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-fg-primary leading-snug mb-4">
          {firstName ? `${firstName}, you've read the books.` : "You've read the books."}
          <br />
          Now you do the work.
        </h1>

        <div className="mt-10 mb-2">
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
            Day 1 of 30
          </p>
          <p className="font-sans text-sm text-fg-muted mt-1">
            {"Week 1: Aristotle's Structure and Conflict"}
          </p>
        </div>

        <p className="font-sans text-sm text-fg-muted mt-8 mb-12">
          Ten minutes. Begin when ready.
        </p>

        <Button onClick={handleBegin} size="lg">
          Begin Day 1
        </Button>

        <div className="mt-8">
          <button
            onClick={() => setShowModal(true)}
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200 underline-offset-4 hover:underline"
          >
            What to expect
          </button>
        </div>
      </div>

      {/* What to expect modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-bg-primary/90 z-50 flex items-center justify-center px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 max-w-sm w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif text-xl text-fg-primary mb-6">
              Each day is the same shape:
            </p>
            <ol className="font-sans text-sm text-fg-muted space-y-3 leading-relaxed">
              <li>{"1. A question, drawn from the day's method."}</li>
              <li>2. You record your first answer.</li>
              <li>3. The AI gives you specific, honest feedback.</li>
              <li>4. You record once more, revised.</li>
              <li>5. You hear the difference.</li>
            </ol>
            <p className="font-sans text-sm text-fg-muted mt-6">
              Eight to twelve minutes. Daily.
            </p>
            <p className="font-sans text-sm text-fg-subtle mt-4">
              Your recordings are private. Always.
            </p>
            <Button
              className="w-full mt-8"
              onClick={() => setShowModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
