'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from '@/components/shared/Menu';
import { StoriedLogoSmall } from '@/components/ui/StoriedLogo';
import { ParticleBg } from '@/components/ui/ParticleBg';

function isInPracticeFlow(pathname: string) {
  return /\/daily\/\d+\/(question|teaching|record-1|processing|feedback|revise|record-2|compare|closure)/.test(pathname);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const inPractice = isInPracticeFlow(pathname);

  return (
    <div className="relative min-h-screen bg-bg-primary text-fg-primary overflow-x-hidden">
      <ParticleBg opacity={0.10} speed={400} />
      <div className="relative z-10">
      {inPractice ? (
        <header className="flex items-center justify-between px-6 py-4">
          <StoriedLogoSmall href="/dashboard" />
          <Link href="/dashboard" className="text-xs text-fg-muted hover:text-fg-primary transition-colors tracking-wide">
            Exit practice
          </Link>
        </header>
      ) : (
        <header className="flex items-center justify-between px-6 py-5">
          <StoriedLogoSmall href="/dashboard" />
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-fg-muted hover:text-fg-primary hover:border-accent-warm/30 transition-all"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>
      )}

      <main id="main-content">{children}</main>

      {!inPractice && (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border-subtle px-4 py-3 md:hidden z-40 backdrop-blur-md" style={{ background: 'rgba(9,14,23,0.85)' }}>
          <div className="flex justify-around items-center max-w-md mx-auto">
            <BottomNavLink href="/dashboard" label="Today" pathname={pathname} />
            <BottomNavLink href="/archive" label="Archive" pathname={pathname} />
            <BottomNavLink href="/settings" label="Settings" pathname={pathname} />
          </div>
        </nav>
      )}

      {!inPractice && <div className="h-16 md:hidden" aria-hidden="true" />}

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
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
