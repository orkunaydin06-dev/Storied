import Link from 'next/link';
import { PhilosopherIcon } from './PhilosopherIcons';

type PhilosopherType = 'aristotle' | 'pixar' | 'campbell' | 'cicero' | 'synthesis';

const weeks: { week: number; master: string; theme: string; days: string; icon: PhilosopherType }[] = [
  {
    week: 1,
    master: 'Aristotle',
    theme: 'Structure\n& Conflict',
    days: 'Days 1–6',
    icon: 'aristotle',
  },
  {
    week: 2,
    master: 'Pixar',
    theme: 'The Modern\nSkeleton',
    days: 'Days 7–12',
    icon: 'pixar',
  },
  {
    week: 3,
    master: 'Joseph Campbell',
    theme: 'Personal\nTransformation',
    days: 'Days 13–18',
    icon: 'campbell',
  },
  {
    week: 4,
    master: 'Cicero',
    theme: 'Persuasion\n& Impact',
    days: 'Days 19–24',
    icon: 'cicero',
  },
  {
    week: 5,
    master: 'You',
    theme: 'Voice\nSynthesized',
    days: 'Days 25–30',
    icon: 'synthesis',
  },
];

export function MethodologyTimeline() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-border-subtle">
      <h2 className="font-serif text-3xl md:text-4xl text-fg-primary text-center mb-4">
        Five weeks. Five masters. One voice.
      </h2>
      <p className="font-sans text-sm text-fg-muted text-center mb-16 max-w-xl mx-auto leading-relaxed">
        Not a course. Not a list of tips. A craft progression — each week built
        on the last.
      </p>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:grid grid-cols-5 gap-4 mb-16">
        {weeks.map((week, i) => (
          <div key={week.week} className="text-center relative group">
            {/* Connector line */}
            {i < weeks.length - 1 && (
              <div className="absolute top-6 left-1/2 w-full h-px bg-border-subtle" />
            )}

            {/* Icon node */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-bg-secondary border border-border-visible mx-auto mb-4 flex items-center justify-center transition-all duration-300 group-hover:border-accent-warm/50 group-hover:shadow-[0_0_16px_rgba(232,181,71,0.12)]">
              <PhilosopherIcon
                type={week.icon}
                className="w-6 h-6 text-fg-subtle group-hover:text-accent-warm transition-colors duration-300"
              />
            </div>

            <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-2">
              Week {week.week}
            </p>
            <p className="font-serif text-lg text-fg-primary mb-1">
              {week.master}
            </p>
            <p className="font-sans text-xs text-fg-muted leading-relaxed whitespace-pre-line">
              {week.theme}
            </p>
            <p className="font-mono text-xs text-fg-subtle mt-2">{week.days}</p>
          </div>
        ))}
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden space-y-0 mb-16">
        {weeks.map((week) => (
          <div
            key={week.week}
            className="flex items-start gap-5 py-5 border-b border-border-subtle last:border-0 group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-secondary border border-border-visible flex items-center justify-center mt-0.5 transition-all duration-300 group-hover:border-accent-warm/40">
              <PhilosopherIcon
                type={week.icon}
                className="w-5 h-5 text-fg-subtle group-hover:text-accent-warm transition-colors duration-300"
              />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-1">
                Week {week.week} — {week.days}
              </p>
              <p className="font-serif text-lg text-fg-primary">{week.master}</p>
              <p className="font-sans text-xs text-fg-muted mt-1 whitespace-pre-line">
                {week.theme}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="ink-divider mb-8" />
        <Link
          href="/methodology"
          className="font-sans text-sm text-fg-muted underline underline-offset-4 hover:text-fg-primary transition-colors duration-200"
        >
          Read the full methodology
        </Link>
      </div>
    </section>
  );
}
