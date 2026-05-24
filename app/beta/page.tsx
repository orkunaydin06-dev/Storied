'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function BetaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code') ?? '';
  const [status, setStatus] = useState<'checking' | 'activating' | 'done' | 'needsLogin' | 'error'>('checking');

  useEffect(() => {
    async function activate() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Save code to sessionStorage, redirect to welcome
        sessionStorage.setItem('beta_code', code);
        router.push(`/welcome`);
        return;
      }

      setStatus('activating');
      const res = await fetch('/api/beta-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        setStatus('done');
        setTimeout(() => router.push('/begin'), 1200);
      } else {
        setStatus('error');
      }
    }

    activate();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 text-center">
      {status === 'checking' || status === 'activating' ? (
        <p className="font-serif text-2xl text-fg-primary animate-fade-in">Activating access...</p>
      ) : status === 'done' ? (
        <>
          <p className="font-serif text-2xl text-fg-primary mb-2 animate-fade-in">You&apos;re in.</p>
          <p className="font-sans text-sm text-fg-muted animate-fade-in">Taking you to the beginning...</p>
        </>
      ) : status === 'needsLogin' ? (
        <p className="font-serif text-xl text-fg-primary animate-fade-in">Redirecting to sign in...</p>
      ) : (
        <p className="font-serif text-xl text-error animate-fade-in">Invalid beta code.</p>
      )}
    </div>
  );
}

export default function BetaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="font-sans text-sm text-fg-subtle">Loading...</p>
      </div>
    }>
      <BetaContent />
    </Suspense>
  );
}
