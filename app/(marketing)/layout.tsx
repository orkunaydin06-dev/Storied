import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Storied — The daily practice of being a storyteller.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
