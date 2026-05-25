import type { Metadata } from 'next';
import { ParticleBg } from '@/components/ui/ParticleBg';

export const metadata: Metadata = {
  title: 'Storied — The daily practice of being a storyteller.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <ParticleBg opacity={0.15} speed={300} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
