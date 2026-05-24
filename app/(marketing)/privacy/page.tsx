import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Storied',
  description: 'How Storied handles your data and recordings.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Nav />

      <main className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href="/"
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200 mb-16 inline-block"
          >
            ← Back to home
          </Link>

          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-6">
            Privacy Policy
          </p>

          <h1 className="font-serif text-4xl text-fg-primary mb-4">
            Your recordings are yours.
          </h1>

          <p className="font-sans text-base text-fg-muted mb-16 leading-relaxed">
            Storied is built on a simple principle: your voice is private. Here
            is exactly what we do and do not do with your data.
          </p>

          <div className="space-y-12">
            <section className="border-t border-border-subtle pt-10">
              <h2 className="font-serif text-xl text-fg-primary mb-4">
                Audio recordings
              </h2>
              <div className="space-y-3 font-sans text-sm text-fg-muted leading-relaxed">
                <p>
                  Your recordings are stored in a private Supabase storage
                  bucket. They are accessible only to you, authenticated by your
                  account.
                </p>
                <p>
                  We do not share your recordings with third parties. We do not
                  use them to train AI models. We do not analyze them for
                  marketing purposes. We do not use them as case studies or
                  testimonials without your explicit written consent.
                </p>
                <p>
                  Audio files are accessed via signed URLs that expire after 15
                  minutes. After expiry, a new signed URL must be generated — no
                  permanent public links exist.
                </p>
                <p>
                  Your recordings are retained indefinitely until you choose to
                  delete them. You can delete your entire archive with one click
                  from Settings.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="font-serif text-xl text-fg-primary mb-4">
                Transcripts and feedback
              </h2>
              <div className="space-y-3 font-sans text-sm text-fg-muted leading-relaxed">
                <p>
                  Your recordings are transcribed using OpenAI Whisper and
                  analyzed by Anthropic Claude. Both services process the audio
                  and text temporarily. Neither Anthropic nor OpenAI trains
                  their models on your data under our API agreements.
                </p>
                <p>
                  Transcripts are stored in our database alongside your feedback
                  scores and narrative. They are subject to the same privacy
                  protections as your audio recordings.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="font-serif text-xl text-fg-primary mb-4">
                Account data
              </h2>
              <div className="space-y-3 font-sans text-sm text-fg-muted leading-relaxed">
                <p>
                  We store your email address (used for authentication and
                  receipts), your first name (optional, used in UI), your
                  practice progress (current day, streak), and your payment
                  record.
                </p>
                <p>
                  We do not sell or share your email with marketers. We do not
                  send unsolicited marketing emails. We send transactional emails
                  only: receipts, magic links, and (optionally) the 7-day
                  storytelling primer if you requested it.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="font-serif text-xl text-fg-primary mb-4">
                Analytics
              </h2>
              <div className="space-y-3 font-sans text-sm text-fg-muted leading-relaxed">
                <p>
                  We use PostHog for privacy-respecting product analytics. We
                  track anonymized events (page visits, practice completions,
                  conversion funnel) to understand how the product is used.
                </p>
                <p>
                  We do not capture form inputs, transcripts, or personally
                  identifiable information in analytics. We do not use
                  third-party advertising trackers.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="font-serif text-xl text-fg-primary mb-4">
                Your rights (GDPR)
              </h2>
              <div className="space-y-3 font-sans text-sm text-fg-muted leading-relaxed">
                <p>
                  You have the right to access, correct, export, and delete your
                  data. You can export all your recordings and transcripts as a
                  ZIP file from your Archive. You can delete your account and all
                  associated data from Settings — deletion is permanent after a
                  7-day grace period.
                </p>
                <p>
                  For data requests or questions, email{' '}
                  <a
                    href="mailto:hello@storied.app"
                    className="text-fg-primary hover:text-accent-warm transition-colors duration-200"
                  >
                    hello@storied.app
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="font-serif text-xl text-fg-primary mb-4">
                Cookies
              </h2>
              <div className="space-y-3 font-sans text-sm text-fg-muted leading-relaxed">
                <p>
                  We use session cookies for authentication (managed by
                  Supabase). We do not use advertising cookies or tracking
                  pixels.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10">
              <p className="font-sans text-sm text-fg-subtle">
                Last updated: May 2026. Storied is operated from Dublin, Ireland.
                Contact:{' '}
                <a
                  href="mailto:hello@storied.app"
                  className="text-fg-muted hover:text-fg-primary transition-colors duration-200"
                >
                  hello@storied.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
