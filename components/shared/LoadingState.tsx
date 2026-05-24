'use client';

import { useEffect, useState } from 'react';

interface LoadingStateProps {
  initialText?: string;
  secondaryText?: string;
  secondaryAfterMs?: number;
}

export function LoadingState({
  initialText = 'Listening...',
  secondaryText = 'Reading your story...',
  secondaryAfterMs = 8000,
}: LoadingStateProps) {
  const [text, setText] = useState(initialText);
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setText(secondaryText), secondaryAfterMs);
    return () => clearTimeout(timer);
  }, [secondaryText, secondaryAfterMs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((i) => (i + 1) % 3);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="font-serif text-2xl text-fg-primary animate-fade-in">{text}</p>
      <div className="flex gap-3" aria-label="Loading" role="status">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                i === dotIndex
                  ? 'var(--color-accent-warm)'
                  : 'var(--color-border-visible)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
