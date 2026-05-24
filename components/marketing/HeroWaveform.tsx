'use client';

import { useEffect, useRef } from 'react';

const BAR_COUNT = 64;

// Pseudo-random heights that look organic — seeded so SSR and client match
function generateBarProfile(): number[] {
  const bars: number[] = [];
  let prev = 0.4;
  for (let i = 0; i < BAR_COUNT; i++) {
    // Weighted random walk that stays between 0.1–1.0
    const delta = (Math.sin(i * 0.4) * 0.35 + Math.cos(i * 0.9) * 0.2 + Math.sin(i * 0.15) * 0.25);
    const next = Math.max(0.1, Math.min(1.0, prev + delta * 0.3));
    bars.push(next);
    prev = next;
  }
  return bars;
}

const PROFILE = generateBarProfile();

export function HeroWaveform() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bars = containerRef.current?.querySelectorAll<HTMLDivElement>('[data-bar]');
    if (!bars) return;

    bars.forEach((bar, i) => {
      const profile = PROFILE[i];
      const min = Math.max(0.15, profile * 0.4);
      const max = profile;
      const duration = 1400 + Math.sin(i * 0.7) * 600;
      const delay = i * 18;

      bar.style.setProperty('--bar-min', String(min));
      bar.style.setProperty('--bar-max', String(max));
      bar.style.animationDuration = `${duration}ms`;
      bar.style.animationDelay = `${delay}ms`;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-end gap-[2px] h-12 px-1"
      aria-hidden="true"
      role="presentation"
    >
      {PROFILE.map((height, i) => {
        // Gradient: muted left/right, amber peaks in the middle third
        const pos = i / (BAR_COUNT - 1);
        const isAmber = pos > 0.3 && pos < 0.7;
        const isHighAmplitude = height > 0.7 && isAmber;

        return (
          <div
            key={i}
            data-bar
            className="flex-1 rounded-full origin-bottom"
            style={{
              height: `${height * 100}%`,
              background: isHighAmplitude
                ? 'rgba(232,181,71,0.85)'
                : isAmber
                ? `rgba(232,181,71,${0.3 + height * 0.4})`
                : `rgba(168,176,188,${0.12 + height * 0.18})`,
              boxShadow: isHighAmplitude
                ? '0 0 6px rgba(232,181,71,0.4)'
                : 'none',
              animation: 'waveform-wave var(--dur, 1.6s) ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />
        );
      })}
    </div>
  );
}
