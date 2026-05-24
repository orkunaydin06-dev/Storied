'use client';

import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface WaveformStaticProps {
  peaks: number[];
  audioUrl: string;
  label?: string;
  durationSeconds?: number;
  className?: string;
}

export function WaveformStatic({
  peaks,
  audioUrl,
  label,
  durationSeconds,
  className = '',
}: WaveformStaticProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const displayPeaks = peaks.length > 0 ? peaks : Array(40).fill(0.3);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
  }

  function handleEnded() {
    setIsPlaying(false);
    setProgress(0);
  }

  const formattedDuration = durationSeconds
    ? `${Math.round(durationSeconds)}s`
    : '';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border-visible text-fg-muted hover:text-fg-primary hover:border-fg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border-active focus:ring-offset-2 focus:ring-offset-bg-primary"
        aria-label={isPlaying ? 'Pause recording' : 'Play recording'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        {label && (
          <p className="font-mono text-xs text-fg-subtle uppercase tracking-wider mb-1">
            {label}
            {formattedDuration && (
              <span className="ml-2 normal-case">{formattedDuration}</span>
            )}
          </p>
        )}
        <div className="flex items-center gap-[2px] h-10" aria-hidden="true">
          {displayPeaks.map((peak, i) => {
            const filled = i / displayPeaks.length <= progress;
            return (
              <div
                key={i}
                className="w-1 rounded-full transition-colors duration-300"
                style={{
                  height: `${Math.max(4, peak * 40)}px`,
                  backgroundColor: filled
                    ? 'var(--color-accent-warm)'
                    : 'var(--color-border-visible)',
                }}
              />
            );
          })}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
}
