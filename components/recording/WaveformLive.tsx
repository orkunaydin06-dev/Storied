'use client';

interface WaveformLiveProps {
  peaks: number[];
  className?: string;
}

export function WaveformLive({ peaks, className = '' }: WaveformLiveProps) {
  const displayPeaks = peaks.length > 0 ? peaks : Array(40).fill(0.05);

  return (
    <div
      className={`flex items-center justify-center gap-[2px] h-16 w-full max-w-md mx-auto ${className}`}
      aria-hidden="true"
    >
      {displayPeaks.map((peak, i) => (
        <div
          key={i}
          className="w-1 bg-accent-warm rounded-full transition-all duration-100"
          style={{
            height: `${Math.max(4, peak * 64)}px`,
            opacity: 0.4 + peak * 0.6,
          }}
        />
      ))}
    </div>
  );
}
