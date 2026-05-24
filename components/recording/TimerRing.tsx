'use client';

interface TimerRingProps {
  progress: number;
  isOverTarget: boolean;
  size?: number;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ progress, isOverTarget, size = 120 }: TimerRingProps) {
  const offset = CIRCUMFERENCE * (1 - Math.min(progress, 1));

  return (
    <svg
      width={size}
      height={size}
      className="rotate-[-90deg]"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--color-border-subtle)"
        strokeWidth="4"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={RADIUS}
        fill="none"
        stroke={isOverTarget ? 'var(--color-warning)' : 'var(--color-accent-warm)'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 100ms linear, stroke 300ms ease' }}
      />
    </svg>
  );
}
