'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > document.body.scrollHeight * 0.5);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 md:hidden z-30 transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', pointerEvents: visible ? 'auto' : 'none' }}
    >
      <Link
        href="/welcome"
        className="inline-flex px-5 py-3 rounded-xl font-bold text-sm text-black"
        style={{
          background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
          backgroundSize: '200% auto',
          animation: 'shimmer 3s linear infinite',
          boxShadow: '0 8px 24px rgba(217,160,91,0.3)',
        }}
      >
        Begin — $29
      </Link>
    </div>
  );
}
