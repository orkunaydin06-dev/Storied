'use client';

import { useEffect, useRef } from 'react';

const audience = [
  'For founders pitching investors.',
  'For product managers explaining vision.',
  'For consultants closing clients.',
  'For writers building voice.',
  'For leaders who need to move a room.',
  'For lawyers who need to move a jury.',
  'For anyone with stories worth telling well.',
];

export function WhoIsThisFor() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLLIElement>('[data-item]');
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => {
                item.classList.remove('reveal-hidden');
                item.classList.add('reveal-visible');
              }, i * 80);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="max-w-2xl mx-auto px-4 py-16 md:py-24 border-t border-border-subtle">
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4 text-center">
        Who is this for
      </p>
      <div className="ink-divider mb-12" />

      <ul ref={listRef} className="space-y-4">
        {audience.map((line) => (
          <li
            key={line}
            data-item
            className="font-serif text-xl md:text-2xl text-fg-primary leading-snug reveal-hidden"
          >
            {line}
          </li>
        ))}
      </ul>

      <p className="font-sans text-sm text-fg-muted mt-12 leading-relaxed">
        Storied is not built for beginners. It is built for thinkers who have
        outgrown silence.
      </p>
    </section>
  );
}
