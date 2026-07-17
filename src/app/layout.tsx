import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../providers/Providers';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GreenPulse AI - Sustainability & ESG Intelligence',
  description:
    'Enterprise sustainability analytics, ESG audit tracing, and decarbonization planning powered by Gemini AI.',
  keywords: ['ESG', 'sustainability', 'carbon audit', 'decarbonization', 'AI'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * suppressHydrationWarning is required by next-themes.
     * next-themes injects a class attribute on <html> during client hydration
     * which does not match the server-rendered markup — suppressing the warning
     * is the officially recommended approach.
     */
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
