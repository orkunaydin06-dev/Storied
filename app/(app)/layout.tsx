'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from '@/components/shared/Menu';
import { Menu as MenuIcon } from 'lucide-react';

function isInPracticeFlow(pathname: string) {
  return /\/daily\/\d+\/(question|teaching|record-1|processing|feedback|revise|record-2|compare|closure)/.test(pathname);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const inPractice = isInPracticeFlow(pathname);

  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary">
      {inPractice ? (
        /* Minimal practice header — just an exit link */
        <header className="flex items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/dashboard"
            className="font-serif text-base text-fg-subtle hover:text-fg-primary transition-colors duration-200"
          >
            Storied
          </Link>
          <Link
            href="/dashboard"
            className="font-sans text-xs text-fg-subtle hover:text-fg-muted transition-colors duration-200 tracking-wide"
          >
            Exit practice
          </Link>
        </header>
      ) : (
        <header className="flex items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/dashboard"
            className="font-serif text-lg text-fg-primary hover:text-accent-warm active:opacity-60 transition-all duration-200 -mx-2 px-2 py-2"
          >
            Storied
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 text-fg-muted hover:text-fg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border-active rounded px-1 py-1"
            aria-label="Open menu"
          >
            <MenuIcon className="w-5 h-5" />
            <span className="font-sans text-sm hidden md:inline">Menu</span>
          </button>
        </header>
      )}

      <main id="main-content">{children}</main>

      {/* Bottom nav — mobile only, hidden during practice */}
      {!inPractice && (
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle px-4 py-3 md:hidden z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <BottomNavLink href="/dashboard" label="Today" pathname={pathname} />
            <BottomNavLink href="/archive" label="Archive" pathname={pathname} />
            <BottomNavLink href="/settings" label="Settings" pathname={pathname} />
          </div>
        </nav>
      )}

      {/* Bottom nav spacer on mobile */}
      {!inPractice && <div className="h-16 md:hidden" aria-hidden="true" />}

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function BottomNavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`font-sans text-sm transition-colors duration-200 px-4 py-2 ${
        active ? 'text-accent-warm' : 'text-fg-muted hover:text-fg-primary'
      }`}
    >
      {label}
    </Link>
  );
}
