'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onScroll() {
      const halfPage = document.body.scrollHeight * 0.5;
      setVisible(window.scrollY > halfPage);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe-checkout', { method: 'POST' });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed bottom-5 right-5 md:hidden z-30 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Button
        size="sm"
        onClick={handleCheckout}
        disabled={loading}
        style={{
          boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 24px rgba(232,181,71,0.2)',
        }}
      >
        {loading ? '...' : 'Begin — $29'}
      </Button>
    </div>
  );
}
