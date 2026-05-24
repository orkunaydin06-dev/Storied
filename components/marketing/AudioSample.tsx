'use client';

import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

function AudioPlayer({
  label,
  src,
}: {
  label: string;
  src: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [exists, setExists] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }

  if (!exists) {
    return (
      <div className="flex items-center gap-4 py-5">
        <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border-visible flex items-center justify-center opacity-40">
          <Play className="w-4 h-4 text-fg-subtle ml-0.5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
            {label}
          </p>
          <p className="font-sans text-xs text-fg-subtle mt-0.5">
            Sample coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-5 group">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setPlaying(false)}
        onError={() => setExists(false)}
      />
      <button
        onClick={toggle}
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-border-active ${
          playing
            ? 'bg-accent-warm/10 border-accent-warm shadow-[0_0_16px_rgba(232,181,71,0.2)]'
            : 'bg-bg-tertiary border-border-visible hover:border-accent-warm/60 hover:shadow-[0_0_12px_rgba(232,181,71,0.15)]'
        }`}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      >
        {playing ? (
          <Pause className="w-4 h-4 text-accent-warm" aria-hidden="true" />
        ) : (
          <Play className="w-4 h-4 text-fg-muted ml-0.5 group-hover:text-accent-warm transition-colors duration-200" aria-hidden="true" />
        )}
      </button>
      <div className="flex-1">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
          {label}
        </p>
        <p className="font-sans text-xs text-fg-subtle mt-0.5">
          {playing ? (
            <span className="text-accent-warm/80">Playing...</span>
          ) : (
            'Tap to listen'
          )}
        </p>
      </div>

      {/* Waveform pulse on playing */}
      {playing && (
        <div className="flex items-end gap-[3px] h-5" aria-hidden="true">
          {[0.5, 1, 0.7, 0.9, 0.4, 0.8, 0.6].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-accent-warm/70 origin-bottom"
              style={{
                height: `${h * 100}%`,
                animation: `waveform-wave ${800 + i * 100}ms ease-in-out infinite alternate`,
                animationDelay: `${i * 80}ms`,
                '--bar-min': String(h * 0.3),
                '--bar-max': String(h),
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AudioSample() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-16 md:py-24">
      <div className="border-t border-border-subtle pt-16">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle text-center mb-12">
          A 30-second sample
        </p>

        <div
          className="relative rounded-2xl p-8 md:p-10 border border-border-subtle overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(28,49,72,0.9) 0%, rgba(20,37,54,0.95) 100%)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(100,160,220,0.06)',
          }}
        >
          {/* Moon glow accent */}
          <div
            className="absolute -top-8 -right-8 w-40 h-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(100,160,220,0.08) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            aria-hidden="true"
          />

          <div className="relative divide-y divide-border-subtle/50">
            <AudioPlayer
              label="Day 1"
              src="/audio-samples/day-1-sample.webm"
            />
            <AudioPlayer
              label="Day 30"
              src="/audio-samples/day-30-sample.webm"
            />
          </div>

          <p className="relative font-serif text-sm text-fg-subtle text-center mt-8 italic">
            Same person. 30 practices apart.
          </p>
        </div>
      </div>
    </section>
  );
}
