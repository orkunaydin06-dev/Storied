'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg-primary/85 backdrop-blur-md border-b border-border-subtle/30 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group -ml-1 px-1"
          aria-label="Storied home"
        >
          <span
            className="w-7 h-7 text-accent-warm animate-logo-breathe group-hover:[animation-play-state:paused] transition-all duration-300"
            style={{ filter: 'drop-shadow(0 0 6px rgba(232,181,71,0.25))' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className="w-full h-full" />
          </span>
          <span className="font-serif text-lg text-fg-primary tracking-tight group-hover:text-accent-warm transition-colors duration-300">
            Storied
          </span>
        </Link>

        <Link
          href="/welcome"
          className="font-sans text-sm text-fg-muted hover:text-fg-primary transition-colors duration-200"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
