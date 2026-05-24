import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'The Storied Methodology — Five weeks, five masters, one voice.',
  description:
    'A craft progression built on 2,300 years of storytelling wisdom — Aristotle, Pixar, Campbell, Cicero — applied through daily voice practice.',
};

const weeks = [
  {
    week: 1,
    days: 'Days 1–6',
    master: "Aristotle's Poetics",
    theme: 'Structure & Conflict',
    narrative: `Every story rests on structure and conflict. Without these foundations, no later technique can stick. Week 1 builds the skeleton. You learn beginning-middle-end, anagnorisis (the moment of recognition), peripeteia (the turn). Two thousand three hundred years of foundation.

Aristotle did not teach storytelling as an art form to be admired. He observed what made stories work — the mechanics beneath every tale that lands, every speech that moves, every narrative that stays in the mind after the room goes quiet.

The three-part structure is not a formula. It is a description of how human attention works. Begin in the ordinary. Break it. Show us what the break costs. That is Aristotle. That is Day 1.`,
    sampleQuestion:
      'Tell me about the most ordinary day in your life that turned into something unforgettable.',
  },
  {
    week: 2,
    days: 'Days 7–12',
    master: "Pixar's Story Spine",
    theme: 'The Modern Skeleton',
    narrative: `Once you understand classical structure, you can see how Pixar made it modern. The Story Spine — "Once upon a time… Every day… One day… Because of that…" — is Aristotle, distilled into six beats anyone can use today.

Week 2 gives you a tool you can apply in any context: emails, pitches, calls, dinners. The Story Spine is not a formula either. It is a way of thinking about causation — what followed from what, and why that matters to the listener.

By the end of Week 2, you have two things: the classical skeleton and the modern tool. They are the same thing, seen from different centuries.`,
    sampleQuestion:
      'Tell me about a time when one small decision sent your life in an unexpected direction.',
  },
  {
    week: 3,
    days: 'Days 13–18',
    master: "Joseph Campbell's Hero's Journey",
    theme: 'Personal Transformation',
    narrative: `By week three, you are ready to turn the lens inward. Your own life is the material. The Hero's Journey shows you how to find the mythic shape inside your own experiences — the call, the refusal, the mentor, the threshold, the ordeal, the return.

This is where your stories become yours, not formula. Campbell spent decades studying myths from every culture and found the same shape everywhere. That shape is not coincidence. It is the shape of what it means to be changed by experience.

You have been through ordeals. You have crossed thresholds. Week 3 is where you learn to name them — and tell others what they mean.`,
    sampleQuestion:
      'Tell me about a time you crossed a threshold you could not uncross.',
  },
  {
    week: 4,
    days: 'Days 19–24',
    master: "Cicero's Rhetoric",
    theme: 'Persuasion & Impact',
    narrative: `By week four, you have stories — and you are ready to learn how to make them land. Rhetoric is the art of being heard. Cicero perfected it 2,000 years ago. Inventio (find the argument). Dispositio (arrange it). Elocutio (style it). Memoria (internalize it). Actio (deliver it). Movere (move the audience).

The methods that built Western persuasion — that shaped every courtroom, every parliament, every keynote — were not invented for politicians. They were invented for anyone who needed to be understood by people who had not yet decided to listen.

Week 4 teaches you to earn the room before you ask it of them.`,
    sampleQuestion:
      'Tell me about a time you had to convince someone of something they did not want to believe.',
  },
  {
    week: 5,
    days: 'Days 25–30',
    master: 'Storied Synthesis',
    theme: 'Finding Your Voice',
    narrative: `In the final week, you stop following anyone else's framework. You take what you have learned and find your own voice. This is what separates a storyteller from a story-teller-by-formula. The greatest writers and speakers throughout history did not follow rules — they internalized them, then transcended them.

Week 5 is yours. You bring your own stories, your own structures, your own rhythm. The AI still gives feedback, but now it is listening for something different: coherence. Does this sound like you? Does it sound like the person who started on Day 1, but clearer?

By Day 30, you do not sound like a Pixar imitator or a Cicero pastiche. You sound like you, but sharper.`,
    sampleQuestion:
      'Tell me the story you would tell if you knew no one would judge you for it.',
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Nav />

      <main className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href="/"
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200 mb-16 inline-block"
          >
            ← Back to home
          </Link>

          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-6">
            The Storied Progression
          </p>

          <h1 className="font-serif text-4xl md:text-5xl text-fg-primary leading-tight mb-8">
            A craft progression — five weeks, five masters, one voice.
          </h1>

          <p className="font-sans text-base text-fg-muted leading-relaxed mb-16">
            Storied is not 30 random questions. It is a deliberate progression —
            five weeks, five methodologies, designed in a specific order that
            compounds. Each week builds on the last. By Day 30, you do not sound
            like a student of anyone. You sound like yourself, but clearer.
          </p>

          <div className="space-y-20">
            {weeks.map((week) => (
              <section
                key={week.week}
                className="border-t border-border-subtle pt-12"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                    Week {week.week} — {week.days}
                  </p>
                  <p className="font-mono text-xs text-fg-subtle">
                    {week.theme}
                  </p>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl text-fg-primary mb-8">
                  {week.master}
                </h2>

                <div className="prose-storied font-sans text-fg-muted leading-relaxed space-y-4">
                  {week.narrative.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="mt-10 bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
                    Sample question from this week
                  </p>
                  <p className="font-serif text-lg text-fg-primary leading-relaxed italic">
                    &ldquo;{week.sampleQuestion}&rdquo;
                  </p>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-24 pt-12 border-t border-border-subtle text-center">
            <p className="font-sans text-sm text-fg-muted mb-8">
              This is not an arbitrary syllabus. It is the same progression used
              {"in the world's best writing programs — distilled into thirty days"}
              of voice practice.
            </p>
            <a
              href="/api/stripe-checkout"
              className="inline-flex items-center justify-center bg-accent-warm text-bg-primary font-sans font-medium px-8 py-4 rounded-lg hover:bg-accent-warm-hover transition-all duration-300 hover:shadow-glow-amber min-h-[44px]"
            >
              Begin your practice — $29
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
