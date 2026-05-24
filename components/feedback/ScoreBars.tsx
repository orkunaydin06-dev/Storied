'use client';

import { useEffect, useState } from 'react';

interface Score {
  name: string;
  value: number;
}

interface ScoreBarsProps {
  scores: Score[];
  animate?: boolean;
}

export function ScoreBars({ scores, animate = true }: ScoreBarsProps) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="space-y-3">
      {scores.map(({ name, value }) => (
        <div key={name} className="flex items-center gap-4">
          <span className="font-sans text-sm text-fg-muted w-28 flex-shrink-0">{name}</span>
          <div className="flex-1 h-1.5 bg-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-warm rounded-full transition-all duration-1000 ease-out"
              style={{ width: visible ? `${value}%` : '0%' }}
            />
          </div>
          <span className="font-mono text-lg text-fg-primary tabular-nums w-10 text-right flex-shrink-0">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
