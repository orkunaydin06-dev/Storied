import type { Metadata, Viewport } from 'next';
import { Lora, Inter, JetBrains_Mono } from 'next/font/google';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Storied — The daily practice of being a storyteller.',
    template: '%s — Storied',
  },
  description:
    'Ten minutes a day. Thirty practices. The methods you know, finally practiced.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://storied.app'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: '/',
    siteName: 'Storied',
    title: 'Storied — The daily practice of being a storyteller.',
    description:
      'Ten minutes a day. Thirty practices. The methods you know, finally practiced.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Storied — The daily practice of being a storyteller.',
    description:
      'Ten minutes a day. Thirty practices. The methods you know, finally practiced.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0B1929',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-primary text-fg-primary font-sans antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
