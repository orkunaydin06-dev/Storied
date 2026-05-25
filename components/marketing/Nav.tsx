'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoriedLogo } from '@/components/ui/StoriedLogo';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-md border-b border-border-subtle/30 py-3' : 'py-6'
      }`}
      style={{ background: scrolled ? 'rgba(9,14,23,0.85)' : 'transparent' }}
    >
      <div className="max-w-md mx-auto px-6 flex items-center justify-between">
        <StoriedLogo />
        <Link
          href="/welcome"
          className="text-sm font-medium text-fg-muted hover:text-fg-primary transition-colors active:scale-95"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
