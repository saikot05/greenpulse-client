import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from '@gravity-ui/icons';

export const metadata: Metadata = {
  title: 'GreenPulse AI — Sign In',
  description: 'Sign in or create an account to access GreenPulse AI sustainability analytics.',
};

/**
 * Minimal centred layout shared by /login and /register.
 * No Navbar/Footer — keeps auth pages distraction-free.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20">
      {/* Minimal brand header */}
      <header className="flex items-center justify-center pt-10 pb-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            GreenPulse AI
          </span>
        </Link>
      </header>

      {/* Page content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer note */}
      <footer className="text-center py-6 text-xs text-neutral-400 dark:text-neutral-600">
        © {new Date().getFullYear()} GreenPulse AI · Enterprise Sustainability Intelligence
      </footer>
    </div>
  );
}
