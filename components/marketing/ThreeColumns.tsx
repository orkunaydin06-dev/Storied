'use client';

import { useEffect, useRef } from 'react';

const columns = [
  {
    label: 'The method',
    body: 'Five frameworks. Aristotle. Pixar. Campbell. Cicero. Synthesis.',
  },
  {
    label: 'The practice',
    body: 'Record. Hear feedback. Revise. Record again. Hear the difference.',
  },
  {
    label: 'The instinct',
    body: 'After 30 days you stop thinking about structure. You just tell stories that land.',
  },
];

export function ThreeColumns() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const children = el.querySelectorAll<HTMLDivElement>('[data-col]');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.remove('reveal-hidden');
            child.classList.add('reveal-visible');
          }, i * 100);
        });
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-md mx-auto px-6 py-10">
      <h3 className="font-heading text-3xl text-center mb-8 text-fg-primary">
        What you build over 30 days
      </h3>
      <div className="grid grid-cols-1 gap-8">
        {columns.map((col) => (
          <div key={col.label} data-col className="reveal-hidden space-y-2">
            <h4 className="text-accent-warm font-bold tracking-widest text-xs uppercase">
              {col.label}
            </h4>
            <p className="text-fg-muted text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
