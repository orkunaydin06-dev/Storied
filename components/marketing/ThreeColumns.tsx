'use client';

import { useEffect, useRef } from 'react';

const columns = [
  {
    label: 'From Theory to Practice',
    headline: "You've read the books.\nNow do the work.",
    body: "You've highlighted Story by McKee. You've watched the Aaron Sorkin MasterClass. You know about Aristotle's three acts, Pixar's story spine, Joseph Campbell's hero's journey.\n\nBut knowing is not the same as doing.\n\nStoried is where you stop reading about storytelling and start practicing it — with your own stories, every day, for thirty days. The frameworks aren't new. Doing them, every day, is.",
  },
  {
    label: 'A Progression, Not a Course',
    headline: 'Five frameworks.\nThirty days.\nOne transformation.',
    body: "Week 1: Aristotle teaches you structure and conflict.\nWeek 2: Pixar teaches you the modern skeleton.\nWeek 3: Joseph Campbell teaches you personal transformation.\nWeek 4: Cicero teaches you persuasion and impact.\nWeek 5: You synthesize all of it into your own voice.\n\nThis is not a random collection of tips. It is a progression — each week building on the last.",
  },
  {
    label: 'Your Stories, Your Voice',
    headline: 'Every recording\nis yours alone.',
    body: "Storied isn't about becoming a better speaker in general. It's about becoming a better teller of your specific stories — the failed startup, the dinner conversation, the pitch you blew, the moment that changed you.\n\nYour recordings live in a private archive only you can access. Never shared. Never used to train AI. Never analyzed for marketing.",
  },
];

export function ThreeColumns() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const children = el.querySelectorAll<HTMLDivElement>('[data-col]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.remove('reveal-hidden');
                child.classList.add('reveal-visible');
              }, i * 120);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
        {columns.map((col) => (
          <div key={col.label} data-col className="reveal-hidden">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-5">
              {col.label}
            </p>
            <h3 className="font-serif text-2xl text-fg-primary leading-snug mb-6 whitespace-pre-line">
              {col.headline}
            </h3>
            <p className="font-sans text-sm text-fg-muted leading-relaxed whitespace-pre-line">
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
