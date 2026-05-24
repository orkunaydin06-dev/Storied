import { Nav } from '@/components/marketing/Nav';
import { Hero } from '@/components/marketing/Hero';
import { AudioSample } from '@/components/marketing/AudioSample';
import { ThreeColumns } from '@/components/marketing/ThreeColumns';
import { MethodologyTimeline } from '@/components/marketing/MethodologyTimeline';
import { WhoIsThisFor } from '@/components/marketing/WhoIsThisFor';
import { FAQ } from '@/components/marketing/FAQ';
import { FoundingOffer } from '@/components/marketing/FoundingOffer';
import { EmailCapture } from '@/components/marketing/EmailCapture';
import { Footer } from '@/components/marketing/Footer';
import { StickyMobileCTA } from '@/components/marketing/StickyMobileCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 font-sans text-sm bg-accent-warm text-bg-primary px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <Nav />

      <main id="main-content">
        <Hero />
        <AudioSample />
        <ThreeColumns />
        <MethodologyTimeline />
        <WhoIsThisFor />
        <FAQ />
        <FoundingOffer />
        <EmailCapture />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
