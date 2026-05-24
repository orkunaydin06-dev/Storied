'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function WelcomeContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Parse hash token from URL (implicit flow from admin-generated links)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ data: { session } }) => {
            if (session) router.push('/begin');
          });
        return;
      }
    }
    // Check existing cookie session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/begin');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/begin');
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // Poll for session after magic link — catches cross-tab sign-ins
  useEffect(() => {
    if (!emailSent) return;
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/begin');
    }, 2000);
    return () => clearInterval(interval);
  }, [emailSent, supabase, router]);

  async function handleGoogle() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback${sessionId ? `?session_id=${sessionId}` : ''}`,
      },
    });
    if (error) {
      setError('Google sign-in did not complete. Try again or use magic link.');
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback${sessionId ? `?session_id=${sessionId}` : ''}`,
      },
    });

    if (error) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-4xl text-fg-primary mb-3 text-center">
          Welcome.
        </h1>
        <p className="font-sans text-base text-fg-muted text-center mb-12">
          Your practice begins now.
        </p>

        {emailSent ? (
          <div className="text-center">
            <p className="font-sans text-base text-fg-primary mb-3">
              Check your inbox.
            </p>
            <p className="font-sans text-sm text-fg-muted">
              A sign-in link is on its way to {email}. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full"
            >
              Continue with Google
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="font-sans text-xs text-fg-subtle">or</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                disabled={loading}
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </Button>
            </form>

            {error && (
              <p className="font-sans text-sm text-error text-center">{error}</p>
            )}

            <p className="font-sans text-xs text-fg-subtle text-center mt-6">
              We just need to set up your account. One step.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <p className="font-sans text-sm text-fg-subtle">Loading...</p>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
