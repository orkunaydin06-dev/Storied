'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/welcome');
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-bg-primary/80 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 bottom-0 w-72 bg-bg-secondary border-l border-border-subtle z-50 flex flex-col p-8 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="self-end text-fg-muted hover:text-fg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border-active rounded"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <nav className="mt-8 flex flex-col gap-1">
          <NavLink href="/dashboard" onClick={onClose}>{"Today's practice"}</NavLink>
          <NavLink href="/archive" onClick={onClose}>Archive</NavLink>
          <NavLink href="/settings" onClick={onClose}>Settings</NavLink>
        </nav>

        <div className="mt-8 pt-8 border-t border-border-subtle flex flex-col gap-1">
          <NavLink href="/methodology" onClick={onClose}>Methodology</NavLink>
          <NavLink href="/privacy" onClick={onClose}>Privacy</NavLink>
          <a
            href="mailto:hello@storied.app"
            className="font-sans text-base text-fg-muted hover:text-fg-primary transition-colors duration-200 py-2"
            onClick={onClose}
          >
            Contact
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-border-subtle">
          <button
            onClick={handleSignOut}
            className="font-sans text-base text-fg-subtle hover:text-fg-muted transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="font-sans text-base text-fg-primary hover:text-accent-warm transition-colors duration-200 py-2"
    >
      {children}
    </Link>
  );
}
