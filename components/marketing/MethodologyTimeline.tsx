import Link from 'next/link';

const weeks = [
  { week: 1, title: "Aristotle's Poetics", subtitle: 'Structure & Conflict', href: '/methodology/aristotle' },
  { week: 2, title: "Pixar's Story Spine", subtitle: 'The Modern Skeleton', href: '/methodology/pixar' },
  { week: 3, title: "Hero's Journey", subtitle: 'Personal Transformation', href: '/methodology/campbell' },
  { week: 4, title: "Cicero's Rhetoric", subtitle: 'Persuasion & Stake', href: '/methodology/cicero' },
  { week: 5, title: 'Synthesis', subtitle: 'Finding Your Voice', href: '/methodology/synthesis' },
];

export function MethodologyTimeline() {
  return (
    <section className="max-w-md mx-auto px-6 py-12">
      <div className="space-y-2 text-center mb-8">
        <span className="text-[10px] font-bold tracking-[0.4em] text-fg-muted uppercase">
          The Curriculum
        </span>
        <h3 className="font-heading text-3xl text-fg-primary">
          Five weeks.<br />Five frameworks.
        </h3>
      </div>

      <div className="space-y-3">
        {weeks.map((w) => (
          <Link
            key={w.week}
            href={w.href}
            className="block p-6 rounded-2xl border border-border-subtle hover:border-accent-warm/30 hover:bg-bg-secondary/60 transition-all group"
            style={{ background: 'rgba(19,28,42,0.4)' }}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-accent-warm uppercase mb-1 block">
              Week {w.week}
            </span>
            <h4 className="font-medium text-lg text-fg-muted group-hover:text-fg-primary transition-colors">
              {w.title} — {w.subtitle}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
