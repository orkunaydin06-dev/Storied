import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

type FrameworkSlug = 'aristotle' | 'pixar' | 'campbell' | 'cicero' | 'synthesis';

interface Framework {
  slug: FrameworkSlug;
  week: number;
  title: string;
  subtitle: string;
  image: string;
  bgImage: string;
  description: string;
  lessons: { icon: string; title: string; subtitle: string; active?: boolean; locked?: boolean }[];
  cta: string;
  spinSpeed?: string;
}

const FRAMEWORKS: Record<FrameworkSlug, Framework> = {
  aristotle: {
    slug: 'aristotle',
    week: 1,
    title: 'Aristotle: Foundations',
    subtitle: "Structure & Conflict",
    image: '/methodology/aristotle.png',
    bgImage: '/methodology/aristotle.png',
    description: "The logic of story. Before the magic, there is the math. We begin by forming the precise stone archway — structure, conflict, recognition, reversal, emotional release. Aristotle said it 2,300 years ago: every story has a beginning, a middle, and an end. This week, you practice making that true.",
    lessons: [
      { icon: '◈', title: 'The Archway Practice', subtitle: 'Foundational structural logic', active: true },
      { icon: '✦', title: 'Premise & Proof', subtitle: 'Testing the strength of your idea' },
    ],
    cta: 'Start Week 1 Practice',
    spinSpeed: '360s',
  },
  pixar: {
    slug: 'pixar',
    week: 2,
    title: 'Pixar: Emotion',
    subtitle: 'The Modern Skeleton',
    image: '/methodology/pixar.png',
    bgImage: '/methodology/pixar.png',
    description: "Warmer golden tones. Experience character and emotional resonance as figures emerge from a crumbling dust of stories past. Pixar's Story Spine — Once upon a time / Every day / One day / Because of that / Until finally / Ever since then — is the most useful storytelling tool in the world. This week, you make it yours.",
    lessons: [
      { icon: '♡', title: 'Character Essence', subtitle: 'Building empathy and deep connection', active: true },
    ],
    cta: 'Deepen the Emotion',
    spinSpeed: '380s',
  },
  campbell: {
    slug: 'campbell',
    week: 3,
    title: 'Campbell: The Journey',
    subtitle: 'Personal Transformation',
    image: '/methodology/campbell.png',
    bgImage: '/methodology/campbell.png',
    description: "The mystical and esoteric. Step through the portal of cracking golden light. Here we map the universal patterns of transformation that define the human experience. The call. The refusal. The mentor. The threshold. The ordeal. The return. Every great story — and every great life — follows this shape.",
    lessons: [
      { icon: '◉', title: 'The Call to Adventure', subtitle: 'Identifying the catalyst for change', active: true },
      { icon: '◎', title: 'The Shadow Self', subtitle: 'Confronting internal resistance' },
    ],
    cta: 'Embark on the Journey',
    spinSpeed: '400s',
  },
  cicero: {
    slug: 'cicero',
    week: 4,
    title: 'Cicero: Persuasion',
    subtitle: 'Persuasion & Stake',
    image: '/methodology/cicero.png',
    bgImage: '/methodology/cicero.png',
    description: "The art of rhetoric. Learn to pull the golden threads of connection that weave individual concepts into a powerful, persuasive narrative. Inventio, Dispositio, Elocutio, Memoria, Pronuntiatio — the five canons that made Rome. This week, they make your stories land.",
    lessons: [
      { icon: '◆', title: 'The 5 Canons', subtitle: 'Mastering the pillars of persuasion', active: true },
    ],
    cta: 'Master Persuasion',
    spinSpeed: '420s',
  },
  synthesis: {
    slug: 'synthesis',
    week: 5,
    title: 'You: Synthesis',
    subtitle: 'Finding Your Voice',
    image: '/methodology/synthesis.png',
    bgImage: '/methodology/synthesis.png',
    description: "The final realization. Here, the student becomes the storyteller. Connecting your daily work to your potent shadowy avatar through a thread of pure golden energy. You've learned structure, emotion, myth, and persuasion. This week, you forget all of it — and just tell your story.",
    lessons: [
      { icon: '✎', title: 'Finding Your True Voice', subtitle: 'Merging logic, emotion, and myth', active: true },
      { icon: '⚿', title: 'The Final Masterpiece', subtitle: 'Locked until Week 5 completion', locked: true },
    ],
    cta: 'Claim Your Voice',
    spinSpeed: '450s',
  },
};

