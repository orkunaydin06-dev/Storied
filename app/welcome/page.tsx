'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ParticleBg } from '@/components/ui/ParticleBg';

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
    async function grantBetaAndRedirect(session: { user: { id: string } } | null) {
      if (!session) return;
      await fetch('/api/beta-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'STORIED_BETA' }),
      }).catch(() => {});
      router.push('/begin');
    }

    const code = searchParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async ({ data, error }) => {
        if (data.session) {
          await grantBetaAndRedirect(data.session);
        } else if (error) {
          setError('This link expired or was opened in a different browser. Request a new one below.');
          window.history.replaceState({}, '', '/welcome');
        }
      });
      return;
    }

    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(async ({ data: { session } }) => { await grantBetaAndRedirect(session); });
        return;
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/begin');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/begin');
    });
    return () => subscription.unsubscribe();
  }, [searchParams, supabase, router]);

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
        queryParams: { prompt: 'select_account' },
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
      options: { emailRedirectTo: `${window.location.origin}/welcome` },
    });
    if (error) {
      setError(error.message ?? 'Something went wrong. Try again.');
      setLoading(false);
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-bg-primary text-fg-primary overflow-hidden flex flex-col items-center justify-center px-8 text-center">
      <ParticleBg opacity={0.15} speed={300} />

      <div className="relative z-10 w-full max-w-sm space-y-12 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-accent-warm/20 blur-xl rounded-full" />
            <div className="relative w-full h-full border border-accent-warm/30 rounded-full flex items-center justify-center backdrop-blur-md">
              <svg
                className="w-8 h-8 text-accent-warm"
                style={{ animation: 'spin-logo 20s linear infinite' }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              >
                <path d="M12 12c-2-2.5-4-4-4-6.5a4 4 0 0 1 8 0c0 2.5-2 4-4 6.5" />
                <path d="M12 12c2 2.5 4 4 4 6.5a4 4 0 0 1-8 0c0-2.5 2-4 4-6.5" />
              </svg>
            </div>
          </div>
          <h1 className="font-heading text-4xl">Welcome.</h1>
        </div>

        {emailSent ? (
          <div className="space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-accent-warm/10 border border-accent-warm/20 rounded-full flex items-center justify-center mx-auto" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}>
              <svg className="w-7 h-7 text-accent-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl">Check your inbox.</h2>
              <p className="text-fg-muted leading-relaxed text-sm">
                A sign-in link is on its way to<br />
                <span className="text-fg-primary font-medium">{email}</span>.<br />
                It expires in 15 minutes.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full bg-bg-secondary/40 border border-border-subtle py-4 rounded-2xl font-medium hover:bg-bg-secondary hover:border-accent-warm/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 px-2 py-2">
              <div className="h-px bg-border-subtle flex-1" />
              <span className="text-[10px] font-bold tracking-widest text-fg-muted uppercase">or</span>
              <div className="h-px bg-border-subtle flex-1" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3 text-left">
              <label className="text-[10px] font-bold tracking-widest text-fg-muted uppercase px-1 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-bg-secondary/40 border border-border-subtle p-4 rounded-2xl focus:border-accent-warm/50 focus:ring-1 focus:ring-accent-warm/20 outline-none transition-all text-fg-primary placeholder:text-fg-subtle"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl font-bold text-black disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                  boxShadow: '0 15px 40px rgba(217,160,91,0.2)',
                }}
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>

            {error && (
              <p className="text-sm text-error text-center">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border border-accent-warm/30 rounded-full animate-pulse" />
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
