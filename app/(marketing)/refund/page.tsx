import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy — Storied',
  description: 'Our refund policy. Simple and honest.',
};

export default function RefundPage() {
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
            Refund Policy
          </p>

          <h1 className="font-serif text-4xl text-fg-primary mb-12">
            Our refund policy
          </h1>

          <div className="space-y-8 font-sans text-base text-fg-muted leading-relaxed">
            <p>
              {"If you don't hear meaningful improvement between Day 1 and Day 30,"}
              we refund you. No questions.
            </p>

            <p>
              Email{' '}
              <a
                href="mailto:hello@storied.app"
                className="text-fg-primary hover:text-accent-warm transition-colors duration-200"
              >
                hello@storied.app
              </a>{' '}
              within 7 days of completing Day 30. Refund processed within 5-7
              business days to the original payment method.
            </p>

            <p>
              If you stop practicing before Day 30, no refund — but your account
              stays active. You can return anytime. There is no expiry on your
              journey.
            </p>

            <div className="border-t border-border-subtle pt-8">
              <p>
                {"We don't auto-charge. We don't subscribe. We don't trap you. One"}
                practice, one price.
              </p>
            </div>

            <div className="border-t border-border-subtle pt-8">
              <p className="text-sm text-fg-subtle">
                Questions about billing:{' '}
                <a
                  href="mailto:hello@storied.app"
                  className="text-fg-muted hover:text-fg-primary transition-colors duration-200"
                >
                  hello@storied.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