export async function generateStaticParams() {
  return Object.keys(FRAMEWORKS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fw = FRAMEWORKS[slug as FrameworkSlug];
  if (!fw) return {};
  return { title: `${fw.title} — Storied` };
}

export default async function MethodologyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fw = FRAMEWORKS[slug as FrameworkSlug];
  if (!fw) notFound();

  const allFrameworks = Object.values(FRAMEWORKS);

  return (
    <div className="relative min-h-screen bg-bg-primary text-fg-primary overflow-hidden font-sans">
      {/* Subtle bg texture */}
      <img
        alt=""
        src={fw.bgImage}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-150 blur-sm"
        style={{ opacity: 0.04, mixBlendMode: 'screen' }}
      />

      <div className="relative z-10 px-6 py-12 flex flex-col min-h-screen max-w-md mx-auto">
        {/* Nav */}
        <nav className="flex justify-between items-center mb-8 animate-fade-in">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border-subtle hover:border-accent-warm/30 transition-all"
            style={{ background: 'rgba(19,28,42,0.8)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <Link href="/" className="flex flex-col items-center gap-0.5 group">
            <svg
              className="w-3 h-3 text-accent-warm opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ animation: `spin-logo ${fw.spinSpeed ?? '10s'} linear infinite` }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <path d="M12 12c-2-2.5-4-4-4-6.5a4 4 0 0 1 8 0c0 2.5-2 4-4 6.5" />
              <path d="M12 12c2 2.5 4 4 4 6.5a4 4 0 0 1-8 0c0-2.5 2-4 4-6.5" />
            </svg>
            <span className="text-[10px] font-bold tracking-[0.2em] text-fg-muted uppercase group-hover:text-accent-warm transition-colors">
              Week {fw.week}
            </span>
          </Link>

          <button className="w-10 h-10 flex items-center justify-center hover:bg-bg-secondary/30 rounded-full transition-all">
            <svg className="w-5 h-5 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
            </svg>
          </button>
        </nav>

        {/* Illustration */}
        <div className="relative w-full aspect-square mb-10 group">
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'rgba(217,160,91,0.3)', filter: 'blur(100px)', opacity: 0.4 }}
          />
          <div
            className="relative z-10 w-full h-full rounded-2xl border border-accent-warm/10 overflow-hidden backdrop-blur-[2px] transition-all duration-700 group-hover:scale-[1.03] group-hover:border-accent-warm/30"
            style={{ boxShadow: '0 0 40px rgba(217,160,91,0.1)' }}
          >
            <img
              alt={fw.title}
              src={fw.image}
              className="w-full h-full object-cover"
              style={{ opacity: 0.8, mixBlendMode: 'screen' }}
            />
          </div>
          {fw.slug === 'synthesis' && (
            <div
              className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-px bg-gradient-to-t from-accent-warm to-transparent z-20 pointer-events-none transition-all duration-1000 group-hover:opacity-60"
              style={{ height: '50%', opacity: 0.3 }}
            />
          )}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1 group-hover:w-full transition-all duration-700" style={{ background: 'linear-gradient(to right, transparent, rgba(217,160,91,0.4), transparent)', filter: 'blur(4px)' }} />
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          <h2 className="font-heading text-3xl mb-4 text-fg-primary">{fw.title}</h2>
          <p className="text-fg-muted leading-relaxed mb-8 text-[15px]">{fw.description}</p>
        </div>

        {/* Lessons */}
        <div className="space-y-4 mb-12 animate-fade-in">
          {fw.lessons.map((lesson) => (
            <div
              key={lesson.title}
              className={`rounded-xl p-5 flex items-center gap-4 transition-all duration-300 ${
                lesson.locked
                  ? 'opacity-50 grayscale cursor-not-allowed border border-border-subtle'
                  : 'cursor-pointer hover:border-accent-warm/20 hover:scale-[1.01] active:scale-[0.99] border border-border-subtle'
              } ${fw.slug === 'synthesis' && lesson.active ? 'border-l-2 border-l-accent-warm border border-border-subtle' : ''}`}
              style={{ background: lesson.locked ? 'rgba(30,41,59,0.5)' : 'rgba(19,28,42,0.5)' }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                  lesson.locked
                    ? 'border-border-subtle bg-bg-tertiary'
                    : 'border-accent-warm/20 bg-accent-warm/10 hover:bg-accent-warm/20'
                }`}
              >
                {lesson.locked ? (
                  <svg className="w-5 h-5 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
                  </svg>
                ) : (
                  <span className="text-accent-warm text-lg">{lesson.icon}</span>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${lesson.locked ? 'text-fg-muted' : 'text-fg-primary'} flex items-center gap-2`}>
                  {lesson.title}
                  {lesson.active && !lesson.locked && (
                    <span className="w-1 h-1 rounded-full bg-accent-warm shadow-[0_0_10px_rgba(229,173,79,0.5)] animate-pulse" />
                  )}
                </h4>
                <p className="text-xs text-fg-muted mt-1">{lesson.subtitle}</p>
              </div>
              {!lesson.locked && (
                <svg className="w-4 h-4 text-fg-muted group-hover:text-accent-warm group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/welcome"
          className="mt-auto w-full py-5 rounded-2xl font-bold text-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all animate-fade-in"
          style={{
            background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
            backgroundSize: '200% auto',
            animation: 'shimmer 4s linear infinite',
            boxShadow: '0 15px 40px rgba(217,160,91,0.2)',
          }}
        >
          {fw.cta}
          {fw.slug === 'synthesis' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}>
              <path d="M12.748 3.166a1 1 0 0 0-1.496 0L9.177 5.378A1 1 0 0 1 8.427 5.7H6.05a1 1 0 0 0-.966 1.26L5.8 9.4a1 1 0 0 1-.235.966L3.8 12.134a1 1 0 0 0 0 1.414l1.765 1.765a1 1 0 0 1 .235.966l-.716 2.44a1 1 0 0 0 .966 1.26h2.378a1 1 0 0 1 .75.322l2.075 2.213a1 1 0 0 0 1.496 0l2.075-2.213a1 1 0 0 1 .75-.322h2.378a1 1 0 0 0 .966-1.26l-.716-2.44a1 1 0 0 1 .235-.966l1.765-1.765a1 1 0 0 0 0-1.414l-1.765-1.765a1 1 0 0 1-.235-.966l.716-2.44A1 1 0 0 0 17.95 5.7h-2.378a1 1 0 0 1-.75-.322L12.748 3.166z"/>
            </svg>
          )}
        </Link>

        {/* Other frameworks */}
        <div className="mt-12 pt-8 border-t border-border-subtle/50">
          <p className="text-[10px] font-bold tracking-[0.3em] text-fg-muted uppercase mb-4">Other Frameworks</p>
          <div className="flex flex-wrap gap-2">
            {allFrameworks.filter(f => f.slug !== fw.slug).map(f => (
              <Link
                key={f.slug}
                href={`/methodology/${f.slug}`}
                className="px-3 py-1.5 rounded-full border border-border-subtle text-xs text-fg-muted hover:border-accent-warm/30 hover:text-accent-warm transition-all"
              >
                Week {f.week}: {f.subtitle}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
