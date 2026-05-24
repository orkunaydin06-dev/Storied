'use client';

export function BreathingDot() {
  return (
    <div
      className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-accent-warm animate-breathe shadow-glow-amber flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-accent-warm-hover opacity-60" />
    </div>
  );
}
